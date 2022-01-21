export interface Inventory {
  size: string;
  quantity: number;
}

export interface Product {
  alloffName: string;
  isForeignDelivery?: true;
  productId?: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountRate?: number;
  specialPrice?: number;
  brandKeyName?: string;
  brandKorName?: string;
  categoryName?: string;
  alloffCategoryName?: string;
  isRemoved?: boolean;
  isSoldout?: boolean;
  totalScore?: number;
  inventory: Inventory[];
  description?: string[];
  earliestDeliveryDays?: number;
  latestDeliveryDays?: number;
  refundFee?: number;
  isRefundPossible?: true;
  images?: string[];
  descriptionImages?: string[];
}

// export type Product = any;

interface ListRes {
  products: Product[];
  offset: number;
  limit: number;
  totalCounts: number;
  listQuery?: any;
}

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
      productId: "WJDR1B400I1",
      alloffName: "베이지 프린트 7부소매원피스",
      discountedPrice: 419300,
      discountRate: 30,
      specialPrice: 0,
      brandKorName: "질스튜어트 뉴욕",
      categoryName: "원피스",
      alloffCategoryName: "",
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
      productId: "WJPA1B200B2",
      alloffName: "블루 워싱 면 밴딩데님팬츠",
      discountedPrice: 195300,
      discountRate: 30,
      specialPrice: 0,
      brandKorName: "질스튜어트 뉴욕",
      categoryName: "팬츠",
      alloffCategoryName: "",
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
      productId: "WKPA1BH31N2",
      alloffName: "네이비 워싱 면혼방 데님팬츠",
      discountedPrice: 185850,
      discountRate: 37,
      specialPrice: 0,
      brandKorName: "닥스 레이디스",
      categoryName: "팬츠",
      alloffCategoryName: "",
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
      productId: "WVDR0D903N3",
      alloffName: "네이비 패턴 실크 긴팔원피스",
      discountedPrice: 299000,
      discountRate: 50,
      specialPrice: 0,
      brandKorName: "바네사브루노",
      categoryName: "원피스",
      alloffCategoryName: "",
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
      productId: "WSTS1B103IV",
      alloffName: "아이보리 퍼피자수 면혼방 긴팔티셔츠",
      discountedPrice: 69300,
      discountRate: 30,
      specialPrice: 0,
      brandKorName: "헤지스 레이디스",
      categoryName: "티셔츠",
      alloffCategoryName: "",
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
      productId: "HSSH0D902BK",
      alloffName: "블랙 체크 면혼방 긴팔셔츠",
      discountedPrice: 129500,
      discountRate: 50,
      specialPrice: 0,
      brandKorName: "헤지스 레이디스",
      categoryName: "셔츠",
      alloffCategoryName: "",
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
      productId: "WVTS1B903E1",
      alloffName: "그린 자수장식 면 긴팔티셔츠",
      discountedPrice: 110600,
      discountRate: 30,
      specialPrice: 0,
      brandKorName: "바네사브루노",
      categoryName: "티셔츠",
      alloffCategoryName: "",
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
      productId: "ISSK0F691B2",
      alloffName: "[ISABEL MARANT ETOILE] 블루 러플배색 면 플레어스커트",
      discountedPrice: 319500,
      discountRate: 50,
      specialPrice: 0,
      brandKorName: "이자벨 마랑",
      categoryName: "스커트",
      alloffCategoryName: "",
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
      productId: "DLSK1B391G3",
      alloffName: "[D-GIFT] 그레이 플레어 밴딩스커트",
      discountedPrice: 116550,
      discountRate: 37,
      specialPrice: 0,
      brandKorName: "닥스 레이디스",
      categoryName: "스커트",
      alloffCategoryName: "",
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
      productId: "DLSH0D901P2",
      alloffName: "핑크 체크 울혼방 긴팔셔츠",
      discountedPrice: 159750,
      discountRate: 55,
      specialPrice: 0,
      brandKorName: "닥스 레이디스",
      categoryName: "셔츠",
      alloffCategoryName: "",
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
