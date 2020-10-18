export interface CartInterface {
  items: [
    {
      _id: string;
      productId: {
        _id: string;
        originalPrice: number;
        offerPrice: number;
        name: string;
        imageUrls: [
          {
            _id: string;
            path: string;
          }
        ];
      };
      seller: string;
      quantity: number;
    }
  ];
  totalPrice: number;
}
export interface MappedCartInterface {
  items: [
    {
      _id: string;
      productId: {
        _id: string;
        originalPrice: number;
        offerPrice: number;
        name: string;
        imageUrls: [
          {
            _id: string;
            path: string;
          }
        ];
      };
      seller: string;
      quantity: number;
      deliveryDate: Date;
      offerPercentage: number;
    }
  ];
  totalPrice: number;
  priceSave: number;
}
