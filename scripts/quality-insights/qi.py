"""qi.py — Quality Insights: xu hướng lỗi · rủi ro release · chọn test. Bộ công cụ của skill skills-quality-insights.

Đọc thẳng các file đã có trong docs/ — KHÔNG cần nguồn dữ liệu nào khác:
    docs/bugs/**/BUG_*.md                                  → lỗi: severity, trạng thái, TC/REQ, ngày, lịch sử retest
    docs/executions/**/run_*/execution_report.md           → kết quả từng TC qua các lần chạy
    docs/testcases/**/<web|mobile|api>/**/*.md             → danh mục TC: REQ, Risk Level, Priority, Tags
    docs/requirements/**/impact/impact_<TICKET>.md         → REQ thêm / sửa / bỏ theo ticket

    python scripts/quality-insights/qi.py collect -o reports/quality-insights/data.json         # gom dữ liệu thô (để soát)
    python scripts/quality-insights/qi.py trends  [--modules login,customers] -o <tên>          # → <tên>.md + <tên>.json
    python scripts/quality-insights/qi.py risk    [--modules …] [--ticket PO-2026-08-18-B] -o <tên>
    python scripts/quality-insights/qi.py select  --ticket <ID> | --req REQ-LOGIN-16,REQ-LOGIN-25 | --modules login
                                                  [--platform web] [--budget 60] -o <tên>

Mọi con số in ra đều kèm nguồn (mã bug · run · TC · REQ) — agent dùng bảng này làm phần số liệu của báo cáo,
phần nhận định (gom nhóm nguyên nhân gốc, khuyến nghị) do agent viết sau khi đọc file nguồn.
Thang điểm và trọng số: .claude/skills/skills-quality-insights/references/scoring.md — đổi ở đó thì đổi cả hằng số bên dưới.
Cần: Python 3.9+ · không cần thư viện ngoài.
"""
import argparse, json, os, re, sys
from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    _s.reconfigure(encoding='utf-8', errors='replace')

PLATFORMS = ('web', 'mobile', 'api')
SEV_ORDER = ['Critical', 'Major', 'Minor', 'Trivial']
SEV_WEIGHT = {'Critical': 5, 'Major': 3, 'Minor': 1, 'Trivial': 0.5}
SEV_ICON = {'Critical': '🔴', 'Major': '🟠', 'Minor': '🟡', 'Trivial': '🟢'}
LEVEL_PTS = {'Critical': 20, 'High': 15, 'Medium': 8, 'Low': 3}
PRIO_PTS = {'Critical': 15, 'High': 10, 'Medium': 5, 'Low': 2}
DEFAULT_MIN_PER_TC = 4.0
LOW_SAMPLE = 5

REQ_RE = re.compile(r'REQ-[A-Z]+(?:-[A-Z]+)*-\d+')
TC_RE = re.compile(r'[A-Z][A-Z]*(?:_[A-Z]+)*_TC_\d+')
DATE_RE = re.compile(r'(\d{1,2})[-/](\d{1,2})[-/](\d{4})|(\d{4})-(\d{2})-(\d{2})')


# ───────────────────────── tiện ích ─────────────────────────
def parse_date(text):
    m = DATE_RE.search(text or '')
    if not m:
        return None
    try:
        if m.group(1):
            return date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        return date(int(m.group(4)), int(m.group(5)), int(m.group(6)))
    except ValueError:
        return None


def fmt_date(d):
    return d.strftime('%d-%m-%Y') if d else '—'


def split_row(line):
    cells = re.split(r'(?<!\\)\|', line.strip())
    if cells and cells[0] == '':
        cells = cells[1:]
    if cells and cells[-1] == '':
        cells = cells[:-1]
    return [c.strip() for c in cells]


def base_tc(tc):
    m = TC_RE.search(tc or '')
    return m.group(0) if m else None


LINK_FROM = None   # thư mục file báo cáo — link trong bảng tính tương đối từ đây


def lk(path):
    return Path(os.path.relpath(path, LINK_FROM)).as_posix() if LINK_FROM else path


def rel(p, root):
    return Path(p).resolve().relative_to(root.resolve()).as_posix()


def locate(path, root):
    """docs/<nhánh>/[_<hệ-thống>/]<module>/[<nền-tảng>/]… → (hệ thống, module, nền tảng)."""
    parts = Path(rel(path, root)).parts[2:]
    system = 'default'
    if parts and parts[0].startswith('_') and parts[0] != '_discovery':
        system, parts = parts[0], parts[1:]
    module = parts[0] if parts else '?'
    platform = next((p for p in parts[1:] if p in PLATFORMS), '?')
    return system, module, platform


def unit_key(system, module, platform):
    return f'{system}/{module}/{platform}'


def unit_label(key):
    system, module, platform = key.split('/')
    return f'`{module}` · {platform}' if system == 'default' else f'`{system}/{module}` · {platform}'


def norm_level(text):
    t = (text or '').lower()
    for k, words in (('Critical', ('critical', 'blocker', 'nghiêm trọng')), ('High', ('high', 'cao')),
                     ('Medium', ('medium', 'trung bình', 'major')), ('Low', ('low', 'thấp', 'minor', 'trivial'))):
        if any(w in t for w in words):
            return k
    return None


def norm_sev(text):
    t = (text or '').lower()
    for k in SEV_ORDER:
        if k.lower() in t:
            return k
    return {'blocker': 'Critical', 'high': 'Major', 'medium': 'Minor', 'low': 'Trivial'}.get(t.strip(), None)


def norm_result(text):
    t = text or ''
    if 'PASS' in t:
        return 'PASS'
    if 'FAIL' in t:
        return 'FAIL'
    if 'BLOCKED' in t:
        return 'BLOCKED'
    if 'SKIP' in t:
        return 'SKIPPED'
    return None


def bug_state(text):
    t = (text or '').lower()
    if 'không phải lỗi' in t or 'not a bug' in t:
        return 'not_bug'
    if 'chờ retest' in t or 'đã fix' in t:
        return 'fixed_pending'
    if 'đã đóng' in t or 'closed' in t:
        return 'closed'
    if 'rà lại' in t:
        return 'review'
    return 'open'


STATE_LABEL = {'open': '🔴 Đang mở', 'fixed_pending': '🟡 Đã fix, chờ retest', 'closed': '🟢 Đã đóng',
               'not_bug': '⚪ Không phải lỗi', 'review': '⚠️ Cần rà lại'}


# ───────────────────────── thu thập ─────────────────────────
def collect_bugs(root):
    status_from_catalog = {}
    for cat in (root / 'docs' / 'bugs').rglob('README.md'):
        for line in cat.read_text(encoding='utf-8').splitlines():
            m = re.match(r'^\| \[(BUG_[^\]]+)\]', line)
            if m:
                cells = split_row(line)
                st = next((c for c in cells if any(w in c for w in ('Đang mở', 'Đã đóng', 'chờ retest', 'rà lại', 'không phải lỗi'))), '')
                status_from_catalog[m.group(1)] = st
    bugs = []
    for f in sorted((root / 'docs' / 'bugs').rglob('BUG_*.md')):
        text = f.read_text(encoding='utf-8')
        system, module, platform = locate(f, root)

        def field(*names):
            for name in names:
                m = re.search(r'^- \*\*' + name + r':\*\*\s*(.+)$', text, re.M)
                if m:   # bỏ ghi chú sửa tham chiếu *( … )* — trong đó là mã CŨ đã ghi nhầm
                    return re.sub(r'\*\([^*]*\)\*', '', m.group(1)).strip()
            return ''

        def ids(pattern, value, norm=lambda x: x):
            seen = []
            for x in pattern.findall(value):
                x = norm(x)
                if x and x not in seen:
                    seen.append(x)
            return seen
        bid = f.stem
        title = re.search(r'^# (.+)$', text, re.M)
        state_txt = field('Trạng thái') or status_from_catalog.get(bid, '')
        history = []
        hm = re.search(r'## Lịch sử retest(.*?)(\n## |\Z)', text, re.S)
        if hm:
            for line in hm.group(1).splitlines():
                cells = split_row(line) if line.startswith('|') else []
                if len(cells) >= 3 and parse_date(cells[0]):
                    res = 'FIXED' if 'NOT_FIXED' not in cells[2] and 'FIXED' in cells[2] else (
                        'NOT_FIXED' if 'NOT_FIXED' in cells[2] else ('PARTIAL' if 'PARTIAL' in cells[2] else cells[2]))
                    history.append({'date': fmt_date(parse_date(cells[0])), 'result': res})
        cause = re.search(r'\*\*Nghi ngờ root cause:\*\*\s*(.+)', text)
        bugs.append({
            'id': bid, 'file': rel(f, root), 'system': system, 'module': module, 'platform': platform,
            'title': re.sub(r'^\[BUG\]\s*', '', title.group(1)).strip() if title else bid,
            'severity': norm_sev(field('Severity')) or '?', 'priority': (re.search(r'P\d', field('Priority')) or [None])[0],
            'state': bug_state(state_txt), 'detected': fmt_date(parse_date(field('Ngày phát hiện'))),
            'tcs': ids(TC_RE, field('Test case liên quan', 'TC liên quan'), base_tc),
            'reqs': ids(REQ_RE, field('REQ ID liên quan', 'Requirement', 'REQ liên quan')),
            'retest': history, 'root_cause_hint': cause.group(1).strip()[:300] if cause else '',
        })
    return bugs


def parse_duration_min(text):
    m = re.search(r'~\s*(\d+)\s*phút', text or '')
    if m:
        return int(m.group(1))
    t = re.findall(r'(\d{1,2}):(\d{2})', text or '')
    if len(t) >= 2:
        a, b = (int(h) * 60 + int(mi) for h, mi in t[:2])
        return b - a if b > a else None
    return None


def run_order_key(run_id):
    m = re.search(r'run_(\d{8})_(\d{6})', run_id)
    if m:
        return datetime.strptime(m.group(1) + m.group(2), '%Y%m%d%H%M%S').timestamp()
    m = re.search(r'run_(\d+)', run_id)
    return float(m.group(1)) if m else 0.0


def collect_runs(root):
    runs = []
    for f in sorted((root / 'docs' / 'executions').rglob('execution_report.md')):
        system, module, platform = locate(f, root)
        text = f.read_text(encoding='utf-8')
        meta = {}
        for line in text.splitlines()[:40]:
            cells = split_row(line) if line.startswith('|') else []
            if len(cells) == 2:
                meta[cells[0]] = cells[1]
        if platform == '?':
            platform = (re.search(r'(web|mobile|api)', meta.get('Nền tảng', '')) or [None, '?'])[1] if meta.get('Nền tảng') else '?'
        source_kind = 'checklist' if 'checklist' in meta.get('Loại nguồn', '').lower() else 'tc'
        results, hdr = {}, None
        for line in text.splitlines():
            if line.startswith('|'):
                cells = split_row(line)
                if cells and cells[0] in ('TC ID', 'Mã mục', 'Mục'):
                    hdr = cells if any('Kết quả' in c for c in cells) else None
                    continue
                if hdr and cells and (base_tc(cells[0]) or cells[0].startswith('CL-')):
                    idx = next(i for i, c in enumerate(hdr) if 'Kết quả' in c)
                    if idx < len(cells):
                        r = norm_result(cells[idx])
                        key = base_tc(cells[0]) or cells[0]
                        if r:
                            prev = results.get(key)
                            rank = {'FAIL': 3, 'BLOCKED': 2, 'PASS': 1, 'SKIPPED': 0}
                            if not prev or rank[r] > rank[prev]:
                                results[key] = r
            else:
                hdr = None
        run_id = meta.get('Run ID', f.parent.name).strip('` ')
        start = meta.get('Bắt đầu → Kết thúc', '')
        executed = sum(1 for r in results.values() if r != 'SKIPPED')
        dur = parse_duration_min(start)
        runs.append({
            'id': run_id, 'file': rel(f, root), 'system': system, 'module': module, 'platform': platform,
            'source_kind': source_kind, 'source': re.sub(r'\]\(.*?\)', ']', meta.get('Nguồn TC', ''))[:160],
            'date': fmt_date(parse_date(start)), 'order': run_order_key(run_id),
            'duration_min': dur, 'min_per_tc': round(dur / executed, 2) if dur and executed else None,
            'results': results, 'counts': dict(Counter(results.values())),
        })
    runs.sort(key=lambda r: r['order'])
    return runs


TAIL_COLS = ('Priority', 'Automation', 'Auto Type', 'Tags')


def collect_testcases(root):
    tcs = {}
    for f in sorted((root / 'docs' / 'testcases').rglob('*.md')):
        p = rel(f, root)
        if '/review/' in p or '/impact/' in p or f.name.startswith(('TEST_CASES_', 'README')):
            continue
        system, module, platform = locate(f, root)
        if platform == '?':
            continue
        hdr = None
        for line in f.read_text(encoding='utf-8').splitlines():
            if not line.startswith('|'):
                hdr = None
                continue
            cells = split_row(line)
            if cells and cells[0] == 'TC ID':
                hdr = cells if any('Risk' in c for c in cells) else None
                continue
            if not hdr or not cells or not base_tc(cells[0]) or not re.match(r'^[A-Z]', cells[0]):
                continue
            row = dict(zip(hdr, cells)) if len(cells) == len(hdr) else {}
            if not row:   # ô có dấu | lạc — cột đầu đọc từ trái, cột cuối đọc từ phải
                for i, h in enumerate(hdr[:4]):
                    row[h] = cells[i] if i < len(cells) else ''
                for j, h in enumerate(reversed(hdr)):
                    if h in TAIL_COLS and j < len(cells):
                        row[h] = cells[-1 - j]
            tc = base_tc(cells[0])
            risk = next((v for k, v in row.items() if 'Risk' in k), '')
            scen = next((v for k, v in row.items() if 'Scenario' in k or 'Title' in k), '')
            tags = re.findall(r'@[\w-]+', row.get('Tags', ''))
            tcs[tc] = {
                'id': tc, 'file': p, 'system': system, 'module': module, 'platform': platform,
                'reqs': sorted(set(REQ_RE.findall(row.get('REQ ID', '')))),
                'risk': norm_level(risk) or '?', 'priority': norm_level(row.get('Priority', '')) or '?',
                'automation': row.get('Automation', ''), 'tags': tags,
                'scenario': re.sub(r'\s+', ' ', scen)[:140],
                'deprecated': '@Deprecated' in tags or 'Deprecated' in scen[:40],
            }
    return tcs


def expand_req_row(line):
    full = REQ_RE.findall(line)
    if not full:
        return []
    prefix = full[0].rsplit('-', 1)[0]
    out = set(full)
    for num in re.findall(r'`(\d{1,3})`', line):
        out.add(f'{prefix}-{int(num):02d}')
    return sorted(out)


def collect_impacts(root):
    impacts = []
    for f in sorted((root / 'docs' / 'requirements').rglob('impact_*.md')):
        system, module, _ = locate(f, root)
        text = f.read_text(encoding='utf-8')
        head = re.search(r'^# .*$', text, re.M)
        ticket = f.stem[len('impact_'):]
        changes = {'add': [], 'modify': [], 'remove': []}
        sm = re.search(r'## Tóm tắt(.*?)(\n## |\Z)', text, re.S)
        for line in (sm.group(1) if sm else '').splitlines():
            for key, mark in (('add', '🟢'), ('modify', '🟡'), ('remove', '🔴')):
                if line.startswith('| ' + mark):
                    changes[key] = expand_req_row(line)
        dates = [parse_date(x) for x in re.findall(r'\d{1,2}-\d{1,2}-\d{4}|\d{4}-\d{2}-\d{2}', head.group(0) if head else '')]
        d = next((x for x in dates if x), None) or parse_date(ticket) or parse_date(text[:600])
        impacts.append({'ticket': ticket, 'file': rel(f, root), 'system': system, 'module': module,
                        'date': fmt_date(d), 'changes': changes,
                        'reqs': sorted(set(changes['add'] + changes['modify'] + changes['remove']))})
    return impacts


def collect(root):
    return {'generated': fmt_date(date.today()), 'bugs': collect_bugs(root), 'runs': collect_runs(root),
            'testcases': collect_testcases(root), 'impacts': collect_impacts(root)}


def scope_filter(data, modules, platform, system):
    def ok(o):
        return ((not modules or o['module'] in modules) and (not platform or o['platform'] == platform)
                and (not system or o['system'] == system))
    return {'generated': data['generated'], 'bugs': [b for b in data['bugs'] if ok(b)],
            'runs': [r for r in data['runs'] if ok(r)],
            'testcases': {k: v for k, v in data['testcases'].items() if ok(v)},
            'impacts': [i for i in data['impacts'] if (not modules or i['module'] in modules) and (not system or i['system'] == system)]}


# ───────────────────────── lịch sử TC ─────────────────────────
def tc_histories(runs):
    """{unit: {tc: [(run_id, result), …]}} — chỉ run bộ TC, theo thứ tự thời gian, tách từng nền tảng."""
    hist = defaultdict(lambda: defaultdict(list))
    for r in runs:
        if r['source_kind'] != 'tc':
            continue
        u = unit_key(r['system'], r['module'], r['platform'])
        for tc, res in r['results'].items():
            hist[u][tc].append((r['id'], res))
    return hist


def classify_history(seq):
    res = [x[1] for x in seq if x[1] != 'SKIPPED']
    if not res:
        return None
    last = res[-1]
    flips = sum(1 for a, b in zip(res, res[1:]) if {a, b} == {'PASS', 'FAIL'})
    if flips >= 2:
        return 'flaky'
    if last == 'FAIL':
        if len(res) >= 2 and res[-2] == 'PASS':
            return 'new_fail'
        tail = 0
        for x in reversed(res):
            if x != 'FAIL':
                break
            tail += 1
        return 'recurring' if tail >= 2 else 'fail_once'
    if last == 'PASS' and 'FAIL' in res[:-1] and res[-2] == 'FAIL':
        return 'fixed'
    if last == 'BLOCKED' and 'PASS' in res[:-1]:
        return 'to_blocked'
    return 'stable_' + last.lower()


TREND_LABEL = {'new_fail': '🆕 Mới fail', 'recurring': '🔁 Fail liên tục', 'fail_once': '❌ Fail (1 lần chạy)',
               'flaky': '🎲 Lật PASS↔FAIL', 'fixed': '✅ Vừa hết fail', 'to_blocked': '⚠️ Chuyển sang BLOCKED'}


# ───────────────────────── trends ─────────────────────────
def build_trends(d, today):
    bugs, runs, tcs = d['bugs'], d['runs'], d['testcases']
    out = {'today': fmt_date(today), 'units': {}, 'bug_rows': [], 'clusters': [], 'leaks': [], 'stale': [],
           'tc_trends': [], 'run_rows': [], 'monthly': {}, 'warnings': []}
    bug_by_tc = defaultdict(list)
    for b in bugs:
        for t in b['tcs']:
            bug_by_tc[t].append(b)
    real = [b for b in bugs if b['state'] != 'not_bug']
    # bảng theo đơn vị
    units = defaultdict(lambda: {'sev': Counter(), 'open': 0, 'open_weight': 0.0, 'total': 0, 'not_bug': 0,
                                 'ages': [], 'not_fixed': 0, 'retests': 0})
    for b in bugs:
        u = units[unit_key(b['system'], b['module'], b['platform'])]
        if b['state'] == 'not_bug':
            u['not_bug'] += 1
            continue
        u['total'] += 1
        u['sev'][b['severity']] += 1
        if b['state'] in ('open', 'review', 'fixed_pending'):
            u['open'] += 1
            u['open_weight'] += SEV_WEIGHT.get(b['severity'], 1)
            dd = parse_date(b['detected'])
            if dd:
                u['ages'].append((today - dd).days)
        u['retests'] += len(b['retest'])
        u['not_fixed'] += sum(1 for h in b['retest'] if h['result'] in ('NOT_FIXED', 'PARTIAL'))
    for k, u in units.items():
        u['sev'] = dict(u['sev'])
    out['units'] = dict(units)
    # theo tháng phát hiện
    monthly = defaultdict(Counter)   # theo từng hệ thống — gộp hai hệ thống thì "tháng" chỉ phản ánh lúc test hệ thống nào
    for b in real:
        dd = parse_date(b['detected'])
        if dd:
            monthly[f"{b['system']}|{dd.strftime('%Y-%m')}"][b['severity']] += 1
    out['monthly'] = {k: dict(v) for k, v in sorted(monthly.items())}
    # cụm theo REQ / nhóm REQ
    by_req = defaultdict(list)
    for b in real:
        for r in b['reqs'][:1]:   # chỉ REQ chính (mã đầu ô) — REQ "kéo theo" làm cụm giả
            by_req[r].append(b['id'])
    out['clusters'] = [{'req': r, 'bugs': ids} for r, ids in sorted(by_req.items()) if len(ids) >= 2]
    # bug + lịch sử
    for b in bugs:
        nf = sum(1 for h in b['retest'] if h['result'] in ('NOT_FIXED', 'PARTIAL'))
        dd = parse_date(b['detected'])
        out['bug_rows'].append({**{k: b[k] for k in ('id', 'file', 'module', 'platform', 'severity', 'state', 'detected', 'tcs', 'reqs', 'title', 'root_cause_hint')},
                                'system': b['system'], 'age_days': (today - dd).days if dd and b['state'] in ('open', 'review', 'fixed_pending') else None,
                                'not_fixed': nf})
    # xu hướng từng TC
    hist = tc_histories(runs)
    latest = {}
    for u, per_tc in hist.items():
        for tc, seq in per_tc.items():
            cls = classify_history(seq)
            latest[tc] = seq[-1][1]
            if cls in TREND_LABEL:
                out['tc_trends'].append({'unit': u, 'tc': tc, 'class': cls, 'seq': [f"{r}:{x}" for r, x in seq],
                                         'bugs': [b['id'] for b in bug_by_tc.get(tc, [])]})
    out['tc_trends'].sort(key=lambda x: (list(TREND_LABEL).index(x['class']), x['unit'], x['tc']))
    # rò rỉ: FAIL ở lần chạy gần nhất nhưng không có bug nào trỏ tới
    for t in out['tc_trends']:
        if t['class'] in ('new_fail', 'recurring', 'fail_once') and not t['bugs']:
            note = ''
            tc = tcs.get(t['tc'])
            if tc and '@KnownBug' in tc['tags']:
                note = 'TC mang @KnownBug nhưng không bug nào ghi TC này ở ô Test case liên quan'
            out['leaks'].append({**t, 'note': note})
    # bug có thể đã hết: TC liên quan PASS ở lần chạy gần nhất mà bug vẫn mở
    for b in bugs:
        if b['state'] in ('open', 'review') and b['tcs'] and all(latest.get(t) == 'PASS' for t in b['tcs']):
            out['stale'].append({'bug': b['id'], 'tcs': b['tcs'], 'file': b['file']})
    # pass rate theo lần chạy
    for r in runs:
        c = r['counts']
        ex = c.get('PASS', 0) + c.get('FAIL', 0) + c.get('BLOCKED', 0)
        out['run_rows'].append({'unit': unit_key(r['system'], r['module'], r['platform']), 'run': r['id'], 'file': r['file'],
                                'date': r['date'], 'kind': r['source_kind'], 'n': sum(c.values()), **c,
                                'pass_rate': round(100 * c.get('PASS', 0) / ex, 1) if ex else None})
    for system in sorted({b['system'] for b in real}):
        n = sum(1 for b in real if b['system'] == system)
        months = sum(1 for k in monthly if k.startswith(system + '|'))
        name = 'hệ thống mặc định' if system == 'default' else f'`{system}`'
        if n < LOW_SAMPLE or months < 3:
            out['warnings'].append(f'{name}: {n} lỗi thật trên {months} tháng — dưới ngưỡng ({LOW_SAMPLE} lỗi · 3 tháng), '
                                   'chỉ gọi là quan sát, không gọi là xu hướng tăng/giảm')
    return out


def md_trends(t):
    L = [f"<!-- sinh bởi scripts/quality-insights/qi.py trends · {t['today']} -->", '']
    if t['warnings']:
        L += ['> ⚠️ **Cỡ mẫu**', '>'] + [f'> - {w}' for w in t['warnings']] + ['']
    L += ['### A. Lỗi theo module × nền tảng', '',
          '| Đơn vị | Tổng lỗi thật | 🔴 Crit | 🟠 Major | 🟡 Minor | 🟢 Triv | Đang mở | Điểm mở (trọng số) | Tuổi TB lỗi mở (ngày) | Retest NOT_FIXED / số lần retest | ⚪ Không phải lỗi |',
          '|---|---|---|---|---|---|---|---|---|---|---|']
    for k, u in sorted(t['units'].items(), key=lambda kv: -kv[1]['open_weight']):
        s = u['sev']
        age = round(sum(u['ages']) / len(u['ages'])) if u['ages'] else '—'
        L.append(f"| {unit_label(k)} | {u['total']} | {s.get('Critical', 0)} | {s.get('Major', 0)} | {s.get('Minor', 0)} | {s.get('Trivial', 0)} | "
                 f"{u['open']} | {u['open_weight']:g} | {age} | {u['not_fixed']} / {u['retests']} | {u['not_bug']} |")
    L += ['', '> Điểm mở = Σ trọng số severity của lỗi chưa đóng (Critical 5 · Major 3 · Minor 1 · Trivial 0,5).', '']
    L += ['### B. Lỗi phát hiện theo tháng — tách từng hệ thống', '', '| Hệ thống | Tháng | Critical | Major | Minor | Trivial | Tổng |', '|---|---|---|---|---|---|---|']
    for k, c in t['monthly'].items():
        system, ym = k.split('|')
        L.append(f"| {'mặc định' if system == 'default' else '`' + system + '`'} | {ym[5:]}-{ym[:4]} | {c.get('Critical', 0)} | {c.get('Major', 0)} | {c.get('Minor', 0)} | {c.get('Trivial', 0)} | {sum(c.values())} |")
    L += ['', '### C. Danh sách lỗi (nguyên liệu để gom nhóm nguyên nhân gốc)', '',
          '| Mã bug | Đơn vị | Severity | Trạng thái | Tuổi (ngày) | REQ | Tiêu đề | Gợi ý nguyên nhân (trích file bug) |', '|---|---|---|---|---|---|---|---|']
    for b in sorted(t['bug_rows'], key=lambda x: (SEV_ORDER.index(x['severity']) if x['severity'] in SEV_ORDER else 9, x['id'])):
        L.append(f"| [{b['id']}]({lk(b['file'])}) | {unit_label(unit_key(b['system'], b['module'], b['platform']))} | {SEV_ICON.get(b['severity'], '')} {b['severity']} | "
                 f"{STATE_LABEL[b['state']]} | {b['age_days'] if b['age_days'] is not None else '—'} | {(b['reqs'][0] + (f' (+{len(b["reqs"]) - 1})' if len(b['reqs']) > 1 else '')) if b['reqs'] else '—'} | {b['title'][:90]} | {b['root_cause_hint'][:120] or '—'} |")
    L += ['', '### D. Cụm lỗi cùng REQ', '']
    L += ([f"- `{c['req']}` — {len(c['bugs'])} lỗi: {', '.join(c['bugs'])}" for c in t['clusters']] or ['- Không có REQ nào mang ≥ 2 lỗi'])
    L += ['', '### E. Xu hướng từng TC qua các lần chạy', '']
    if t['tc_trends']:
        L += ['| Nhóm | Đơn vị | TC | Chuỗi kết quả (cũ → mới) | Bug trỏ tới |', '|---|---|---|---|---|']
        for x in t['tc_trends']:
            seq = ' → '.join(s.split(':')[1] for s in x['seq'])
            L.append(f"| {TREND_LABEL[x['class']]} | {unit_label(x['unit'])} | `{x['tc']}` | {seq} | {', '.join(x['bugs']) or '**chưa có**'} |")
    else:
        L.append('- Không TC nào đổi trạng thái hoặc fail ở lần chạy gần nhất')
    L += ['', '### F. Lỗ hổng quy trình', '', '**TC đang fail mà chưa có bug** (lỗi đang rò rỉ khỏi sổ):', '']
    L += ([f"- `{x['tc']}` ({unit_label(x['unit'])}) — {TREND_LABEL[x['class']]}{' — ' + x['note'] if x['note'] else ''}" for x in t['leaks']] or ['- Không có'])
    L += ['', '**Bug còn mở nhưng mọi TC liên quan đã PASS ở lần chạy gần nhất** (ứng viên `/retest-fixed-bugs`):', '']
    L += ([f"- [{x['bug']}]({lk(x['file'])}) — TC {', '.join(x['tcs'])}" for x in t['stale']] or ['- Không có'])
    L += ['', '### G. Tỉ lệ đạt theo lần chạy', '', '| Đơn vị | Run | Ngày | Loại | Số TC | PASS | FAIL | BLOCKED | SKIPPED | Pass rate* |', '|---|---|---|---|---|---|---|---|---|---|']
    for r in t['run_rows']:
        L.append(f"| {unit_label(r['unit'])} | [{r['run']}]({lk(r['file'])}) | {r['date']} | {r['kind']} | {r['n']} | {r.get('PASS', 0)} | {r.get('FAIL', 0)} | "
                 f"{r.get('BLOCKED', 0)} | {r.get('SKIPPED', 0)} | {str(r['pass_rate']) + '%' if r['pass_rate'] is not None else '—'} |")
    L += ['', '> \\* Pass rate không tính SKIPPED. Các lần chạy thường có **phạm vi khác nhau** (cột *Số TC*) — không đọc cột này như một đường xu hướng; xu hướng thật nằm ở mục E (cùng TC qua các lần).']
    return '\n'.join(L) + '\n'


# ───────────────────────── risk ─────────────────────────
def band(v, cuts):
    for i, c in enumerate(cuts):
        if v <= c:
            return i
    return len(cuts)


def build_risk(d, today, tickets, since, want=()):
    bugs, runs, tcs, impacts = d['bugs'], d['runs'], d['testcases'], d['impacts']
    units = set()
    for col in (bugs, runs, tcs.values()):
        for o in col:
            if o['platform'] in PLATFORMS:
                units.add(unit_key(o['system'], o['module'], o['platform']))
    for w in want:   # module trong phạm vi release mà chưa có bug / run / TC nào — vẫn phải hiện, mang ⬛
        if not any(u.split('/')[1] == w.split('/')[1] for u in units):
            units.add(w)
    sel_imp = [i for i in impacts if (not tickets or i['ticket'] in tickets)
               and (not since or (parse_date(i['date']) or date.min) >= since)]
    req_platforms = defaultdict(set)
    for tc in tcs.values():
        for r in tc['reqs']:
            req_platforms[r].add(unit_key(tc['system'], tc['module'], tc['platform']))
    hist = tc_histories(runs)
    rows = []
    for u in sorted(units):
        system, module, platform = u.split('/')
        ev = {}
        # C — thay đổi
        changed = set()
        for i in sel_imp:
            if i['system'] == system and i['module'] == module:
                changed |= {r for r in i['reqs'] if u in req_platforms.get(r, {u})}
        removed = any(i['changes']['remove'] for i in sel_imp if i['module'] == module and i['system'] == system)
        C = 3 if removed or len(changed) > 5 else band(len(changed), [0, 2, 5])
        tickets_u = sorted({i['ticket'] for i in sel_imp if i['module'] == module and i['system'] == system})
        if changed:
            ev['C'] = f"{len(changed)} REQ đổi ({', '.join(sorted(changed)[:6])}{'…' if len(changed) > 6 else ''}) · ticket: {', '.join(tickets_u)}"
        elif tickets_u:
            ev['C'] = f"có impact report ({', '.join(tickets_u)}) nhưng không REQ nào của nền tảng này đổi"
        else:
            ev['C'] = 'không có impact report trong phạm vi'
        # D — lỗi đang mở
        ob = [b for b in bugs if unit_key(b['system'], b['module'], b['platform']) == u and b['state'] in ('open', 'review', 'fixed_pending')]
        w = sum(SEV_WEIGHT.get(b['severity'], 1) for b in ob)
        crit = [b for b in ob if b['severity'] == 'Critical']
        D = 3 if crit else band(w, [0, 2, 6])
        ev['D'] = (f"{len(ob)} lỗi mở, điểm {w:g}" + (f" · Critical: {', '.join(b['id'] for b in crit)}" if crit else '')) if ob else '0 lỗi mở'
        # I — bất ổn lần chạy
        per_tc = hist.get(u, {})
        unit_runs = [r for r in runs if unit_key(r['system'], r['module'], r['platform']) == u and r['source_kind'] == 'tc']
        if per_tc:
            classes = Counter(classify_history(s) for s in per_tc.values())
            last_res = [s[-1][1] for s in per_tc.values() if s[-1][1] != 'SKIPPED']
            fail_rate = 100 * sum(1 for x in last_res if x == 'FAIL') / len(last_res) if last_res else 0
            unstable = classes['new_fail'] + classes['flaky']
            I = 3 if unstable or fail_rate >= 20 else band(fail_rate, [0, 5, 20])
            ev['I'] = (f"tỉ lệ fail ở kết quả gần nhất {fail_rate:.0f}% ({len(last_res)} TC)"
                       + (f" · 🆕 {classes['new_fail']} mới fail" if classes['new_fail'] else '')
                       + (f" · 🎲 {classes['flaky']} lật" if classes['flaky'] else '')
                       + (f" · 🔁 {classes['recurring']} fail liên tục" if classes['recurring'] else '')
                       + f" · {len(unit_runs)} lần chạy")
            I_known = True
        else:
            I, I_known = 2, False
            ev['I'] = '⬛ chưa có lần chạy bộ TC nào — tính 2 (thiếu dữ liệu ≠ an toàn)'
        # G — khoảng trống thực thi
        unit_tcs = [t for t in tcs.values() if unit_key(t['system'], t['module'], t['platform']) == u and not t['deprecated']]
        if unit_tcs:
            ran = sum(1 for t in unit_tcs if t['id'] in per_tc)
            pct = 100 * ran / len(unit_tcs)
            G = 3 - band(pct, [29.99, 59.99, 89.99])
            hi = [t for t in unit_tcs if t['risk'] in ('High', 'Critical') and t['id'] not in per_tc]
            ev['G'] = f"đã chạy {ran}/{len(unit_tcs)} TC ({pct:.0f}%)" + (f" · {len(hi)} TC rủi ro High/Critical chưa chạy lần nào" if hi else '')
            if changed:
                changed_uncovered = [r for r in changed if not any(r in t['reqs'] for t in unit_tcs)]
                if changed_uncovered:   # có thể là REQ cố ý ngoài phạm vi viết TC — agent đối chiếu impact report
                    G = max(G, 2)
                    ev['G'] += f" · REQ đổi chưa có TC: {', '.join(changed_uncovered)}"
        else:
            G = 3
            ev['G'] = '⬛ chưa có TC nào cho đơn vị này'
        # B — tầm ảnh hưởng nghiệp vụ (theo Risk Level đã chấm ở RBT)
        if unit_tcs:
            hi_share = 100 * sum(1 for t in unit_tcs if t['risk'] in ('High', 'Critical')) / len(unit_tcs)
            B = band(hi_share, [24.99, 49.99, 74.99])
            ev['B'] = f"{hi_share:.0f}% TC chấm High/Critical"
        else:
            B = 2
            ev['B'] = '⬛ chưa chấm (không có TC) — tính 2'
        likelihood = round(1 + (C + D + I + G) / 12 * 4, 1)
        impact = round(1 + B / 3 * 4, 1)
        score = round(likelihood * impact, 1)
        level = 'Cao' if score >= 15 else ('Trung bình' if score >= 8 else 'Thấp')
        override = ''
        if crit and level != 'Cao':
            level, override = 'Cao', 'nâng lên Cao vì còn lỗi Critical đang mở'
        elif not unit_tcs and level != 'Cao':
            level, override = 'Cao', 'nâng lên Cao vì chưa có TC nào — không có bằng chứng kiểm thử'
        rows.append({'unit': u, 'C': C, 'D': D, 'I': I, 'G': G, 'B': B, 'likelihood': likelihood, 'impact': impact,
                     'score': score, 'level': level, 'override': override, 'evidence': ev, 'run_data': I_known})
    rows.sort(key=lambda r: (-{'Cao': 3, 'Trung bình': 2, 'Thấp': 1}[r['level']], -r['score']))
    return {'today': fmt_date(today), 'tickets': sorted({i['ticket'] for i in sel_imp}), 'rows': rows}


LVL_ICON = {'Cao': '🔴', 'Trung bình': '🟠', 'Thấp': '🟢'}


def md_risk(r):
    L = [f"<!-- sinh bởi scripts/quality-insights/qi.py risk · {r['today']} -->", '',
         f"Impact report tính vào yếu tố C: {', '.join('`' + t + '`' for t in r['tickets']) or 'không có'}", '',
         '| # | Đơn vị | C · Thay đổi | D · Lỗi mở | I · Bất ổn | G · Chưa chạy | B · Ảnh hưởng | Khả năng (1–5) | Tác động (1–5) | Điểm | Mức |',
         '|---|---|---|---|---|---|---|---|---|---|---|']
    for i, x in enumerate(r['rows'], 1):
        L.append(f"| {i} | {unit_label(x['unit'])} | {x['C']} | {x['D']} | {x['I']}{'' if x['run_data'] else ' ⬛'} | {x['G']} | {x['B']} | "
                 f"{x['likelihood']} | {x['impact']} | **{x['score']}** | {LVL_ICON[x['level']]} {x['level']}{' ¹' if x['override'] else ''} |")
    L += ['', '> Mỗi yếu tố 0–3. Khả năng = 1 + (C+D+I+G)/12 × 4 · Tác động = 1 + B/3 × 4 · Điểm = Khả năng × Tác động (1–25) · '
          '🔴 ≥ 15 · 🟠 8–14,9 · 🟢 < 8. ¹ Nâng mức: còn lỗi Critical mở, hoặc chưa có TC nào. ⬛ = thiếu dữ liệu, tính như có rủi ro.', '',
          '### Căn cứ từng yếu tố', '']
    for x in r['rows']:
        e = x['evidence']
        L += [f"**{unit_label(x['unit'])}** — {LVL_ICON[x['level']]} {x['level']} ({x['score']}){' — ' + x['override'] if x['override'] else ''}", '',
              f"- C = {x['C']}: {e['C']}", f"- D = {x['D']}: {e['D']}", f"- I = {x['I']}: {e['I']}",
              f"- G = {x['G']}: {e['G']}", f"- B = {x['B']}: {e['B']}", '']
    return '\n'.join(L) + '\n'


# ───────────────────────── select ─────────────────────────
def build_select(d, today, tickets, reqs, modules, budget):
    tcs, runs, bugs, impacts = d['testcases'], d['runs'], d['bugs'], d['impacts']
    changed = set(reqs or [])
    used = []
    for i in impacts:
        if tickets and i['ticket'] in tickets:
            changed |= set(i['reqs'])
            used.append(i['ticket'])
    changed_mods = {(t['system'], t['module']) for t in tcs.values() if set(t['reqs']) & changed}
    for i in impacts:
        if i['ticket'] in used:
            changed_mods.add((i['system'], i['module']))
    dep_mods = set()
    if modules:
        extra = {(t['system'], t['module']) for t in tcs.values() if t['module'] in modules}
        if changed:   # có thay đổi: module truyền thêm là module PHỤ THUỘC — chỉ lấy @Smoke / @CriticalPath
            dep_mods = extra - changed_mods
        changed_mods |= extra
    hist = tc_histories(runs)
    flat_hist = {tc: seq for per in hist.values() for tc, seq in per.items()}
    bug_by_tc = defaultdict(list)
    for b in bugs:
        for t in b['tcs']:
            bug_by_tc[t].append(b)
    # thời lượng ước tính từng đơn vị
    rate = defaultdict(list)
    for r in runs:
        if r['min_per_tc']:
            rate[unit_key(r['system'], r['module'], r['platform'])].append(r['min_per_tc'])
    est = {u: round(sum(v) / len(v), 1) for u, v in rate.items()}
    cand, personal, excluded = [], [], []
    for t in tcs.values():
        if (t['system'], t['module']) not in changed_mods:
            continue
        u = unit_key(t['system'], t['module'], t['platform'])
        if t['deprecated']:
            excluded.append({'tc': t['id'], 'unit': u, 'why': '@Deprecated'})
            continue
        is_dep = (t['system'], t['module']) in dep_mods
        if is_dep and not {'@Smoke', '@CriticalPath'} & set(t['tags']):
            excluded.append({'tc': t['id'], 'unit': u, 'why': 'module phụ thuộc — chỉ lấy @Smoke / @CriticalPath'})
            continue
        pts, why, tier = 0, [], 2
        direct = sorted(set(t['reqs']) & changed)
        if direct:
            pts += 40; why.append(f"+40 trỏ REQ đổi {', '.join(direct)}"); tier = 0
        elif is_dep:
            why.append('module phụ thuộc')
        elif changed:
            pts += 10; why.append('+10 cùng module có thay đổi')
        lv = LEVEL_PTS.get(t['risk'], 8)
        pts += lv; why.append(f"+{lv} Risk {t['risk']}")
        pr = PRIO_PTS.get(t['priority'], 5)
        pts += pr; why.append(f"+{pr} Priority {t['priority']}")
        if '@Smoke' in t['tags']:
            pts += 10; why.append('+10 @Smoke'); tier = min(tier, 1)
        if '@CriticalPath' in t['tags']:
            pts += 10; why.append('+10 @CriticalPath')
        seq = flat_hist.get(t['id'])
        cls = classify_history(seq) if seq else None
        if not seq:
            pts += 10; why.append('+10 chưa chạy lần nào')
        elif cls == 'new_fail':
            pts += 20; why.append('+20 mới fail ở lần chạy gần nhất'); tier = 0
        elif cls == 'flaky':
            pts += 10; why.append('+10 kết quả lật PASS↔FAIL')
        elif seq[-1][1] == 'BLOCKED':
            pts += 8; why.append('+8 lần gần nhất BLOCKED')
        tb = bug_by_tc.get(t['id'], [])
        if any(b['state'] == 'fixed_pending' for b in tb):
            pts += 25; why.append('+25 bug đã fix chờ retest'); tier = 0
        elif any(b['state'] in ('open', 'review') for b in tb) and seq and seq[-1][1] == 'FAIL':
            pts -= 15; why.append('−15 bug còn mở chưa fix — chạy lại không thêm thông tin')
            tier = 2
        item = {'tc': t['id'], 'unit': u, 'file': t['file'], 'scenario': t['scenario'], 'score': pts, 'tier': tier,
                'why': why, 'minutes': est.get(u, DEFAULT_MIN_PER_TC), 'est_from_runs': u in est,
                'reqs': t['reqs'], 'last': seq[-1][1] if seq else '—'}
        (personal if '@PersonalOnly' in t['tags'] else cand).append(item)
    cand.sort(key=lambda x: (x['tier'], -x['score'], x['tc']))
    picked, skipped, used_min = [], [], 0.0
    for c in cand:
        if budget is None or c['tier'] == 0 or used_min + c['minutes'] <= budget:
            picked.append(c)
            used_min += c['minutes']
        else:
            skipped.append(c)
    covered = {r for c in picked for r in c['reqs']}
    return {'today': fmt_date(today), 'tickets': used, 'changed': sorted(changed),
            'modules': sorted(f'{s}/{m}' for s, m in changed_mods - dep_mods), 'dep_modules': sorted(f'{s}/{m}' for s, m in dep_mods),
            'budget': budget,
            'picked': picked, 'skipped': skipped, 'personal': personal, 'excluded': excluded,
            'minutes': round(used_min, 1), 'uncovered': sorted(changed - covered),
            'no_tc': sorted(r for r in changed if not any(r in t['reqs'] for t in tcs.values())), 'est': est}


TIER_LABEL = {0: 'Bắt buộc', 1: 'Smoke', 2: 'Theo điểm'}


def md_select(s):
    L = [f"<!-- sinh bởi scripts/quality-insights/qi.py select · {s['today']} -->", '',
         f"- Ticket: {', '.join('`' + t + '`' for t in s['tickets']) or '—'} · REQ đổi: {len(s['changed'])} · Module có thay đổi: {', '.join(s['modules']) or '—'}"
         + (f" · Module phụ thuộc (chỉ @Smoke / @CriticalPath): {', '.join(s['dep_modules'])}" if s['dep_modules'] else ''),
         f"- Quỹ thời gian: {str(s['budget']) + ' phút' if s['budget'] is not None else 'không giới hạn'} · Chọn **{len(s['picked'])}** TC ≈ **{s['minutes']} phút** · Cố ý bỏ {len(s['skipped'])} · QA tự chạy (@PersonalOnly) {len(s['personal'])}",
         f"- Thời lượng/TC lấy từ các lần chạy trước: {', '.join(f'{unit_label(k)} {v} phút' for k, v in s['est'].items()) or '—'} · đơn vị chưa có lần chạy tính {DEFAULT_MIN_PER_TC:g} phút/TC", '']
    if s['budget'] is not None and any(c['tier'] == 0 for c in s['picked']):
        must = sum(c['minutes'] for c in s['picked'] if c['tier'] == 0)
        if must > s['budget']:
            L += [f"> ⚠️ Riêng nhóm **Bắt buộc** đã cần ≈ {must:.0f} phút, vượt quỹ {s['budget']} phút — báo QA Lead xin thêm thời gian, **không** tự cắt nhóm này.", '']
    L += ['### Thứ tự chạy đề xuất', '', '| # | Nhóm | TC | Đơn vị | Điểm | Lần gần nhất | Lý do | ≈ phút |', '|---|---|---|---|---|---|---|---|']
    acc = 0.0
    for i, c in enumerate(s['picked'], 1):
        acc += c['minutes']
        L.append(f"| {i} | {TIER_LABEL[c['tier']]} | [`{c['tc']}`]({lk(c['file'])}) | {unit_label(c['unit'])} | {c['score']} | {c['last']} | {' · '.join(c['why'])} | {acc:.0f} |")
    L += ['', '### REQ đổi — độ phủ của tập đã chọn', '']
    L += [f"- 🔴 REQ đổi **chưa có TC nào**: {', '.join(s['no_tc'])} — cần `/update-testcases-from-impact` trước khi chạy"] if s['no_tc'] else []
    L += [f"- 🟠 REQ đổi có TC nhưng không lọt vào tập chọn: {', '.join(r for r in s['uncovered'] if r not in s['no_tc'])}"] if [r for r in s['uncovered'] if r not in s['no_tc']] else []
    if not s['uncovered']:
        L.append('- ✅ Mọi REQ đổi đều có ít nhất 1 TC trong tập đã chọn')
    L += ['', f"### ⏭️ Cố ý bỏ ({len(s['skipped'])} TC) — vượt quỹ thời gian, điểm thấp nhất", '']
    if s['skipped']:
        L += ['| TC | Đơn vị | Điểm | Lý do điểm |', '|---|---|---|---|']
        L += [f"| `{c['tc']}` | {unit_label(c['unit'])} | {c['score']} | {' · '.join(c['why'])} |" for c in s['skipped'][:60]]
        if len(s['skipped']) > 60:
            L.append(f"| … | | | còn {len(s['skipped']) - 60} TC — xem file JSON |")
    else:
        L.append('- Không có')
    if s['personal']:
        L += ['', '### QA tự chạy (@PersonalOnly — không đưa vào lượt chạy của agent)', '']
        L += [f"- `{c['tc']}` ({unit_label(c['unit'])}) — điểm {c['score']}" for c in s['personal']]
    return '\n'.join(L) + '\n'


# ───────────────────────── CLI ─────────────────────────
def write_out(stem, md, obj):
    p = Path(stem)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.with_suffix('.md').write_text(md, encoding='utf-8')
    p.with_suffix('.json').write_text(json.dumps(obj, ensure_ascii=False, indent=1, default=str), encoding='utf-8')
    print(f'→ {p.with_suffix(".md")} · {p.with_suffix(".json")}')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    for name in ('collect', 'trends', 'risk', 'select'):
        s = sub.add_parser(name)
        s.add_argument('--root', default='.', help='gốc project (chứa docs/)')
        s.add_argument('--modules', help='danh sách thư mục module, ngăn bằng dấu phẩy (VD login,customers)')
        s.add_argument('--platform', choices=PLATFORMS)
        s.add_argument('--system', help="namespace hệ thống: 'default' hoặc tên thư mục như _book-api")
        s.add_argument('--today', help='ngày tính tuổi lỗi (DD-MM-YYYY) — mặc định hôm nay')
        s.add_argument('-o', '--out', required=True, help='đường dẫn output, không cần đuôi')
        if name in ('risk', 'select'):
            s.add_argument('--ticket', help='mã ticket của impact report, ngăn bằng dấu phẩy')
        if name == 'risk':
            s.add_argument('--since', help='chỉ tính impact report từ ngày này (DD-MM-YYYY)')
        if name == 'select':
            s.add_argument('--req', help='REQ ID đổi, ngăn bằng dấu phẩy')
            s.add_argument('--budget', type=float, help='quỹ thời gian (phút)')
    a = ap.parse_args()
    root = Path(a.root)
    global LINK_FROM
    LINK_FROM = os.path.relpath(Path(a.out).resolve().parent, root.resolve())
    if not (root / 'docs').is_dir():
        sys.exit(f'Không thấy {root / "docs"} — chạy từ gốc project hoặc truyền --root')
    today = parse_date(a.today) if a.today else date.today()
    mods = [m.strip() for m in a.modules.split(',')] if a.modules else None
    data = scope_filter(collect(root), mods, a.platform, a.system)
    tickets = [t.strip() for t in a.ticket.split(',')] if getattr(a, 'ticket', None) else None
    if a.cmd == 'collect':
        p = Path(a.out).with_suffix('.json')
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f"→ {p} · {len(data['bugs'])} bug · {len(data['runs'])} run · {len(data['testcases'])} TC · {len(data['impacts'])} impact")
    elif a.cmd == 'trends':
        t = build_trends(data, today)
        write_out(a.out, md_trends(t), t)
    elif a.cmd == 'risk':
        if tickets:
            known = {i['ticket'] for i in data['impacts']}
            miss = [t for t in tickets if t not in known]
            if miss:
                sys.exit(f"Không thấy impact report cho: {', '.join(miss)} (tìm impact_<TICKET>.md trong docs/requirements/)")
        want = [unit_key(a.system or 'default', m, a.platform or '?') for m in (mods or [])]
        r = build_risk(data, today, tickets, parse_date(a.since) if a.since else None, want)
        write_out(a.out, md_risk(r), r)
    else:
        reqs = [x.strip() for x in a.req.split(',')] if a.req else None
        if not (tickets or reqs or mods):
            sys.exit('select cần ít nhất một trong --ticket / --req / --modules')
        if tickets:
            known = {i['ticket'] for i in data['impacts']}
            miss = [t for t in tickets if t not in known]
            if miss:
                sys.exit(f"Không thấy impact report cho: {', '.join(miss)} (tìm impact_<TICKET>.md trong docs/requirements/)")
        s = build_select(data, today, tickets, reqs, mods, a.budget)
        write_out(a.out, md_select(s), s)


if __name__ == '__main__':
    main()
