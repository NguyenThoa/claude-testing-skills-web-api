// CHỈ ĐỌC — trích spec của khung Figma để so với UI thật. KHÔNG tạo / sửa / xoá node nào.
// Cách dùng: đọc file này, thay FRAME_IDS, truyền nguyên văn vào tham số `code` của tool `use_figma`.
// Kết quả trả về là JSON → ghi ra reports/design-compare/<run>/figma_<frame-id>.json (đổi ':' thành '-').
//
// Đơn vị: đơn vị Figma (= dp Android · pt iOS · CSS px web). Toạ độ `rect` = [x, y, w, h] TƯƠNG ĐỐI với góc trái-trên của khung.
// FRAME_IDS rỗng → chỉ liệt kê page + khung cấp 1 (để lập Bản đồ màn hình), không trích chi tiết.
//   Mỗi khung kèm `fp` = dấu vân tay nội dung (chữ, toạ độ, màu, font của MỌI node con) — `dc.py cache plan` so với kho
//   để biết khung nào đổi, khung nào dùng lại spec + ảnh đã lưu (không tốn lượt get_screenshot).

const FRAME_IDS = ['<node-id>'];
// Khung vẽ lớp phủ (menu, dialog, bottom sheet) trên nền màn khác: đặt tên khối lớp phủ (VD 'Menu').
// Cây phần tử của app chỉ còn lớp phủ khi nó mở (nền bị ẩn khỏi cây trợ năng) → chỉ so lớp phủ, nền so ở khung riêng.
const SCOPE = null;
// Định dạng GỌN (mặc định): mảng thay cho object, bỏ khối không nền/viền (trừ khối cấp 1 như StatusBar · AppHeader · BottomNav).
// Kết quả phải chép ra file → càng ngắn càng ít lỗi chép. dc.py tự mở rộng. Đặt false khi cần xem đủ thuộc tính để gỡ lỗi.
const COMPACT = true;
// Chỉ liệt kê / lấy dấu vân tay các page này (id page, VD ['6:2']) — file rất lớn thì giới hạn để lượt liệt kê không quá chậm.
const PAGES = [];
const FINGERPRINT = true;

const hex = (paints) => {
  const list = paints && paints !== figma.mixed ? paints : [];
  const p = list.find(x => x.visible !== false && x.type === 'SOLID');
  if (!p) return null;
  const h = v => Math.round(v * 255).toString(16).padStart(2, '0');
  const a = p.opacity !== undefined && p.opacity < 1 ? '@' + p.opacity.toFixed(2) : '';
  return '#' + h(p.color.r) + h(p.color.g) + h(p.color.b) + a;
};
// bỏ ô null cho JSON gọn — kết quả phải chép ra file, càng ngắn càng ít lỗi chép
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== ''));
const textColor = (n) => {
  const c = hex(n.fills);
  if (c) return c;
  try { const seg = n.getStyledTextSegments(['fills'])[0]; return seg ? hex(seg.fills) : null; } catch (e) { return null; }
};
const font = (n) => {
  if (n.fontName !== figma.mixed) return n.fontName.family + ' ' + n.fontName.style;
  try { const s = n.getStyledTextSegments(['fontName'])[0]; return s.fontName.family + ' ' + s.fontName.style + ' (mixed)'; } catch (e) { return 'mixed'; }
};

// Dấu vân tay: băm FNV-1a hai lượt (64 bit) chuỗi mô tả mọi node con — toạ độ TƯƠNG ĐỐI khung (dời khung trên canvas không tính là đổi)
const fingerprint = (frame) => {
  let h1 = 0x811c9dc5, h2 = 0x9747b28c;
  const add = (str) => { for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 16777619); h2 = Math.imul(h2 ^ c, 2246822507); } };
  const val = (v) => v === figma.mixed ? 'mixed' : JSON.stringify(v);
  const fb = frame.absoluteBoundingBox || { x: 0, y: 0 };
  const walk = (n) => {
    if (n.visible === false) { add('~' + n.id); return; }
    const b = n.absoluteBoundingBox;
    add([n.type, n.name, b ? [b.x - fb.x, b.y - fb.y, b.width, b.height].map(Math.round).join(',') : '',
      'characters' in n ? n.characters : '', 'fontSize' in n ? val(n.fontSize) : '', 'fontName' in n ? val(n.fontName) : '',
      'fills' in n ? val(n.fills) : '', 'strokes' in n ? val(n.strokes) : '', 'cornerRadius' in n ? val(n.cornerRadius) : '',
      'opacity' in n ? n.opacity : ''].join('|'));
    if ('children' in n) for (const c of n.children) walk(c);
  };
  walk(frame);
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
};

if (!FRAME_IDS.length || FRAME_IDS[0] === '<node-id>') {
  const pages = [];
  for (const p of figma.root.children) {
    if (PAGES.length && !PAGES.includes(p.id)) continue;
    await p.loadAsync();
    // khung màn hình hay được gom trong SECTION — liệt kê cả khung con của section, không chỉ section
    const frames = [];
    const add = (c, section) => frames.push({ id: c.id, name: c.name, type: c.type, w: Math.round(c.width), h: Math.round(c.height),
      ...(section ? { section } : {}), ...(FINGERPRINT && c.type !== 'SECTION' ? { fp: fingerprint(c) } : {}) });
    for (const c of p.children) {
      if (c.type === 'SECTION') { add(c); for (const k of c.children) if (['FRAME', 'COMPONENT'].includes(k.type)) add(k, c.name); }
      else if (['FRAME', 'COMPONENT'].includes(c.type)) add(c);
    }
    pages.push({ id: p.id, name: p.name, frames });
  }
  return { file: figma.root.name, pages };
}

const frames = [];
for (const id of FRAME_IDS) {
  const frame = await figma.getNodeByIdAsync(id);
  if (!frame) { frames.push({ id, error: 'không tìm thấy node' }); continue; }
  const fb = frame.absoluteBoundingBox;
  const nodes = [];
  const walk = (n, path) => {
    if (n.visible === false) return;
    const b = n.absoluteBoundingBox;
    const rect = b ? [Math.round(b.x - fb.x), Math.round(b.y - fb.y), Math.round(b.width), Math.round(b.height)] : null;
    const owner = path.split(' > ')[0];
    if (n.type === 'TEXT') {
      nodes.push(clean({ k: 'text', id: n.id, path, text: n.characters, rect,
        size: n.fontSize === figma.mixed ? null : n.fontSize, font: font(n),
        weight: n.fontWeight === figma.mixed ? null : n.fontWeight,
        lh: n.lineHeight && n.lineHeight !== figma.mixed && n.lineHeight.unit === 'PIXELS' ? n.lineHeight.value : null,
        color: textColor(n), align: n.textAlignHorizontal, owner }));
    } else if (n !== frame && ['FRAME', 'INSTANCE', 'RECTANGLE', 'COMPONENT', 'ELLIPSE'].includes(n.type)) {
      const fill = hex(n.fills), stroke = hex(n.strokes);
      const radius = n.cornerRadius === undefined ? null : n.cornerRadius === figma.mixed ? 'mixed' : n.cornerRadius;
      if (fill || stroke || n.type === 'INSTANCE') {
        nodes.push(clean({ k: 'box', id: n.id, type: n.type, name: n.name, path, rect, fill, stroke,
          strokeW: stroke && n.strokeWeight !== figma.mixed ? Math.round(n.strokeWeight * 10) / 10 : null, radius: radius || null, owner }));
      }
    }
    // icon / ảnh: máy không so được nội dung, nhưng phải có mặt trong lưới soát (`dc.py checklist`) để người soát không bỏ sót
    const isIcon = (n.type === 'INSTANCE' || ['VECTOR', 'BOOLEAN_OPERATION', 'GROUP', 'FRAME', 'COMPONENT'].includes(n.type)) && /^(icon|ic[ _/-])/i.test(n.name);
    const hasImage = 'fills' in n && n.fills !== figma.mixed && n.fills.some(f => f.type === 'IMAGE' && f.visible !== false);
    const imageLike = !isIcon && n !== frame && /image|img|ảnh|hình|photo|avatar|banner|logo|thumbnail|cover/i.test(n.name)
      && 'findOne' in n && !n.findOne(c => c.type === 'TEXT');
    if (rect && n !== frame && (isIcon || hasImage || imageLike)) nodes.push(clean({ k: isIcon ? 'icon' : 'image', id: n.id, name: n.name, path, rect, owner }));
    // icon: dừng ở cấp icon — nét vẽ bên trong chỉ là nhiễu
    if ('children' in n && !isIcon) for (const c of n.children) walk(c, path ? path + ' > ' + n.name : n.name);
  };
  for (const c of frame.children) walk(c, '');
  frames.push({ source: 'figma', frame: { id: frame.id, name: frame.name, w: Math.round(fb.width), h: Math.round(fb.height), fill: hex(frame.fills) }, nodes });
}
if (SCOPE) for (const f of frames) if (f.nodes) f.nodes = f.nodes.filter(n => n.owner === SCOPE || n.name === SCOPE || /^status ?bar$/i.test(n.name || ''));
// t: [chữ, x, y, w, h, cỡ, đậm, line-height, màu, căn, khối cấp 1, font] · b: [tên, x, y, w, h, nền, viền, bo góc, khối cấp 1, là khối cấp 1 (1/0)]
// i: [tên, x, y, w, h, khối cấp 1, 'i' icon | 'm' ảnh]
const pack = (f) => f.error ? f : { f: [f.frame.id, f.frame.name, f.frame.w, f.frame.h, f.frame.fill], ...(SCOPE ? { scope: SCOPE } : {}),
  t: f.nodes.filter(n => n.k === 'text').map(n => [n.text, ...n.rect, n.size ?? null, n.weight ?? null, n.lh ?? null, n.color ?? null, n.align ?? null, n.owner ?? '', n.font ?? null]),
  b: f.nodes.filter(n => n.k === 'box' && (!n.path || ((n.fill || n.stroke) && n.rect[2] >= 24 && n.rect[3] >= 24))).map(n => [n.name, ...n.rect, n.fill ?? null, n.stroke ?? null, n.radius ?? null, n.owner ?? '', n.path ? 0 : 1]),
  i: f.nodes.filter(n => n.k === 'icon' || n.k === 'image').map(n => [n.name, ...n.rect, n.owner ?? '', n.k === 'icon' ? 'i' : 'm']) };
const out = COMPACT ? frames.map(pack) : frames;
return out.length === 1 ? out[0] : out;
