export interface UserInterface {
  message: string;
  userData: {
    name: string;
    email: string;
    companyName: string;
    products: [];
    totalRating: number;
    ratings: [];
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
