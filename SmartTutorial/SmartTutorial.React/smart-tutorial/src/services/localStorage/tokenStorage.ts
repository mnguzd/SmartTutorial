import moment from "moment";

const REFRESH_TOKEN = "refresh_token";

const REFRESH_TOKEN_EXPIRE = "refreshTokenExpire";

export class TokenStorage {

  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
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
      return refreshTokenDate < new Date(moment().format("YYYY-M-DD HH:mm:ss"));
    }
    return null;
  }

  static clearTokenStorage(): void {
      this.setRefreshToken("");
      this.setRefreshTokenExpire(new Date(0));
  }
}
