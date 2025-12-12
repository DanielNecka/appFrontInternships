export interface JwtPayloadModel {
    sub: number;
    login: string;
    role: string;
    iat: number;
    exp: number;
}