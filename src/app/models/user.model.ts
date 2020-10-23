export interface UserInterface {
  message: string;
  userData: {
    name: string;
    email: string;
    companyName: string;
    products: [];
    totalRating: number;
    ratings: [];
    wishList: [
      {
        _id: string;
        productId: string;
      }
    ];
  };
  token: string;
  expireTime: Date;
}
export class User {
  public userData: {
    name: string;
    email: string;
    companyName: string;
    products: [];
    totalRating: number;
    ratings: [];
    wishList: [
      {
        _id: string;
        productId: string;
      }
    ];
  };
  private readonly _token: string;
  private readonly expireTime: Date;
  constructor(
    userData: {
      name: string;
      email: string;
      companyName: string;
      products: [];
      totalRating: number;
      ratings: [];
      wishList: [
        {
          _id: string;
          productId: string;
        }
      ];
    },
    _token: string,
    expireTime: Date
  ) {
    this.userData = userData;
    this._token = _token;
    this.expireTime = expireTime;
  }
  get token() {
    if (!this._token || new Date() > this.expireTime) {
      return null;
    } else {
      return this._token;
    }
  }
}
