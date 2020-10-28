export interface OrderModel {
  _id: string;
  productId: string;
  userId: string;
  name: string;
  seller: string;
  price: number;
  quantity: number;
  imageUrl: string;
  deliveryDate: Date;
}
