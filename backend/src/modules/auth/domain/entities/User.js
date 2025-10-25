export class User {
  constructor({
    id,
    username,
    email,
    password,
    role = "user",
    profile = {},
    preferences = {},
    lastLogin,
    isActive = true,
    lockUntil,
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.profile = profile;
    this.preferences = preferences;
    this.lastLogin = lastLogin;
    this.isActive = isActive;
    this.lockUntil = lockUntil;
  }

  static fromPersistence(model) {
    return new User({
      id: model._id?.toString?.() ?? model.id,
      username: model.username,
      email: model.email,
      password: model.password,
      role: model.role,
      profile: model.profile,
      preferences: model.preferences,
      lastLogin: model.lastLogin,
      isActive: model.isActive,
      lockUntil: model.lockUntil,
    });
  }
}

export default User;
