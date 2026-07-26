export async function GET() {
  try {
    const res = await fetch('https://discord.com/api/v9/users/744808879036170272', {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Discord API error');
    const data = await res.json();
    const avatarExt = data.avatar?.startsWith('a_') ? 'gif' : 'png';
    const avatarUrl = data.avatar
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${avatarExt}`
      : `https://cdn.discordapp.com/embed/avatars/${Number(data.discriminator) % 5}.png`;
    const timestamp = Number((BigInt(data.id) >> BigInt(22)) + BigInt(1420070400000));
    const createdAt = new Date(timestamp).toISOString();
    return Response.json({ username: data.username, globalName: data.global_name, avatarUrl, createdAt });
  } catch {
    return Response.json({ error: 'Failed to fetch Discord profile' }, { status: 500 });
  }
}
