export default async function handler(req, res) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') { res.status(200).setHeader(CORS).end(); return; }

  const { steamid, appid } = req.query;
  if (!steamid || !appid) {
    res.status(400).setHeader(CORS).json({ error: 'Missing steamid or appid' });
    return;
  }

  const key = process.env.STEAM_API_KEY;
  if (!key) {
    res.status(200).setHeader(CORS).json({ error: 'STEAM_API_KEY not configured' });
    return;
  }

  try {
    const [achRes, gamesRes] = await Promise.all([
      fetch(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?steamid=${steamid}&appid=${appid}&key=${key}&l=en`).catch(()=>null),
      fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?steamid=${steamid}&key=${key}&include_appinfo=true&include_played_free_games=true&appids_filter[0]=${appid}`).catch(()=>null),
    ]);

    let achievements = null, gameInfo = null;

    if (achRes && achRes.ok) {
      const achJson = await achRes.json();
      achievements = achJson?.playerstats?.achievements || null;
    }

    if (gamesRes && gamesRes.ok) {
      const gamesJson = await gamesRes.json();
      const game = gamesJson?.response?.games?.[0];
      if (game) {
        gameInfo = { playtime_forever: game.playtime_forever, playtime_2weeks: game.playtime_2weeks || 0 };
      }
    }

    res.status(200).setHeader(CORS).json({
      steamid,
      appid,
      playtime_hours: gameInfo ? Math.round(gameInfo.playtime_forever / 60) : null,
      playtime_2weeks: gameInfo ? Math.round(gameInfo.playtime_2weeks / 60) : null,
      achievements: achievements ? {
        total: achievements.length,
        earned: achievements.filter(a => a.achieved === 1).length,
        list: achievements.slice(0, 10).map(a => ({ name: a.name, achieved: a.achieved === 1 })),
      } : null,
    });
  } catch (e) {
    res.status(500).setHeader(CORS).json({ error: e.message });
  }
}
