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
  ratings: [
    {
      title: string;
      comments: {
        message: string;
        reply: [
          {
            userId: {
              _id: string;
              name: string;
            };
            message: string;
          }
        ];
      };
      rating: number;
      userId: {
        _id: string;
        name: string;
      };
      creation: string;
      _id: string;
    }
  ];
  ratingCount: number;
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
  deliveryDate: Date;
  imageUrls: [
    {
      _id: string;
      path: string;
    }
  ];
  totalRating: number;
  ratings: [
    {
      title: string;
      comments: {
        message: string;
        reply: [
          {
            userId: {
              _id: string;
              name: string;
            };
            message: string;
          }
        ];
      };
      rating: number;
      userId: {
        _id: string;
        name: string;
      };
      creation: string;
      _id: string;
    }
  ];
  ratingCount: number;
  category: string;
  userId: {
    email: string;
    companyName: string;
    ratings: [];
  };
  createdAt: string;
  updatedAt: string;
}
