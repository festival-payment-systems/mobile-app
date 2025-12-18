export interface Tokens {
  accessToken: string,
  refreshToken: string,
}

export interface TokenPayload {
  userId: string,
  tokenId: string,
  type: 'ACCESS' | 'REFRESH',
  issuedAt: number,
  expiresAt: number,
}
