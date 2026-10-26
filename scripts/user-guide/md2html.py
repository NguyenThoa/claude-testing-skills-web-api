"""Markdown → HTML 1 file (mục lục cố định, ảnh bấm phóng to, video phát tại chỗ, sáng/tối).
Dùng cho MỌI tài liệu Markdown của dự án: User Guide · execution_report.md · retest_report.md · bug report · báo cáo khác.

    python scripts/user-guide/md2html.py <file.md> <out.html> [--standalone] [--lang vi|en] [--release] [--max-video-mb 50]

  --standalone    nhúng MỌI ảnh (PNG nén JPEG q78) và video (MP4/WebM ≤ --max-video-mb) vào HTML — gửi 1 file là xem được hết,
                  không cần kèm thư mục images/ evidence/ video/. Video vượt ngưỡng giữ link tương đối + in cảnh báo
  --lang          ngôn ngữ chữ giao diện (mục lục, nút, gợi ý) — khớp ngôn ngữ tài liệu. Mặc định vi
  --release       bản phát hành: cắt mọi đoạn giữa <!-- internal:start --> và <!-- internal:end --> (mục "Vùng chưa xác minh"…).
                  Không thấy cặp đánh dấu nào ⇒ báo lỗi, không xuất (tránh lỡ gửi khách ghi chú nội bộ)
  --max-video-mb  trần dung lượng MỖI video được nhúng (mặc định 50)

Trong Markdown (đường dẫn tương đối tính từ file .md, kể cả ../../ sang thư mục khác):
  ảnh   ![Chú thích](images/x.png)                                 → figure + chú thích = alt
  video <video src="video/x.mp4" title="Chú thích" controls></video>  → trình phát, chú thích = title (không có thì tên file)
  link  [ảnh](evidence/x.png) · [▶ video](video/TC_001.webm)        → ảnh / trình phát tại chỗ, chú thích = chữ của link
  Nằm TRONG bảng → ảnh thu nhỏ (bấm phóng to) / trình phát nhỏ, để bảng kết quả không bị kéo giãn. File không tồn tại ⇒ giữ link + cảnh báo
  ghi chú/cảnh báo: đoạn bắt đầu bằng 💡 ❗ ⚠️ 🛑 📌 → khung màu
Cần: pip install markdown pillow
"""
import argparse, base64, html, json, re, sys
from urllib.parse import unquote
from pathlib import Path
import markdown

for _s in (sys.stdout, sys.stderr):
    _s.reconfigure(encoding='utf-8', errors='replace')

I18N = {
    'vi': dict(toc_title='Mục lục', viewer='Xem ảnh', close='Đóng', prev='Ảnh trước', next='Ảnh sau', theme='Đổi giao diện sáng/tối',
               hint='Click ảnh để phóng to · ← → chuyển ảnh · Esc đóng'),
    'en': dict(toc_title='Contents', viewer='Image viewer', close='Close', prev='Previous image', next='Next image', theme='Toggle light/dark theme',
               hint='Click an image to zoom · ← → previous/next · Esc to close'),
}

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--standalone', action='store_true')
ap.add_argument('--release', action='store_true')
ap.add_argument('--lang', default='vi')
ap.add_argument('--max-video-mb', type=float, default=50)
a = ap.parse_args()
STANDALONE, RELEASE, LANG = a.standalone, a.release, a.lang
src, dst = Path(a.src), Path(a.dst)
base = src.parent
text = src.read_text(encoding='utf-8')

if RELEASE:
    text, n = re.subn(r'<!--\s*internal:start\s*-->.*?<!--\s*internal:end\s*-->', '', text, flags=re.S | re.I)
    if not n:
        sys.exit('--release: không thấy <!-- internal:start --> … <!-- internal:end --> — đánh dấu mục nội bộ trước khi xuất bản phát hành')
    print(f'--release: đã cắt {n} đoạn nội bộ')

# Dòng tiếp nối trong danh sách thụt 3 cách; python-markdown cần 4.
lines = []
for ln in text.splitlines():
    if ln.startswith('   ') and not ln.startswith('    '):
        ln = ' ' + ln
        if ln.strip().startswith(('💡', '❗', '⚠️', '🛑', '📌')):
            lines.append('')
    if re.match(r'^(\d+\. |- )', ln) and lines and lines[-1].strip() and not re.match(r'^\s*(\d+\. |- )', lines[-1]):
        lines.append('')
    lines.append(ln)
body = markdown.markdown('\n'.join(lines), extensions=['tables', 'toc', 'sane_lists'])
# `\|` trong ô bảng là dấu | đã thoát — python-markdown giữ nguyên dấu \ khi nó nằm trong `code`
body = re.sub(r'<code>(.*?)</code>', lambda m: '<code>' + m.group(1).replace('\\|', '|') + '</code>', body, flags=re.S)


def callout(m):
    inner = m.group(1)
    for mark, cls in (('❗', 'caution'), ('⚠️', 'warning'), ('🛑', 'danger'), ('💡', 'tip'), ('📌', 'note')):
        if inner.lstrip().startswith(mark):
            return f'<div class="callout {cls}">{inner}</div>'
    return m.group(0)
body = re.sub(r'<p>(.*?)</p>', callout, body, flags=re.S)
body = re.sub(r'<blockquote>\s*(.*?)\s*</blockquote>', lambda m: f'<div class="callout note">{m.group(1)}</div>', body, flags=re.S)

IMG_EXT = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml'}
VID_EXT = {'.mp4': 'video/mp4', '.webm': 'video/webm'}
ASSETS, KEYS, MISSING, BIG = {}, {}, [], []


def local(path):
    """File cục bộ mà đường dẫn trỏ tới — None nếu là URL / data: / neo #."""
    if re.match(r'^([a-z]+:|#|/)', path, re.I):
        return None
    return base / unquote(html.unescape(path))


def asset(f):
    k = str(f.resolve())
    if k not in KEYS:
        suf = f.suffix.lower()
        if suf == '.png':
            try:
                from io import BytesIO
                from PIL import Image
                buf = BytesIO(); Image.open(f).convert('RGB').save(buf, 'JPEG', quality=78, optimize=True, progressive=True)
                uri = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
            except ImportError:
                uri = 'data:image/png;base64,' + base64.b64encode(f.read_bytes()).decode()
        else:
            uri = f'data:{IMG_EXT.get(suf) or VID_EXT[suf]};base64,' + base64.b64encode(f.read_bytes()).decode()
        KEYS[k] = f'a{len(KEYS)}'; ASSETS[KEYS[k]] = uri
    return KEYS[k]


def source(path):
    """Thuộc tính nguồn: data-k (nhúng) khi --standalone và file có thật, ngược lại src tương đối."""
    f = local(path)
    if f is None:
        return f'src="{path}"'
    if not f.exists():
        MISSING.append(path); return f'src="{path}"'
    if not STANDALONE:
        return f'src="{path}"'
    if f.suffix.lower() in VID_EXT and f.stat().st_size > a.max_video_mb * 1024 * 1024:
        BIG.append(f'{path} ({f.stat().st_size / 1048576:.1f} MB)'); return f'src="{path}"'
    return f'data-k="{asset(f)}"'


def image(path, cap, small):
    s, c = source(path), html.escape(cap or Path(unquote(path)).name)
    if small:
        return f'<img class="thumb" {s} alt="{c}" title="{c}" loading="lazy">'
    return f'<figure><img {s} alt="{c}" loading="lazy"><figcaption>{c}</figcaption></figure>'


def player(path, cap, small):
    s, c = source(path), html.escape(cap or Path(unquote(path)).name)
    if small:
        return f'<video class="vmini" {s} title="{c}" controls preload="metadata"></video>'
    return f'<figure class="vid"><video {s} controls preload="metadata"></video><figcaption>{c}</figcaption></figure>'


def media(chunk, small):
    chunk = re.sub(r'<img alt="([^"]*)" src="([^"]+)"\s*/?>', lambda m: image(m.group(2), html.unescape(m.group(1)), small), chunk)

    def vid(m):
        t = re.search(r'\stitle="([^"]*)"', m.group(0))
        return player(m.group(1), html.unescape(t.group(1)) if t else m.group(1), small)
    chunk = re.sub(r'<video[^>]*\ssrc="([^"]+)"[^>]*>\s*</video>', vid, chunk)

    def link(m):   # [chữ](evidence/x.png) · [▶](video/x.webm) → ảnh / trình phát; file không có thật ⇒ giữ nguyên link
        path, txt = m.group(1), re.sub('<[^>]+>', '', m.group(2)).strip()
        f = local(path)
        if f is None or not f.exists():
            if f is not None:
                MISSING.append(path)
            return m.group(0)
        cap = txt if txt and txt not in ('▶', 'ảnh', 'video') else f.name
        return (image if f.suffix.lower() in IMG_EXT else player)(path, cap, small)
    ext = '|'.join(e[1:] for e in (*IMG_EXT, *VID_EXT))
    return re.sub(rf'<a href="([^"]+\.(?:{ext}))">(.*?)</a>', link, chunk, flags=re.I)


# Trong bảng → thu nhỏ; ngoài bảng → figure khổ đầy đủ
body = ''.join(media(part, part.startswith('<table>')) for part in re.split(r'(<table>.*?</table>)', body, flags=re.S))
body = re.sub(r'<p>\s*(<figure( class="vid")?>.*?</figure>)\s*</p>', r'\1', body, flags=re.S)
# Liên kết sang User Guide khác (.md) → bản .html cạnh nó nếu đã xuất (người đọc HTML không mở được .md)
body = re.sub(r'href="([^"#:]+)\.md(#[^"]*)?"', lambda m: f'href="{m.group(1)}.html{m.group(2) or ""}"' if (base / (m.group(1) + '.html')).exists() else m.group(0), body)
body = body.replace('<table>', '<div class="tbl"><table>').replace('</table>', '</table></div>')

toc = ''.join(f'<a class="lvl{lvl}" href="#{hid}">{re.sub("<[^>]+>", "", t)}</a>'
              for lvl, hid, t in re.findall(r'<h([23]) id="([^"]+)">(.*?)</h\1>', body))
m = re.search(r'<h1[^>]*>(.*?)</h1>', body)
title = re.sub('<[^>]+>', '', m.group(1)) if m else src.stem

t = I18N.get(LANG, I18N['en'])
page = (Path(__file__).with_name('template.html').read_text(encoding='utf-8')
        .replace('{{LANG}}', LANG).replace('{{TITLE}}', html.escape(title)).replace('{{TOC}}', toc).replace('{{BODY}}', body)
        .replace('{{JS_I18N}}', json.dumps(t, ensure_ascii=False)))
for k, v in t.items():
    page = page.replace('{{' + k.upper() + '}}', html.escape(v))
if ASSETS:   # bảng tài sản nạp TRƯỚC script lightbox (lightbox đọc .src khi bấm)
    page = page.replace('<!--ASSETS-->', '<script>var A=' + json.dumps(ASSETS) + ";document.querySelectorAll('[data-k]').forEach(function(e){e.src=A[e.getAttribute('data-k')]});</script>")
dst.write_text(page, encoding='utf-8')
print(f'{dst} — {dst.stat().st_size // 1024} KB · {sum(1 for v in ASSETS.values() if v.startswith("data:image"))} ảnh + '
      f'{sum(1 for v in ASSETS.values() if v.startswith("data:video"))} video nhúng · lang={LANG}' + (' · release' if RELEASE else ''))
for p in dict.fromkeys(MISSING):
    print('⚠️ không thấy file:', p)
for p in BIG:
    print(f'⚠️ video vượt {a.max_video_mb:g} MB — KHÔNG nhúng, HTML vẫn trỏ link tương đối (nâng --max-video-mb nếu cần):', p)
