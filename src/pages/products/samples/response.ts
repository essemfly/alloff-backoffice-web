export interface Inventory {
  size: string;
  quantity: number;
}

export interface Product {
  inventory: Inventory[];
  description: string[];
  images: string[];
  descriptionImages: string[];
  alloffName: string;
  productId: string;
  brandKorName: string;
  categoryName: string;
  alloffCategoryName: string;
  originalPrice: number;
  discountedPrice: number;
  specialPrice: number;
  earliestDeliveryDays: number;
  latestDeliveryDays: number;
  refundFee: number;
  totalScore: number;
  isRefundPossible: boolean;
  isForeignDelivery: boolean;
  isSoldout: boolean;
  isRemoved: boolean;
}

interface ListRes {
  products: Product[];
  offset: number;
  limit: number;
  totalCounts: number;
  listQuery?: string | null;
}

export interface Brand {
  key?: any;
  id: any;
  _id?: any;
  korname: string;
  keyname: string;
}

export type AlloffProductBrand = Brand;

export const response: ListRes = {
  products: [
    {
      inventory: [
        {
          size: "00M",
          quantity: 25,
        },
        {
          size: "00S",
          quantity: 51,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_00.jpg?1642033246000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_01.jpg?1642033246000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_D0.jpg?1642033246000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_D1.jpg?1642033246000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_00.jpg?1642033246000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_01.jpg?1642033246000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_D0.jpg?1642033246000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJDR1B400I1_D1.jpg?1642033246000",
      ],
      alloffName: "베이지 프린트 7부소매원피스",
      isForeignDelivery: false,
      productId: "WJDR1B400I1",
      originalPrice: 599000,
      discountedPrice: 419300,
      specialPrice: 0,
      brandKorName: "질스튜어트 뉴욕",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "원피스",
      alloffCategoryName: "1ONEPIECE",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "00M",
          quantity: 33,
        },
        {
          size: "00S",
          quantity: 61,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_00.jpg?1640925341000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_01.jpg?1640925341000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_D0.jpg?1640925341000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_D1.jpg?1640925341000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_00.jpg?1640925341000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_01.jpg?1640925341000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_D0.jpg?1640925341000",
        "https://nimg.lfmall.co.kr/file/product/prd/WJ/2021/640/WJPA1B200B2_D1.jpg?1640925341000",
      ],
      alloffName: "블루 워싱 면 밴딩데님팬츠",
      isForeignDelivery: false,
      productId: "WJPA1B200B2",
      originalPrice: 279000,
      discountedPrice: 195300,
      specialPrice: 0,
      brandKorName: "질스튜어트 뉴욕",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "팬츠",
      alloffCategoryName: "1_PANTS/DENIM",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "067",
          quantity: 8,
        },
        {
          size: "073",
          quantity: 25,
        },
        {
          size: "076",
          quantity: 17,
        },
        {
          size: "082",
          quantity: 17,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_00.jpg?1641514918000",
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_01.jpg?1641514918000",
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_D0.jpg?1641514918000",
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_D1.jpg?1641514918000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_00.jpg?1641514918000",
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_01.jpg?1641514918000",
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_D0.jpg?1641514918000",
        "https://nimg.lfmall.co.kr/file/product/prd/WK/2021/640/WKPA1BH31N2_D1.jpg?1641514918000",
      ],
      alloffName: "네이비 워싱 면혼방 데님팬츠",
      isForeignDelivery: false,
      productId: "WKPA1BH31N2",
      originalPrice: 295000,
      discountedPrice: 185850,
      specialPrice: 0,
      brandKorName: "닥스 레이디스",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "팬츠",
      alloffCategoryName: "1_PANTS/DENIM",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "036",
          quantity: 4,
        },
        {
          size: "038",
          quantity: 1,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_00.jpg?1635221250000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_01.jpg?1635221250000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_D0.jpg?1635221250000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_D1.jpg?1635221250000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_00.jpg?1635221250000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_01.jpg?1635221250000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_D0.jpg?1635221250000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2020/640/WVDR0D903N3_D1.jpg?1635221250000",
      ],
      alloffName: "네이비 패턴 실크 긴팔원피스",
      isForeignDelivery: false,
      productId: "WVDR0D903N3",
      originalPrice: 598000,
      discountedPrice: 299000,
      specialPrice: 0,
      brandKorName: "바네사브루노",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "원피스",
      alloffCategoryName: "1_ONEPIECE",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "085",
          quantity: 211,
        },
        {
          size: "090",
          quantity: 333,
        },
        {
          size: "095",
          quantity: 293,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_00.jpg?1640823747000",
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_01.jpg?1640823747000",
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_D0.jpg?1640823747000",
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_D1.jpg?1640823747000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_00.jpg?1640823747000",
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_01.jpg?1640823747000",
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_D0.jpg?1640823747000",
        "https://nimg.lfmall.co.kr/file/product/prd/WS/2021/640/WSTS1B103IV_D1.jpg?1640823747000",
      ],
      alloffName: "아이보리 퍼피자수 면혼방 긴팔티셔츠",
      isForeignDelivery: false,
      productId: "WSTS1B103IV",
      originalPrice: 99000,
      discountedPrice: 69300,
      specialPrice: 0,
      brandKorName: "헤지스 레이디스",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "티셔츠",
      alloffCategoryName: "1_TSHIRT",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "085",
          quantity: 102,
        },
        {
          size: "090",
          quantity: 66,
        },
        {
          size: "095",
          quantity: 3,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_00.jpg?1603780366000",
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_01.jpg?1603780366000",
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_D0.jpg?1603780366000",
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_D1.jpg?1603780366000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_00.jpg?1603780366000",
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_01.jpg?1603780366000",
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_D0.jpg?1603780366000",
        "https://nimg.lfmall.co.kr/file/product/prd/HS/2020/640/HSSH0D902BK_D1.jpg?1603780366000",
      ],
      alloffName: "블랙 체크 면혼방 긴팔셔츠",
      isForeignDelivery: false,
      productId: "HSSH0D902BK",
      originalPrice: 259000,
      discountedPrice: 129500,
      specialPrice: 0,
      brandKorName: "헤지스 레이디스",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "셔츠",
      alloffCategoryName: "1_SHIRT/BLOUSE",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "00M",
          quantity: 34,
        },
        {
          size: "00S",
          quantity: 53,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_00.jpg?1641515118000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_01.jpg?1641515118000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_D0.jpg?1641515118000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_D1.jpg?1641515118000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_00.jpg?1641515118000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_01.jpg?1641515118000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_D0.jpg?1641515118000",
        "https://nimg.lfmall.co.kr/file/product/prd/WV/2021/640/WVTS1B903E1_D1.jpg?1641515118000",
      ],
      alloffName: "그린 자수장식 면 긴팔티셔츠",
      isForeignDelivery: false,
      productId: "WVTS1B903E1",
      originalPrice: 158000,
      discountedPrice: 110600,
      specialPrice: 0,
      brandKorName: "바네사브루노",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "티셔츠",
      alloffCategoryName: "1_TSHIRT",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "034",
          quantity: 1,
        },
        {
          size: "036",
          quantity: 20,
        },
        {
          size: "038",
          quantity: 9,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_00.jpg?1600151927000",
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_01.jpg?1600151927000",
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_02.jpg?1600151927000",
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_D0.jpg?1600151927000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_00.jpg?1600151927000",
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_01.jpg?1600151927000",
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_02.jpg?1600151927000",
        "https://nimg.lfmall.co.kr/file/product/prd/C552/2020/640/ISSK0F691B2_D0.jpg?1600151927000",
      ],
      alloffName: "[ISABEL MARANT ETOILE] 블루 러플배색 면 플레어스커트",
      isForeignDelivery: false,
      productId: "ISSK0F691B2",
      originalPrice: 639000,
      discountedPrice: 319500,
      specialPrice: 0,
      brandKorName: "이자벨 마랑",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "스커트",
      alloffCategoryName: "1_SKIRT",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "082",
          quantity: 1,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_00.jpg?1615187315000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_01.jpg?1615187315000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_02.jpg?1615187315000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_03.jpg?1615187315000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_00.jpg?1615187315000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_01.jpg?1615187315000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_02.jpg?1615187315000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2021/640/DLSK1B391G3_03.jpg?1615187315000",
      ],
      alloffName: "[D-GIFT] 그레이 플레어 밴딩스커트",
      isForeignDelivery: false,
      productId: "DLSK1B391G3",
      originalPrice: 185000,
      discountedPrice: 116550,
      specialPrice: 0,
      brandKorName: "닥스 레이디스",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "스커트",
      alloffCategoryName: "1_SKIRT",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
    {
      inventory: [
        {
          size: "085",
          quantity: 14,
        },
        {
          size: "088",
          quantity: 14,
        },
        {
          size: "091",
          quantity: 24,
        },
      ],
      description: [],
      images: [
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_00.jpg?1605248811000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_01.jpg?1605248811000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_02.jpg?1605248811000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_03.jpg?1605248811000",
      ],
      descriptionImages: [
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_00.jpg?1605248811000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_01.jpg?1605248811000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_02.jpg?1605248811000",
        "https://nimg.lfmall.co.kr/file/product/prd/DL/2020/640/DLSH0D901P2_03.jpg?1605248811000",
      ],
      alloffName: "핑크 체크 울혼방 긴팔셔츠",
      isForeignDelivery: false,
      productId: "DLSH0D901P2",
      originalPrice: 355000,
      discountedPrice: 159750,
      specialPrice: 0,
      brandKorName: "닥스 레이디스",
      earliestDeliveryDays: 7,
      latestDeliveryDays: 2,
      refundFee: 5000,
      isRefundPossible: true,
      categoryName: "셔츠",
      alloffCategoryName: "1_SHIRT/BLOUSE",
      isRemoved: false,
      isSoldout: false,
      totalScore: 20,
    },
  ],
  offset: 10,
  limit: 10,
  totalCounts: 32197,
  listQuery: null,
};
