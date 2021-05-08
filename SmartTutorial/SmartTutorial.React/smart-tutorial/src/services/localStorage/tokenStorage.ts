import moment from "moment";

const TOKEN = "token";
const REFRESH_TOKEN = "refresh_token";

const TOKEN_EXPIRE = "tokenExpire";
const REFRESH_TOKEN_EXPIRE = "refreshTokenExpire";

export class TokenStorage {
  static setToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }
  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }
  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }
  static getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }
  static setTokenExpire(tokenExpire: Date): void {
    localStorage.setItem(
      TOKEN_EXPIRE,
      moment(tokenExpire).format("YYYY-M-DD HH:mm:ss")
    );
  }
  static setRefreshTokenExpire(refreshTokenExpire: Date): void {
    localStorage.setItem(
      REFRESH_TOKEN_EXPIRE,
      moment(refreshTokenExpire).format("YYYY-M-DD HH:mm:ss")
    );
  }
  static refreshTokenExpired(): boolean | null {
    const expire: string | null = localStorage.getItem(REFRESH_TOKEN_EXPIRE);
    if (expire) {
      const refreshTokenDate: Date = new Date(expire);
      console.log(
        refreshTokenDate < new Date(moment().format("YYYY-M-DD HH:mm:ss"))
      );
      return refreshTokenDate < new Date(moment().format("YYYY-M-DD HH:mm:ss"));
    }
    return null;
  }
  static clearTokenStorage(withRefresh: boolean): void {
    this.setToken("");
    this.setTokenExpire(new Date(0));
    if (withRefresh) {
      this.setRefreshToken("");
      this.setRefreshTokenExpire(new Date(0));
    }
  }
}
