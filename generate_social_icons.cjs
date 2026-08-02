const fs = require('fs');

// We will generate standalone SVG files in assets/mc/ that render pixel art crisply (shape-rendering="crispEdges")
// AND CSS rules mapping background-image to /assets/mc/<name>.svg or .png

const icons = {
  discord: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <!-- Background / Outline -->
      <rect x="2" y="3" width="12" height="10" fill="#5865F2"/>
      <rect x="3" y="2" width="10" height="12" fill="#5865F2"/>
      <rect x="1" y="4" width="14" height="8" fill="#5865F2"/>
      <!-- Dark border outline -->
      <rect x="2" y="2" width="12" height="1" fill="#3c45a5"/>
      <rect x="2" y="13" width="12" height="1" fill="#3c45a5"/>
      <rect x="1" y="3" width="1" height="10" fill="#3c45a5"/>
      <rect x="14" y="3" width="1" height="10" fill="#3c45a5"/>
      <!-- Controller/Clyde face cutout -->
      <rect x="4" y="5" width="2" height="3" fill="#ffffff"/>
      <rect x="10" y="5" width="2" height="3" fill="#ffffff"/>
      <rect x="4" y="6" width="8" height="3" fill="#ffffff"/>
      <rect x="5" y="9" width="6" height="2" fill="#ffffff"/>
      <!-- Eyes -->
      <rect x="5" y="6" width="2" height="2" fill="#5865F2"/>
      <rect x="9" y="6" width="2" height="2" fill="#5865F2"/>
      <!-- Pupils -->
      <rect x="5" y="6" width="1" height="1" fill="#1e2354"/>
      <rect x="9" y="6" width="1" height="1" fill="#1e2354"/>
      <!-- Bottom ears/handles -->
      <rect x="3" y="10" width="2" height="2" fill="#ffffff"/>
      <rect x="11" y="10" width="2" height="2" fill="#ffffff"/>
      <rect x="3" y="11" width="1" height="1" fill="#5865F2"/>
      <rect x="12" y="11" width="1" height="1" fill="#5865F2"/>
    </svg>
  `,
  github: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <!-- Dark background -->
      <rect x="3" y="2" width="10" height="12" fill="#181717"/>
      <rect x="2" y="3" width="12" height="10" fill="#181717"/>
      <rect x="4" y="1" width="8" height="14" fill="#181717"/>
      <!-- Ears -->
      <rect x="3" y="1" width="2" height="2" fill="#181717"/>
      <rect x="11" y="1" width="2" height="2" fill="#181717"/>
      <!-- White Octocat Face/Silhouette -->
      <rect x="4" y="5" width="8" height="6" fill="#f0f6fc"/>
      <rect x="5" y="4" width="6" height="8" fill="#f0f6fc"/>
      <!-- Eyes & nose -->
      <rect x="5" y="6" width="2" height="2" fill="#181717"/>
      <rect x="9" y="6" width="2" height="2" fill="#181717"/>
      <rect x="7" y="8" width="2" height="1" fill="#181717"/>
      <!-- Inner ear shadows -->
      <rect x="3" y="2" width="1" height="1" fill="#f0f6fc"/>
      <rect x="12" y="2" width="1" height="1" fill="#f0f6fc"/>
      <!-- Tentacle bottom -->
      <rect x="5" y="11" width="1" height="2" fill="#181717"/>
      <rect x="10" y="11" width="1" height="2" fill="#181717"/>
      <rect x="7" y="10" width="2" height="3" fill="#181717"/>
    </svg>
  `,
  email: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <!-- Paper envelope base -->
      <rect x="1" y="3" width="14" height="10" fill="#e8d8b8"/>
      <rect x="2" y="2" width="12" height="12" fill="#e8d8b8"/>
      <!-- Outline -->
      <rect x="1" y="2" width="14" height="1" fill="#5c4428"/>
      <rect x="1" y="13" width="14" height="1" fill="#5c4428"/>
      <rect x="1" y="2" width="1" height="12" fill="#5c4428"/>
      <rect x="14" y="2" width="1" height="12" fill="#5c4428"/>
      <!-- Envelope fold lines -->
      <rect x="2" y="3" width="2" height="1" fill="#b8a078"/>
      <rect x="12" y="3" width="2" height="1" fill="#b8a078"/>
      <rect x="3" y="4" width="2" height="1" fill="#b8a078"/>
      <rect x="11" y="4" width="2" height="1" fill="#b8a078"/>
      <rect x="4" y="5" width="2" height="1" fill="#b8a078"/>
      <rect x="10" y="5" width="2" height="1" fill="#b8a078"/>
      <rect x="5" y="6" width="6" height="1" fill="#b8a078"/>
      <!-- Red Minecraft Wax Seal -->
      <rect x="7" y="7" width="2" height="2" fill="#bd1e1e"/>
      <rect x="6" y="8" width="4" height="2" fill="#bd1e1e"/>
      <rect x="7" y="10" width="2" height="1" fill="#8f1111"/>
    </svg>
  `,
  instagram: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <!-- Gradient / Pixel Art Camera Body -->
      <rect x="2" y="2" width="12" height="12" fill="#e1306c"/>
      <rect x="3" y="1" width="10" height="14" fill="#fd1d1d"/>
      <rect x="1" y="3" width="14" height="10" fill="#833ab4"/>
      <!-- Outer gold frame -->
      <rect x="2" y="1" width="12" height="1" fill="#fccc63"/>
      <rect x="1" y="2" width="1" height="12" fill="#fccc63"/>
      <!-- Lens outer ring -->
      <rect x="5" y="5" width="6" height="6" fill="#ffffff"/>
      <rect x="6" y="4" width="4" height="8" fill="#ffffff"/>
      <rect x="4" y="6" width="8" height="4" fill="#ffffff"/>
      <!-- Lens inner black -->
      <rect x="6" y="6" width="4" height="4" fill="#181818"/>
      <!-- Lens blue reflection -->
      <rect x="6" y="6" width="2" height="2" fill="#3897f0"/>
      <!-- Flash dot -->
      <rect x="11" y="3" width="2" height="2" fill="#fccc63"/>
    </svg>
  `,
  twitter: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <!-- Sky blue background feather item -->
      <rect x="2" y="2" width="12" height="12" fill="#1da1f2"/>
      <rect x="3" y="1" width="10" height="14" fill="#1da1f2"/>
      <rect x="1" y="3" width="14" height="10" fill="#1da1f2"/>
      <!-- Dark blue outline -->
      <rect x="2" y="1" width="12" height="1" fill="#0d6dae"/>
      <rect x="1" y="2" width="1" height="12" fill="#0d6dae"/>
      <rect x="14" y="2" width="1" height="12" fill="#0d6dae"/>
      <rect x="2" y="14" width="12" height="1" fill="#0d6dae"/>
      <!-- White Bird Silhouette -->
      <rect x="9" y="4" width="3" height="2" fill="#ffffff"/>
      <rect x="8" y="5" width="5" height="2" fill="#ffffff"/>
      <rect x="6" y="6" width="8" height="2" fill="#ffffff"/>
      <rect x="4" y="7" width="9" height="3" fill="#ffffff"/>
      <rect x="5" y="10" width="6" height="2" fill="#ffffff"/>
      <rect x="7" y="12" width="3" height="1" fill="#ffffff"/>
      <!-- Beak -->
      <rect x="13" y="5" width="2" height="1" fill="#ffffff"/>
    </svg>
  `,
  steam: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <!-- Dark metal gear / piston background -->
      <rect x="2" y="2" width="12" height="12" fill="#171a21"/>
      <rect x="3" y="1" width="10" height="14" fill="#171a21"/>
      <rect x="1" y="3" width="14" height="10" fill="#171a21"/>
      <!-- Metallic outline -->
      <rect x="2" y="1" width="12" height="1" fill="#66c0f4"/>
      <rect x="1" y="2" width="1" height="12" fill="#66c0f4"/>
      <!-- Steam logo piston & crank arm -->
      <rect x="9" y="3" width="4" height="4" fill="#c7d5e0"/>
      <rect x="10" y="4" width="2" height="2" fill="#171a21"/>
      <rect x="5" y="7" width="6" height="3" fill="#c7d5e0"/>
      <rect x="3" y="9" width="5" height="5" fill="#c7d5e0"/>
      <rect x="4" y="10" width="3" height="3" fill="#171a21"/>
      <rect x="5" y="11" width="1" height="1" fill="#66c0f4"/>
    </svg>
  `,
  redbull: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      <!-- RedBull Can Outline & Pull Tab -->
      <rect x="5" y="1" width="6" height="1" fill="#d0d0d0"/>
      <rect x="7" y="0" width="2" height="1" fill="#a0a0a0"/>
      <rect x="4" y="2" width="8" height="13" fill="#00186b"/>
      <!-- Metallic Silver Top Half -->
      <rect x="5" y="2" width="6" height="5" fill="#e0e0e0"/>
      <rect x="4" y="3" width="8" height="3" fill="#f0f0f0"/>
      <!-- Blue Diagonal Stripes -->
      <rect x="4" y="2" width="3" height="4" fill="#00186b"/>
      <rect x="9" y="4" width="3" height="4" fill="#00186b"/>
      <rect x="4" y="8" width="8" height="6" fill="#00186b"/>
      <rect x="7" y="7" width="5" height="5" fill="#e0e0e0"/>
      <!-- Yellow Sun Circle in Middle -->
      <rect x="6" y="6" width="4" height="4" fill="#ffd700"/>
      <rect x="7" y="5" width="2" height="6" fill="#ffd700"/>
      <!-- Red Bulls Charging Silhouette -->
      <rect x="4" y="7" width="3" height="2" fill="#cc0000"/>
      <rect x="9" y="7" width="3" height="2" fill="#cc0000"/>
      <rect x="3" y="6" width="2" height="1" fill="#cc0000"/>
      <rect x="11" y="6" width="2" height="1" fill="#cc0000"/>
      <!-- Can Bottom Rim Shading -->
      <rect x="4" y="14" width="8" height="1" fill="#808080"/>
      <rect x="5" y="15" width="6" height="1" fill="#505050"/>
      <!-- Shading highlight line on left edge -->
      <rect x="4" y="2" width="1" height="12" fill="#ffffff"/>
    </svg>
  `
};

fs.mkdirSync('assets/mc', { recursive: true });
for (const [name, svg] of Object.entries(icons)) {
  fs.writeFileSync(`assets/mc/${name}.svg`, svg.trim());
  console.log(`Created assets/mc/${name}.svg`);
}
