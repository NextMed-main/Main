/**
 * EHR Provider Data
 * Shared EHR provider definitions for use across dashboards
 */

export interface EHRProvider {
  id: string;
  vendor: string;
  vendorJa: string;
  name: string;
  category: string;
  categoryJa: string;
  target: string;
  targetJa: string;
  description: string;
  descriptionJa: string;
}

export const EHR_PROVIDERS: EHRProvider[] = [
  {
    id: "humanbridge",
    vendor: "Fujitsu",
    vendorJa: "富士通",
    name: "HumanBridge",
    category: "Integrated / Major",
    categoryJa: "総合・大手",
    target: "Large Scale Hospitals / Regional Alliance",
    targetJa: "大規模病院・地域広域連携",
    description: "Largest domestic share. De facto standard for regional medical coordination infrastructure.",
    descriptionJa: "国内シェア最大級。地域医療連携基盤のデファクト。",
  },
  {
    id: "id-link",
    vendor: "NEC",
    vendorJa: "NEC",
    name: "ID-Link",
    category: "Integrated / Major",
    categoryJa: "総合・大手",
    target: "Regional Medical Network",
    targetJa: "地域医療連携ネットワーク",
    description: "Integration of medical information between facilities. Utilizes NTT Data infrastructure.",
    descriptionJa: "施設間での診療情報統合参照。NTTデータの基盤活用。",
  },
  {
    id: "mirais",
    vendor: "CSI",
    vendorJa: "シーエスアイ",
    name: "MI・RA・Is",
    category: "Integrated / Major",
    categoryJa: "総合・大手",
    target: "SME Hospitals / Regional Alliance",
    targetJa: "中小病院・地域連携",
    description: "Strong in regional coordination functions. Abundant introduction track record.",
    descriptionJa: "地域連携機能に強み。導入実績が豊富。",
  },
  {
    id: "newtons",
    vendor: "Software Service",
    vendorJa: "ソフトウェア・サービス",
    name: "E-RI / NEWTONS",
    category: "Integrated / Major",
    categoryJa: "総合・大手",
    target: "Large Hospitals / Integrated",
    targetJa: "大病院・統合型",
    description: "Data sharing environment completely integrated with proprietary electronic medical records.",
    descriptionJa: "自社カルテと完全に統合されたデータ共有環境。",
  },
  {
    id: "kanjasan",
    vendor: "NTT DATA",
    vendorJa: "NTTデータ",
    name: "かんじゃさん窓口",
    category: "Public / PHR",
    categoryJa: "公共・PHR",
    target: "Patients / Local Gov",
    targetJa: "患者・自治体",
    description: "Strong character as PHR (Personal Health Record), viewable by patients themselves.",
    descriptionJa: "PHR（個人健康記録）としての性格が強く、患者自身が閲覧。",
  },
  {
    id: "clinics",
    vendor: "Medley",
    vendorJa: "メドレー",
    name: "CLINICS",
    category: "Cloud / Next Gen",
    categoryJa: "クラウド・次世代",
    target: "Clinics / Patients",
    targetJa: "クリニック・患者",
    description: "System integrating online medical care, electronic charts, and reservations.",
    descriptionJa: "オンライン診療、カルテ、予約が一体となったシステム。",
  },
  {
    id: "henry",
    vendor: "Henry",
    vendorJa: "ヘンリー",
    name: "Henry",
    category: "Cloud / Next Gen",
    categoryJa: "クラウド・次世代",
    target: "SME Hospitals / Cloud",
    targetJa: "中小病院・クラウド",
    description: "Cloud-native design. Specialized in operational efficiency.",
    descriptionJa: "クラウドネイティブな設計。運用の効率化に特化。",
  },
  {
    id: "m3digikar",
    vendor: "M3",
    vendorJa: "エムスリー",
    name: "M3 Digikar",
    category: "Cloud / Next Gen",
    categoryJa: "クラウド・次世代",
    target: "Clinics / API Integration",
    targetJa: "クリニック・API連携",
    description: "Active in API integration, high affinity with external services.",
    descriptionJa: "API連携に積極的で、外部サービスとの親和性が高い。",
  },
  {
    id: "iris",
    vendor: "InterSystems",
    vendorJa: "インターシステムズ",
    name: "IRIS for Health",
    category: "Data Platform",
    categoryJa: "データ基盤",
    target: "Developers / Data Integration",
    targetJa: "開発者・データ統合",
    description: "Global data platform. Strong in standardization of medical information.",
    descriptionJa: "グローバルなデータプラットフォーム。医療情報の標準化に強み。",
  },
  {
    id: "ssmix",
    vendor: "Various",
    vendorJa: "(各社)",
    name: "SS-MIX2 準拠パッケージ",
    category: "Standard",
    categoryJa: "標準規格",
    target: "General",
    targetJa: "全般",
    description: "Standard promoted by MHLW. Many products support this.",
    descriptionJa: "厚生労働省が推進する標準規格。多くの製品がこれに対応。",
  },
];
