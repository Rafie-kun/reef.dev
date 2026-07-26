import { getCMS, updateLibrary } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const { library } = getCMS();
  return Response.json({ library });
}

export async function PUT(req: Request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { library } = await req.json();
  const data = updateLibrary(library);
  return Response.json({ library: data.library });
}
