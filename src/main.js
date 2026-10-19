import { LitematicLoader, ThreeStructureRenderer, loadDefaultPackResources } from '@mattzh72/lodestone';
import { mat4 } from 'gl-matrix';
import * as THREE from 'three';
import { Litematic } from '@kleppe/litematic-reader'; 
import './style.css';

// Огромный словарь перевода блоков
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

document.addEventListener('DOMContentLoaded', () => {
  // ===== 1. МОДАЛКА 3D СХЕМ =====
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const closeBtn = document.getElementById('closeModalBtn');
  const viewer = document.getElementById('viewer');
  const blockInfoPanel = document.getElementById('block-info');
  const hintEl = modal.querySelector('.modal-hint');
  const downloadLink = document.getElementById('downloadLink'); // Кнопка скачивания

  let animationFrameId = null;
  let currentRenderer = null;
  let keysPressed = {}; 

  function translateBlock(blockId) {
    const cleanId = blockId.replace('minecraft:', '');
    if (blockTranslations[cleanId]) return blockTranslations[cleanId];
    
    // Умный фолбэк, если блока нет в словаре
    let fallback = cleanId.replace(/_/g, ' ');
    return fallback.charAt(0).toUpperCase() + fallback.slice(1);
  }

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', async () => {
      const name = card.dataset.name || 'Схема';
      const schemaFile = card.dataset.schema || '';
      
      modalTitle.textContent = 'VibeGuide 3D: ' + name;
      modal.classList.add('open');
      
      // === Настраиваем кнопку скачивания ===
      downloadLink.href = `/schemas/${schemaFile}`;
      downloadLink.setAttribute('download', schemaFile);
      downloadLink.style.opacity = '0.5'; // Делаем полупрозрачной, пока идет загрузка
      downloadLink.textContent = 'Скачать схему (.litematic)';

      viewer.innerHTML = '<div style="color: var(--muted); font-family: var(--font-mono); display:flex; align-items:center; justify-content:center; height:100%;">Загрузка 3D модели...</div>';
      blockInfoPanel.innerHTML = '<h4>Считаем блоки...</h4>';

      try {
        // 1. Загружаем файл схемы
        const response = await fetch(`/schemas/${schemaFile}`);
        if (!response.ok) throw new Error('Файл схемы не найден');
        const buffer = await response.arrayBuffer();
        
        // Активируем кнопку скачивания
        downloadLink.style.opacity = '1';

        // 2. Парсим 3D структуру
        const structure = LitematicLoader.load(new Uint8Array(buffer));

        // 3. Парсим список блоков с переводом и сортировкой
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
          console.warn("Ошибка парсинга блоков", e);
          blockInfoPanel.innerHTML = '<h4>Ошибка</h4><p>Не удалось прочитать список блоков.</p>';
        }

        // 4. Загружаем текстуры
        const baseUrl = 'https://unpkg.com/@mattzh72/lodestone@0.6.0/assets/default-pack/';
        const { resources } = await loadDefaultPackResources({ baseUrl });

        // 5. Создаем canvas
        viewer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        viewer.appendChild(canvas);
        
        const width = viewer.clientWidth;
        const height = viewer.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // 6. Настраиваем рендерер
        const renderer = new ThreeStructureRenderer(canvas, structure, resources);
        renderer.setViewport(0, 0, width, height);
        
        // === НАСТРОЙКА ПОЛЕТА КАМЕРЫ (WASD) ===
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(15, 15, 15); 
        
        let yaw = -Math.PI / 4;
        let pitch = -Math.PI / 6;

        hintEl.innerHTML = 'WASD — полет | Мышка — обзор | <strong>Кликни по 3D, чтобы начать</strong>';

        canvas.addEventListener('click', () => {
          canvas.requestPointerLock();
        });

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
        // Если файл не загрузился, отключаем кнопку
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


  // ===== ОСТАЛЬНОЙ КОД (АНИМАЦИИ, ГАЙДЫ, САЙДБАР) =====
  const animatedElements = document.querySelectorAll('.hero-tag, .hero p, .hero-stats, .btn-row, .section-header, .grid, .ench-grid, .guide-accordion');
  animatedElements.forEach(el => el.classList.add('fade-up'));

  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
      else entry.target.classList.remove('visible');
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

  const heroTextEl = document.getElementById('hero-typewriter');
  if (heroTextEl) {
    setTimeout(() => {
      let i = 0;
      const text = 'VibeGuide';
      heroTextEl.textContent = ''; 
      function typeHero() {
        if (i < text.length) {
          heroTextEl.textContent += text.charAt(i);
          i++;
          setTimeout(typeHero, 150);
        }
      }
      typeHero();
    }, 300); 
  }
});