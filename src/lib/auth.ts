import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const COOKIE_NAME = 'mc-session';

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function createSession(): Promise<string> {
  return jwt.sign({ role: 'admin', ts: Date.now() }, JWT_SECRET, { expiresIn: '24h' });
}

export async function getSession(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return false;
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function setSessionCookie(token: string) {
  return {
    'Set-Cookie': `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`,
  };
}

export function clearSessionCookie() {
  return {
    'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`,
  };
}
