export async function GET() {
  try {
    const res = await fetch('https://api.lanyard.rest/v1/users/744808879036170272', {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Lanyard API error');
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Failed to fetch presence data' }, { status: 500 });
  }
}
