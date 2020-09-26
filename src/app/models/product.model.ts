export interface ProductInterface {
  _id: string;
  name: string;
  currentPrice: number;
  updatedPrice: number;
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
  userId: string;
  createdAt: string;
  updatedAt: string;
}
