export interface ITokenData {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface ITokenPayload {
    _id: string;
}
