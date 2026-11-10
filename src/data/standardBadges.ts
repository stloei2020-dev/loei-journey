import { StandardBadge } from '../types';

// Predefined official standards & certification presets with high quality SVG logos
export const PRESET_STANDARDS: StandardBadge[] = [
  {
    id: 'sha-extra-plus',
    name: 'SHA Extra Plus',
    issuer: 'การท่องเที่ยวแห่งประเทศไทย (ททท.) & กระทรวงสาธารณสุข',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230284c7" stroke="%2338bdf8" stroke-width="3"/><path d="M50 20 L68 35 L68 62 L50 78 L32 62 L32 35 Z" fill="%23ffffff"/><text x="50" y="52" font-family="sans-serif" font-size="16" font-weight="900" fill="%230369a1" text-anchor="middle">SHA</text><text x="50" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230284c7" text-anchor="middle">EXTRA+</text></svg>',
    description: 'มาตรฐานความปลอดภัยด้านสุขอนามัย Amazing Thailand Safety & Health Administration'
  },
  {
    id: 'green-hotel',
    name: 'Green Hotel (โรงแรมสีเขียวระดับทอง)',
    issuer: 'กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%2315803d" stroke="%2386efac" stroke-width="3"/><path d="M50 22 C35 30 25 50 35 70 C45 78 55 78 65 70 C75 50 65 30 50 22 Z" fill="%23ffffff"/><path d="M50 30 Q53 50 50 70 M40 50 Q48 55 50 50 M60 45 Q52 50 50 50" stroke="%2315803d" stroke-width="3" fill="none"/><text x="50" y="88" font-family="sans-serif" font-size="8" font-weight="bold" fill="%23ffffff" text-anchor="middle">GREEN HOTEL</text></svg>',
    description: 'มาตรฐานการจัดการสิ่งแวดล้อมและการอนุรักษ์พลังงานระดับยอดเยี่ยม'
  },
  {
    id: 'otop-5-stars',
    name: 'OTOP 5 ดาว (สุดยอดหนึ่งตำบล หนึ่งผลิตภัณฑ์)',
    issuer: 'กรมการพัฒนาชุมชน กระทรวงมหาดไทย',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23b45309" stroke="%23fde68a" stroke-width="3"/><polygon points="50,15 58,35 80,35 62,49 69,70 50,57 31,70 38,49 20,35 42,35" fill="%23fbbf24"/><text x="50" y="82" font-family="sans-serif" font-size="12" font-weight="900" fill="%23ffffff" text-anchor="middle">OTOP 5★</text></svg>',
    description: 'สุดยอดผลิตภัณฑ์ชุมชนระดับพรีเมียม ภูมิปัญญาพื้นบ้านไทยแท้'
  },
  {
    id: 'thai-select',
    name: 'Thai SELECT Classic',
    issuer: 'กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23991b1b" stroke="%23fca5a5" stroke-width="3"/><path d="M50 22 C62 22 72 32 72 44 C72 58 50 78 50 78 C50 78 28 58 28 44 C28 32 38 22 50 22 Z" fill="%23ffffff"/><text x="50" y="45" font-family="sans-serif" font-size="10" font-weight="900" fill="%23991b1b" text-anchor="middle">Thai</text><text x="50" y="57" font-family="sans-serif" font-size="9" font-weight="bold" fill="%23991b1b" text-anchor="middle">SELECT</text></svg>',
    description: 'ตรารับรองรสชาติอาหารไทยต้นตำรับและมาตรฐานสุขอนามัยระดับสากล'
  },
  {
    id: 'tat-standard',
    name: 'มาตรฐานการท่องเที่ยวไทย (Thailand Tourism Standard)',
    issuer: 'กรมการท่องเที่ยว กระทรวงการท่องเที่ยวและกีฬา',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%231e3a8a" stroke="%2393c5fd" stroke-width="3"/><path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" fill="%23ffffff"/><text x="50" y="47" font-family="sans-serif" font-size="14" font-weight="900" fill="%231e3a8a" text-anchor="middle">TTS</text><text x="50" y="62" font-family="sans-serif" font-size="8" font-weight="bold" fill="%232563eb" text-anchor="middle">มาตรฐาน ททท.</text></svg>',
    description: 'เครื่องหมายรับรองมาตรฐานการบริการและสิ่งอำนวยความสะดวกสำหรับนักท่องเที่ยว'
  },
  {
    id: 'specialty-coffee',
    name: 'Loei Specialty Coffee Heritage',
    issuer: 'สมาคมกาแฟพิเศษไทย & จังหวัดเลย',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23451a03" stroke="%23d97706" stroke-width="3"/><path d="M35 38 Q50 25 65 38 Q50 50 35 38 Z M35 62 Q50 50 65 62 Q50 75 35 62 Z" fill="%23fef3c7"/><line x1="50" y1="28" x2="50" y2="72" stroke="%2378350f" stroke-width="3"/><text x="50" y="88" font-family="sans-serif" font-size="8" font-weight="bold" fill="%23fbbf24" text-anchor="middle">SPECIALTY</text></svg>',
    description: 'เมล็ดกาแฟสายพันธุ์คัดพิเศษ ปลูกบนพื้นที่สูงภูเรือและภูหลวง'
  }
];
