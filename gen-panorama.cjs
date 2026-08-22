// Minecraft-style TWILIGHT panorama v3 — beauty across full height
const fs = require('fs');
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd = mulberry32(777);
const R=(mn,mx)=>Math.floor(rnd()*(mx-mn+1))+mn;
const W=1200,H=675;
const s=[];
s.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges">`);

// ---- twilight sky (brighter) ----
s.push(`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#1a2560"/><stop offset="26%" stop-color="#45307e"/>
<stop offset="50%" stop-color="#8a4f88"/><stop offset="68%" stop-color="#d3705c"/>
<stop offset="84%" stop-color="#ffab58"/><stop offset="100%" stop-color="#ffd98d"/>
</linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#4a6aa8"/><stop offset="100%" stop-color="#25335f"/></linearGradient></defs>`);
s.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);

// ---- stars (full upper half, brighter) ----
for(let i=0;i<130;i++){
  const x=R(0,W),y=R(0,H*0.52),sz=rnd()<.12?3:2,o=(0.35+rnd()*0.65).toFixed(2);
  s.push(`<rect x="${x}" y="${y}" width="${sz}" height="${sz}" fill="#ffffff" opacity="${o}"/>`);
}
for(let i=0;i<14;i++){
  s.push(`<rect x="${R(0,W)}" y="${R(0,H*0.42)}" width="3" height="3" fill="${rnd()<.5?'#aee2ff':'#ffd6f2'}" opacity="${(0.5+rnd()*0.5).toFixed(2)}"/>`);
}

// ---- AURORA BANDS (diagonal, full-width, teal/green/violet) ----
function aurora(yBase,amp,color,op){
  let out='';
  const seg=40;
  for(let x=0;x<W;x+=seg){
    const y=yBase+Math.sin((x/W)*Math.PI*2.2)*amp+R(-10,10);
    const h=R(26,64);
    out+=`<rect x="${x}" y="${y.toFixed(1)}" width="${seg+2}" height="${h}" fill="${color}" opacity="${op}"/>`;
    // sparkle pixels along band
    if(rnd()<.5) out+=`<rect x="${x+R(0,seg)}" y="${(y-h*0.4).toFixed(1)}" width="5" height="5" fill="${color}" opacity="${Math.min(1,op*1.8).toFixed(2)}"/>`;
  }
  return out;
}
s.push(aurora(H*0.16,46,'#54e6c0',0.20));
s.push(aurora(H*0.24,58,'#7be87a',0.16));
s.push(aurora(H*0.11,38,'#9a70ec',0.17));
s.push(aurora(H*0.32,50,'#54c8e6',0.13));

// ---- raised square sun with glow (left-of-center) ----
const ssz=86,sx=W*0.28-ssz/2,sy=Math.round(H*0.36);
[[240,'#ffb54d',.14],[170,'#ffca70',.20],[126,'#ffe394',.32]].forEach(([g,c,o])=>{
  s.push(`<rect x="${sx+ssz/2-g/2}" y="${sy+ssz/2-g/2}" width="${g}" height="${g}" fill="${c}" opacity="${o}"/>`);
});
s.push(`<rect x="${sx}" y="${sy}" width="${ssz}" height="${ssz}" fill="#fff4cd"/>`);
s.push(`<rect x="${sx}" y="${sy}" width="${ssz}" height="${ssz}" fill="none" stroke="#fffdf4" stroke-width="4" opacity=".85"/>`);

// ---- blocky clouds (golden-pink) ----
function cloud(cx,cy,sc,tint){
  let out='';const rows=[[0,3],[1,5],[2,6],[1,4]];
  rows.forEach(([ry,n],ri)=>{for(let i=0;i<n;i++){
    const bx=cx+(i-(n-1)/2)*24*sc+R(-6,6),by=cy+ry*10*sc;
    if(rnd()<.92)out+=`<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${(20*rnd()+9).toFixed(1)}" height="${(9*sc).toFixed(1)}" fill="${tint}"/>`;
  }});
  return out;
}
for(let i=0;i<6;i++) s.push(cloud(R(-40,W-140),R(H*0.22,H*0.44),R(8,13)/10,'rgba(255,206,178,0.8)'));
for(let i=0;i<4;i++) s.push(cloud(R(-40,W-140),R(H*0.14,H*0.26),R(6,9)/10,'rgba(255,236,220,0.62)'));

// ---- mountains (two ridges) ----
function ridge(baseY,minH,maxH,color,stepPx){
  let d=`M0 ${baseY}`,x=0;
  while(x<W){const w=R(2,5)*stepPx,h=R(minH,maxH);
    d+=` L${x} ${baseY-h} L${x+w} ${baseY-h} L${x+w} ${baseY}`;x+=w;}
  d+=` L${W} ${baseY} L${W} ${H} L0 ${H} Z`;
  return `<path d="${d}" fill="${color}"/>`;
}
s.push(ridge(Math.round(H*0.74),50,150,'#4a2c68',26));
s.push(ridge(Math.round(H*0.80),36,110,'#372350',34));

// ---- water strip (bottom ~14%) ----
const wy=Math.round(H*0.845);
s.push(`<rect x="0" y="${wy}" width="${W}" height="${H-wy}" fill="url(#sea)"/>`);
// sun glitter column beneath sun x-center
for(let i=0;i<22;i++){
  const gy=wy+3+i*((H-wy)/22),gw=R(18,64);
  s.push(`<rect x="${sx+ssz/2-gw/2+R(-10,10)}" y="${gy}" width="${gw}" height="3" fill="#ffcf82" opacity="${Math.max(.15,(0.5-i*0.02)).toFixed(2)}"/>`);
}
for(let i=0;i<26;i++) s.push(`<rect x="${R(0,W-90)}" y="${R(wy+3,H-5)}" width="${R(22,78)}" height="3" fill="#93b8ec" opacity="${(0.14+rnd()*0.24).toFixed(2)}"/>`);

// ---- shore islands + trees ----
function grassStrip(x,w,y){
  let out=`<rect x="${x}" y="${y}" width="${w}" height="14" fill="#61ab4d"/>`;
  for(let gx=x;gx<x+w;gx+=16){if(rnd()<.75)out+=`<rect x="${gx}" y="${y-6}" width="16" height="6" fill="#61ab4d"/>`;}
  out+=`<rect x="${x}" y="${y+14}" width="${w}" height="${H-y-14}" fill="#705030"/>`;
  for(let i=0;i<w/38;i++)out+=`<rect x="${x+R(0,w-10)}" y="${y+R(18,H-y-8)}" width="8" height="8" fill="#5c4028"/>`;
  return out;
}
[[-20,320,H*0.80],[250,190,H*0.825],[420,400,H*0.79],[800,420,H*0.815]].forEach(([x,w,lift])=>{s.push(grassStrip(x,w,Math.round(lift)));});

function tree(tx,ty){
  let out='';
  for(let i=0;i<4;i++)out+=`<rect x="${tx}" y="${ty-64+i*16}" width="20" height="16" fill="${i%2?'#5c3a1e':'#6b4423'}"/>`;
  [['#2e6b27',-32,-96,84,16],['#3c8432',-48,-80,116,16],['#4c9c3e',-40,-112,68,32]].forEach(([c,ox,oy,w,h])=>{
    out+=`<rect x="${tx+ox}" y="${ty+oy}" width="${w}" height="${h}" fill="${c}"/>`;
  });
  for(let i=0;i<10;i++)out+=`<rect x="${tx+R(-40,60)}" y="${ty+R(-108,-66)}" width="6" height="6" fill="#66b550" opacity=".8"/>`;
  return out;
}
s.push(tree(120,Math.round(H*0.80)));
s.push(tree(500,Math.round(H*0.79)));
s.push(tree(880,Math.round(H*0.815)));
s.push(tree(1060,Math.round(H*0.815)));

s.push('</svg>');
fs.writeFileSync('assets/mc-panorama.svg', s.join('\n'));
fs.writeFileSync('public/assets/mc-panorama.svg', s.join('\n'));
console.log('panorama v3 written:', s.join('\n').length, 'bytes');
