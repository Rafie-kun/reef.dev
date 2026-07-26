import { getSession } from '@/lib/auth';

export async function GET() {
  const authenticated = await getSession();
  return Response.json({ authenticated });
}
