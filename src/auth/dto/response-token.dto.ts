export class TokenResponseDto {
    accessToken: string;
    tokenType: string;
    expiresIn: number;

    constructor(token: string, expiresIn: number) {
        this.accessToken = token;
        this.tokenType = 'Bearer';
        this.expiresIn = expiresIn;
    }
}

