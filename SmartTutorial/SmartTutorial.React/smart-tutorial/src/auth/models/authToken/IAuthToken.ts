export interface IRefreshToken {
    username: string;
    tokenString: string;
    expireAt: string;
}

export interface IAuthToken {
    accessToken: string;
    refreshToken: IRefreshToken;
}

export interface ISendRefreshToken {
    refreshToken: string | null;
}