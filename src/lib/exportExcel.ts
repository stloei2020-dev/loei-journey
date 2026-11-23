import * as XLSX from 'xlsx';
import { AnalyticsSummary, Article, Place, PlaceCategory } from '../types';
import { OFFICIAL_CONTACT } from '../constants/contact';
import { DISTRICTS } from '../data/seedData';

const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  stay: 'ที่พัก & โรงแรม',
  restaurant: 'ร้านอาหาร',
  cafe: 'คาเฟ่ & กาแฟ',
  attraction: 'สถานที่ท่องเที่ยว',
  service: 'ธุรกิจบริการน่าสนใจ',
  souvenir: 'ของฝากเมืองเลย'
};

function getDateStamp(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${y}${m}${d}_${hh}${mm}`;
}

function getThaiDateTime(): string {
  return new Date().toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getOriginSafe(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

function safeCellText(value: unknown, maxLen = 4000): string {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

function computeColWidths(rows: Record<string, unknown>[], minWidth = 10, maxWidth = 45): { wch: number }[] {
  if (rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys.map((key) => {
    let max = key.length + 3;
    for (const row of rows) {
      const val = row[key];
      const len = val === null || val === undefined ? 0 : String(val).split('\n')[0].length;
      if (len + 2 > max) max = len + 2;
    }
    return { wch: Math.min(Math.max(max, minWidth), maxWidth) };
  });
}

function computeAoAColWidths(aoa: unknown[][], minWidth = 12, maxWidth = 48): { wch: number }[] {
  if (aoa.length === 0) return [];
  const colCount = Math.max(...aoa.map((r) => r.length));
  const widths: { wch: number }[] = [];
  for (let c = 0; c < colCount; c++) {
    let max = minWidth;
    for (const row of aoa) {
      const val = row[c];
      const len = val === null || val === undefined ? 0 : String(val).split('\n')[0].length;
      if (len + 3 > max) max = len + 3;
    }
    widths.push({ wch: Math.min(max, maxWidth) });
  }
  return widths;
}

function downloadWorkbook(wb: XLSX.WorkBook, filename: string): void {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportPlacesToExcel(
  places: Place[],
  options?: { filenamePrefix?: string; filterDescription?: string }
): void {
  const origin = getOriginSafe();
  const wb = XLSX.utils.book_new();

  // Sheet 1: Full places directory
  const rows = places.map((p, index) => {
    const shareLink = origin ? `${origin}/?place=${encodeURIComponent(p.id)}` : `/?place=${encodeURIComponent(p.id)}`;
    const primaryImageLink =
      p.imageUrl && !p.imageUrl.startsWith('data:')
        ? p.imageUrl
        : origin
          ? `${origin}/api/place-image?id=${encodeURIComponent(p.id)}&cat=${encodeURIComponent(p.category)}`
          : '';

    const standardsText =
      p.standards && p.standards.length > 0
        ? p.standards.map((s) => (s.issuer ? `${s.name} (${s.issuer})` : s.name)).join(', ')
        : '-';

    return {
      'ลำดับ': index + 1,
      'รหัสสถานที่ (ID)': p.id,
      'ชื่อสถานที่ / ร้านค้า (ไทย)': safeCellText(p.name, 500),
      'ชื่อภาษาอังกฤษ': safeCellText(p.nameEn || '-', 500),
      'หมวดหมู่': CATEGORY_LABELS[p.category] || p.category,
      'อำเภอ': safeCellText(p.district, 200),
      'สถานะเผยแพร่': (p.status || 'published') === 'draft' ? 'แบบร่าง (ยังไม่เผยแพร่)' : 'เผยแพร่แล้ว',
      'แนะนำประจำสัปดาห์': p.isFeatured ? 'ใช่' : 'ไม่ใช่',
      'คะแนนรีวิว': typeof p.rating === 'number' ? p.rating : '',
      'ช่วงราคา / ค่าบริการ': safeCellText(p.priceRange || '-', 300),
      'เวลาเปิด-ปิด': safeCellText(p.openingHours || '-', 300),
      'เบอร์โทรศัพท์': safeCellText(p.phone || '-', 200),
      'ที่อยู่': safeCellText(p.address || '-', 1000),
      'มาตรฐานรับรอง': safeCellText(standardsText, 1000),
      'คำโปรยสั้น': safeCellText(p.shortDescription || '-', 1000),
      'รายละเอียดฉบับเต็ม': safeCellText(p.description || '-', 8000),
      'Google Maps URL': safeCellText(p.googleMapsUrl || '-', 1000),
      'Facebook': safeCellText(p.facebookUrl || '-', 500),
      'LINE': safeCellText(p.lineUrl || '-', 500),
      'เว็บไซต์': safeCellText(p.websiteUrl || '-', 500),
      'ลิงก์แชร์หน้าเว็บ': shareLink,
      'ลิงก์ภาพหน้าปก': safeCellText(primaryImageLink, 1000),
      'จำนวนรูปภาพ': p.gallery?.length || (p.imageUrl ? 1 : 0),
      'ยอดเข้าชม (Views)': p.viewsCount || 0,
      'ยอดแชร์ (Shares)': p.sharesCount || 0,
      'แท็ก (Tags)': p.tags && p.tags.length > 0 ? p.tags.join(', ') : '-',
      'อัปเดตล่าสุด': safeCellText(p.updatedAt || p.createdAt || '-', 100)
    };
  });

  const wsPlaces = rows.length > 0
    ? XLSX.utils.json_to_sheet(rows)
    : XLSX.utils.aoa_to_sheet([['ไม่พบข้อมูลสถานที่ตามเงื่อนไขที่เลือก']]);
  if (rows.length > 0) {
    wsPlaces['!cols'] = computeColWidths(rows);
  }
  XLSX.utils.book_append_sheet(wb, wsPlaces, 'รายการสถานที่และธุรกิจ');

  // Sheet 2: Executive Summary by Category & District
  const publishedCount = places.filter((p) => (p.status || 'published') !== 'draft').length;
  const draftCount = places.filter((p) => p.status === 'draft').length;
  const totalViews = places.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalShares = places.reduce((acc, p) => acc + (p.sharesCount || 0), 0);

  const summaryRows: unknown[][] = [
    ['รายงานสรุปข้อมูลสถานที่ท่องเที่ยว ที่พัก ร้านอาหาร และธุรกิจบริการ จังหวัดเลย (LOEI JOURNEY)'],
    ['หน่วยงาน', OFFICIAL_CONTACT.organization],
    ['ที่อยู่', OFFICIAL_CONTACT.address],
    ['โทรศัพท์', OFFICIAL_CONTACT.phoneDisplay],
    ['วันที่ส่งออกข้อมูล', getThaiDateTime()],
    ['เงื่อนไขการกรองข้อมูล', options?.filterDescription || 'ทั้งหมดในระบบ'],
    [],
    ['ภาพรวมจำนวนข้อมูล', 'จำนวน'],
    ['จำนวนสถานที่ทั้งหมดที่ส่งออก (แห่ง)', places.length],
    ['สถานะเผยแพร่แล้ว (แห่ง)', publishedCount],
    ['สถานะแบบร่าง (แห่ง)', draftCount],
    ['ยอดเข้าชมรวม (ครั้ง)', totalViews],
    ['ยอดแชร์รวม (ครั้ง)', totalShares],
    [],
    ['สรุปจำนวนแยกตามหมวดหมู่', 'จำนวน (แห่ง)', 'ยอดเข้าชมรวม', 'ยอดแชร์รวม']
  ];

  (Object.keys(CATEGORY_LABELS) as PlaceCategory[]).forEach((cat) => {
    const items = places.filter((p) => p.category === cat);
    summaryRows.push([
      CATEGORY_LABELS[cat],
      items.length,
      items.reduce((s, p) => s + (p.viewsCount || 0), 0),
      items.reduce((s, p) => s + (p.sharesCount || 0), 0)
    ]);
  });

  summaryRows.push([]);
  summaryRows.push(['สรุปจำนวนแยกตามอำเภอ (14 อำเภอ)', 'จำนวน (แห่ง)', 'ยอดเข้าชมรวม', 'ยอดแชร์รวม']);

  const districtNames = Array.from(
    new Set([...DISTRICTS.map((d) => d.name), ...places.map((p) => p.district).filter(Boolean)])
  );

  districtNames.forEach((dist) => {
    const items = places.filter((p) => p.district === dist);
    summaryRows.push([
      dist,
      items.length,
      items.reduce((s, p) => s + (p.viewsCount || 0), 0),
      items.reduce((s, p) => s + (p.sharesCount || 0), 0)
    ]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = computeAoAColWidths(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'สรุปตามหมวดหมู่และอำเภอ');

  const prefix = options?.filenamePrefix || 'LOEI_JOURNEY_Places';
  downloadWorkbook(wb, `${prefix}_${getDateStamp()}.xlsx`);
}

export function exportAnalyticsToExcel(analytics: AnalyticsSummary, places: Place[]): void {
  const wb = XLSX.utils.book_new();

  const summaryAoA: unknown[][] = [
    ['รายงานสถิติผู้เข้าชมและการแชร์ต่อ (LOEI JOURNEY Analytics)'],
    ['หน่วยงาน', OFFICIAL_CONTACT.organization],
    ['วันที่ส่งออกข้อมูล', getThaiDateTime()],
    [],
    ['ตัวชี้วัดหลัก (Key Metrics)', 'จำนวน'],
    ['ผู้เข้าชมเว็บไซต์ทั้งหมด (Pageviews)', analytics.totalPageviews],
    ['ยอดดูรายละเอียดสถานที่รวม (Place Views)', analytics.totalPlaceViews],
    ['ยอดแชร์ต่อทั้งหมด (Total Shares)', analytics.totalShares],
    [
      'อัตราการแชร์ต่อผู้เข้าชม (%)',
      Number(((analytics.totalShares / (analytics.totalPlaceViews || 1)) * 100).toFixed(2))
    ],
    [],
    ['สถิติการแชร์แยกตามแพลตฟอร์ม', 'จำนวน (ครั้ง)', 'สัดส่วน (%)'],
    [
      'Facebook',
      analytics.sharesByPlatform.facebook,
      analytics.totalShares > 0
        ? Number(((analytics.sharesByPlatform.facebook / analytics.totalShares) * 100).toFixed(1))
        : 0
    ],
    [
      'LINE',
      analytics.sharesByPlatform.line,
      analytics.totalShares > 0
        ? Number(((analytics.sharesByPlatform.line / analytics.totalShares) * 100).toFixed(1))
        : 0
    ],
    [
      'X (Twitter)',
      analytics.sharesByPlatform.x,
      analytics.totalShares > 0
        ? Number(((analytics.sharesByPlatform.x / analytics.totalShares) * 100).toFixed(1))
        : 0
    ],
    [
      'คัดลอกลิงก์ตรง (Direct Link)',
      analytics.sharesByPlatform.copy,
      analytics.totalShares > 0
        ? Number(((analytics.sharesByPlatform.copy / analytics.totalShares) * 100).toFixed(1))
        : 0
    ],
    [],
    ['ยอดเข้าชมแยกตามหมวดหมู่', 'ยอดเข้าชม (ครั้ง)']
  ];

  Object.entries(analytics.viewsByCategory).forEach(([cat, views]) => {
    summaryAoA.push([CATEGORY_LABELS[cat as PlaceCategory] || cat, views]);
  });

  summaryAoA.push([]);
  summaryAoA.push(['ยอดเข้าชมแยกตามอำเภอ', 'ยอดเข้าชม (ครั้ง)']);
  Object.entries(analytics.viewsByDistrict).forEach(([dist, views]) => {
    summaryAoA.push([dist, views]);
  });

  const wsOverview = XLSX.utils.aoa_to_sheet(summaryAoA);
  wsOverview['!cols'] = computeAoAColWidths(summaryAoA);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'ภาพรวมสถิติ');

  const rankedRows = [...places]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .map((p, idx) => ({
      'อันดับ': idx + 1,
      'ชื่อสถานที่ / ร้านค้า': safeCellText(p.name, 500),
      'หมวดหมู่': CATEGORY_LABELS[p.category] || p.category,
      'อำเภอ': p.district,
      'สถานะ': (p.status || 'published') === 'draft' ? 'แบบร่าง' : 'เผยแพร่แล้ว',
      'ยอดเข้าชม (Views)': p.viewsCount || 0,
      'ยอดแชร์ (Shares)': p.sharesCount || 0,
      'คะแนนรีวิว': p.rating || ''
    }));

  const wsRanked = rankedRows.length > 0
    ? XLSX.utils.json_to_sheet(rankedRows)
    : XLSX.utils.aoa_to_sheet([['ไม่มีข้อมูลสถานที่']]);
  if (rankedRows.length > 0) {
    wsRanked['!cols'] = computeColWidths(rankedRows);
  }
  XLSX.utils.book_append_sheet(wb, wsRanked, 'สถิติรายสถานที่');

  downloadWorkbook(wb, `LOEI_JOURNEY_Analytics_${getDateStamp()}.xlsx`);
}

export function exportArticlesToExcel(articles: Article[]): void {
  const origin = getOriginSafe();
  const wb = XLSX.utils.book_new();

  const rows = articles.map((art, idx) => ({
    'ลำดับ': idx + 1,
    'รหัสบทความ (ID)': art.id,
    'หัวข้อบทความ': safeCellText(art.title, 500),
    'หมวดหมู่': safeCellText(art.category, 200),
    'ผู้เขียน': safeCellText(art.author, 200),
    'เวลาอ่าน': safeCellText(art.readTime, 100),
    'เรื่องเด่น': art.isFeatured ? 'ใช่' : 'ไม่ใช่',
    'วันที่เผยแพร่': safeCellText(art.publishedAt, 100),
    'บทคัดย่อ': safeCellText(art.excerpt, 1500),
    'เนื้อหาฉบับเต็ม': safeCellText(art.content, 10000),
    'ลิงก์แชร์บทความ': origin ? `${origin}/?article=${encodeURIComponent(art.id)}` : `/?article=${encodeURIComponent(art.id)}`
  }));

  const ws = rows.length > 0
    ? XLSX.utils.json_to_sheet(rows)
    : XLSX.utils.aoa_to_sheet([['ไม่มีข้อมูลบทความ']]);
  if (rows.length > 0) {
    ws['!cols'] = computeColWidths(rows);
  }
  XLSX.utils.book_append_sheet(wb, ws, 'รายการบทความ');

  downloadWorkbook(wb, `LOEI_JOURNEY_Articles_${getDateStamp()}.xlsx`);
}
