export interface WishListModel {
  _id: string;
  productId: {
    _id: string;
    category: string;
    name: string;
    offerPrice: number;
    originalPrice: number;
    mainImage: {
      path: string;
      key: string;
    };
    imageUrls: [
      {
        _id: string;
        path: string;
        key: string;
      }
    ];
    totalRating: number;
    ratingCount: number;
  };
  offerPercentage: number;
}
