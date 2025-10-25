import bcrypt from "bcryptjs";

export class PasswordHasher {
  constructor({ saltRounds = 10 } = {}) {
    this.saltRounds = saltRounds;
  }

  async hash(plainText) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(plainText, salt);
  }

  async compare(plainText, hashed) {
    return bcrypt.compare(plainText, hashed);
  }
}

export default PasswordHasher;
