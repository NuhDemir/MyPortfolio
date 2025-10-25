import jwt from "jsonwebtoken";

export class JwtTokenService {
  constructor({ secret, expiresIn = "1h" }) {
    if (!secret) {
      throw new Error("JWT secret must be provided");
    }
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

export default JwtTokenService;
