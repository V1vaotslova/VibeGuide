import { LitematicLoader, ThreeStructureRenderer, loadDefaultPackResources } from '@mattzh72/lodestone';
import { mat4 } from 'gl-matrix';
import * as THREE from 'three';
import { Litematic } from '@kleppe/litematic-reader'; 
import './style.css';

// Словарь перевода популярных блоков на русский
const blockTranslations = {
  "stone": "Камень", "cobblestone": "Булыжник", "dirt": "Земля", "grass_block": "Травяной блок",
  "sand": "Песок", "gravel": "Гравий", "oak_log": "Дубовое бревно", "oak_planks": "Дубовые доски",
  "oak_slab": "Дубовая плита", "oak_stairs": "Дубовая лестница", "oak_fence": "Дубовый забор",
  "oak_trapdoor": "Дубовый люк", "glass": "Стекло", "glass_pane": "Стеклянная панель",
  "iron_block": "Железный блок", "iron_bars": "Железные прутья", "iron_trapdoor": "Железный люк",
  "hopper": "Воронка", "chest": "Сундук", "trapped_chest": "Сундук-ловушка", "furnace": "Печь",
  "water": "Вода", "lava": "Лава", "torch": "Факел", "wall_torch": "Настенный факел",
  "redstone_wire": "Редстоун", "redstone_torch": "Редстоуновый факел", "repeater": "Повторитель",
  "observer": "Наблюдатель", "piston": "Поршень", "sticky_piston": "Липкий поршень",
  "dispenser": "Раздатчик", "dropper": "Выбрасыватель", "lever": "Рычаг",
  "stone_button": "Каменная кнопка", "oak_button": "Дубовая кнопка", "oak_pressure_plate": "Дубовая нажимная плита",
  "crafting_table": "Верстак", "bookshelf": "Книжная полка", "campfire": "Костёр",
  "scaffolding": "Строительные леса", "lantern": "Фонарь", "soul_lantern": "Фонарь душ",
  "cobweb": "Паутина", "cactus": "Кактус", "sugar_cane": "Сахарный тростник",
  "bamboo": "Бамбук", "kelp": "Ламинария", "sea_pickle": "Морской огурец",
  "soul_sand": "Песок душ", "magma_block": "Магмовый блок", "obsidian": "Обсидиан",
  "netherrack": "Адский камень", "nether_bricks": "Адский кирпич", "glowstone": "Светокамень",
  "iron_door": "Железная дверь", "oak_door": "Дубовая дверь", "oak_fence_gate": "Дубовая калитка",
  "note_block": "Нотный блок", "jukebox": "Проигрыватель", "tnt": "Динамит",
  "slime_block": "Блок слизи", "honey_block": "Блок мёда", "soul_campfire": "Костёр душ",
  "mud_bricks": "Грязевые кирпичи", "packed_mud": "Утрамбованная грязь", "white_wool": "Белая шерсть",
  "black_wool": "Чёрная шерсть", "red_wool": "Красная шерсть", "stone_bricks": "Каменный кирпич",
  "smooth_stone": "Гладкий камень", "deepslate": "Глубинный сланец", "cobbled_deepslate": "Булыжный глубинный сланец"
};

document.addEventListener('DOMContentLoaded', () => {
  // ===== 1. МОДАЛКА 3D СХЕМ =====
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const closeBtn = document.getElementById('closeModalBtn');
  const viewer = document.getElementById('viewer');
  const blockInfoPanel = document.getElementById('block-info');
  const hintEl = modal.querySelector('.modal-hint'); // Подсказка в шапке

  let animationFrameId = null;
  let currentRenderer = null;
  let keysPressed = {}; 

  // Функция перевода названия блока
  function translateBlock(blockId) {
    const cleanId = blockId.replace('minecraft:', '');
    // Если нет в словаре — делаем красивое название (убираем подчеркивания)
    return blockTranslations[cleanId] || cleanId.replace(/_/g, ' '); 
  }

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', async () => {
      const name = card.dataset.name || 'Схема';
      const schemaFile = card.dataset.schema || '';
      
      modalTitle.textContent = 'VibeGuide 3D: ' + name;
      modal.classList.add('open');
      
      viewer.innerHTML = '<div style="color: var(--muted); font-family: var(--font-mono); display:flex; align-items:center; justify-content:center; height:100%;">Загрузка 3D модели...</div>';
      blockInfoPanel.innerHTML = '<h4>Считаем блоки...</h4>';

      try {
        // 1. Загружаем файл схемы
        const response = await fetch(`/schemas/${schemaFile}`);
        if (!response.ok) throw new Error('Файл схемы не найден');
        const buffer = await response.arrayBuffer();
        
        // 2. Парсим 3D структуру
        const structure = LitematicLoader.load(new Uint8Array(buffer));

        // 3. Парсим список блоков с переводом и сортировкой
        try {
          const litematicReader = new Litematic(buffer);
          const palette = await litematicReader.getBlockPaletteWithCount();
          
          let html = '<h4>Необходимые блоки</h4><ul class="block-info-list">';
          let totalBlocks = 0;
          
          // Сортируем блоки по убыванию количества
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

        // Подсказка по умолчанию
        hintEl.innerHTML = 'WASD — полет | Мышка — обзор | <strong>Кликни по 3D, чтобы начать</strong>';

        // Обработка захвата мыши
        canvas.addEventListener('click', () => {
          canvas.requestPointerLock();
        });

        document.addEventListener('pointerlockchange', () => {
          if (document.pointerLockElement === canvas) {
            hintEl.innerHTML = 'WASD — полет | Мышка — обзор | <strong>Esc — вернуть курсор (чтобы листать список)</strong>';
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