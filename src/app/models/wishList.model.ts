export interface WishListModel {
  _id: string;
  productId: {
    _id: string;
    name: string;
    offerPrice: number;
    originalPrice: number;
    imageUrls: [
      {
        _id: string;
        path: string;
      }
    ];
    totalRating: number;
    ratingCount: number;
  };
  offerPercentage: number;
}
