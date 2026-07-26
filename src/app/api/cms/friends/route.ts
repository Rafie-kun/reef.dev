import { getCMS, updateFriends } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const { friends } = getCMS();
  return Response.json({ friends });
}

export async function PUT(req: Request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { friends } = await req.json();
  const data = updateFriends(friends);
  return Response.json({ friends: data.friends });
}
