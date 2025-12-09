// Простая авторизация без сервера — для демонстрации.
// Пароли хранятся в localStorage в зашифрованном виде (симпл хеш), но это ДЕМО — не используйте в проде.
import { save, load, STORAGE_USERS } from './storage.js';

function simpleHash(s) {
  // очень простой фингерпринт, не криптографический
  let h = 0; for (let i=0;i<s.length;i++){ h = (h<<5)-h + s.charCodeAt(i); h |= 0; } return h.toString(36);
}

export class Auth {
  constructor() {
    const users = load(STORAGE_USERS) || [];
    this.users = new Map(users.map(u=>[u.email, u]));
    this.current = null;
  }

  register({email, password}) {
    email = String(email).toLowerCase();
    if (this.users.has(email)) throw new Error('Пользователь уже зарегистрирован');
    const u = { email, passwordHash: simpleHash(password), createdAt: Date.now() };
    this.users.set(email, u);
    this._persist();
    return u;
  }

  login({email, password}) {
    email = String(email).toLowerCase();
    const u = this.users.get(email);
    if (!u) throw new Error('Пользователь не найден');
    if (u.passwordHash !== simpleHash(password)) throw new Error('Неверный пароль');
    this.current = u;
    return u;
  }

  logout() { this.current = null; }

  _persist() {
    save(STORAGE_USERS, Array.from(this.users.values()));
  }

  getCurrent() { return this.current; }
}
