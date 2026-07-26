import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const valid = await verifyPassword(password);
  if (!valid) {
    return Response.json({ success: false, error: 'Invalid password' });
  }
  const token = await createSession();
  const cookieHeader = setSessionCookie(token);
  return Response.json({ success: true }, { headers: cookieHeader });
}
