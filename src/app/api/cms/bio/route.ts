import { getCMS, updateBio, updateEmail } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const { bio, email } = getCMS();
  return Response.json({ bio, email });
}

export async function PUT(req: Request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { bio, email } = await req.json();
  let data = getCMS();
  if (typeof bio === 'string') data = updateBio(bio);
  if (typeof email === 'string') data = updateEmail(email);
  return Response.json({ bio: data.bio, email: data.email });
}
