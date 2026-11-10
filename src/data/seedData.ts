import { Place, Article, DistrictInfo } from '../types';
import { PRESET_STANDARDS } from './standardBadges';

import heroImg from '../assets/images/loei_hero_sea_of_mist_1794278412692.jpg';
import chiangKhanImg from '../assets/images/chiang_khan_walking_street_1794278414260.jpg';
import phuKraduengImg from '../assets/images/phu_kradueng_cliff_pine_1794278415253.jpg';
import phuPaPoImg from '../assets/images/phu_pa_po_mountain_1794278416294.jpg';
import cuisineCafeImg from '../assets/images/loei_cuisine_and_cafe_1794278415525.jpg';

export const HERO_IMAGE = heroImg || '/images/loei_hero_sea_of_mist_1794278412692.jpg';
export const CHIANG_KHAN_IMAGE = chiangKhanImg || '/images/chiang_khan_walking_street_1794278414260.jpg';
export const PHU_KRADUENG_IMAGE = phuKraduengImg || '/images/phu_kradueng_cliff_pine_1794278415253.jpg';
export const PHU_PA_PO_IMAGE = phuPaPoImg || '/images/phu_pa_po_mountain_1794278416294.jpg';
export const CUISINE_CAFE_IMAGE = cuisineCafeImg || '/images/loei_cuisine_and_cafe_1794278415525.jpg';

export const DISTRICTS: DistrictInfo[] = [
  {
    name: 'อำเภอเชียงคาน',
    nameEn: 'Chiang Khan',
    tagline: 'เมืองไม้เก่าริมแม่น้ำโขง สายหมอกภูทอก และวิถีชีวิตสโลว์ไลฟ์',
    description: 'เมืองชายแดนริมแม่น้ำโขงที่เปี่ยมด้วยมนต์เสน่ห์ บ้านไม้เก่าแก่สองฟากถนนคนเดิน บรรยากาศเงียบสงบ ตักบาตรข้าวเหนียวตอนเช้าตรู่ และชมทะเลหมอกสุดอลังการบนภูทอก',
    highlightAttraction: 'ถนนคนเดินเชียงคาน, ภูทอก, แก่งคุดคู้',
    imageUrl: CHIANG_KHAN_IMAGE
  },
  {
    name: 'อำเภอภูกระดึง',
    nameEn: 'Phu Kradueng',
    tagline: 'ยอดภูรูปหัวใจในตำนาน ดินแดนแห่งการพิสูจน์รักแท้และสนสามใบ',
    description: 'หนึ่งในอุทยานแห่งชาติที่คลาสสิกที่สุดของเมืองไทย ที่ราบกว้างใหญ่บนยอดภู ป่าสน น้ำตก ทุ่งกุหลาบพันปี และจุดชมพระอาทิตย์ตกที่ผาหล่มสักอันลือชื่อ',
    highlightAttraction: 'ผาหล่มสัก, ผาหล่มเต่า, ลานพระแก้ว',
    imageUrl: PHU_KRADUENG_IMAGE
  },
  {
    name: 'อำเภอภูเรือ',
    nameEn: 'Phu Ruea',
    tagline: 'เมืองหนาวที่สุดในสยาม ดินแดนแห่งดอกไม้เมืองหนาวและกาแฟอาราบิก้า',
    description: 'อำเภอที่มียอดเขารูปร่างคล้ายเรือสำเภา อากาศหนาวเย็นตลอดทั้งปี มีแปลงไม้ดอกเมืองหนาว พืชผักออร์แกนิก และไร่กาแฟสายพันธุ์พิเศษบนภูสูง',
    highlightAttraction: 'อุทยานแห่งชาติภูเรือ, เกษตรที่สูงภูเรือ',
    imageUrl: HERO_IMAGE
  },
  {
    name: 'อำเภอหนองหิน',
    nameEn: 'Nong Hin',
    tagline: 'คุนหมิงเมืองเลย และฟูจิเมืองเลย ณ ภูป่าเปาะ',
    description: 'มหัศจรรย์แห่งธรรมชาติกับแนวหินปูนอายุหลายร้อยล้านปีที่สวนหินผางาม และจุดชมวิวภูป่าเปาะที่มองเห็นยอดภูหอรูปร่างคล้ายภูเขาไฟฟูจิ',
    highlightAttraction: 'ภูป่าเปาะ, สวนหินผางาม (คุนหมิงเมืองเลย)',
    imageUrl: PHU_PA_PO_IMAGE
  },
  {
    name: 'อำเภอด่านซ้าย',
    nameEn: 'Dan Sai',
    tagline: 'เมืองแห่งตำนานผีตาโขน ดินแดนแห่งสัจจะไมตรีพระธาตุศรีสองรัก',
    description: 'ศูนย์กลางวัฒนธรรมประเพณีอันเก่าแก่ ประเพณีบุญหลวงและการละเล่นผีตาโขนอันโด่งดังระดับโลก วัดเนรมิตวิปัสสนาศิลาแลง และทะเลหมอกภูอีเลิศ',
    highlightAttraction: 'พระธาตุศรีสองรัก, วัดเนรมิตวิปัสสนา, ภูอีเลิศ',
    imageUrl: CUISINE_CAFE_IMAGE
  },
  {
    name: 'อำเภอเมืองเลย',
    nameEn: 'Mueang Loei',
    tagline: 'ศูนย์กลางวัฒนธรรม ประตูสู่ธรรมชาติ และอาหารพื้นถิ่นแสนอร่อย',
    description: 'หัวใจของจังหวัดเลย ที่ผสมผสานความสะดวกสบายของเมืองเข้ากับธรรมชาติ มีวนอุทยานภูบ่อบิดชมวิวเมือง 360 องศา และตลาดอาหารพื้นเมืองที่คึกคัก',
    highlightAttraction: 'ภูบ่อบิด, ศาลเจ้าพ่อกุดป่อง, สวนสาธารณะกุดป่อง',
    imageUrl: HERO_IMAGE
  },
  {
    name: 'อำเภอนาแห้ว',
    nameEn: 'Na Haeo',
    tagline: 'เพชรเม็ดงามชายแดนไทย-ลาว สายน้ำเหืองและธรรมชาติบริสุทธิ์',
    description: 'อำเภอชายแดนที่เงียบสงบที่สุด โอบล้อมด้วยภูเขา ป่าไม้หนาทึบ สถาปัตยกรรมล้านช้างที่วัดโพธิ์ชัยนาพึง และจุดชมหมอกภูหัวฮ่อม',
    highlightAttraction: 'ภูหัวฮ่อม, วัดโพธิ์ชัยนาพึง, น้ำตกธารสวรรค์',
    imageUrl: HERO_IMAGE
  },
  {
    name: 'อำเภอปากชม',
    nameEn: 'Pak Chom',
    tagline: 'สายน้ำโขงคดเคี้ยว วิถีประมงพื้นบ้าน และพันโขดแสนไคร้',
    description: 'ดินแดนริมน้ำโขงที่มีเกาะแก่งหินธรรมชาติอันงดงาม วิถีชีวิตริมสายน้ำที่สงบสุข และจุดชมวิวภูลำดวนที่เห็นโค้งน้ำโขงสองแผ่นดิน',
    highlightAttraction: 'ภูลำดวน, พันโขดแสนไคร้, จุดชมวิวบ้านคกไผ่',
    imageUrl: CHIANG_KHAN_IMAGE
  },
  {
    name: 'อำเภอท่าลี่',
    nameEn: 'Tha Li',
    tagline: 'สะพานมิตรภาพน้ำเหือง ประตูสู่เมืองหลวงพระบาง',
    description: 'เมืองชายแดนที่มีสะพานข้ามแม่น้ำเหืองเชื่อมไทย-สปป.ลาว มีพระธาตุสัจจะสถาปัตยกรรมงดงาม และธรรมชาติที่ร่มรื่น',
    highlightAttraction: 'พระธาตุสัจจะ, ด่านพรมแดนบ้านนากระเซ็ง',
    imageUrl: HERO_IMAGE
  },
  {
    name: 'อำเภอภูหลวง',
    nameEn: 'Phu Luang',
    tagline: 'มรกตแห่งอีสาน ดินแดนพรรณไม้หายากและกล้วยไม้ป่า',
    description: 'เขตรักษาพันธุ์สัตว์ป่าภูหลวง แหล่งรวบรวมกล้วยไม้ป่าและดอกไม้ป่าหายากระดับโลก ทุ่งหญ้าสะวันนา และรอยเท้าไดโนเสาร์',
    highlightAttraction: 'เขตรักษาพันธุ์สัตว์ป่าภูหลวง, โหล่นแต้, ผากบ',
    imageUrl: PHU_KRADUENG_IMAGE
  },
  {
    name: 'อำเภอวังสะพุง',
    nameEn: 'Wang Saphung',
    tagline: 'ชุมชนผ้าทอพื้นเมือง ธรรมชาติริมแม่น้ำเลย และสวนเกษตร',
    description: 'ดินแดนอุดมสมบูรณ์ แหล่งผลิตผลผลิตทางการเกษตร ผ้าฝ้ายทอมือลายโบราณ และน้ำตกสวนห้อมแสนสดชื่น',
    highlightAttraction: 'สวนสวรรค์วังสะพุง, น้ำตกสวนห้อม',
    imageUrl: PHU_PA_PO_IMAGE
  },
  {
    name: 'อำเภอเอราวัณ',
    nameEn: 'Erawan',
    tagline: 'ตำนานถ้ำช้างเอราวัณ บันไดสวรรค์สู่ดินแดนศักดิ์สิทธิ์',
    description: 'โดดเด่นด้วยเขาหินปูนทรงช้างหมอบ และถ้ำเอราวัณที่มีหินงอกหินย้อยตระการตา พร้อมบันไดทอดขึ้นสู่ปากถ้ำเพื่อชมวิวทุ่งกว้าง',
    highlightAttraction: 'ถ้ำเอราวัณ, วัดถ้ำเอราวัณ',
    imageUrl: PHU_PA_PO_IMAGE
  },
  {
    name: 'อำเภอผาขาว',
    nameEn: 'Pha Khao',
    tagline: 'ภูผาสีขาวตระหง่าน แหล่งเรียนรู้เกษตรอินทรีย์',
    description: 'อำเภอที่มีแนวหน้าผาหินปูนสีขาวสะดุดตา วิถีเกษตรกรรมผสมผสาน และอ่างเก็บน้ำห้วยน้ำหองที่เหมาะแก่การพักผ่อนหย่อนใจ',
    highlightAttraction: 'ผาขาว, อ่างเก็บน้ำห้วยน้ำหอง',
    imageUrl: HERO_IMAGE
  },
  {
    name: 'อำเภอนาดวง',
    nameEn: 'Na Duang',
    tagline: 'ป่าชุมชนเขียวขจี อ่างเก็บน้ำ และวิถีเกษตรพอเพียง',
    description: 'ดินแดนเงียบสงบทางทิศตะวันออกเฉียงเหนือของจังหวัด แหล่งรวมอ่างเก็บน้ำธรรมชาติ ป่าชุมชน และความอุดมสมบูรณ์ของวิถีชนบท',
    highlightAttraction: 'อ่างเก็บน้ำห้วยลิ้นควาย, ถ้ำผายา',
    imageUrl: HERO_IMAGE
  }
];

export const INITIAL_PLACES: Place[] = [
  // --- ATTRACTIONS ---
  {
    id: 'phu-tok-chiang-khan',
    name: 'ภูทอก เชียงคาน',
    nameEn: 'Phu Tok Chiang Khan',
    category: 'attraction',
    district: 'อำเภอเชียงคาน',
    shortDescription: 'จุดชมทะเลหมอกและพระอาทิตย์ขึ้น 360 องศาสุดอลังการริมแม่น้ำโขง',
    description: 'ภูเขาเตี้ยๆ ที่มีความสูงประมาณ 500 เมตรจากระดับน้ำทะเล แต่เป็นจุดชมทะเลหมอกที่หนาแน่นและสวยงามที่สุดแห่งหนึ่งของภาคอีสาน ในช่วงฤดูหนาวทะเลหมอกจะลอยละล่องปกคลุมตัวเมืองเชียงคานและแม่น้ำโขง ตัดกับแสงสีส้มทองของพระอาทิตย์ขึ้นอย่างน่าอัศจรรย์ การเดินทางขึ้นมีรถสองแถวของชาวบ้านให้บริการอย่างสะดวกสบาย',
    imageUrl: HERO_IMAGE,
    gallery: [
      HERO_IMAGE,
      CHIANG_KHAN_IMAGE,
      PHU_KRADUENG_IMAGE,
      PHU_PA_PO_IMAGE,
      CUISINE_CAFE_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0],
      PRESET_STANDARDS[4]
    ],
    address: 'ตำบลเชียงคาน อำเภอเชียงคาน จังหวัดเลย 42110',
    phone: '042-821-254 (ทต.เชียงคาน)',
    priceRange: '25 - 40 บาท/คน',
    openingHours: 'เปิดทุกวัน 05:00 - 17:30 น. (ชมหมอก 05:30 - 08:30 น.)',
    googleMapsUrl: 'https://maps.google.com/?q=Phu+Tok+Chiang+Khan+Loei',
    facebookUrl: 'https://facebook.com/phutokchiangkhan.official',
    lineUrl: 'https://line.me/R/ti/p/@chiangkhan',
    websiteUrl: 'https://loei.mots.go.th',
    rating: 4.9,
    isFeatured: true,
    viewsCount: 1420,
    sharesCount: 386,
    tags: ['ทะเลหมอก', 'พระอาทิตย์ขึ้น', 'วิวแม่น้ำโขง', 'ไฮไลท์ห้ามพลาด']
  },
  {
    id: 'chiang-khan-walking-street',
    name: 'ถนนคนเดินเชียงคาน',
    nameEn: 'Chiang Khan Walking Street (Chai Khong Rd)',
    category: 'attraction',
    district: 'อำเภอเชียงคาน',
    shortDescription: 'ย่านเรือนไม้โบราณสองฟากถนนชายโขง เปี่ยมมนต์ขลังยามค่ำคืน',
    description: 'ถนนสายวัฒนธรรมที่ทอดยาวเลียบแม่น้ำโขง สองฝั่งถนนเรียงรายไปด้วยบ้านไม้สักโบราณอายุเกือบศตวรรษ ในช่วงเย็นของทุกวันจะเปิดเป็นถนนคนเดิน มีอาหารพื้นเมือง ขนมโบราณ สินค้าแฮนด์เมด เสื้อยืดที่ระลึก และการแสดงเปิดหมวกของเด็กๆ บรรยากาศอบอุ่นและโรแมนติกอย่างยิ่ง',
    imageUrl: CHIANG_KHAN_IMAGE,
    gallery: [
      CHIANG_KHAN_IMAGE,
      HERO_IMAGE,
      CUISINE_CAFE_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0],
      PRESET_STANDARDS[2]
    ],
    address: 'ถนนชายโขง ตำบลเชียงคาน อำเภอเชียงคาน จังหวัดเลย 42110',
    phone: '042-821-254',
    priceRange: 'เข้าชมฟรี',
    openingHours: 'ทุกวัน 16:30 - 21:30 น.',
    googleMapsUrl: 'https://maps.google.com/?q=Chiang+Khan+Walking+Street',
    facebookUrl: 'https://facebook.com/chiangkhanwalkingstreet',
    lineUrl: 'https://line.me/R/ti/p/@tatloei',
    rating: 4.8,
    isFeatured: true,
    viewsCount: 1280,
    sharesCount: 312,
    tags: ['ถนนคนเดิน', 'บ้านไม้โบราณ', 'ริมโขง', 'ของกินพื้นเมือง']
  },
  {
    id: 'phu-kradueng-pha-lom-sak',
    name: 'อุทยานแห่งชาติภูกระดึง (ผาหล่มสัก)',
    nameEn: 'Phu Kradueng National Park (Pha Lom Sak)',
    category: 'attraction',
    district: 'อำเภอภูกระดึง',
    shortDescription: 'ผาหินทรายยื่นและต้นสนเดียวดาย สัญลักษณ์แห่งการชมอาทิตย์อัสดง',
    description: 'อุทยานแห่งชาติระดับตำนานของเมืองไทย บนยอดภูกระดึงมีพื้นที่ราบกว้างใหญ่กว่า 60 ตารางกิโลเมตร ไฮไลท์สำคัญคือ "ผาหล่มสัก" ชะง่อนหินทรายที่ยื่นออกไปในอากาศเคียงคู่กับต้นสนสามใบ เป็นจุดชมพระอาทิตย์ตกดินที่คลาสสิกและโรแมนติกที่สุดในประเทศไทย นักท่องเที่ยวจะได้สัมผัสการเดินป่า ทุ่งกุหลาบพันปี และน้ำตกเพ็ญพบใหม่',
    imageUrl: PHU_KRADUENG_IMAGE,
    gallery: [
      PHU_KRADUENG_IMAGE,
      HERO_IMAGE,
      PHU_PA_PO_IMAGE,
      CHIANG_KHAN_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[1],
      PRESET_STANDARDS[4]
    ],
    address: 'หมู่ 1 ตำบลศรีฐาน อำเภอภูกระดึง จังหวัดเลย 42180',
    phone: '042-871-333',
    priceRange: '40 บาท/คน (เด็ก 20 บาท)',
    openingHours: 'เปิดฤดูกาลท่องเที่ยว 1 ต.ค. - 31 พ.ค. (ขึ้นภู 06:00 - 13:00 น.)',
    googleMapsUrl: 'https://maps.google.com/?q=Pha+Lom+Sak+Phu+Kradueng',
    facebookUrl: 'https://facebook.com/PKDnationalpark',
    rating: 5.0,
    isFeatured: true,
    viewsCount: 1650,
    sharesCount: 420,
    tags: ['เดินป่า', 'ผาหล่มสัก', 'พระอาทิตย์ตก', 'สนสามใบ', 'ระดับตำนาน']
  },
  {
    id: 'phu-pa-po-fuji-loei',
    name: 'ภูป่าเปาะ (ฟูจิเมืองเลย)',
    nameEn: 'Phu Pa Po - Fuji of Loei',
    category: 'attraction',
    district: 'อำเภอหนองหิน',
    shortDescription: 'จุดชมวิวภูหอยอดตัดคล้ายภูเขาไฟฟูจิ ท่ามกลางทุ่งดอกไม้สีทอง',
    description: 'จุดชมวิวทิวทัศน์ที่ได้รับการขนานนามว่าเป็น "ฟูจิเมืองเลย" จากจุดชมวิวจะมองเห็น "ภูหอ" ภูเขาหินปูนยอดตัดตรงที่มีลักษณะละม้ายคล้ายภูเขาไฟฟูจิของญี่ปุ่น หากมาเยือนในช่วงเช้าจะเห็นทะเลหมอกขาวโพลนลอยรอบฐานเขา มีบริการรถอีแต๊กของชุมชนพาขึ้นไปชมวิวมุมสูง 4 จุด พร้อมทุ่งดอกคอสมอสสีเหลืองทองบานสะพรั่ง',
    imageUrl: PHU_PA_PO_IMAGE,
    gallery: [
      PHU_PA_PO_IMAGE,
      HERO_IMAGE,
      CUISINE_CAFE_IMAGE,
      PHU_KRADUENG_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[4]
    ],
    address: 'บ้านผาหวาย ตำบลปวนพุ อำเภอหนองหิน จังหวัดเลย 42190',
    phone: '089-952-2824',
    priceRange: 'ค่ารถอีแต๊ก 60 บาท/คน',
    openingHours: 'เปิดทุกวัน 05:00 - 18:00 น.',
    googleMapsUrl: 'https://maps.google.com/?q=Phu+Pa+Po+Nong+Hin+Loei',
    facebookUrl: 'https://facebook.com/phupapo.fuji',
    rating: 4.7,
    isFeatured: true,
    viewsCount: 940,
    sharesCount: 215,
    tags: ['ฟูจิเมืองเลย', 'รถอีแต๊ก', 'ดอกไม้เมืองหนาว', 'ทะเลหมอก']
  },

  // --- ACCOMMODATIONS (STAY) ---
  {
    id: 'suneta-hostel-chiang-khan',
    name: 'สุเนต์ตา โฮสเทล เชียงคาน',
    nameEn: 'Suneta Hostel Chiang Khan',
    category: 'stay',
    district: 'อำเภอเชียงคาน',
    shortDescription: 'เรือนไม้สักริมโขงสไตล์เรโทรบูทีค ชื่นชมสายน้ำและตักบาตรข้าวเหนียวหน้าบ้าน',
    description: 'ที่พักยอดนิยมระดับไอคอนิกของเชียงคาน รีโนเวทจากบ้านไม้สักเก่าริมแม่น้ำโขง ตกแต่งด้วยเฟอร์นิเจอร์ไม้สไตล์คลาสสิกและของสะสมวินเทจ มีระเบียงส่วนตัวชมพระอาทิตย์ตกริมแม่น้ำโขงอย่างเป็นส่วนตัว พร้อมบริการชุดใส่บาตรข้าวเหนียวตอนเช้าตรู่ และจักรยานให้ปั่นเที่ยวรอบเมืองฟรี',
    imageUrl: CHIANG_KHAN_IMAGE,
    gallery: [
      CHIANG_KHAN_IMAGE,
      HERO_IMAGE,
      CUISINE_CAFE_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0],
      PRESET_STANDARDS[1]
    ],
    address: '166/1 หมู่ 2 ถนนชายโขง ตำบลเชียงคาน อำเภอเชียงคาน จังหวัดเลย 42110',
    phone: '086-999-9218',
    priceRange: '1,500 - 3,500 บาท/คืน',
    openingHours: 'เช็คอิน 14:00 น. / เช็คเอาท์ 11:30 น.',
    googleMapsUrl: 'https://maps.google.com/?q=Suneta+Hostel+Chiang+Khan',
    facebookUrl: 'https://facebook.com/sunetahostel',
    lineUrl: 'https://line.me/R/ti/p/@suneta',
    websiteUrl: 'https://sunetahostel.com',
    rating: 4.8,
    isFeatured: true,
    viewsCount: 1120,
    sharesCount: 260,
    tags: ['ติดริมแม่น้ำโขง', 'บ้านไม้สัก', 'ตักบาตรข้าวเหนียว', 'มีจักรยานฟรี']
  },
  {
    id: 'phu-pha-nam-resort-phu-ruea',
    name: 'ภูผาน้ำ รีสอร์ท แอนด์ สปา ภูเรือ',
    nameEn: 'Phu Pha Nam Resort & Spa Phu Ruea',
    category: 'stay',
    district: 'อำเภอภูเรือ',
    shortDescription: 'รีสอร์ทหรูท่ามกลางขุนเขา สวนกล้วยไม้ และทะเลสาบธรรมชาติ',
    description: 'รีสอร์ทระดับพรีเมียมบนเนื้อที่หลายร้อยไร่ในอ้อมกอดของเทือกเขาภูเรือ โอบล้อมด้วยธรรมชาติบริสุทธิ์ มีสวนกล้วยไม้เพาะพันธุ์นานาชนิด สระว่ายน้ำกลางแจ้งมองเห็นวิวเทือกเขาแบบพาโนรามา ห้องพักกว้างขวางตกแต่งด้วยไม้ธรรมชาติระเบียงมองเห็นหมอกยามเช้าอย่างเต็มตา',
    imageUrl: HERO_IMAGE,
    gallery: [
      HERO_IMAGE,
      CUISINE_CAFE_IMAGE,
      PHU_KRADUENG_IMAGE,
      CHIANG_KHAN_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0],
      PRESET_STANDARDS[1],
      PRESET_STANDARDS[4]
    ],
    address: '252 หมู่ 1 ถนนเลย-ด่านซ้าย ตำบลโคกงาม อำเภอด่านซ้าย/ภูเรือ จังหวัดเลย 42160',
    phone: '042-810-589',
    priceRange: '2,200 - 6,500 บาท/คืน',
    openingHours: 'บริการต้อนรับ 24 ชั่วโมง',
    googleMapsUrl: 'https://maps.google.com/?q=Phu+Pha+Nam+Resort',
    facebookUrl: 'https://facebook.com/phuphanamresort',
    websiteUrl: 'https://phuphanamresort.com',
    rating: 4.7,
    isFeatured: true,
    viewsCount: 890,
    sharesCount: 195,
    tags: ['สปาระดับพรีเมียม', 'วิวภูเขาพาโนรามา', 'สวนกล้วยไม้', 'ห้องอาหาร']
  },

  // --- CAFES ---
  {
    id: 'de-loei-cafe-roastery',
    name: "เดอ เลย คาเฟ่ แอนด์ โรงคั่ว (De' Loei Cafe)",
    nameEn: "De' Loei Specialty Coffee & Roastery",
    category: 'cafe',
    district: 'อำเภอเมืองเลย',
    shortDescription: 'โรงคั่วกาแฟสเปเชียลตี้คัดสรรเมล็ดอาราบิก้าจากยอดดอยภูเรือและภูหลวง',
    description: 'คาเฟ่โทนไม้อบอุ่นผสมผสานโมเดิร์นคราฟต์ใจกลางเมืองเลย ผู้บุกเบิกวงการกาแฟคลื่นลูกที่สามของจังหวัด นำเมล็ดกาแฟที่ปลูกในดินภูเขาไฟและเทือกเขาสูงของภูเรือมาผ่านการคั่วแบบประณีต มีทั้งเมนูดริป Hand Drip, Cold Brew รมควัน และเบเกอรี่โฮมเมดสไตล์ฝรั่งเศส',
    imageUrl: CUISINE_CAFE_IMAGE,
    gallery: [
      CUISINE_CAFE_IMAGE,
      HERO_IMAGE,
      CHIANG_KHAN_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0],
      PRESET_STANDARDS[5]
    ],
    address: 'ถนนร่วมจิตต์ ตำบลกุดป่อง อำเภอเมืองเลย จังหวัดเลย 42000',
    phone: '087-865-9898',
    priceRange: '75 - 160 บาท/แก้ว',
    openingHours: 'เปิดทุกวัน 08:00 - 17:30 น.',
    googleMapsUrl: 'https://maps.google.com/?q=De+Loei+Cafe',
    facebookUrl: 'https://facebook.com/deloeicafe',
    lineUrl: 'https://line.me/R/ti/p/@deloei',
    rating: 4.9,
    isFeatured: true,
    viewsCount: 980,
    sharesCount: 245,
    tags: ['Specialty Coffee', 'โรงคั่วกาแฟ', 'เมล็ดกาแฟภูเรือ', 'เบเกอรี่โฮมเมด']
  },

  // --- RESTAURANTS ---
  {
    id: 'pa-bua-wan-khao-poon-nam-jaew',
    name: 'ป้าบัวหวาน ข้าวปุ้นน้ำแจ่ว เชียงคาน',
    nameEn: 'Pa Bua Wan Khao Poon Nam Jaew',
    category: 'restaurant',
    district: 'อำเภอเชียงคาน',
    shortDescription: 'อาหารพื้นถิ่นเมืองเลยที่ต้องลิ้มลอง น้ำซุปต้มสมุนไพรร้อนๆ หอมกรุ่น',
    description: '"ข้าวปุ้นน้ำแจ่ว" เป็นเมนูเอกลักษณ์ที่มีเฉพาะที่เชียงคานและจังหวัดเลย เส้นขนมจีนสดทำเอง เสิร์ฟในน้ำซุปต้มกระดูกหมูและเครื่องในหมูที่เคี่ยวนานหลายชั่วโมง โรยด้วยผักกะหล่ำปลีซอย สะระแหน่ ต้นหอม และปรุงรสด้วยพริกตำน้ำแจ่วสูตรเด็ด รสชาติกลมกล่อม หอมสดชื่น ปรุงมะนาวสดเพิ่มความจี๊ดจ๊าด',
    imageUrl: CUISINE_CAFE_IMAGE,
    gallery: [
      CUISINE_CAFE_IMAGE,
      CHIANG_KHAN_IMAGE,
      HERO_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[3],
      PRESET_STANDARDS[0]
    ],
    address: 'ซอย 14 ถนนศรีเชียงคาน ตำบลเชียงคาน อำเภอเชียงคาน จังหวัดเลย 42110',
    phone: '081-380-1412',
    priceRange: '50 - 80 บาท/ชาม',
    openingHours: 'ทุกวัน 07:00 - 14:00 น. (หมดแล้วปิดเลย)',
    googleMapsUrl: 'https://maps.google.com/?q=Pa+Bua+Wan+Khao+Poon+Nam+Jaew',
    facebookUrl: 'https://facebook.com/pabuawankhaopoon',
    rating: 4.9,
    isFeatured: true,
    viewsCount: 1350,
    sharesCount: 380,
    tags: ['อาหารพื้นเมือง', 'ข้าวปุ้นน้ำแจ่ว', 'สูตรดั้งเดิม', 'ต้องลอง']
  },

  // --- SOUVENIRS ---
  {
    id: 'kaeng-khut-khu-coconut',
    name: 'มะพร้าวแก้วแก่งคุดคู้ เกรด A',
    nameEn: 'Kaeng Khut Khu Soft Coconut Confectionery',
    category: 'souvenir',
    district: 'อำเภอเชียงคาน',
    shortDescription: 'ของฝากเลื่องชื่อ มะพร้าวแก้วเนื้อนุ่มละมุน หวานน้อย หอมใบเตย',
    description: 'สุดยอดของฝากประจำจังหวัดเลย มะพร้าวแก้วเกรด A ผลิตจากเนื้อมะพร้าวน้ำหอมอ่อน นำมากวนกับน้ำตาลสดและน้ำใบเตยธรรมชาติ ไม่ใส่สารกันบูด เนื้อนุ่มหนึบเคี้ยวเพลิน หอมหวานกำลังดี แหล่งผลิตอยู่ที่ริมแก่งคุดคู้ มีให้เลือกชิมสดๆ ร้อนๆ จากกระทะกวน',
    imageUrl: CUISINE_CAFE_IMAGE,
    gallery: [
      CUISINE_CAFE_IMAGE,
      CHIANG_KHAN_IMAGE,
      HERO_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[2],
      PRESET_STANDARDS[0]
    ],
    address: 'ศูนย์รวมของฝากแก่งคุดคู้ ตำบลเชียงคาน อำเภอเชียงคาน จังหวัดเลย 42110',
    phone: '042-821-254',
    priceRange: '100 - 300 บาท/กล่อง',
    openingHours: 'ทุกวัน 08:00 - 18:00 น.',
    googleMapsUrl: 'https://maps.google.com/?q=Kaeng+Khut+Khu+Loei',
    facebookUrl: 'https://facebook.com/kaengkhutkhu.coconut',
    rating: 4.9,
    isFeatured: true,
    viewsCount: 820,
    sharesCount: 190,
    tags: ['ของฝากเมืองเลย', 'มะพร้าวแก้ว', 'แก่งคุดคู้', 'OTOP 5 ดาว']
  },

  // --- ธุรกิจบริการน่าสนใจ (FEATURED SERVICES & LOCAL BUSINESSES) ---
  {
    id: 'mekong-river-boat-cruise-chiangkhan',
    name: 'บริการเรือนำเที่ยวแม่น้ำโขง เชียงคาน',
    nameEn: 'Chiang Khan Mekong River Cruise & Sunset Tour',
    category: 'service',
    district: 'อำเภอเชียงคาน',
    shortDescription: 'ล่องเรือชมทัศนียภาพสองฝั่งโขงไทย-ลาว พระอาทิตย์ตกดิน และแก่งคุดคู้',
    description: 'บริการเรือยนต์นำเที่ยวมาตรฐานความปลอดภัยสูง พาชื่นชมความงดงามของลำน้ำโขง ชมทิวทัศน์เทือกเขาฝั่ง สปป.ลาว และเกาะแก่งธรรมชาติ โดยเฉพาะช่วงเวลา 16:30 - 18:30 น. ที่พระอาทิตย์อัสดงลับทิวเขา แสงสีส้มทองสะท้อนผิวน้ำโขงอย่างงดงาม มีชูชีพสำหรับผู้โดยสารทุกคนและกัปตันเรือท้องถิ่นผู้ชำนาญร่องน้ำ',
    imageUrl: CHIANG_KHAN_IMAGE,
    gallery: [
      CHIANG_KHAN_IMAGE,
      HERO_IMAGE,
      PHU_PA_PO_IMAGE,
      CUISINE_CAFE_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0], // SHA Extra Plus
      PRESET_STANDARDS[4]  // Thailand Tourism Standard
    ],
    address: 'ท่าเรือวัดท่าคก ถนนชายโขง ตำบลเชียงคาน อำเภอเชียงคาน จังหวัดเลย 42110',
    phone: '085-719-8822 (ชมรมเรือนำเที่ยวเชียงคาน)',
    priceRange: 'เหมาลำ 600 - 1,200 บาท (นั่งได้ 8-10 ท่าน)',
    openingHours: 'บริการทุกวัน 06:00 - 18:30 น. (ช่วงชมพระอาทิตย์ตก 16:30 - 18:00 น.)',
    googleMapsUrl: 'https://maps.google.com/?q=Wat+Tha+Khok+Chiang+Khan',
    facebookUrl: 'https://facebook.com/chiangkhanboatcruise',
    lineUrl: 'https://line.me/R/ti/p/@mekongboat',
    rating: 4.9,
    isFeatured: true,
    viewsCount: 780,
    sharesCount: 230,
    tags: ['ล่องเรือแม่น้ำโขง', 'พระอาทิตย์ตก', 'เรือนำเที่ยว', 'ชมวิวสองฝั่งโขง']
  },
  {
    id: 'loei-traditional-cotton-weaving-center',
    name: 'ศูนย์หัตถกรรมทอผ้าฝ้ายพื้นเมืองลายโบราณเมืองเลย',
    nameEn: 'Loei Traditional Handwoven Cotton & Craft Center',
    category: 'service',
    district: 'อำเภอวังสะพุง',
    shortDescription: 'ศูนย์เวิร์กช็อปทอผ้าฝ้ายย้อมสีธรรมชาติ สวมชุดไทเลย และถ่ายภาพที่ระลึก',
    description: 'แหล่งเรียนรู้และบริการทางวัฒนธรรมครบวงจร เปิดโอกาสให้นักท่องเที่ยวได้สัมผัสเสน่ห์การทอผ้าฝ้ายโบราณ ทดลองย้อมสีธรรมชาติจากเปลือกไม้และพืชพรรณท้องถิ่น มีบริการเช่าชุดพื้นเมืองไทเลยสำหรับถ่ายภาพในบรรยากาศเรือนไทย และจำหน่ายผลิตภัณฑ์ผ้าทอมือเกรดส่งออก',
    imageUrl: CUISINE_CAFE_IMAGE,
    gallery: [
      CUISINE_CAFE_IMAGE,
      CHIANG_KHAN_IMAGE,
      HERO_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[2], // OTOP 5 ดาว
      PRESET_STANDARDS[4]  // Thailand Tourism Standard
    ],
    address: '145 หมู่ 4 ตำบลทรายขาว อำเภอวังสะพุง จังหวัดเลย 42130',
    phone: '081-974-5511',
    priceRange: 'เวิร์กช็อป 150 - 350 บาท/ท่าน, เช่าชุด 100 บาท',
    openingHours: 'เปิดวันอังคาร - วันอาทิตย์ 08:30 - 17:00 น.',
    googleMapsUrl: 'https://maps.google.com/?q=Wang+Saphung+Cotton+Center+Loei',
    facebookUrl: 'https://facebook.com/loeicottoncraft',
    lineUrl: 'https://line.me/R/ti/p/@loeicraft',
    websiteUrl: 'https://loeicraft.com',
    rating: 4.8,
    isFeatured: true,
    viewsCount: 650,
    sharesCount: 175,
    tags: ['เวิร์กช็อปทอผ้า', 'เช่าชุดพื้นเมือง', 'ย้อมสีธรรมชาติ', 'หัตถกรรม']
  },
  {
    id: 'phu-ruea-green-van-car-rental',
    name: 'ภูเรือกรีนคาร์ รถตู้ VIP และรถเช่าขับเที่ยวเมืองเลย',
    nameEn: 'Phu Ruea Green Car & VIP Tour Van Rental Loei',
    category: 'service',
    district: 'อำเภอภูเรือ',
    shortDescription: 'บริการรถตู้ VIP พร้อมคนขับชำนาญเส้นทางภูเขา และรถเก๋งเช่าขับเองรับ-ส่งสนามบินเลย',
    description: 'บริการยานพาหนะเดินทางท่องเที่ยวระดับพรีเมียม รถตู้ VIP 9-10 ที่นั่ง เบาะนวดไฟฟ้า แอร์เย็นฉ่ำ พร้อมพนักงานขับรถท้องถิ่นที่ชำนาญเส้นทางขึ้นเขาสูงชันของภูกระดึง ภูเรือ ภูทอก และด่านซ้าย ให้บริการรับ-ส่งจากท่าอากาศยานเลย โรงแรม หรือจัดทริปพาเที่ยวแบบส่วนตัวตามแผนที่ต้องการ',
    imageUrl: HERO_IMAGE,
    gallery: [
      HERO_IMAGE,
      PHU_KRADUENG_IMAGE,
      CHIANG_KHAN_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0], // SHA Extra Plus
      PRESET_STANDARDS[4]  // Thailand Tourism Standard
    ],
    address: '88 หมู่ 2 ตำบลหนองบัว อำเภอภูเรือ จังหวัดเลย 42160 (บริการรับส่งสนามบินเลย)',
    phone: '089-882-9900',
    priceRange: 'รถเช่าขับเอง 800 - 1,400 บาท/วัน, รถตู้ VIP พร้อมคนขับ 1,800 - 2,500 บาท/วัน',
    openingHours: 'บริการทุกวัน 24 ชั่วโมง (ศูนย์ประสานงาน 06:00 - 21:00 น.)',
    googleMapsUrl: 'https://maps.google.com/?q=Loei+Airport',
    facebookUrl: 'https://facebook.com/phurueagreencar',
    lineUrl: 'https://line.me/R/ti/p/@phurueacar',
    rating: 4.9,
    isFeatured: true,
    viewsCount: 890,
    sharesCount: 280,
    tags: ['รถเช่าสนามบินเลย', 'รถตู้VIP', 'คนขับชำนาญทาง', 'พาเที่ยวขุนเขา']
  },
  {
    id: 'loei-wellness-herbal-spa',
    name: 'เลยสปา & นวดแผนไทยเพื่อสุขภาพ สมุนไพรลุ่มน้ำโขง',
    nameEn: 'Loei Riverside Wellness Spa & Herbal Traditional Massage',
    category: 'service',
    district: 'อำเภอเมืองเลย',
    shortDescription: 'สปาผ่อนคลายและนวดแผนไทยสมุนไพรพื้นบ้าน ฟื้นฟูกล้ามเนื้อหลังพิชิตยอดภู',
    description: 'ศูนย์ส่งเสริมสุขภาพและสปาที่ได้รับการรับรองมาตรฐานสากล บริการนวดแผนไทยโบราณ นวดฝ่าเท้า นวดอโรมาเธอราปีผ่อนคลายกล้ามเนื้อหลังจากเดินป่าภูกระดึงหรือเที่ยวชมเมืองเลย พร้อมการประคบด้วยลูกประคบสมุนไพรสดสูตรพื้นถิ่นไทเลย บรรยากาศเงียบสงบ กลิ่นหอมอโรมาผ่อนคลาย',
    imageUrl: CUISINE_CAFE_IMAGE,
    gallery: [
      CUISINE_CAFE_IMAGE,
      HERO_IMAGE,
      CHIANG_KHAN_IMAGE,
      PHU_PA_PO_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[0], // SHA Extra Plus
      PRESET_STANDARDS[4]  // TTS
    ],
    address: '24/5 ถนนพิพัฒน์มงคล ตำบลกุดป่อง อำเภอเมืองเลย จังหวัดเลย 42000',
    phone: '042-833-415',
    priceRange: 'นวดไทย 250 - 350 บาท/ชม., อโรมาสปา 650 - 1,200 บาท',
    openingHours: 'เปิดทุกวัน 10:00 - 21:30 น.',
    googleMapsUrl: 'https://maps.google.com/?q=Loei+Wellness+Spa',
    facebookUrl: 'https://facebook.com/loeiwellnessspa',
    lineUrl: 'https://line.me/R/ti/p/@loeispa',
    rating: 4.8,
    isFeatured: false,
    viewsCount: 520,
    sharesCount: 135,
    tags: ['นวดแผนไทย', 'สปาสมุนไพร', 'คลายเมื่อยหลังเดินภู', 'สุขภาพ']
  },
  {
    id: 'phukradueng-camping-gear-adventure',
    name: 'แคมป์ปิ้ง & อุปกรณ์เดินป่า ภูกระดึง แอดเวนเจอร์',
    nameEn: 'Phu Kradueng Trekking Gear & Camping Rental Service',
    category: 'service',
    district: 'อำเภอภูกระดึง',
    shortDescription: 'บริการเช่าเต็นท์ ถุงนอน ไม้เท้าเดินป่า เตาแก๊สพกพา และสัมภาระแคมป์ปิ้ง',
    description: 'บริการให้เช่าอุปกรณ์เดินป่าและตั้งแคมป์คุณภาพสูงบริเวณเชิงภูกระดึง มีเต็นท์กันน้ำกันลม ถุงนอนหนาสำหรับอุณหภูมิเลขตัวเดียว แผ่นรองนอน ไม้เท้าค้ำยันช่วยเดินขึ้นเขา เตาแก๊สสนาม เสื้อกันฝน และไฟฉายคาดหัว คัดสรรอุปกรณ์น้ำหนักเบาและสะอาดฆ่าเชื้อทุกครั้ง พร้อมคำแนะนำเส้นทางเดินป่าอย่างละเอียด',
    imageUrl: PHU_KRADUENG_IMAGE,
    gallery: [
      PHU_KRADUENG_IMAGE,
      HERO_IMAGE,
      PHU_PA_PO_IMAGE,
      CHIANG_KHAN_IMAGE
    ],
    standards: [
      PRESET_STANDARDS[4] // TTS
    ],
    address: 'หมู่ 1 บ้านศรีฐาน (ทางขึ้นอุทยานแห่งชาติภูกระดึง) อำเภอภูกระดึง จังหวัดเลย 42180',
    phone: '087-992-1133',
    priceRange: 'เช่าเต็นท์ 200 - 450 บาท, ถุงนอน 50 บาท, ไม้เท้า 30 บาท',
    openingHours: 'เปิดบริการทุกวัน 05:30 - 18:00 น. (ช่วงฤดูกาลเปิดภู)',
    googleMapsUrl: 'https://maps.google.com/?q=Phu+Kradueng+National+Park',
    facebookUrl: 'https://facebook.com/pkdadventuregear',
    lineUrl: 'https://line.me/R/ti/p/@pkdgear',
    rating: 4.9,
    isFeatured: true,
    viewsCount: 710,
    sharesCount: 205,
    tags: ['เช่าเต็นท์ภูกระดึง', 'อุปกรณ์เดินป่า', 'ถุงนอน', 'แคมป์ปิ้ง']
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'hunting-4-mist-peaks-loei',
    title: 'คู่มือล่าทะเลหมอก 4 ภูแห่งเมืองเลย: ภูทอก ภูเรือ ภูกระดึง และภูอีเลิศ',
    excerpt: 'เดินทางสู่มหานครแห่งขุนเขาและม่านหมอก สัมผัสความมหัศจรรย์ของธรรมชาติในจุดชมวิวทะเลหมอกที่ดีที่สุดของประเทศไทย',
    content: `จังหวัดเลย คือดินแดนที่ได้รับการขนานนามว่า "เมืองแห่งทะเลภูเขา สุดหนาวในสยาม ดอกไม้งามสามฤดู" หากเอ่ยถึงความงดงามที่เป็นที่สุดของการท่องเที่ยวเมืองเลย คงหนีไม่พ้นการตื่นเช้าขึ้นไปยืนอยู่บนยอดภูสูง แล้วทอดสายตามองดู "ทะเลหมอกสีขาวบริสุทธิ์" ที่ลอยเอื่อยปกคลุมหุบเขาเบื้องล่าง

### 1. ภูทอก เชียงคาน: ทะเลหมอกริมแม่น้ำโขง
สำหรับผู้ที่ต้องการชมทะเลหมอกที่เข้าถึงง่ายและงดงามจับใจ "ภูทอก" คือคำตอบอันดับหนึ่ง ตั้งอยู่ห่างจากตัวอำเภอเชียงคานเพียงไม่กี่กิโลเมตร เพียงนั่งรถสองแถวของชุมชนขึ้นไปราว 10 นาที คุณจะได้พบกับผืนทะเลหมอกสีขาวหนานุ่มที่ลอยอยู่เหนือลำน้ำโขง แสงแรกของดวงอาทิตย์ยามเช้าจะค่อยๆ ส่องกระทบม่านหมอกให้กลายเป็นสีทองอร่ามตา

### 2. อุทยานแห่งชาติภูเรือ: ดินแดนที่หนาวที่สุดในสยาม
ภูเรือโดดเด่นด้วยยอดผาที่มีรูปร่างคล้ายหัวเรือสำเภา ในช่วงฤดูหนาวอุณหภูมิบนยอดภูเรืออาจลดลงจนแตะจุดเยือกแข็งและเกิด "แม่คะนิ้ง" หรือน้ำค้างแข็งบนยอดหญ้า ทะเลหมอกที่นี่จะลอยเคล้าไปกับทิวสนสองใบและทุ่งดอกไม้เมืองหนาว มอบความรู้สึกเหมือนกำลังยืนอยู่ในดินแดนยุโรป

### 3. ผาหล่มสัก ภูกระดึง: มนต์เสน่ห์แห่งการพิชิต
แม้การขึ้นภูกระดึงจะต้องอาศัยแรงกายและใจในการเดินเท้าขึ้นเขาราว 9 กิโลเมตร แต่รางวัลที่ได้รับบนยอดภูนั้นคุ้มค่าเกินบรรยาย ทะเลหมอกยามเช้าที่ผานกแอ่น และภาพพระอาทิตย์ตกดินหลังสนสามใบคู่ผาหล่มสัก คือภาพจำที่นักเดินทางทุกคนต้องบันทึกไว้ในหัวใจสักครั้งในชีวิต

### 4. ภูอีเลิศ ด่านซ้าย: ทะเลหมอกสองแผ่นดิน
จุดชมวิวแห่งใหม่ที่กำลังได้รับความนิยมอย่างมากในอำเภอด่านซ้าย ภูอีเลิศเป็นแนวผาหินสูงที่สามารถมองเห็นวิวทิวทัศน์ของฝั่งลาวและเทือกเขาของไทยได้อย่างชัดเจน ทะเลหมอกที่นี่จะไหลผ่านร่องเขาอย่างอลังการ ราวกับคลื่นน้ำตกสีขาวที่ไม่มีวันสิ้นสุด

**ข้อแนะนำสำหรับการชมทะเลหมอก:**
- ช่วงเวลาที่เหมาะสมที่สุดคือปลายฝนต้นหนาว (ตุลาคม - มกราคม)
- เวลาที่ดีที่สุดในการขึ้นชมคือ 05:30 - 07:30 น.
- เตรียมเสื้อกันหนาว หมวกไหมพรม และกล้องถ่ายรูปพร้อมแบตเตอรี่สำรองให้พร้อม`,
    author: 'กองบรรณาธิการ LOEI JOURNEY',
    readTime: '6 นาที',
    category: 'Travel Guide',
    coverImage: HERO_IMAGE,
    isFeatured: true,
    publishedAt: '2026-11-01'
  },
  {
    id: 'chiang-khan-slow-life-heritage',
    title: 'มนต์เสน่ห์สโลว์ไลฟ์ริมโขงเชียงคาน: วิถีเรือนไม้ ตักบาตรข้าวเหนียว และสายลมหนาว',
    excerpt: 'หลีกหนีความเร่งรีบของเมืองใหญ่ มาสัมผัสจังหวะชีวิตที่ค่อยเป็นค่อยไปริมสายน้ำโขง เรียนรู้วัฒนธรรมพื้นบ้านที่ยังคงงดงามไร้กาลเวลา',
    content: `เมื่อล้อรถหมุนเข้าสู่อำเภอเชียงคาน สิ่งแรกที่ทุกคนสัมผัสได้คือ "จังหวะเวลา" ที่ดูเหมือนจะหมุนช้าลง บ้านไม้สักโบราณสองชั้นสีน้ำตาลเข้มเรียงรายขนานไปกับแม่น้ำโขง เสียงคลื่นน้ำกระทบตลิ่ง และรอยยิ้มที่เปี่ยมด้วยความจริงใจของชาวบ้าน

### รุ่งอรุณแห่งศรัทธา: ตักบาตรข้าวเหนียว
ทุกเช้าตรู่ประมาณ 05:45 น. ชาวเชียงคานจะนำเสื่อมาปูริมถนนชายโขง พร้อมกระติบข้าวเหนียวร้อนๆ เพื่อรอตักบาตรพระสงฆ์ที่เดินบิณฑบาตเป็นแถวยาว พิธีกรรมนี้สืบทอดกันมานับร้อยปี สะท้อนถึงความผูกพันอันลึกซึ้งระหว่างพุทธศาสนากับวิถีชีวิตคนลุ่มน้ำโขง นักท่องเที่ยวสามารถร่วมสัมผัสประสบการณ์อันสงบนี้ได้โดยปฏิบัติตามธรรมเนียมด้วยความเคารพ

### ปั่นจักรยานเลียบแม่น้ำโขง
หลังจากอิ่มบุญในยามเช้า ไม่มีอะไรจะรื่นรมย์ไปกว่าการเช่าจักรยานแม่บ้านสักคัน ปั่นไปตามทางเดินเลียบแม่น้ำโขง สัมผัสไอหมอกจางๆ และลมหนาวที่พัดผ่านผิวกาย แวะจิบกาแฟโบราณริมน้ำและทาน "ไข่กระทะ" ร้อนๆ จากร้านท้องถิ่น

### ตกค่ำที่ถนนคนเดิน
เมื่ออาทิตย์ลับขอบฟ้าหลังทิวเขาฝั่งลาว ตะเกียงและโคมไฟสีส้มอบอุ่นจะเริ่มสว่างไสว ถนนชายโขงจะเปลี่ยนเป็นถนนคนเดินที่เต็มไปด้วยสีสัน เสียงเพลงพื้นบ้าน อาหารจานอร่อยอย่าง "กุ้งแม่น้ำโขงเสียบไม้ย่าง" และ "ข้าวจี่ทาไข่" ส่งกลิ่นหอมชวนน้ำลายสอ`,
    author: 'ณภัทร วัฒนศิลป์ (สารคดีท่องเที่ยว)',
    readTime: '5 นาที',
    category: 'Culture & Lifestyle',
    coverImage: CHIANG_KHAN_IMAGE,
    isFeatured: true,
    publishedAt: '2026-10-25'
  },
  {
    id: 'loei-culinary-khao-poon-nam-jaew',
    title: 'รสชาติแห่งเมืองเลย: เจาะลึกตำนาน "ข้าวปุ้นน้ำแจ่ว" และอาหารพื้นถิ่นที่คุณต้องชิม',
    excerpt: 'เปิดสำรับอาหารพื้นบ้านที่มีอัตลักษณ์เฉพาะตัว รสชาติกลมกล่อมจากสมุนไพรสดและภูมิปัญญาชาวไทเลยที่สืบทอดมารุ่นสู่รุ่น',
    content: `หากคุณไปเยือนเมืองเลยแล้วไม่ได้ลิ้มลอง "ข้าวปุ้นน้ำแจ่ว" ก็เหมือนยังเดินทางมาไม่ถึงจังหวัดนี้อย่างแท้จริง

### ข้าวปุ้นน้ำแจ่วคืออะไร?
ในภาษาถิ่นอีสาน "ข้าวปุ้น" หมายถึงขนมจีน ส่วน "น้ำแจ่ว" คือน้ำซุปใสที่ได้จากการต้มกระดูกหมู เครื่องในหมู และสมุนไพรพื้นบ้าน เช่น ตะไคร้ ข่า ใบมะกรูด และพริกสดตำละเอียด น้ำซุปที่ได้จะมีความใสแต่รสชาติเข้มข้น หวานน้ำต้มกระดูก และหอมกลิ่นสมุนไพรเตะจมูก

แตกต่างจากขนมจีนน้ำยาหรือน้ำยาป่าทั่วไป ข้าวปุ้นน้ำแจ่วจะเสิร์ฟแบบน้ำซุปร้อนจัด ใส่ผักสดซอยบางๆ เช่น กะหล่ำปลี ถั่วฝักยาว ใบสะระแหน่ และยอดผักแพว บีบมะนาวสดลงไปหนึ่งซีก จะช่วยชูรสให้กลมกล่อมสดชื่นเป็นทวีคูณ

### ของอร่อยเมืองเลยที่ไม่ควรพลาด:
1. **ข้าวจี่ทาไข่:** ข้าวเหนียวนึ่งปั้นชุบไข่ไก่ปรุงรส ย่างบนเตาถ่านหอมกรุ่น
2. **มะพร้าวแก้วแก่งคุดคู้:** ขนมหวานเนื้อนุ่มทำจากมะพร้าวอ่อนน้ำหอมกวนใบเตย
3. **กาแฟอาราบิก้าภูเรือ:** กาแฟรสชาติเข้มข้น มีกลิ่นหอมดอกไม้ป่าและผลไม้เมืองหนาว`,
    author: 'เชฟธนินทร์ ปัญญาวงศ์',
    readTime: '4 นาที',
    category: 'Gastronomy',
    coverImage: CUISINE_CAFE_IMAGE,
    isFeatured: false,
    publishedAt: '2026-10-18'
  }
];
