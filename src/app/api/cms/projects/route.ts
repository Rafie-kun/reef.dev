import { getCMS, updateProjects } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const { projects } = getCMS();
  return Response.json({ projects });
}

export async function PUT(req: Request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { projects } = await req.json();
  const data = updateProjects(projects);
  return Response.json({ projects: data.projects });
}
