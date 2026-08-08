// Minecraft Crafting Engine & Creative Inventory System

const CREATIVE_ITEMS = [
  // 🧱 Building Blocks
  { id: 'i-log', name: 'Oak Log', cat: 'blocks', icon: 'i-log' },
  { id: 'i-planks', name: 'Oak Planks', cat: 'blocks', icon: 'i-planks' },
  { id: 'i-dirt', name: 'Dirt Block', cat: 'blocks', icon: 'i-dirt' },
  { id: 'i-grass', name: 'Grass Block', cat: 'blocks', icon: 'i-grass' },
  { id: 'i-tnt', name: 'TNT Block', cat: 'blocks', icon: 'i-tnt' },
  { id: 'i-diamond-block', name: 'Diamond Block', cat: 'blocks', icon: 'i-diamond-block' },
  { id: 'i-obsidian', name: 'Obsidian', cat: 'blocks', icon: 'i-obsidian' },
  { id: 'i-creeper', name: 'Creeper Head', cat: 'blocks', icon: 'i-creeper' },

  // ⚔️ Tools & Gear
  { id: 'i-sword', name: 'Diamond Sword', cat: 'tools', icon: 'i-sword' },
  { id: 'i-pick', name: 'Diamond Pickaxe', cat: 'tools', icon: 'i-pick' },
  { id: 'i-totem', name: 'Totem of Undying', cat: 'tools', icon: 'i-totem' },
  { id: 'i-gapple', name: 'Golden Apple', cat: 'tools', icon: 'i-gapple' },
  { id: 'i-enchant', name: 'Enchanted Book', cat: 'tools', icon: 'i-enchant' },
  { id: 'i-clock', name: 'Clock', cat: 'tools', icon: 'i-clock' },
  { id: 'i-map', name: 'Map', cat: 'tools', icon: 'i-map' },
  { id: 'i-door', name: 'Oak Sign', cat: 'tools', icon: 'i-door' },

  // 🎒 Items & Ingredients
  { id: 'i-diamond', name: 'Diamond', cat: 'items', icon: 'i-diamond' },
  { id: 'i-gold', name: 'Gold Ingot', cat: 'items', icon: 'i-gold' },
  { id: 'i-iron', name: 'Iron Ingot', cat: 'items', icon: 'i-iron' },
  { id: 'i-coal', name: 'Coal', cat: 'items', icon: 'i-coal' },
  { id: 'i-stick', name: 'Stick', cat: 'items', icon: 'i-stick' },
  { id: 'i-apple', name: 'Apple', cat: 'items', icon: 'i-apple' },
  { id: 'i-star', name: 'Nether Star', cat: 'items', icon: 'i-star' },
  { id: 'i-book', name: 'Book', cat: 'items', icon: 'i-book' },
  { id: 'i-pen', name: 'Paper', cat: 'items', icon: 'i-pen' },
  { id: 'i-wolf', name: 'Tamed Wolf', cat: 'items', icon: 'i-wolf' },
  { id: 'i-xp', name: 'Experience Bottle', cat: 'items', icon: 'i-xp' },
  { id: 'i-arrow', name: 'Arrow', cat: 'items', icon: 'i-arrow' },
  { id: 'i-palette', name: 'Potion', cat: 'items', icon: 'i-palette' },
  { id: 'i-redbull', name: 'Red Bull Energy', cat: 'items', icon: 'i-redbull' },

  // 🔴 Redstone & Functional
  { id: 'i-crafting-table', name: 'Crafting Table', cat: 'redstone', icon: 'i-crafting-table' },
  { id: 'i-furnace', name: 'Furnace', cat: 'redstone', icon: 'i-furnace' },
  { id: 'i-chest', name: 'Chest', cat: 'redstone', icon: 'i-chest' },
  { id: 'i-anvil', name: 'Anvil', cat: 'redstone', icon: 'i-anvil' },
  { id: 'i-torch', name: 'Torch', cat: 'redstone', icon: 'i-torch' },
  { id: 'i-beacon', name: 'Beacon', cat: 'redstone', icon: 'i-beacon' },
  { id: 'i-music-note', name: 'Note Block', cat: 'redstone', icon: 'i-music-note' },
  { id: 'i-sound', name: 'Jukebox', cat: 'redstone', icon: 'i-sound' },
  { id: 'i-screen', name: 'Comparator', cat: 'redstone', icon: 'i-screen' },
  { id: 'i-redstone', name: 'Redstone Dust', cat: 'redstone', icon: 'i-redstone' }
];

// Official & Custom Minecraft Recipes
// Patterns represent 3x3 grid slots 0..8
const RECIPES = [
  // 1. Oak Log -> 4 Oak Planks
  {
    name: '4 Oak Planks',
    result: 'i-planks',
    count: 4,
    pattern: [
      null, null, null,
      null, 'i-log', null,
      null, null, null
    ]
  },
  // 2. 2 Planks vertical -> 4 Sticks
  {
    name: '4 Sticks',
    result: 'i-stick',
    count: 4,
    pattern: [
      null, 'i-planks', null,
      null, 'i-planks', null,
      null, null, null
    ]
  },
  // 3. 4 Planks 2x2 -> Crafting Table
  {
    name: 'Crafting Table',
    result: 'i-crafting-table',
    count: 1,
    pattern: [
      'i-planks', 'i-planks', null,
      'i-planks', 'i-planks', null,
      null, null, null
    ]
  },
  // 4. 8 Dirt -> Furnace
  {
    name: 'Furnace',
    result: 'i-furnace',
    count: 1,
    pattern: [
      'i-dirt', 'i-dirt', 'i-dirt',
      'i-dirt', null,     'i-dirt',
      'i-dirt', 'i-dirt', 'i-dirt'
    ]
  },
  // 5. 8 Planks -> Chest
  {
    name: 'Chest',
    result: 'i-chest',
    count: 1,
    pattern: [
      'i-planks', 'i-planks', 'i-planks',
      'i-planks', null,       'i-planks',
      'i-planks', 'i-planks', 'i-planks'
    ]
  },
  // 6. Diamond Sword
  {
    name: 'Diamond Sword',
    result: 'i-sword',
    count: 1,
    pattern: [
      null, 'i-diamond', null,
      null, 'i-diamond', null,
      null, 'i-stick',   null
    ]
  },
  // 7. Diamond Pickaxe
  {
    name: 'Diamond Pickaxe',
    result: 'i-pick',
    count: 1,
    pattern: [
      'i-diamond', 'i-diamond', 'i-diamond',
      null,        'i-stick',   null,
      null,        'i-stick',   null
    ]
  },
  // 8. Golden Apple
  {
    name: 'Golden Apple',
    result: 'i-gapple',
    count: 1,
    pattern: [
      'i-gold', 'i-gold', 'i-gold',
      'i-gold', 'i-apple', 'i-gold',
      'i-gold', 'i-gold', 'i-gold'
    ]
  },
  // 9. Torch
  {
    name: '4 Torches',
    result: 'i-torch',
    count: 4,
    pattern: [
      null, 'i-coal', null,
      null, 'i-stick', null,
      null, null, null
    ]
  },
  // 10. TNT Block
  {
    name: 'TNT Block',
    result: 'i-tnt',
    count: 1,
    pattern: [
      'i-coal', 'i-dirt', 'i-coal',
      'i-dirt', 'i-coal', 'i-dirt',
      'i-coal', 'i-dirt', 'i-coal'
    ]
  },
  // 11. Diamond Block
  {
    name: 'Diamond Block',
    result: 'i-diamond-block',
    count: 1,
    pattern: [
      'i-diamond', 'i-diamond', 'i-diamond',
      'i-diamond', 'i-diamond', 'i-diamond',
      'i-diamond', 'i-diamond', 'i-diamond'
    ]
  },
  // 12. 9 Diamonds from Diamond Block
  {
    name: '9 Diamonds',
    result: 'i-diamond',
    count: 9,
    pattern: [
      null, null, null,
      null, 'i-diamond-block', null,
      null, null, null
    ]
  },
  // 13. Beacon
  {
    name: 'Beacon',
    result: 'i-beacon',
    count: 1,
    pattern: [
      'i-obsidian', 'i-obsidian', 'i-obsidian',
      'i-obsidian', 'i-star',     'i-obsidian',
      'i-obsidian', 'i-obsidian', 'i-obsidian'
    ]
  },
  // 14. Anvil
  {
    name: 'Anvil',
    result: 'i-anvil',
    count: 1,
    pattern: [
      'i-iron', 'i-iron', 'i-iron',
      null,     'i-iron', null,
      'i-iron', 'i-iron', 'i-iron'
    ]
  },
  // 15. Book
  {
    name: 'Book',
    result: 'i-book',
    count: 1,
    pattern: [
      'i-pen', 'i-pen', null,
      'i-pen', null,    null,
      null,    null,    null
    ]
  },
  // 16. Enchanted Book
  {
    name: 'Enchanted Book',
    result: 'i-enchant',
    count: 1,
    pattern: [
      null,       'i-diamond',  null,
      'i-diamond', 'i-book',     'i-diamond',
      null,       'i-obsidian', null
    ]
  },
  // 17. Creeper Head
  {
    name: 'Creeper Head',
    result: 'i-creeper',
    count: 1,
    pattern: [
      'i-grass', 'i-grass', 'i-grass',
      'i-grass', 'i-tnt',   'i-grass',
      'i-grass', 'i-grass', 'i-grass'
    ]
  },
  // 18. Tamed Wolf
  {
    name: 'Tamed Wolf',
    result: 'i-wolf',
    count: 1,
    pattern: [
      null, 'i-stick', null,
      null, 'i-apple', null,
      null, 'i-diamond', null
    ]
  },
  // 19. Totem of Undying
  {
    name: 'Totem of Undying',
    result: 'i-totem',
    count: 1,
    pattern: [
      'i-gold', 'i-star',   'i-gold',
      'i-gold', 'i-gapple', 'i-gold',
      null,     'i-gold',   null
    ]
  },
  // 20. Clock
  {
    name: 'Clock',
    result: 'i-clock',
    count: 1,
    pattern: [
      null,     'i-gold',     null,
      'i-gold', 'i-redstone', 'i-gold',
      null,     'i-gold',     null
    ]
  },
  // 21. Map
  {
    name: 'Map',
    result: 'i-map',
    count: 1,
    pattern: [
      'i-pen', 'i-pen',      'i-pen',
      'i-pen', 'i-redstone', 'i-pen',
      'i-pen', 'i-pen',      'i-pen'
    ]
  },
  // 22. Oak Sign
  {
    name: 'Oak Sign',
    result: 'i-door',
    count: 3,
    pattern: [
      'i-planks', 'i-planks', 'i-planks',
      'i-planks', 'i-planks', 'i-planks',
      null,       'i-stick',  null
    ]
  },
  // 23. Note Block
  {
    name: 'Note Block',
    result: 'i-music-note',
    count: 1,
    pattern: [
      'i-planks', 'i-planks',   'i-planks',
      'i-planks', 'i-redstone', 'i-planks',
      'i-planks', 'i-planks',   'i-planks'
    ]
  },
  // 24. Jukebox
  {
    name: 'Jukebox',
    result: 'i-sound',
    count: 1,
    pattern: [
      'i-planks', 'i-planks',  'i-planks',
      'i-planks', 'i-diamond', 'i-planks',
      'i-planks', 'i-planks',  'i-planks'
    ]
  },
  // 25. Experience Bottle
  {
    name: 'Experience Bottle',
    result: 'i-xp',
    count: 1,
    pattern: [
      null, 'i-star',    null,
      null, 'i-palette', null,
      null, null,        null
    ]
  },
  // 26. Arrow
  {
    name: '4 Arrows',
    result: 'i-arrow',
    count: 4,
    pattern: [
      null, 'i-coal',  null,
      null, 'i-stick', null,
      null, 'i-pen',   null
    ]
  },
  // 27. Potion
  {
    name: 'Potion',
    result: 'i-palette',
    count: 1,
    pattern: [
      null, 'i-redstone', null,
      null, 'i-apple',    null,
      null, null,         null
    ]
  },
  // 28. Red Bull Energy
  {
    name: 'Red Bull Energy',
    result: 'i-redbull',
    count: 1,
    pattern: [
      'i-gold', 'i-redstone', 'i-gold',
      null,     'i-palette',  null,
      null,     null,         null
    ]
  },
  // 29. Comparator
  {
    name: 'Comparator',
    result: 'i-screen',
    count: 1,
    pattern: [
      null,       'i-torch',    null,
      'i-torch',  'i-redstone', 'i-torch',
      'i-iron',   'i-iron',     'i-iron'
    ]
  }
];

let currentGrid = Array(9).fill(null);
let selectedPaletteItem = null;

function initCraftingEngine() {
  const gridEl = document.getElementById('craft-grid');
  const paletteEl = document.getElementById('creative-palette-items');
  const searchInput = document.getElementById('creative-search');
  const resultSlot = document.getElementById('craft-result-slot');
  const resultName = document.getElementById('craft-result-name');
  const clearBtn = document.getElementById('clear-craft-grid');
  
  if (!gridEl) return;

  // Render Creative Inventory
  renderPalette('all');

  // Creative Tabs Event Listeners
  document.querySelectorAll('.creative-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.creative-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      renderPalette(cat, searchInput?.value || '');
      if (typeof playClick === 'function') playClick('click');
    });
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.creative-tab.active')?.dataset.cat || 'all';
      renderPalette(activeTab, e.target.value.trim());
    });
  }

  // Grid slot click listeners
  gridEl.querySelectorAll('.craft-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const idx = parseInt(slot.dataset.slot);
      if (selectedPaletteItem) {
        if (currentGrid[idx] === selectedPaletteItem.id) {
          // If clicking slot that already has same item, toggle clear
          currentGrid[idx] = null;
        } else {
          currentGrid[idx] = selectedPaletteItem.id;
        }
      } else {
        // Toggle/remove item
        currentGrid[idx] = null;
      }
      updateGridUI();
      checkRecipes();
      if (typeof playClick === 'function') playClick('click');
    });

    slot.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const idx = parseInt(slot.dataset.slot);
      currentGrid[idx] = null;
      updateGridUI();
      checkRecipes();
      if (typeof playClick === 'function') playClick('click');
    });
  });

  // Clear Grid
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentGrid = Array(9).fill(null);
      selectedPaletteItem = null;
      document.querySelectorAll('.palette-item').forEach(b => b.classList.remove('selected'));
      updateGridUI();
      checkRecipes();
      if (typeof playClick === 'function') playClick('click');
    });
  }

  // Craft Result Slot Click
  if (resultSlot) {
    resultSlot.addEventListener('click', () => {
      const recipe = findMatchingRecipe();
      if (recipe) {
        // Craft success!
        triggerCraftParticles(resultSlot);
        if (typeof playClick === 'function') playClick('xp');
        
        const craftedName = recipe.name;

        // Clear grid ingredients
        currentGrid = Array(9).fill(null);
        updateGridUI();
        checkRecipes();

        // Feedback in UI
        const statusTip = document.getElementById('craft-status-tip') || document.querySelector('#creative-palette-items + div span');
        if (statusTip) {
          statusTip.textContent = `★ Successfully crafted ${craftedName}!`;
          statusTip.style.color = 'var(--gold)';
          setTimeout(() => {
            statusTip.textContent = 'Click item to select, then click grid slot!';
            statusTip.style.color = '#888';
          }, 3500);
        }

        if (typeof toast === 'function') {
          toast(`Crafted ${craftedName}!`);
        }
      }
    });
  }
}

function renderPalette(category, query = '') {
  const paletteEl = document.getElementById('creative-palette-items');
  if (!paletteEl) return;

  // Combine standard CREATIVE_ITEMS with dynamic items from siteData
  let allItems = [...CREATIVE_ITEMS];
  if (typeof siteData !== 'undefined' && Array.isArray(siteData.inventory)) {
    siteData.inventory.forEach((inv, idx) => {
      if (inv && (inv.title || inv.name)) {
        const title = inv.title || inv.name;
        const customId = 'custom-' + idx;
        const icon = inv.icon || 'i-diamond';
        if (!allItems.some(x => x.name.toLowerCase() === title.toLowerCase())) {
          allItems.push({
            id: customId,
            name: title,
            cat: inv.cat || 'items',
            icon: icon
          });
        }
      }
    });
  }

  if (category === 'recipes') {
    // Render Recipe Book with search query support
    const filteredRecipes = RECIPES.filter(r => !query || r.name.toLowerCase().includes(query.toLowerCase()));
    if (filteredRecipes.length === 0) {
      paletteEl.innerHTML = `<div style="padding:16px;color:#aaa;font-family:'VT323',monospace;font-size:18px;width:100%;text-align:center;">No recipes found matching "${query}".</div>`;
      return;
    }

    paletteEl.innerHTML = filteredRecipes.map((r) => {
      const origIdx = RECIPES.indexOf(r);
      return `
        <button class="recipe-book-item mc-btn" type="button" data-recipe-idx="${origIdx}" style="padding:6px 10px;font-size:7px;display:inline-flex;align-items:center;gap:8px;background:#222;border:1px solid #555;" data-tip="Click to load recipe pattern">
          <span class="mc-item ${r.result} inline"></span>
          <span>${r.name}</span>
        </button>
      `;
    }).join('');

    paletteEl.querySelectorAll('.recipe-book-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.recipeIdx);
        if (RECIPES[idx]) {
          currentGrid = [...RECIPES[idx].pattern];
          updateGridUI();
          checkRecipes();
          if (typeof playClick === 'function') playClick('click');
        }
      });
    });
    return;
  }

  const items = allItems.filter(item => {
    const matchCat = (category === 'all' || item.cat === category);
    const matchQuery = !query || item.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  if (items.length === 0) {
    paletteEl.innerHTML = `<div style="padding:16px;color:#aaa;font-family:'VT323',monospace;font-size:18px;width:100%;text-align:center;">No items found matching filter.</div>`;
    return;
  }

  paletteEl.innerHTML = items.map(item => `
    <button class="palette-item mc-btn ${selectedPaletteItem?.id === item.id ? 'selected' : ''}" type="button" data-id="${item.id}" data-icon="${item.icon}" data-name="${item.name}" style="padding:6px 10px;font-size:7px;display:inline-flex;align-items:center;gap:6px;min-width:110px;" data-tip="${item.name}">
      <span class="mc-item ${item.icon} inline"></span>
      <span>${item.name}</span>
    </button>
  `).join('');

  paletteEl.querySelectorAll('.palette-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = allItems.find(i => i.id === id);
      if (!item) return;

      selectedPaletteItem = item;
      paletteEl.querySelectorAll('.palette-item').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Place 1 of this item into the first empty slot in crafting grid
      const emptyIdx = currentGrid.indexOf(null);
      if (emptyIdx !== -1) {
        currentGrid[emptyIdx] = item.id;
      } else {
        // If grid is full, replace slot 0
        currentGrid[0] = item.id;
      }

      updateGridUI();
      checkRecipes();

      if (typeof playClick === 'function') playClick('click');
    });
  });
}

function updateGridUI() {
  const gridEl = document.getElementById('craft-grid');
  if (!gridEl) return;

  gridEl.querySelectorAll('.craft-slot').forEach(slot => {
    const idx = parseInt(slot.dataset.slot);
    const itemId = currentGrid[idx];
    if (itemId) {
      const item = CREATIVE_ITEMS.find(i => i.id === itemId);
      const icon = item ? item.icon : itemId;
      slot.innerHTML = `<span class="mc-item ${icon}"></span>`;
      slot.style.background = '#2a2a2a';
    } else {
      slot.innerHTML = '';
      slot.style.background = 'var(--slot)';
    }
  });
}

function getBoundingShape(grid) {
  let minR = 3, maxR = -1, minC = 3, maxC = -1;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const item = grid[r * 3 + c];
      if (item) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      }
    }
  }
  if (maxR === -1) return null;
  const height = maxR - minR + 1;
  const width = maxC - minC + 1;
  const shape = [];
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      shape.push(grid[r * 3 + c]);
    }
  }
  return { width, height, shape };
}

function findMatchingRecipe() {
  // 1. Exact pattern match
  const exact = RECIPES.find(r => r.pattern.every((patItem, i) => patItem === currentGrid[i]));
  if (exact) return exact;

  // 2. Shift-invariant shape match (allows placing recipes anywhere in 3x3 grid)
  const gridShape = getBoundingShape(currentGrid);
  if (!gridShape) return null;

  return RECIPES.find(r => {
    const recShape = getBoundingShape(r.pattern);
    if (!recShape) return false;
    if (gridShape.width !== recShape.width || gridShape.height !== recShape.height) return false;
    return gridShape.shape.every((item, i) => item === recShape.shape[i]);
  });
}

function checkRecipes() {
  const resultIcon = document.getElementById('craft-result-icon');
  const resultName = document.getElementById('craft-result-name');
  const resultSlot = document.getElementById('craft-result-slot');
  
  const recipe = findMatchingRecipe();
  if (recipe) {
    if (resultIcon) resultIcon.className = `mc-item ${recipe.result}`;
    if (resultName) resultName.textContent = recipe.name + (recipe.count > 1 ? ` (x${recipe.count})` : '');
    if (resultSlot) {
      resultSlot.style.borderColor = 'var(--gold)';
      resultSlot.style.boxShadow = '0 0 15px rgba(255,241,107,0.5)';
    }
  } else {
    if (resultIcon) resultIcon.className = '';
    if (resultName) resultName.textContent = '';
    if (resultSlot) {
      resultSlot.style.borderColor = '#333 #888 #888 #333';
      resultSlot.style.boxShadow = 'none';
    }
  }
}

function triggerCraftParticles(targetEl) {
  const rect = targetEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.left = centerX + 'px';
    p.style.top = centerY + 'px';
    p.style.width = '6px';
    p.style.height = '6px';
    p.style.background = i % 2 === 0 ? 'var(--gold)' : 'var(--xp)';
    p.style.border = '1px solid #000';
    p.style.zIndex = '9999';
    p.style.pointerEvents = 'none';
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    document.body.appendChild(p);

    let opacity = 1;
    let x = centerX;
    let y = centerY;

    const anim = setInterval(() => {
      x += vx;
      y += vy;
      opacity -= 0.05;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.opacity = opacity;

      if (opacity <= 0) {
        clearInterval(anim);
        p.remove();
      }
    }, 20);
  }
}

window.giveItemToGrid = function(queryItem, qty) {
  const q = String(queryItem || 'diamond').toLowerCase().replace('minecraft:', '').replace('i-', '');
  let found = CREATIVE_ITEMS.find(i => i.id.includes(q) || i.name.toLowerCase().includes(q) || i.icon.includes(q));
  if (!found) {
    // fallback map
    const map = {
      sword: 'i-sword', pickaxe: 'i-pick', pick: 'i-pick', diamond: 'i-diamond',
      wood: 'i-log', log: 'i-log', plank: 'i-planks', dirt: 'i-dirt', grass: 'i-grass',
      tnt: 'i-tnt', gold: 'i-gold', iron: 'i-iron', coal: 'i-coal', stick: 'i-stick',
      apple: 'i-apple', gapple: 'i-gapple', star: 'i-star', wolf: 'i-wolf',
      totem: 'i-totem', beacon: 'i-beacon', book: 'i-book', furnace: 'i-furnace'
    };
    const mapped = map[q] || 'i-diamond';
    found = CREATIVE_ITEMS.find(i => i.id === mapped) || CREATIVE_ITEMS[0];
  }

  // Fill first empty grid slot
  const emptyIdx = currentGrid.indexOf(null);
  if (emptyIdx !== -1) {
    currentGrid[emptyIdx] = found.id;
  } else {
    currentGrid[0] = found.id;
  }
  updateGridUI();
  checkRecipes();

  const slot = document.getElementById('craft-result-slot');
  if (slot) triggerCraftParticles(slot);
  if (typeof playClick === 'function') playClick('xp');
  return found;
};

// Auto init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCraftingEngine);
} else {
  initCraftingEngine();
}
