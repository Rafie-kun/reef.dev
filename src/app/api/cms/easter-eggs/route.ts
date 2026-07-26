import { getCMS, updateEasterEggs } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const { easterEggs } = getCMS();
  return Response.json({ easterEggs });
}

export async function PUT(req: Request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { easterEggs } = await req.json();
  const data = updateEasterEggs(easterEggs);
  return Response.json({ easterEggs: data.easterEggs });
}
