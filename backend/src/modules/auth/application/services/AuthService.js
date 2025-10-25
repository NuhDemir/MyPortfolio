import { User } from "../../domain/entities/User.js";

export class AuthService {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async login({ identity, password }) {
    const user = await this.userRepository.findByIdentity(identity);

    if (!user) {
      throw new Error("Kullanıcı bulunamadı veya bilgiler hatalı.");
    }

    const isLocked = user.lockUntil && user.lockUntil > Date.now();
    if (isLocked) {
      throw new Error("Hesabınız geçici olarak kilitlendi. Lütfen daha sonra deneyin.");
    }

    const isMatch = await this.passwordHasher.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Kullanıcı adı veya şifre yanlış.");
    }

    const token = this.tokenService.sign({ id: user.id });

    return this.formatAuthResponse(user, token);
  }

  async registerAdmin({ username, email, password }) {
    const existingUser = await this.userRepository.findByIdentity(username);
    if (existingUser) {
      throw new Error("Kullanıcı adı zaten mevcut.");
    }

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error("Email adresi zaten kayıtlı.");
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const createdUser = await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const token = this.tokenService.sign({ id: createdUser.id });
    return this.formatAuthResponse(createdUser, token);
  }

  formatAuthResponse(user, token) {
    return {
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    };
  }
}

export const createAuthService = ({ userRepository, passwordHasher, tokenService }) =>
  new AuthService({ userRepository, passwordHasher, tokenService });

export default AuthService;
