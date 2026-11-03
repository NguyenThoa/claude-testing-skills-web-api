"""gsheet_fetch.py — Đọc một tab Google Sheet (ticket / requirement / bug) và xuất Markdown · JSON · CSV.
Bộ công cụ của skill skills-gsheet-integration — thay cho việc lấy ticket từ Jira.

Nguồn nhận được:
    --url   <link Google Sheet>    Sheet chia sẻ "Bất kỳ ai có đường liên kết đều xem được" — tải CSV qua link export
    --file  <đường dẫn .csv/.tsv>   Bản tải về từ Google Sheet (File → Tải xuống → CSV) — dùng cho sheet riêng tư

    python scripts/gsheet/gsheet_fetch.py --url "<link>" --list-columns                      # xem tên cột trước
    python scripts/gsheet/gsheet_fetch.py --url "<link>" --id TK-12,TK-15 --format md -o <file.md>
    python scripts/gsheet/gsheet_fetch.py --url "<link>" --sheet "Requirements" --module login --status "Sẵn sàng test"
    python scripts/gsheet/gsheet_fetch.py --file reports/gsheet/tickets.csv --where "Loại=Story" --format json

Không đăng nhập Google, không cần API key: sheet riêng tư → link export trả về trang đăng nhập → script dừng (mã 2)
và báo cách xử lý, KHÔNG đoán nội dung. Tên cột khớp theo bí danh (Tiếng Việt / Tiếng Anh, không phân biệt hoa-thường)
— bảng bí danh ở COLUMN_ALIASES, đổi quy ước cột của team thì sửa ở đó và ở SKILL.md.
Cần: Python 3.9+ · không cần thư viện ngoài.
"""
import argparse, csv, io, json, re, sys, unicodedata
from datetime import datetime
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import Request, urlopen

for _s in (sys.stdout, sys.stderr):
    _s.reconfigure(encoding='utf-8', errors='replace')

COLUMN_ALIASES = {
    'id': ['ticket id', 'ma ticket', 'ma', 'id', 'key', 'ticket', 'story id', 'ma yeu cau', 'ma story'],
    'title': ['tieu de', 'title', 'summary', 'ten', 'ten chuc nang', 'tom tat'],
    'type': ['loai', 'type', 'issue type', 'loai ticket'],
    'module': ['module', 'phan he', 'chuc nang', 'feature'],
    'status': ['trang thai', 'status', 'tinh trang'],
    'priority': ['uu tien', 'priority', 'muc uu tien'],
    'description': ['mo ta', 'description', 'noi dung', 'chi tiet'],
    'ac': ['acceptance criteria', 'tieu chi chap nhan', 'ac', 'dieu kien chap nhan'],
}
LONG_FIELDS = ('description', 'ac')
SHEET_ID_RE = re.compile(r'/spreadsheets/d/([a-zA-Z0-9_-]+)')


def norm(text):
    text = unicodedata.normalize('NFD', str(text)).replace('đ', 'd').replace('Đ', 'D')
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', text).strip().lower()


def export_url(url, sheet=None, gid=None):
    m = SHEET_ID_RE.search(url)
    if not m:
        sys.exit('❌ Không nhận ra link Google Sheet — cần dạng https://docs.google.com/spreadsheets/d/<ID>/...')
    sheet_id = m.group(1)
    if sheet:
        return f'https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={quote(sheet)}'
    if gid is None:
        parsed = urlparse(url)
        gid = (parse_qs(parsed.query).get('gid') or parse_qs(parsed.fragment).get('gid') or ['0'])[0]
    return f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}'


def download(url):
    req = Request(url, headers={'User-Agent': 'gsheet_fetch/1.0'})
    try:
        with urlopen(req, timeout=30) as resp:
            body = resp.read().decode('utf-8-sig', errors='replace')
            ctype = resp.headers.get('Content-Type', '')
    except HTTPError as e:
        if e.code in (401, 403, 404):
            private_sheet_exit(f'HTTP {e.code}')
        sys.exit(f'❌ Google trả HTTP {e.code} khi tải sheet')
    except URLError as e:
        sys.exit(f'❌ Không kết nối được Google Sheets: {e.reason}')
    if 'text/html' in ctype or body.lstrip()[:15].lower().startswith(('<!doctype', '<html')):
        private_sheet_exit('Google trả về trang HTML (trang đăng nhập)')
    return body


def private_sheet_exit(reason):
    sys.stderr.write(
        f'⛔ Không đọc được sheet: {reason}.\n'
        '   Sheet đang riêng tư (hoặc link sai — kiểm tra lại link). Chọn một trong ba cách:\n'
        '   1. Bật connector Google Drive trong Claude rồi đọc sheet qua connector\n'
        '   2. Chia sẻ sheet "Bất kỳ ai có đường liên kết — Người xem" rồi chạy lại\n'
        '   3. File → Tải xuống → CSV, chạy lại với --file <đường dẫn .csv>\n')
    sys.exit(2)


def read_rows(text, delimiter=','):
    rows = [r for r in csv.reader(io.StringIO(text), delimiter=delimiter)]
    rows = [r for r in rows if any(c.strip() for c in r)]
    if not rows:
        sys.exit('❌ Sheet rỗng — không có dòng nào')
    header = [h.strip() for h in rows[0]]
    records = []
    for r in rows[1:]:
        r = r + [''] * (len(header) - len(r))
        records.append({h: r[i].strip() for i, h in enumerate(header) if h})
    return [h for h in header if h], records


def map_columns(header):
    found = {}
    normed = {norm(h): h for h in header}
    for role, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            if alias in normed:
                found[role] = normed[alias]
                break
    return found


def apply_filters(records, cols, args):
    def match_any(value, wanted):
        return norm(value) in {norm(w) for w in wanted}

    out = records
    if args.id:
        if 'id' not in cols:
            sys.exit('❌ Không tìm thấy cột mã ticket — xem tên cột bằng --list-columns rồi lọc bằng --where')
        out = [r for r in out if match_any(r.get(cols['id'], ''), args.id.split(','))]
    for role, value in (('module', args.module), ('status', args.status), ('type', args.type)):
        if value:
            if role not in cols:
                sys.exit(f'❌ Không tìm thấy cột {role} — xem tên cột bằng --list-columns rồi lọc bằng --where')
            out = [r for r in out if match_any(r.get(cols[role], ''), value.split(','))]
    for cond in args.where or []:
        if '=' not in cond:
            sys.exit(f'❌ --where phải có dạng "Tên cột=giá trị": {cond}')
        key, value = (s.strip() for s in cond.split('=', 1))
        real = next((h for h in (out[0].keys() if out else []) if norm(h) == norm(key)), None)
        if out and real is None:
            sys.exit(f'❌ Không có cột "{key}" trong sheet')
        out = [r for r in out if norm(r.get(real, '')) == norm(value)]
    return out


def cell(value):
    return value.replace('|', '\\|').replace('\n', '<br>') or '—'


def to_markdown(records, cols, source, fetched):
    lines = [
        '# Ticket lấy từ Google Sheet',
        '',
        '| Thuộc tính | Giá trị |',
        '|---|---|',
        f'| Nguồn | {source} |',
        f'| Thời điểm lấy | {fetched} |',
        f'| Số ticket | {len(records)} |',
        '',
        '> Bản chụp tại thời điểm lấy — sheet đổi sau đó thì lấy lại, không sửa tay file này.',
        '',
    ]
    for r in records:
        tid = r.get(cols.get('id', ''), '') or '(không có mã)'
        title = r.get(cols.get('title', ''), '')
        lines += [f'## {tid} — {title}'.rstrip(' —'), '']
        long_cols = [cols[k] for k in LONG_FIELDS if k in cols]
        short = [(k, v) for k, v in r.items() if k not in long_cols and k not in (cols.get('id'), cols.get('title'))]
        if short:
            lines += ['| Cột | Giá trị |', '|---|---|']
            lines += [f'| {k} | {cell(v)} |' for k, v in short]
            lines.append('')
        for k in long_cols:
            if r.get(k):
                lines += [f'### {k}', '', r[k], '']
    return '\n'.join(lines).rstrip() + '\n'


def main():
    ap = argparse.ArgumentParser(description='Đọc tab Google Sheet → Markdown / JSON / CSV')
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument('--url', help='Link Google Sheet (lấy gid từ link nếu có)')
    src.add_argument('--file', help='File .csv / .tsv tải về từ Google Sheet')
    ap.add_argument('--sheet', help='Tên tab (thay cho gid)')
    ap.add_argument('--gid', help='gid của tab — mặc định lấy từ link, không có thì tab đầu')
    ap.add_argument('--id', help='Lọc theo mã ticket, nhiều mã cách nhau dấu phẩy')
    ap.add_argument('--module', help='Lọc theo cột Module')
    ap.add_argument('--status', help='Lọc theo cột Trạng thái')
    ap.add_argument('--type', help='Lọc theo cột Loại')
    ap.add_argument('--where', action='append', help='Lọc "Tên cột=giá trị", lặp được')
    ap.add_argument('--format', choices=('md', 'json', 'csv'), default='md')
    ap.add_argument('--list-columns', action='store_true', help='Chỉ in tên cột và vai trò nhận ra được')
    ap.add_argument('-o', '--output', help='Ghi ra file thay vì stdout')
    args = ap.parse_args()

    if args.url:
        url = export_url(args.url, args.sheet, args.gid)
        text, delimiter = download(url), ','
        source = args.url.split('?')[0].split('#')[0] + (f' · tab `{args.sheet}`' if args.sheet else f' · gid `{url.rsplit("=", 1)[-1]}`')
    else:
        path = Path(args.file)
        if not path.exists():
            sys.exit(f'❌ Không thấy file {path}')
        text = path.read_text(encoding='utf-8-sig')
        delimiter = '\t' if path.suffix.lower() == '.tsv' else ','
        source = f'`{path.as_posix()}` (bản tải về từ Google Sheet)'

    header, records = read_rows(text, delimiter)
    cols = map_columns(header)

    if args.list_columns:
        roles = {v: k for k, v in cols.items()}
        print(f'{len(records)} dòng · {len(header)} cột')
        for h in header:
            print(f'- {h}' + (f'  → {roles[h]}' if h in roles else ''))
        missing = [k for k in ('id', 'title') if k not in cols]
        if missing:
            print(f'⚠️ Chưa nhận ra cột: {", ".join(missing)} — đổi tên cột hoặc thêm bí danh vào COLUMN_ALIASES')
        return

    records = apply_filters(records, cols, args)
    if not records:
        sys.stderr.write('⚠️ Không có dòng nào khớp bộ lọc\n')

    fetched = datetime.now().strftime('%d-%m-%Y %H:%M')
    if args.format == 'json':
        out = json.dumps({'source': source, 'fetched': fetched, 'columns': cols, 'rows': records},
                         ensure_ascii=False, indent=2) + '\n'
    elif args.format == 'csv':
        buf = io.StringIO()
        writer = csv.DictWriter(buf, fieldnames=header, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(records)
        out = buf.getvalue()
    else:
        out = to_markdown(records, cols, source, fetched)

    if args.output:
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output).write_text(out, encoding='utf-8')
        sys.stderr.write(f'✅ {len(records)} dòng → {args.output}\n')
    else:
        sys.stdout.write(out)


if __name__ == '__main__':
    main()
