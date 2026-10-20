import { LitematicLoader, ThreeStructureRenderer, loadDefaultPackResources } from '@mattzh72/lodestone';
import { mat4 } from 'gl-matrix';
import * as THREE from 'three';
import { Litematic } from '@kleppe/litematic-reader'; 
import './style.css';

// Словарь перевода блоков
const blockTranslations = {
  "stone": "Камень", "smooth_stone": "Гладкий камень", "smooth_stone_slab": "Плита из гладкого камня",
  "smooth_stone_stairs": "Ступени из гладкого камня", "cobblestone": "Булыжник", "cobblestone_slab": "Плита из булыжника",
  "cobblestone_stairs": "Ступени из булыжника", "stone_bricks": "Каменный кирпич", "stone_brick_slab": "Плита из каменного кирпича",
  "stone_brick_stairs": "Ступени из каменного кирпича", "dirt": "Земля", "dirt_path": "Тропинка", "grass_block": "Травяной блок",
  "coarse_dirt": "Каменистая земля", "rooted_dirt": "Земля с корнями", "podzol": "Подзол", "mycelium": "Мицелий",
  "sand": "Песок", "red_sand": "Красный песок", "gravel": "Гравий", "clay": "Глина",
  "oak_log": "Дубовое бревно", "oak_planks": "Дубовые доски", "oak_slab": "Дубовая плита",
  "oak_stairs": "Дубовые ступени", "oak_fence": "Дубовый забор", "oak_fence_gate": "Дубовая калитка",
  "oak_door": "Дубовая дверь", "oak_trapdoor": "Дубовый люк", "oak_sapling": "Дубовый саженец",
  "oak_leaves": "Дубовая листва", "oak_wall_sign": "Дубовая настенная табличка",
  "spruce_log": "Еловое бревно", "spruce_planks": "Еловые доски", "birch_log": "Берёзовое бревно",
  "birch_planks": "Берёзовые доски", "jungle_log": "Бревно тропического дерева", "acacia_log": "Акациевое бревно",
  "dark_oak_log": "Бревно тёмного дуба", "mangrove_log": "Мангровое бревно", "cherry_log": "Вишнёвое бревно",
  "crimson_stem": "Багровый стебель", "warped_stem": "Искажённый стебель",
  "glass": "Стекло", "glass_pane": "Стеклянная панель", "tinted_glass": "Тонированное стекло",
  "white_stained_glass": "Белое стекло", "black_stained_glass": "Чёрное стекло",
  "iron_block": "Железный блок", "iron_bars": "Железные прутья", "iron_trapdoor": "Железный люк",
  "iron_door": "Железная дверь", "gold_block": "Золотой блок", "diamond_block": "Алмазный блок",
  "emerald_block": "Изумрудный блок", "netherite_block": "Незеритовый блок", "copper_block": "Медный блок",
  "hopper": "Воронка", "chest": "Сундук", "trapped_chest": "Сундук-ловушка", "ender_chest": "Эндер-сундук",
  "barrel": "Бочка", "furnace": "Печь", "blast_furnace": "Плавильная печь", "smoker": "Коптильня",
  "crafting_table": "Верстак", "cartography_table": "Стол картографа", "fletching_table": "Стол лучника",
  "smithing_table": "Кузнечный стол", "stonecutter": "Камнерез", "loom": "Ткацкий станок",
  "grindstone": "Точильный камень", "anvil": "Наковальня", "enchanting_table": "Стол зачарований",
  "brewing_stand": "Варочная стойка", "cauldron": "Котёл", "bookshelf": "Книжная полка",
  "chiseled_bookshelf": "Резная книжная полка", "lectern": "Кафедра", "composter": "Компостер",
  "water": "Вода", "lava": "Лава", "torch": "Факел", "wall_torch": "Настенный факел",
  "soul_torch": "Факел душ", "lantern": "Фонарь", "soul_lantern": "Фонарь душ", "campfire": "Костёр",
  "soul_campfire": "Костёр душ", "redstone_wire": "Редстоун", "redstone_torch": "Редстоуновый факел",
  "redstone_block": "Блок редстоуна", "repeater": "Повторитель", "comparator": "Компаратор",
  "observer": "Наблюдатель", "piston": "Поршень", "sticky_piston": "Липкий поршень",
  "dispenser": "Раздатчик", "dropper": "Выбрасыватель", "hopper_minecart": "Вагонетка с воронкой",
  "lever": "Рычаг", "stone_button": "Каменная кнопка", "oak_button": "Дубовая кнопка",
  "oak_pressure_plate": "Дубовая нажимная плита", "stone_pressure_plate": "Каменная нажимная плита",
  "tripwire_hook": "Крюк", "tripwire": "Растяжка", "target": "Мишень", "daylight_detector": "Датчик дневного света",
  "note_block": "Нотный блок", "jukebox": "Проигрыватель", "tnt": "Динамит", "slime_block": "Блок слизи",
  "honey_block": "Блок мёда", "scaffolding": "Строительные леса", "ladder": "Лестница",
  "cobweb": "Паутина", "cactus": "Кактус", "sugar_cane": "Сахарный тростник", "bamboo": "Бамбук",
  "kelp": "Ламинария", "sea_pickle": "Морской огурец", "lily_pad": "Кувшинка", "vine": "Лианы",
  "short_grass": "Короткая трава", "tall_grass": "Высокая трава", "fern": "Папоротник",
  "dead_bush": "Сухой куст", "dandelion": "Одуванчик", "poppy": "Мак", "blue_orchid": "Синяя орхидея",
  "soul_sand": "Песок душ", "soul_soil": "Почва душ", "magma_block": "Магмовый блок",
  "obsidian": "Обсидиан", "crying_obsidian": "Плачущий обсидиан", "netherrack": "Адский камень",
  "nether_bricks": "Адский кирпич", "glowstone": "Светокамень", "shroomlight": "Грибной свет",
  "basalt": "Базальт", "blackstone": "Чернокамень", "white_wool": "Белая шерсть",
  "black_wool": "Чёрная шерсть", "red_wool": "Красная шерсть", "blue_wool": "Синяя шерсть",
  "green_wool": "Зелёная шерсть", "mud_bricks": "Грязевые кирпичи", "packed_mud": "Утрамбованная грязь",
  "deepslate": "Глубинный сланец", "cobbled_deepslate": "Булыжный глубинный сланец",
  "polished_deepslate": "Полированный глубинный сланец", "tuff": "Туф", "calcite": "Кальцит",
  "amethyst_block": "Аметистовый блок", "white_bed": "Белая кровать", "red_bed": "Красная кровать",
  "lightning_rod": "Громоотвод", "snow_block": "Блок снега", "ice": "Лёд", "packed_ice": "Плотный лёд",
  "blue_ice": "Синий лёд", "moss_block": "Блок мха", "moss_carpet": "Мшистый ковёр",
  "azalea_leaves": "Листва азалии", "flowering_azalea_leaves": "Цветущая листва азалии"
};

// Советы дня
const advices = [
  "Никогда не копайте строго под себя!",
  "Криперы боятся кошек. Заведите себе питомца.",
  "Ведро воды — лучшее оружие против падения в лаву.",
  "Чтобы найти алмазы, копайте на высоте Y = -58.",
  "Всегда берите с собой блок печи и верстак в шахту.",
  "Используйте кровать, чтобы установить точку возрождения.",
  "Эндермены злятся, если на них смотреть. Не смотрите им в глаза!",
  "Ферма железа из деревни — это самый простой способ добыть железо.",
  "Не забудьте про факелы: монстры не спавнятся при хорошем освещении.",
  "Золотую броню лучше не носить в Незере — пиглины атакуют."
];

document.addEventListener('DOMContentLoaded', () => {
  // ===== 0. СЛУЧАЙНЫЙ ШРИФТ И ПЕЧАТЬ =====
  const fonts = [
    '"Russo One", sans-serif',
    '"Play", sans-serif',
    '"Montserrat", sans-serif',
    '"Unbounded", sans-serif'
  ];
  const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
  const fontName = randomFont.split(',')[0].replace(/"/g, '');

  document.documentElement.style.setProperty('--font-title', randomFont);
  
  const heroTitle = document.querySelector('.hero h1');
  const sidebarLogo = document.querySelector('.sidebar-logo');
  const logoFull = document.querySelector('.logo-full');

  if (heroTitle) heroTitle.style.setProperty('font-family', randomFont, 'important');
  if (sidebarLogo) sidebarLogo.style.setProperty('font-family', randomFont, 'important');
  if (logoFull) logoFull.style.setProperty('font-family', randomFont, 'important');

  let hasTyped = false; 

  document.fonts.load(`1em "${fontName}"`).then(() => {
    const heroTextEl = document.getElementById('hero-typewriter');
    if (heroTextEl && !hasTyped) {
      hasTyped = true; 
      heroTextEl.textContent = ''; 
      setTimeout(() => {
        let i = 0;
        const text = 'VibeGuide';
        function typeHero() {
          if (i < text.length) {
            heroTextEl.textContent += text.charAt(i);
            i++;
            setTimeout(typeHero, 150);
          }
        }
        typeHero();
      }, 100);
    }
  }).catch(() => {
    const heroTextEl = document.getElementById('hero-typewriter');
    if (heroTextEl && !hasTyped) {
      hasTyped = true; 
      heroTextEl.textContent = ''; 
      let i = 0;
      const text = 'VibeGuide';
      function typeHero() {
        if (i < text.length) {
          heroTextEl.textContent += text.charAt(i);
          i++;
          setTimeout(typeHero, 150);
        }
      }
      typeHero();
    }
  });

  // ===== 0.5. ИНСТРУМЕНТЫ (КАЛЬКУЛЯТОРЫ И СОВЕТ) =====
  
  // 1. Совет дня
  const adviceEl = document.getElementById('daily-advice');
  if (adviceEl) {
    const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
    adviceEl.textContent = `"${randomAdvice}"`;
  }

  // 2. Калькулятор крафтов
  const craftBlocksInput = document.getElementById('craft-input-blocks');
  const craftSelectType = document.getElementById('craft-select-type');
  const craftResultEl = document.getElementById('craft-result');

  function updateCraft() {
    if (!craftBlocksInput || !craftResultEl) return;
    const blocks = parseInt(craftBlocksInput.value) || 0;
    const resources = blocks * 9;
    const type = craftSelectType.value;
    
    let unit = 'шт.';
    if (type === 'diamond') unit = 'алмазов';
    if (type === 'iron') unit = 'слитков железа';
    if (type === 'gold') unit = 'слитков золота';
    if (type === 'emerald') unit = 'изумрудов';

    craftResultEl.innerHTML = `Вам понадобится: <strong>${resources}</strong> ${unit}.`;
  }

  if (craftBlocksInput) craftBlocksInput.addEventListener('input', updateCraft);
  if (craftSelectType) craftSelectType.addEventListener('change', updateCraft);
  updateCraft();

  // 3. Калькулятор урона
  const dmgMaterial = document.getElementById('dmg-select-material');
  const dmgSharpness = document.getElementById('dmg-select-sharpness');
  const dmgResultEl = document.getElementById('dmg-result');

  function updateDamage() {
    if (!dmgMaterial || !dmgResultEl) return;
    
    const baseDamage = parseFloat(dmgMaterial.value) || 0;
    const sharpnessLevel = parseInt(dmgSharpness.value) || 0;
    const sharpnessBonus = sharpnessLevel * 1.25;
    const totalDamage = baseDamage + sharpnessBonus;

    dmgResultEl.innerHTML = `Итоговый урон: <strong>${totalDamage.toFixed(1)}</strong> ед.`;
  }

  if (dmgMaterial) dmgMaterial.addEventListener('change', updateDamage);
  if (dmgSharpness) dmgSharpness.addEventListener('change', updateDamage);
  updateDamage();

  // ===== 4. КОНСТРУКТОР БИЛДОВ (БРОНЯ + ОРУЖИЕ + ИНСТРУМЕНТЫ) =====
  const buildPurpose = document.getElementById('build-purpose');
  const armorMaterial = document.getElementById('armor-material');
  const weaponSelect = document.getElementById('weapon-select');

  const slotHelmet = document.getElementById('slot-helmet');
  const slotChest = document.getElementById('slot-chest');
  const slotLegs = document.getElementById('slot-legs');
  const slotBoots = document.getElementById('slot-boots');
  const slotWeapon = document.getElementById('slot-weapon');

  const iconHelmet = document.getElementById('icon-helmet');
  const iconChest = document.getElementById('icon-chest');
  const iconLegs = document.getElementById('icon-legs');
  const iconBoots = document.getElementById('icon-boots');
  const iconWeapon = document.getElementById('icon-weapon');

  const statArmorVal = document.getElementById('stat-armor-val');
  const statDmgRed = document.getElementById('stat-dmg-red');
  const statDurability = document.getElementById('stat-durability');
  const statThorns = document.getElementById('stat-thorns');
  const statWeaponDmg = document.getElementById('stat-weapon-dmg');

  // База билдов для БРОНИ
  const builds = {
    universal: {
      helmet: ['Защита IV', 'Подводное дыхание III', 'Подводник I', 'Прочность III', 'Починка'],
      chest: ['Защита IV', 'Шипы III', 'Прочность III', 'Починка'],
      legs: ['Защита IV', 'Проворство III', 'Прочность III', 'Починка'],
      boots: ['Защита IV', 'Невесомость IV', 'Подводная ходьба III', 'Прочность III', 'Починка']
    },
    nether: {
      helmet: ['Огнестойкость IV', 'Подводное дыхание III', 'Прочность III', 'Починка'],
      chest: ['Огнестойкость IV', 'Шипы III', 'Прочность III', 'Починка'],
      legs: ['Огнестойкость IV', 'Проворство III', 'Прочность III', 'Починка'],
      boots: ['Огнестойкость IV', 'Невесомость IV', 'Скорость души III', 'Прочность III', 'Починка']
    },
    end: {
      helmet: ['Защита от снарядов IV', 'Подводное дыхание III', 'Прочность III', 'Починка'],
      chest: ['Защита от снарядов IV', 'Шипы III', 'Прочность III', 'Починка'],
      legs: ['Защита от снарядов IV', 'Проворство III', 'Прочность III', 'Починка'],
      boots: ['Защита от снарядов IV', 'Невесомость IV', 'Прочность III', 'Починка']
    },
    blast: {
      helmet: ['Взрывоустойчивость IV', 'Подводное дыхание III', 'Прочность III', 'Починка'],
      chest: ['Взрывоустойчивость IV', 'Шипы III', 'Прочность III', 'Починка'],
      legs: ['Взрывоустойчивость IV', 'Проворство III', 'Прочность III', 'Починка'],
      boots: ['Взрывоустойчивость IV', 'Невесомость IV', 'Прочность III', 'Починка']
    }
  };

  // База чар для ОРУЖИЯ И ИНСТРУМЕНТОВ
  const weaponEnchants = {
    sword: ['Острота V', 'Разящий клинок III', 'Добыча III', 'Прочность III', 'Починка'],
    axe: ['Острота V', 'Эффективность V', 'Прочность III', 'Починка'],
    bow: ['Сила V', 'Отдача II', 'Пламя I', 'Бесконечность', 'Прочность III', 'Починка'],
    crossbow: ['Быстрая перезарядка III', 'Пробивание IV', 'Мультивыстрел', 'Прочность III', 'Починка'],
    trident: ['Верность III', 'Пронизывание V', 'Тягун III', 'Прочность III', 'Починка'],
    pickaxe: ['Эффективность V', 'Удача III (или Шелк)', 'Прочность III', 'Починка'],
    shovel: ['Эффективность V', 'Удача III', 'Прочность III', 'Починка'],
    hoe: ['Эффективность V', 'Удача III', 'Прочность III', 'Починка'],
    fishing_rod: ['Приманка III', 'Удача моря III', 'Прочность III', 'Починка']
  };

  // Данные о броне (прочность + базовая защита)
  const armorData = {
    leather: { helmet: 55, chest: 80, legs: 75, boots: 65, armor: 1 },
    chainmail: { helmet: 165, chest: 240, legs: 225, boots: 195, armor: 2 },
    gold: { helmet: 77, chest: 112, legs: 105, boots: 91, armor: 2 },
    iron: { helmet: 165, chest: 240, legs: 225, boots: 195, armor: 2 },
    diamond: { helmet: 363, chest: 528, legs: 495, boots: 429, armor: 3 },
    netherite: { helmet: 407, chest: 592, legs: 555, boots: 481, armor: 3 }
  };

  // Иконки оружия (ссылки на вики)
  const weaponIcons = {
    sword: 'Netherite_Sword',
    axe: 'Netherite_Axe',
    bow: 'Bow',
    crossbow: 'Crossbow',
    trident: 'Trident',
    pickaxe: 'Netherite_Pickaxe',
    shovel: 'Netherite_Shovel',
    hoe: 'Netherite_Hoe',
    fishing_rod: 'Fishing_Rod'
  };

  // Урон/Эффект оружия (для текста статов)
  const weaponStatsText = {
    sword: '7.0 (Урон)',
    axe: '9.0 (Урон)',
    bow: '9.0 (Урон)',
    crossbow: '11.0 (Урон)',
    trident: '8.0 (Урон)',
    pickaxe: '5.0 (Урон)',
    shovel: '4.5 (Урон)',
    hoe: '1.0 (Урон)',
    fishing_rod: 'Нет урона'
  };

  function fillSlot(selectEl, enchants) {
    selectEl.innerHTML = '';
    enchants.forEach(ench => {
      const option = document.createElement('option');
      option.value = ench;
      option.textContent = ench;
      option.selected = true;
      selectEl.appendChild(option);
    });
    selectEl.disabled = true;
  }

  function updateIcons() {
    const mat = armorMaterial.value;
    
    const matMap = {
      gold: 'Golden',
      iron: 'Iron',
      diamond: 'Diamond',
      netherite: 'Netherite'
    };

    let prefix = matMap[mat];

    if (mat === 'leather') {
      iconHelmet.src = `https://minecraft.wiki/images/Invicon_Leather_Cap.png`;
      iconChest.src = `https://minecraft.wiki/images/Invicon_Leather_Tunic.png`;
      iconLegs.src = `https://minecraft.wiki/images/Invicon_Leather_Pants.png`;
      iconBoots.src = `https://minecraft.wiki/images/Invicon_Leather_Boots.png`;
    } else if (mat === 'chainmail') {
      iconHelmet.src = `https://minecraft.wiki/images/Invicon_Chainmail_Helmet.png`;
      iconChest.src = `https://minecraft.wiki/images/Invicon_Chainmail_Chestplate.png`;
      iconLegs.src = `https://minecraft.wiki/images/Invicon_Chainmail_Leggings.png`;
      iconBoots.src = `https://minecraft.wiki/images/Invicon_Chainmail_Boots.png`;
    } else {
      iconHelmet.src = `https://minecraft.wiki/images/Invicon_${prefix}_Helmet.png`;
      iconChest.src = `https://minecraft.wiki/images/Invicon_${prefix}_Chestplate.png`;
      iconLegs.src = `https://minecraft.wiki/images/Invicon_${prefix}_Leggings.png`;
      iconBoots.src = `https://minecraft.wiki/images/Invicon_${prefix}_Boots.png`;
    }

    const wep = weaponSelect.value;
    iconWeapon.src = `https://minecraft.wiki/images/Invicon_${weaponIcons[wep]}.png`;
  }

  function updateStats() {
    const purpose = buildPurpose.value;
    const mat = armorMaterial.value;
    const wep = weaponSelect.value;
    const data = armorData[mat];

    fillSlot(slotHelmet, builds[purpose].helmet);
    fillSlot(slotChest, builds[purpose].chest);
    fillSlot(slotLegs, builds[purpose].legs);
    fillSlot(slotBoots, builds[purpose].boots);
    fillSlot(slotWeapon, weaponEnchants[wep]);

    updateIcons();

    const baseArmor = data.armor * 4; 
    
    let dmgRed = 0;
    let extraText = '';

    if (builds[purpose].helmet.includes('Защита IV')) {
      dmgRed = Math.min(80, baseArmor * 4);
    } else {
      dmgRed = Math.min(80, baseArmor * 3); 
      if (builds[purpose].helmet.includes('Огнестойкость')) extraText = ' (Огонь)';
      if (builds[purpose].helmet.includes('Взрывоустойчивость')) extraText = ' (Взрывы)';
      if (builds[purpose].helmet.includes('Защита от снарядов')) extraText = ' (Снаряды)';
    }

    statArmorVal.textContent = baseArmor;
    statDmgRed.textContent = `${dmgRed}%${extraText}`;

    let totalDur = (data.helmet + data.chest + data.legs + data.boots) * 1.75;
    statDurability.textContent = Math.floor(totalDur);

    const hasThorns = builds[purpose].chest.includes('Шипы III');
    statThorns.textContent = hasThorns ? '45%' : '0%';

    statWeaponDmg.textContent = weaponStatsText[wep];
  }

  if (buildPurpose) {
    buildPurpose.addEventListener('change', updateStats);
    armorMaterial.addEventListener('change', updateStats);
    weaponSelect.addEventListener('change', updateStats);
    updateStats(); 
  }

  // ===== 5. ПЕРЕКЛЮЧАТЕЛЬ ТЕМ =====
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ===== 1. МОДАЛКА 3D СХЕМ =====
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const closeBtn = document.getElementById('closeModalBtn');
  const viewer = document.getElementById('viewer');
  const blockInfoPanel = document.getElementById('block-info');
  const hintEl = modal.querySelector('.modal-hint');
  const downloadLink = document.getElementById('downloadLink');

  let animationFrameId = null;
  let currentRenderer = null;
  let keysPressed = {}; 

  function translateBlock(blockId) {
    const cleanId = blockId.replace('minecraft:', '');
    if (blockTranslations[cleanId]) return blockTranslations[cleanId];
    let fallback = cleanId.replace(/_/g, ' ');
    return fallback.charAt(0).toUpperCase() + fallback.slice(1);
  }

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', async () => {
      const name = card.dataset.name || 'Схема';
      const schemaFile = card.dataset.schema || '';
      
      modalTitle.textContent = 'VibeGuide 3D: ' + name;
      modal.classList.add('open');
      
      downloadLink.href = `/schemas/${schemaFile}`;
      downloadLink.setAttribute('download', schemaFile);
      downloadLink.style.opacity = '0.5'; 
      downloadLink.textContent = 'Скачать схему (.litematic)';

      viewer.innerHTML = '<div style="color: var(--muted); font-family: var(--font-mono); display:flex; align-items:center; justify-content:center; height:100%;">Загрузка 3D модели...</div>';
      blockInfoPanel.innerHTML = '<h4>Считаем блоки...</h4>';

      try {
        const response = await fetch(`/schemas/${schemaFile}`);
        if (!response.ok) throw new Error('Файл схемы не найден');
        const buffer = await response.arrayBuffer();
        
        downloadLink.style.opacity = '1';

        const structure = LitematicLoader.load(new Uint8Array(buffer));

        try {
          const litematicReader = new Litematic(buffer);
          const palette = await litematicReader.getBlockPaletteWithCount();
          
          let html = '<h4>Необходимые блоки</h4><ul class="block-info-list">';
          let totalBlocks = 0;
          
          const sortedBlocks = Object.entries(palette)
            .filter(([id]) => !id.includes('air'))
            .sort((a, b) => b[1].count - a[1].count);

          for (const [blockId, data] of sortedBlocks) {
            const ruName = translateBlock(blockId);
            totalBlocks += data.count;
            html += `<li><span>${ruName}</span><strong>${data.count}</strong></li>`;
          }
          html += '</ul>';
          html += `<div style="margin-top: 12px; font-size: 12px; color: var(--muted); text-align: right;">Всего: <strong style="color: var(--green);">${totalBlocks}</strong></div>`;
          
          blockInfoPanel.innerHTML = html;
        } catch (e) {
          blockInfoPanel.innerHTML = '<h4>Ошибка</h4><p>Не удалось прочитать список блоков.</p>';
        }

        const baseUrl = 'https://unpkg.com/@mattzh72/lodestone@0.6.0/assets/default-pack/';
        const { resources } = await loadDefaultPackResources({ baseUrl });

        viewer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        viewer.appendChild(canvas);
        
        const width = viewer.clientWidth;
        const height = viewer.clientHeight;
        canvas.width = width;
        canvas.height = height;

        const renderer = new ThreeStructureRenderer(canvas, structure, resources);
        renderer.setViewport(0, 0, width, height);
        
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(15, 15, 15); 
        
        let yaw = -Math.PI / 4;
        let pitch = -Math.PI / 6;

        hintEl.innerHTML = 'WASD — полет | Мышка — обзор | <strong>Кликни по 3D, чтобы начать</strong>';

        canvas.addEventListener('click', () => canvas.requestPointerLock());

        document.addEventListener('pointerlockchange', () => {
          if (document.pointerLockElement === canvas) {
            hintEl.innerHTML = 'WASD — полет | Мышка — обзор | <strong>Esc — вернуть курсор</strong>';
          } else {
            hintEl.innerHTML = 'WASD — полет | Мышка — обзор | <strong>Кликни по 3D, чтобы начать</strong>';
          }
        });

        document.addEventListener('mousemove', (e) => {
          if (document.pointerLockElement === canvas) {
            yaw -= e.movementX * 0.002;
            pitch -= e.movementY * 0.002;
            pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch));
          }
        });

        const onKeyDown = (e) => keysPressed[e.code] = true;
        const onKeyUp = (e) => keysPressed[e.code] = false;
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        const viewMatrix = mat4.create();
        const clock = new THREE.Clock();

        function animate() {
          animationFrameId = requestAnimationFrame(animate);
          
          const delta = clock.getDelta();
          const speed = 20 * delta; 

          const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
          const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, yaw, 0, 'YXZ'));

          if (keysPressed['KeyW'] || keysPressed['ArrowUp']) camera.position.addScaledVector(forward, speed);
          if (keysPressed['KeyS'] || keysPressed['ArrowDown']) camera.position.addScaledVector(forward, -speed);
          if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) camera.position.addScaledVector(right, -speed);
          if (keysPressed['KeyD'] || keysPressed['ArrowRight']) camera.position.addScaledVector(right, speed);
          
          if (keysPressed['Space']) camera.position.y += speed;
          if (keysPressed['ShiftLeft'] || keysPressed['ShiftRight']) camera.position.y -= speed;

          camera.rotation.set(pitch, yaw, 0, 'YXZ');
          camera.updateMatrixWorld();

          mat4.copy(viewMatrix, camera.matrixWorldInverse.elements);
          renderer.drawStructure(viewMatrix);
        }
        
        animate(); 

        currentRenderer = renderer;
        
        currentRenderer.cleanupListeners = () => {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp);
          if (document.pointerLockElement) document.exitPointerLock();
        };

      } catch (error) {
        console.error(error);
        viewer.innerHTML = `<div style="color: #e74c3c; padding: 20px; text-align:center;">Ошибка: ${error.message}</div>`;
        downloadLink.style.opacity = '0.5';
        downloadLink.textContent = 'Файл не найден';
        downloadLink.removeAttribute('href');
      }
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    viewer.innerHTML = '';
    blockInfoPanel.innerHTML = '';
    
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (currentRenderer && currentRenderer.cleanupListeners) currentRenderer.cleanupListeners();
    
    currentRenderer = null;
    keysPressed = {};
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ===== 2. АНИМАЦИИ И ОСТАЛЬНОЕ =====
  // Убираем анимацию исчезновения, чтобы не было дерганий при скролле
  const animatedElements = document.querySelectorAll('.hero-tag, .hero p, .hero-stats, .btn-row, .section-header, .grid, .ench-grid, .guide-accordion, .tools-grid, .armor-builder');
  
  animatedElements.forEach(el => el.classList.add('fade-up'));

  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // <-- ВАЖНО: отключаем слежку после появления
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  const guideToggles = document.querySelectorAll('.guide-toggle');
  guideToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const parentItem = this.closest('.guide-item');
      const content = parentItem.querySelector('.guide-content');
      if (parentItem.classList.contains('active')) {
        parentItem.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        document.querySelectorAll('.guide-item').forEach(item => {
          item.classList.remove('active');
          item.querySelector('.guide-content').style.maxHeight = null;
        });
        parentItem.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  const sections = document.querySelectorAll('section');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
    });
    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });
});