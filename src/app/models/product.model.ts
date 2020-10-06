export interface ProductInterface {
  _id: string;
  name: string;
  originalPrice: number;
  offerPrice: number;
  description: string;
  imageUrls: [
    {
      _id: string;
      path: string;
    }
  ];
  totalRating: number;
  ratings: [];
  category: string;
  userId: {
    email: string;
    companyName: string;
    ratings: [];
  };
  createdAt: string;
  updatedAt: string;
}
export interface mappedProductInterface {
  _id: string;
  name: string;
  originalPrice: number;
  offerPrice: number;
  ratingsCount: number;
  priceDifference: number;
  offerPercentage: number;
  description: string;
  deliveryDate: string;
  imageUrls: [
    {
      _id: string;
      path: string;
    }
  ];
  totalRating: number;
  ratings: [];
  category: string;
  userId: {
    email: string;
    companyName: string;
    ratings: [];
  };
  createdAt: string;
  updatedAt: string;
}
