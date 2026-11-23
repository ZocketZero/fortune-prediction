export interface KrathongComponents {
  baseId: string;
  petalId: string;
  centerFlowerId: string;
  candleId: string;
  incenseId: string;
}

export interface KrathongBaseItem {
  id: string;
  name: string;
  description: string;
  baseColor: string;
  bottomColor: string;
  rimColor: string;
  ecoTag: string;
  icon: string;
}

export interface KrathongPetalItem {
  id: string;
  name: string;
  description: string;
  petalColor: string;
  gradientBottom: string;
  strokeColor: string;
  meaning: string;
  icon: string;
}

export interface KrathongCenterItem {
  id: string;
  name: string;
  description: string;
  centerColor: string;
  highlightColor: string;
  secondaryDotColor: string;
  meaning: string;
  icon: string;
}

export interface KrathongCandleItem {
  id: string;
  name: string;
  description: string;
  candleColor: string;
  flameCoreColor: string;
  auraColor: string;
  meaning: string;
  icon: string;
}

export interface KrathongIncenseItem {
  id: string;
  name: string;
  description: string;
  stickColor: string;
  tipColor: string;
  hasSmoke: boolean;
  typeTag: string;
  icon: string;
}

export interface KrathongStyle {
  id: string;
  name: string;
  badge: string;
  description: string;
  meaning: string;
  ecoScore: string;
  petalColor: string;
  baseColor: string;
  centerColor: string;
  candleColor: string;
  auraColor: string;
  defaultComponents?: KrathongComponents;
}

export interface KrathongDecoration {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface WishCategory {
  id: string;
  name: string;
  icon: string;
  wishes: string[];
}

export interface GangaBlessing {
  id: number;
  title: string;
  message: string;
  advice: string;
  luckyNumber: string;
  luckyColor: string;
}

export interface RiverKrathong {
  id: string;
  senderName: string;
  partnerName?: string;
  wish: string;
  category: string;
  krathongStyleId: string;
  decorations: string[];
  customComponents?: KrathongComponents;
  xPercent: number; // 5 - 90%
  yPercent: number; // 25 - 85%
  scale: number;    // 0.7 - 1.25
  speedSeconds: number; // Animation duration for gentle drift
  createdAt: string;
  isUser?: boolean;
}

export const KRATHONG_BASES: KrathongBaseItem[] = [
  {
    id: 'banana-trunk',
    name: 'ฐานหยวกกล้วยใบตองสด',
    description: 'หยวกกล้วยธรรมชาติกรุใบตองตานีเขียวสดใส สืบสานภูมิปัญญาไทยแท้',
    baseColor: '#15803d',
    bottomColor: '#052e16',
    rimColor: '#166534',
    ecoTag: 'ธรรมชาติ 100%',
    icon: '🌿'
  },
  {
    id: 'coconut-shell',
    name: 'ฐานกะลามะพร้าวตามประทีป',
    description: 'กะลามะพร้าวขัดเงาเรียบเนียน ลอยน้ำได้มั่นคง ไม่โคลงเคลง',
    baseColor: '#78350f',
    bottomColor: '#451a03',
    rimColor: '#92400e',
    ecoTag: 'วัสดุธรรมชาติพื้นบ้าน',
    icon: '🥥'
  },
  {
    id: 'eco-bread',
    name: 'ฐานขนมปังรักษ์สายน้ำ',
    description: 'อบจากแป้งสาลีเนื้อนุ่ม ย่อยสลายเป็นอาหารปลา ได้บุญให้อาหารสัตว์น้ำ',
    baseColor: '#d97706',
    bottomColor: '#92400e',
    rimColor: '#b45309',
    ecoTag: 'อาหารปลา 100%',
    icon: '🍞'
  },
  {
    id: 'crystal-ice',
    name: 'ฐานน้ำแข็งคริสตัลใส',
    description: 'น้ำแข็งแกะสลักบริสุทธิ์ เย็นชื่นใจ ละลายคืนสู่แม่น้ำอย่างไร้ร่องรอย',
    baseColor: '#38bdf8',
    bottomColor: '#0284c7',
    rimColor: '#0284c7',
    ecoTag: 'ละลายคืนน้ำ 0% ขยะ',
    icon: '🧊'
  },
  {
    id: 'golden-royal',
    name: 'ฐานสุวรรณวิมานทองคำ',
    description: 'ฐานเคลือบประกายทองคำมงคล วิจิตรตระการตา ดั่งกระทงหลวงโบราณ',
    baseColor: '#facc15',
    bottomColor: '#713f12',
    rimColor: '#ca8a04',
    ecoTag: 'สิริมงคลชั้นสูง',
    icon: '👑'
  }
];

export const KRATHONG_PETALS: KrathongPetalItem[] = [
  {
    id: 'banana-fold',
    name: 'กลีบผกากรองใบตองสด',
    description: 'พับจีบใบตองตานีปลายแหลม คลาสสิกตามแบบแผนราชสำนัก',
    petalColor: '#22c55e',
    gradientBottom: '#14532d',
    strokeColor: '#052e16',
    meaning: 'แคล้วคลาด ปลอดภัย ร่มเย็น',
    icon: '🍃'
  },
  {
    id: 'pink-lotus',
    name: 'กลีบบัวสวรรค์สีชมพู',
    description: 'กลีบดอกบัวหลวงสีชมพูซ้อนชั้น ดุจบัวบานรับแสงจันทร์เพ็ญ',
    petalColor: '#f472b6',
    gradientBottom: '#db2777',
    strokeColor: '#831843',
    meaning: 'ความรักสมหวัง เมตตามหานิยม',
    icon: '🌸'
  },
  {
    id: 'yellow-marigold',
    name: 'กลีบดาวเรืองสีเหลืองทอง',
    description: 'สีเหลืองทองสว่างไสว เปล่งรัศมีความมั่งคั่งและความรุ่งเรือง',
    petalColor: '#fbbf24',
    gradientBottom: '#d97706',
    strokeColor: '#78350f',
    meaning: 'โชคลาภเงินทอง ค้าขายร่ำรวย',
    icon: '🌼'
  },
  {
    id: 'red-rose',
    name: 'กลีบกุหลาบแดงมหารัก',
    description: 'กลีบกุหลาบสดสีแดงกำมะหยี่ ดึงดูดพลังเสน่หาและความรักแท้',
    petalColor: '#f43f5e',
    gradientBottom: '#9f1239',
    strokeColor: '#4c0519',
    meaning: 'รักมั่นคง คู่แท้เสน่หา',
    icon: '🌹'
  },
  {
    id: 'purple-orchid',
    name: 'กลีบกล้วยไม้ม่วงราชาวดี',
    description: 'กลีบกล้วยไม้สีม่วงคราม อ่อนช้อยสง่างาม เสริมสง่าราศี',
    petalColor: '#c084fc',
    gradientBottom: '#7e22ce',
    strokeColor: '#3b0764',
    meaning: 'บารมี เกียรติยศ ผู้ใหญ่เมตตา',
    icon: '🪻'
  },
  {
    id: 'cyan-crystal',
    name: 'กลีบแก้วประกายมรกตธารา',
    description: 'กลีบแก้วสีฟ้าอมเขียวประกายแสง สื่อถึงความเย็นกายสบายใจ',
    petalColor: '#67e8f9',
    gradientBottom: '#0891b2',
    strokeColor: '#164e63',
    meaning: 'จิตใจสงบนิ่ง ดับทุกข์ร้อน',
    icon: '💎'
  },
  {
    id: 'white-lotus',
    name: 'กลีบบัวขาวมุกบริสุทธิ์',
    description: 'กลีบดอกบัวสีขาวนวลสะอาด สัญลักษณ์แห่งความบริสุทธิ์ผุดผ่อง',
    petalColor: '#f8fafc',
    gradientBottom: '#64748b',
    strokeColor: '#334155',
    meaning: 'สติปัญญา สมาธิ จิตใจบริสุทธิ์',
    icon: '🤍'
  }
];

export const KRATHONG_CENTERS: KrathongCenterItem[] = [
  {
    id: 'marigold-bed',
    name: 'ดอกดาวเรืองทองเรืองรอง',
    description: 'กลุ่มดอกดาวเรืองสีเหลืองทองอร่ามแน่นใจกลางกระทง',
    centerColor: '#facc15',
    highlightColor: '#fef08a',
    secondaryDotColor: '#f59e0b',
    meaning: 'เงินทองไหลมาเทมา ทรัพย์สินเพิ่มพูน',
    icon: '🌼'
  },
  {
    id: 'lotus-core',
    name: 'ดอกบัวสวรรค์หลวงบานสง่า',
    description: 'ดอกบัวหลวงชมพูสดใสบานตรงกลาง เกสรสีทองส่งกลิ่นหอม',
    centerColor: '#f472b6',
    highlightColor: '#fde047',
    secondaryDotColor: '#fb7185',
    meaning: 'ความรักสดใส จิตใจผ่องแผ้ว',
    icon: '🪷'
  },
  {
    id: 'jasmine-crown',
    name: 'มงกุฎดอกมะลิสดหอมเย็น',
    description: 'ดอกมะลิสดเรียงร้อยเป็นวงแหวน หอมชื่นใจ คลายความกังวล',
    centerColor: '#ffffff',
    highlightColor: '#f8fafc',
    secondaryDotColor: '#cbd5e1',
    meaning: 'ครอบครัวอบอุ่น สงบร่มเย็น',
    icon: '🤍'
  },
  {
    id: 'red-rose-bed',
    name: 'พุ่มดอกกุหลาบแดงเสน่หา',
    description: 'ดอกกุหลาบแดงจัดช่อแน่น สื่อถึงไฟแห่งความรักที่ไม่มอดดับ',
    centerColor: '#e11d48',
    highlightColor: '#fda4af',
    secondaryDotColor: '#be123c',
    meaning: 'เสน่ห์ดึงดูดใจ รักใคร่กลมเกลียว',
    icon: '🌹'
  },
  {
    id: 'purple-orchid-bed',
    name: 'ช่อกล้วยไม้เกียรติยศ',
    description: 'กล้วยไม้สีม่วงเข้มเสริมความหรูหราและบารมี',
    centerColor: '#a855f7',
    highlightColor: '#f3e8ff',
    secondaryDotColor: '#7e22ce',
    meaning: 'การงานก้าวหน้า ได้รับการยกย่อง',
    icon: '🪻'
  },
  {
    id: 'sunflower-bed',
    name: 'ดอกทานตะวันเปี่ยมพลังชีวิต',
    description: 'ดอกทานตะวันสีทองอร่าม เบิกบานรับแสงจันทร์และประทีป',
    centerColor: '#eab308',
    highlightColor: '#fef9c3',
    secondaryDotColor: '#78350f',
    meaning: 'มีพลังใจ สุขภาพแข็งแรง เบิกบาน',
    icon: '🌻'
  }
];

export const KRATHONG_CANDLES: KrathongCandleItem[] = [
  {
    id: 'amber',
    name: 'เทียนทองนำทาง (Golden Amber)',
    description: 'เทียนขี้ผึ้งสีเหลืองทองดั้งเดิม เปลวไฟสีทองอบอุ่นสว่างไสว',
    candleColor: '#f59e0b',
    flameCoreColor: '#ffffff',
    auraColor: 'rgba(245, 158, 11, 0.55)',
    meaning: 'ปัญญาแจ่มใส ส่องทางสว่างสู่ความสำเร็จ',
    icon: '🕯️'
  },
  {
    id: 'pink',
    name: 'เทียนชมพูเสน่หา (Rose Pink)',
    description: 'เทียนสีชมพูกลีบบัว เปลวไฟสีชมพูประกายเสน่ห์',
    candleColor: '#ec4899',
    flameCoreColor: '#ffffff',
    auraColor: 'rgba(236, 72, 153, 0.55)',
    meaning: 'ความรักสมหวัง เมตตามหานิยม คนรักเอ็นดู',
    icon: '💖'
  },
  {
    id: 'red',
    name: 'เทียนแดงมหาโชค (Ruby Red)',
    description: 'เทียนสีแดงสดใส จุดพลังความมั่นใจและโชคลาภก้อนใหญ่',
    candleColor: '#ef4444',
    flameCoreColor: '#ffffff',
    auraColor: 'rgba(239, 68, 68, 0.55)',
    meaning: 'ขจัดอุปสรรค พลังใจเข้มแข็ง ชนะทุกศัตรู',
    icon: '❤️'
  },
  {
    id: 'cyan',
    name: 'เทียนฟ้าประกายธารา (Aqua Cyan)',
    description: 'เทียนสีฟ้าคราม สื่อถึงพระแม่คงคาและความชุ่มเย็น',
    candleColor: '#06b6d4',
    flameCoreColor: '#ffffff',
    auraColor: 'rgba(6, 182, 212, 0.55)',
    meaning: 'จิตใจสงบร่มเย็น ไร้โรคภัย แคล้วคลาดปลอดภัย',
    icon: '🩵'
  },
  {
    id: 'purple',
    name: 'เทียนม่วงเรืองเวท (Mystic Purple)',
    description: 'เทียนสีม่วงเรืองรอง สื่อถึงญาณหยั่งรู้และบารมี',
    candleColor: '#a855f7',
    flameCoreColor: '#ffffff',
    auraColor: 'rgba(168, 85, 247, 0.55)',
    meaning: 'ความสำเร็จในการงาน มีผู้ใหญ่ค้ำจุน',
    icon: '💜'
  },
  {
    id: 'white',
    name: 'เทียนขาวมุกบริสุทธิ์ (Pure White)',
    description: 'เทียนสีขาวสะอาดตา แสงสว่างนวลตา สื่อถึงความสงบสุข',
    candleColor: '#f8fafc',
    flameCoreColor: '#ffffff',
    auraColor: 'rgba(248, 250, 252, 0.55)',
    meaning: 'จิตใจผ่องใส สติปัญญา สมาธิตั้งมั่น',
    icon: '🤍'
  }
];

export const KRATHONG_INCENSES: KrathongIncenseItem[] = [
  {
    id: 'traditional',
    name: 'ธูปมงคล ๓ ดอก (ดั้งเดิม)',
    description: 'ก้านธูปสีแดง/ทอง บูชาคุณพระรัตนตรัย ควันลอยกรุ่นสู่ฟากฟ้า',
    stickColor: '#854d0e',
    tipColor: '#ef4444',
    hasSmoke: true,
    typeTag: 'ประเพณีแท้',
    icon: '🪔'
  },
  {
    id: 'incense-wood',
    name: 'ธูปหอมกำยานไม้กฤษณา',
    description: 'ก้านธูปไม้หอมธรรมชาติ ให้กลิ่นอายสงบเยือกเย็น',
    stickColor: '#451a03',
    tipColor: '#f97316',
    hasSmoke: true,
    typeTag: 'กลิ่นหอมผ่อนคลาย',
    icon: '🪵'
  },
  {
    id: 'led-flame',
    name: 'ธูปเทียน LED รักษ์สิ่งแวดล้อม',
    description: 'นวัตกรรมไฟประทีปไร้ควัน 0% มลพิษทางอากาศ ปลอดภัย รักษ์โลก',
    stickColor: '#0284c7',
    tipColor: '#38bdf8',
    hasSmoke: false,
    typeTag: 'รักษ์สิ่งแวดล้อม 100%',
    icon: '💡'
  }
];

export const DEFAULT_KRATHONG_COMPONENTS: KrathongComponents = {
  baseId: 'banana-trunk',
  petalId: 'pink-lotus',
  centerFlowerId: 'marigold-bed',
  candleId: 'amber',
  incenseId: 'traditional'
};

export const KRATHONG_STYLES: KrathongStyle[] = [
  {
    id: 'lotus-banana',
    name: 'กระทงใบตองบัวหลวงราชินี',
    badge: 'ประเพณีดั้งเดิม',
    description: 'จีบกลีบใบตองตานีอ่อนช้อย ล้อมรอบด้วยดอกบัวหลวงสีชมพูขาว',
    meaning: 'สื่อถึงความเคารพอ่อนน้อม สืบสานประเพณีไทยแท้ ขจัดอุปสรรคและสิ่งไม่ดี',
    ecoScore: 'วัสดุธรรมชาติ 100%',
    petalColor: '#f472b6',
    baseColor: '#15803d',
    centerColor: '#facc15',
    candleColor: '#f59e0b',
    auraColor: 'rgba(234, 179, 8, 0.4)',
    defaultComponents: {
      baseId: 'banana-trunk',
      petalId: 'pink-lotus',
      centerFlowerId: 'marigold-bed',
      candleId: 'amber',
      incenseId: 'traditional'
    }
  },
  {
    id: 'pink-lotus',
    name: 'กระทงปทุมมาลัยบัวสวรรค์',
    badge: 'เสริมความรัก & เสน่ห์',
    description: 'พับกลีบบัวหลวงสีชมพูซ้อนชั้น ดุจดอกบัวบานกลางสระโบกขรณี',
    meaning: 'เสริมเสน่ห์เมตตามหานิยม ความรักสมหวัง ชีวิตคู่ร่มเย็นเป็นสุข',
    ecoScore: 'ดอกไม้ธรรมชาติ 100%',
    petalColor: '#fb7185',
    baseColor: '#166534',
    centerColor: '#fde047',
    candleColor: '#ec4899',
    auraColor: 'rgba(244, 114, 182, 0.45)',
    defaultComponents: {
      baseId: 'banana-trunk',
      petalId: 'pink-lotus',
      centerFlowerId: 'lotus-core',
      candleId: 'pink',
      incenseId: 'traditional'
    }
  },
  {
    id: 'golden-marigold',
    name: 'กระทงสุวรรณดาวเรืองมหาโชค',
    badge: 'เสริมโชคลาภ & การเงิน',
    description: 'จัดช่อดอกดาวเรืองสีทองอร่าม สว่างไสวดุจแสงแห่งความมั่งคั่ง',
    meaning: 'เปิดดวงทรัพย์ โชคลาภเงินทองไหลมาเทมา การค้าการงานเจริญรุ่งเรือง',
    ecoScore: 'ดอกไม้ธรรมชาติ 100%',
    petalColor: '#f59e0b',
    baseColor: '#14532d',
    centerColor: '#fbbf24',
    candleColor: '#eab308',
    auraColor: 'rgba(245, 158, 11, 0.5)',
    defaultComponents: {
      baseId: 'golden-royal',
      petalId: 'yellow-marigold',
      centerFlowerId: 'marigold-bed',
      candleId: 'amber',
      incenseId: 'traditional'
    }
  },
  {
    id: 'eco-bread',
    name: 'กระทงขนมปังรักษ์สายน้ำ',
    badge: 'บุญให้อาหารปลา 100%',
    description: 'อบจากแป้งขนมปังหอมกรุ่น ปั้นแต่งทรงดอกไม้ เป็นมิตรต่อสิ่งมีชีวิตในน้ำ',
    meaning: 'ให้ทานแก่ฝูงมัจฉา ละลายเป็นอาหารปลา สุขใจและไร้ขยะตกค้าง',
    ecoScore: 'ย่อยสลายเป็นอาหารปลา',
    petalColor: '#d97706',
    baseColor: '#b45309',
    centerColor: '#fef08a',
    candleColor: '#f59e0b',
    auraColor: 'rgba(217, 119, 6, 0.4)',
    defaultComponents: {
      baseId: 'eco-bread',
      petalId: 'yellow-marigold',
      centerFlowerId: 'sunflower-bed',
      candleId: 'amber',
      incenseId: 'led-flame'
    }
  },
  {
    id: 'coconut-shell',
    name: 'กระทงสายกะลาตามประทีป',
    badge: 'เอกลักษณ์ล้านนาไทย',
    description: 'กะลามะพร้าวขัดเกลา บรรจุขี้ผึ้งแท้และประทีปเทียน ลอยสว่างดุจสายรุ้งน้ำ',
    meaning: 'ส่องแสงสว่างนำทางชีวิต ขจัดความมืดมน ปัญญาแจ่มใส ไร้สิ่งขัดข้อง',
    ecoScore: 'วัสดุธรรมชาติพื้นบ้าน',
    petalColor: '#78350f',
    baseColor: '#451a03',
    centerColor: '#fde047',
    candleColor: '#f97316',
    auraColor: 'rgba(249, 115, 22, 0.45)',
    defaultComponents: {
      baseId: 'coconut-shell',
      petalId: 'banana-fold',
      centerFlowerId: 'marigold-bed',
      candleId: 'amber',
      incenseId: 'traditional'
    }
  },
  {
    id: 'floral-ice',
    name: 'กระทงน้ำแข็งบุปผชาติมงคล',
    badge: 'นวัตกรรมรักษ์โลก 0% ขยะ',
    description: 'แกะสลักจากน้ำแข็งใสบริสุทธิ์ แทรกกลีบดอกไม้หลากสี ละลายคืนสู่แม่น้ำ',
    meaning: 'จิตใจสงบร่มเย็น ดับไฟราคะ โทสะ โมหะ ชีวิตสดชื่นผ่องใสดั่งสายน้ำบริสุทธิ์',
    ecoScore: 'ละลายคืนสู่สายน้ำ 100%',
    petalColor: '#38bdf8',
    baseColor: '#0284c7',
    centerColor: '#e0f2fe',
    candleColor: '#38bdf8',
    auraColor: 'rgba(56, 189, 248, 0.45)',
    defaultComponents: {
      baseId: 'crystal-ice',
      petalId: 'cyan-crystal',
      centerFlowerId: 'jasmine-crown',
      candleId: 'cyan',
      incenseId: 'led-flame'
    }
  },
  {
    id: 'royal-purple-orchid',
    name: 'กระทงกล้วยไม้พรายมงคล',
    badge: 'เสริมบารมี & เกียรติยศ',
    description: 'ร้อยเรียงด้วยกลีบกล้วยไม้มรกตและสีม่วงคราม อ่อนช้อยสง่างามดุจงานช่างหลวง',
    meaning: 'เสริมสง่าราศี บารมีเป็นที่รักนับถือ ผู้ใหญ่เมตตาอุปถัมภ์ค้ำชู',
    ecoScore: 'ดอกไม้ธรรมชาติ 100%',
    petalColor: '#a855f7',
    baseColor: '#15803d',
    centerColor: '#e9d5ff',
    candleColor: '#c084fc',
    auraColor: 'rgba(168, 85, 247, 0.45)',
    defaultComponents: {
      baseId: 'banana-trunk',
      petalId: 'purple-orchid',
      centerFlowerId: 'purple-orchid-bed',
      candleId: 'purple',
      incenseId: 'incense-wood'
    }
  }
];

export const KRATHONG_DECORATIONS: KrathongDecoration[] = [
  {
    id: 'incense-candle',
    name: 'ธูป & เทียนประทีปนำทาง',
    description: 'จุดบูชาพระรัตนตรัย ส่องแสงสว่างนำทางชีวิต',
    icon: '🕯️'
  },
  {
    id: 'nine-coins',
    name: 'เหรียญกษาปณ์มงคล ๙ บาท',
    description: 'เคล็ดโบราณเพื่อความมั่งคั่ง ทรัพย์สินงอกเงย ลอยเคราะห์รับโชค',
    icon: '🪙'
  },
  {
    id: 'jasmine',
    name: 'พวงมะลิสดหอมชื่นใจ',
    description: 'จิตใจบริสุทธิ์ สงบร่มเย็น คนในครอบครัวรักใคร่ปรองดอง',
    icon: '🤍'
  },
  {
    id: 'rose-petals',
    name: 'กลีบกุหลาบแดงมหารัก',
    description: 'ความรักสดใส มั่นคง ยืนยาวดั่งสายธารที่ไม่เคยเหือดแห้ง',
    icon: '🌹'
  },
  {
    id: 'betel-nut',
    name: 'หมากพลูคำมงคลโบราณ',
    description: 'เครื่องบูชาพระแม่คงคาตามคติความเชื่อดั้งเดิม',
    icon: '🌿'
  },
  {
    id: 'puffed-rice',
    name: 'ข้าวตอกดอกไม้โปรยทาน',
    description: 'สัญลักษณ์แห่งความเจริญงอกงาม ผลิดอกออกผลในชีวิต',
    icon: '🌾'
  },
  {
    id: 'sacred-thread',
    name: 'สายสิญจน์มงคล ๙ เส้น',
    description: 'ผูกโยงสิริมงคล แคล้วคลาดจากสิ่งอัปมงคลทั้งปวง',
    icon: '🧵'
  }
];

export const WISH_CATEGORIES: WishCategory[] = [
  {
    id: 'repent',
    name: 'ขอขมาพระแม่คงคา & ลอยทุกข์โศก',
    icon: '🌊',
    wishes: [
      'ขอขมาลาโทษแด่พระแม่คงคา ที่ได้ใช้น้ำอุปโภคบริโภค ขอให้สายน้ำพัดพาความทุกข์โศก โรคภัย และสิ่งไม่ดีออกไปจากชีวิต',
      'ขอให้พระแม่คงคาประทานพรให้ชีวิตสดชื่น ร่มเย็น ปราศจากอุปสรรคและภยันตรายทั้งปวง มีแต่ความผาสุกตลอดไป',
      'ตั้งจิตบริสุทธิ์ขอขมาพระแม่คงคา สิ่งใดที่เคยล่วงเกินโปรดอโหสิกรรม ขอเริ่มต้นสิ่งใหม่ด้วยจิตใจที่สว่างไสว',
      'ขอให้สายน้ำอันศักดิ์สิทธิ์ ชะล้างเคราะห์กรรม สิ่งอัปมงคล และนำพาความสุขศานติเข้ามาสู่ตัวข้าพเจ้าและครอบครัว'
    ]
  },
  {
    id: 'love',
    name: 'ความรัก & ความสัมพันธ์',
    icon: '💖',
    wishes: [
      'ขอให้พบเจอคนที่ดี เข้าใจ และพร้อมเคียงข้างไปด้วยกัน ขอให้ความรักสุขสมหวังและจริงใจ',
      'ขอให้ความรักของสองเรามั่นคง ราบรื่นดั่งสายน้ำ ไร้มือที่สาม มีความเข้าใจและเกื้อกูลกันตลอดไป',
      'ขอให้ความสัมพันธ์ในครอบครัวและคนรอบข้างเปี่ยมด้วยความเมตตา รอยยิ้ม และความอบอุ่นในทุกๆ วัน',
      'ขอให้สายน้ำพัดพาความรักที่เป็นพิษออกไป และนำพาคู่แท้ที่มีศีลเสมอกันเข้ามาในชีวิต'
    ]
  },
  {
    id: 'work',
    name: 'การงาน & การเรียน',
    icon: '💼',
    wishes: [
      'ขอให้การงานราบรื่น ปราศจากอุปสรรค ได้รับโอกาสใหญ่และเติบโตอย่างมั่นคง มีผู้ใหญ่เมตตาอุปถัมภ์',
      'ขอให้การเรียนการสอบผ่านฉลุย มีสติปัญญาแจ่มใส ประสบความสำเร็จในสาขาวิชาที่ตั้งใจ',
      'ขอให้ธุรกิจการค้าเจริญก้าวหน้า มีลูกค้าหลั่งไหลมาไม่ขาดสาย ดั่งสายน้ำที่ไหลรินตลอดกาล',
      'ขอให้ค้นพบเส้นทางที่ใช่ ได้ทำงานที่มีความสุข สร้างคุณค่าและผลตอบแทนที่สมบูรณ์แบบ'
    ]
  },
  {
    id: 'wealth',
    name: 'โชคลาภ & การเงิน',
    icon: '💰',
    wishes: [
      'ขอให้เงินทองไหลมาเทมา ปลดหนี้สินได้อย่างรวดเร็ว มีเงินเก็บมั่งคั่ง มั่นคง ไม่ติดขัด',
      'ขอให้มีโชคลาภก้อนโต ดวงเปิดรับทรัพย์ มีโอกาสทางการเงินใหม่ๆ เข้ามาอย่างต่อเนื่อง',
      'ขอให้ทรัพย์สินเพิ่มพูน การลงทุนมีกำไร ประสบความสำเร็จทางด้านการเงินในทุกด้าน',
      'ขอให้ชีวิตมีกินมีใช้เหลือเฟือ มีสภาพคล่องดั่งสายน้ำ และสามารถแบ่งปันช่วยเหลือผู้อื่นได้เสมอ'
    ]
  },
  {
    id: 'health',
    name: 'สุขภาพ & แคล้วคลาด',
    icon: '🌿',
    wishes: [
      'ขอให้ร่างกายแข็งแรง จิตใจแจ่มใส ปราศจากโรคภัยไข้เจ็บ มีพลังชีวิตในการทำสิ่งดีๆ เสมอ',
      'ขอให้คนในครอบครัว พ่อแม่ และคนที่รัก มีสุขภาพแข็งแรง อายุยืนยาว อยู่เป็นร่มโพธิ์ร่มไทร',
      'ขอให้แคล้วคลาดปลอดภัยจากอุบัติเหตุและภยันตรายทั้งปวง เดินทางไปไหนมีแต่ความปลอดภัย',
      'ขอให้จิตใจสงบนิ่ง ปล่อยวางความเครียดความกังวล หลับสบาย ตื่นมาพบกับวันที่สดใส'
    ]
  }
];

export const GANGA_BLESSINGS: GangaBlessing[] = [
  {
    id: 1,
    title: 'สายธารแห่งความร่มเย็นและความสุขสมบูรณ์',
    message: 'พระแม่คงคาประทานพรให้จิตใจของท่านสงบร่มเย็นดั่งสระบัว ความร้อนรนและความกังวลใจจะค่อยๆ มลายหายไป ความสุขที่แท้จริงจะหลั่งไหลเข้ามาสู่ครอบครัวของท่าน',
    advice: 'หมั่นสงบจิตใจ ดื่มน้ำสะอาดอย่างมีสติ และปล่อยวางสิ่งที่ไม่สามารถควบคุมได้',
    luckyNumber: '1, 8, 9',
    luckyColor: 'สีฟ้าคราม และ สีขาวมุก'
  },
  {
    id: 2,
    title: 'ธารน้ำทองเปิดทางทรัพย์และโชคลาภ',
    message: 'สายน้ำกำลังพัดพาโอกาสทางการเงินและลู่ทางทำมาหากินใหม่ๆ เข้ามา การลงทุนหรือสิ่งที่ท่านลงแรงไว้จะเริ่มผลิดอกออกผล มีเกณฑ์ได้รับข่าวดีเรื่องเงินทอง',
    advice: 'ทำทานด้วยน้ำดื่มหรือบริจาคค่าน้ำวัด จะช่วยเสริมดวงการเงินให้คล่องตัวยิ่งขึ้น',
    luckyNumber: '2, 4, 6',
    luckyColor: 'สีทองคำ และ สีเขียวมรกต'
  },
  {
    id: 3,
    title: 'เกลียวคลื่นแห่งเสน่หาและความรักแท้',
    message: 'แสงจันทร์เพ็ญสะท้อนผิวน้ำ ส่องสว่างให้ดวงชะตาความรักของท่านเปิดรับความจริงใจ หากมีคู่อยู่แล้วความสัมพันธ์จะหวานชื่นเข้าใจกัน หากโสดมีเกณฑ์พบคู่แท้ที่อบอุ่น',
    advice: 'เปิดใจรับฟังอย่างอ่อนโยน แสดงความเมตตาและรอยยิ้มแก่คนรอบข้างเสมอ',
    luckyNumber: '3, 5, 7',
    luckyColor: 'สีชมพูกลีบบัว และ สีโอรส'
  },
  {
    id: 4,
    title: 'กระแสน้ำพัดพาเคราะห์กรรมสู่ความสว่างไสว',
    message: 'สิ่งใดที่เคยติดขัด ความทุกข์ใจ หรือเรื่องที่ทำให้หนักอกหนักใจ กำลังถูกสายน้ำพัดลอยออกไปสู่ทะเลลึก นับจากวันนี้ไป ท่านจะได้รับความปลอดโปร่งและเริ่มต้นใหม่อย่างสดใส',
    advice: 'ให้อภัยตนเองและผู้อื่น จุดเทียนหรือนั่งสมาธิสั้นๆ ก่อนนอนเพื่อรับพลังงานบวก',
    luckyNumber: '5, 9, 0',
    luckyColor: 'สีเหลืองทอง และ สีส้มพีช'
  },
  {
    id: 5,
    title: 'มหาชลาลัยแห่งปัญญาและความก้าวหน้า',
    message: 'ปัญญาของท่านจะเฉียบแหลมดั่งสายน้ำที่เซาะผ่านทุกอุปสรรค การงานและการศึกษาจะได้รับการยอมรับ มีเกียรติยศและชื่อเสียงปรากฏให้คนชื่นชม',
    advice: 'จดบันทึกเป้าหมายและลงมือทำทีละก้าว ความสม่ำเสมอคือกุญแจแห่งความสำเร็จ',
    luckyNumber: '4, 7, 8',
    luckyColor: 'สีม่วงดอกรัก และ สีน้ำเงินคราม'
  },
  {
    id: 6,
    title: 'คุ้งน้ำแห่งความปลอดภัยและสุขภาพยืนยาว',
    message: 'พลังแห่งพระแม่คงคาโอบอุ้มคุ้มครองธาตุทั้งสี่ในกายของท่านให้สมดุล โรคภัยไข้เจ็บจะทุเลาเบาบาง มีพลังชีวิตที่สดชื่น กระปรี้กระเปร่า ปลอดภัยในทุกย่างก้าว',
    advice: 'ออกกำลังกายเบาๆ ดื่มน้ำเปล่าให้เพียงพอ และพักผ่อนใต้ร่มเงาธรรมชาติ',
    luckyNumber: '2, 6, 9',
    luckyColor: 'สีเขียวใบตอง และ สีขาวสะอาด'
  }
];

export const INITIAL_RIVER_KRATHONGS: RiverKrathong[] = [
  {
    id: 'krathong-init-1',
    senderName: 'คุณสมชาย & คุณนิด',
    partnerName: 'คุณนิด',
    wish: 'ขอให้ครอบครัวมีความสุข ปราศจากโรคภัยไข้เจ็บ ขอให้ลูกๆ เรียนหนังสือเก่งๆ',
    category: 'health',
    krathongStyleId: 'lotus-banana',
    decorations: ['incense-candle', 'nine-coins', 'jasmine'],
    xPercent: 12,
    yPercent: 42,
    scale: 0.95,
    speedSeconds: 14,
    createdAt: 'เมื่อสักครู่'
  },
  {
    id: 'krathong-init-2',
    senderName: 'น้องพลอย (คนโสด2026)',
    wish: 'ขอให้ปีนี้สอบผ่านบรรจุงานราชการ และขอให้เจอคู่แท้ที่จริงใจและอบอุ่น',
    category: 'work',
    krathongStyleId: 'pink-lotus',
    decorations: ['incense-candle', 'rose-petals'],
    xPercent: 32,
    yPercent: 55,
    scale: 1.1,
    speedSeconds: 16,
    createdAt: '1 นาทีที่แล้ว'
  },
  {
    id: 'krathong-init-3',
    senderName: 'เฮียตี๋ ค้าขายร่ำรวย',
    wish: 'ขอขมาพระแม่คงคา ขอให้ยอดขายปังๆ เงินทองไหลมาเทมาดั่งสายน้ำ ปลดหนี้ได้ไว',
    category: 'wealth',
    krathongStyleId: 'golden-marigold',
    decorations: ['incense-candle', 'nine-coins'],
    xPercent: 62,
    yPercent: 38,
    scale: 0.85,
    speedSeconds: 13,
    createdAt: '3 นาทีที่แล้ว'
  },
  {
    id: 'krathong-init-4',
    senderName: 'สายเขียวรักษ์โลก',
    wish: 'ขอให้แม่น้ำลำคลองใสสะอาด มนุษย์อยู่ร่วมกับธรรมชาติอย่างเกื้อกูล ให้อาหารปลาอิ่มหนำสำราญ',
    category: 'repent',
    krathongStyleId: 'eco-bread',
    decorations: ['incense-candle'],
    xPercent: 82,
    yPercent: 65,
    scale: 1.0,
    speedSeconds: 15,
    createdAt: '5 นาทีที่แล้ว'
  },
  {
    id: 'krathong-init-5',
    senderName: 'พี่ต้น & น้องเมย์',
    partnerName: 'น้องเมย์',
    wish: 'ขอให้ความรักของเราสองคนมั่นคง มีความสุขในทุกๆ วันที่ได้อยู่ด้วยกัน',
    category: 'love',
    krathongStyleId: 'coconut-shell',
    decorations: ['incense-candle', 'rose-petals', 'jasmine'],
    xPercent: 48,
    yPercent: 72,
    scale: 1.15,
    speedSeconds: 18,
    createdAt: '8 นาทีที่แล้ว'
  },
  {
    id: 'krathong-init-6',
    senderName: 'คุณยายละมุน',
    wish: 'ขอขมาพระแม่คงคา ขอบารมีคุ้มครองลูกหลานให้เจริญก้าวหน้า แคล้วคลาดปลอดภัยทุกคน',
    category: 'repent',
    krathongStyleId: 'lotus-banana',
    decorations: ['incense-candle', 'betel-nut', 'jasmine'],
    xPercent: 22,
    yPercent: 78,
    scale: 1.05,
    speedSeconds: 17,
    createdAt: '10 นาทีที่แล้ว'
  },
  {
    id: 'krathong-init-7',
    senderName: 'แก๊งเด็กวิศวะ มช.',
    wish: 'ขอเกรด A ทุกวิชา โปรเจกต์ผ่านฉลุย ได้งานเงินเดือนดีๆ สาธุ!',
    category: 'work',
    krathongStyleId: 'floral-ice',
    decorations: ['incense-candle'],
    xPercent: 75,
    yPercent: 48,
    scale: 0.9,
    speedSeconds: 14,
    createdAt: '12 นาทีที่แล้ว'
  }
];

export const THAI_LOY_KRATHONG_MANTRA = {
  pali: `มะโนพุทธัสสะ วาจายะ กาเยนะ อะปะราธัง
สัพพัง อะปะราธัง ขะมะถะ เม ภันเต อุกาสะ ขะมามิ ภันเต
มะหาคงคา นะมัสสามิ อายาจามิ สัพพะทา`,
  meaning: `ข้าพเจ้าขอน้อมเศียรระลึกถึงพระคุณของพระแม่คงคา
ขอขมาลาโทษในสิ่งทั้งปวงที่เคยล่วงเกินด้วยกาย วาจา ใจ
ขอพระแม่คงคาโปรดประทานอภัย และอำนวยพรให้ข้าพเจ้าประสบแต่ความสุขความร่มเย็นเทอญ`
};
