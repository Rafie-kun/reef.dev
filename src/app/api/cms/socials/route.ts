import { getCMS, updateSocials } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const { socials } = getCMS();
  return Response.json({ socials });
}

export async function PUT(req: Request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { socials } = await req.json();
  const data = updateSocials(socials);
  return Response.json({ socials: data.socials });
}
