/**
 * Black Queen Ops — 3D Chess Hero Background
 * Pure Three.js (CDN r128) + EffectComposer bloom
 */

class ChessBackground3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.isMobile = window.innerWidth < 768;
    this.mouse = { x: 0, y: 0 };
    this.targetCamOffset = { x: 0, y: 0 };
    this.camOffset = { x: 0, y: 0 };
    this.scrollY = 0;
    this.clock = new THREE.Clock();
    this.angle = 0;
    this.cells = [];
    this.cellMeshes = {};
    this.particles = [];
    this.eventIndex = 0;
    this.eventRunning = false;
    this.eventTextEl = null;
    this.pawnMesh = null;

    this.init();
    this.createBoard();
    this.createQueen();
    this.createLights();
    if (!this.isMobile) this.setupBloom();
    this.setupEvents();
    this.bindListeners();
    this.animate();
    this.startEventLoop();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: !this.isMobile, alpha: false });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0a0a0a);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    if (!this.isMobile) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const canvas = this.renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    this.container.appendChild(canvas);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      this.isMobile ? 60 : 45,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(0, 14, 18);
    this.camera.lookAt(0, 0, 0);

    // Event text overlay
    this.eventTextEl = document.createElement('div');
    Object.assign(this.eventTextEl.style, {
      position: 'absolute',
      bottom: '40px',
      left: '40px',
      zIndex: '2',
      color: '#b8971f',
      fontSize: '13px',
      letterSpacing: '0.1em',
      fontFamily: 'inherit',
      fontWeight: '500',
      opacity: '0',
      transition: 'opacity 0.6s ease',
      pointerEvents: 'none',
      textTransform: 'uppercase',
    });
    this.container.appendChild(this.eventTextEl);
  }

  // ─── BOARD ───────────────────────────────────────
  createBoard() {
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a0d, roughness: 0.8, metalness: 0.2
    });
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0x2a2500, roughness: 0.6, metalness: 0.4
    });

    const geo = this.isMobile
      ? new THREE.PlaneGeometry(1.96, 1.96)
      : new THREE.BoxGeometry(1.96, 0.2, 1.96);

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 === 1;
        const mesh = new THREE.Mesh(geo, isDark ? darkMat.clone() : lightMat.clone());
        const x = (col - 3.5) * 2;
        const z = (row - 3.5) * 2;

        if (this.isMobile) {
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.set(x, 0, z);
        } else {
          mesh.position.set(x, 0, z);
        }

        mesh.receiveShadow = true;
        mesh.castShadow = !this.isMobile;
        this.scene.add(mesh);

        const key = `${col},${row}`;
        this.cellMeshes[key] = mesh;
        this.cells.push({ col, row, mesh, originalY: 0, targetY: 0, glowIntensity: 0 });
      }
    }

    // Store original colors
    this.cells.forEach(c => {
      c.originalColor = c.mesh.material.color.clone();
    });
  }

  boardPos(col, row) {
    return new THREE.Vector3((col - 3.5) * 2, 0, (row - 3.5) * 2);
  }

  // ─── QUEEN ───────────────────────────────────────
  createQueen() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb8971f,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x3d2a00,
      emissiveIntensity: 0.3,
    });

    this.queenGroup = new THREE.Group();

    // Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 0.3, 24), mat);
    base.position.y = 0.25;
    this.queenGroup.add(base);

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 1.0, 24), mat);
    body.position.y = 0.9;
    this.queenGroup.add(body);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.3, 24), mat);
    neck.position.y = 1.55;
    this.queenGroup.add(neck);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), mat);
    head.position.y = 1.95;
    this.queenGroup.add(head);

    // Crown spikes
    for (let i = 0; i < 5; i++) {
      const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.4, 8), mat);
      const angle = (i / 5) * Math.PI * 2;
      spike.position.set(Math.cos(angle) * 0.28, 2.25, Math.sin(angle) * 0.28);
      spike.rotation.x = Math.cos(angle) * 0.3;
      spike.rotation.z = -Math.sin(angle) * 0.3;
      this.queenGroup.add(spike);
    }

    // Shadows
    this.queenGroup.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (!this.isMobile) child.layers.enable(1); // bloom layer
      }
    });

    // Start at e1 → col=4, row=0
    this.queenCol = 4;
    this.queenRow = 0;
    const startPos = this.boardPos(4, 0);
    this.queenGroup.position.copy(startPos);
    this.queenGroup.position.y = -5; // hidden below
    this.queenGroup.visible = false;
    this.scene.add(this.queenGroup);
  }

  createPawn() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb8971f, roughness: 0.3, metalness: 0.8,
      emissive: 0x3d2a00, emissiveIntensity: 0.2,
    });
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.2, 16), mat);
    base.position.y = 0.2;
    group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 0.6, 16), mat);
    body.position.y = 0.6;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
    head.position.y = 1.1;
    group.add(head);
    group.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    return group;
  }

  // ─── LIGHTS ──────────────────────────────────────
  createLights() {
    // Ambient
    this.ambientLight = new THREE.AmbientLight(0x1a1400, 0.4);
    this.scene.add(this.ambientLight);

    // Directional
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.dirLight.position.set(5, 10, 5);
    if (!this.isMobile) {
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 2048;
      this.dirLight.shadow.mapSize.height = 2048;
      this.dirLight.shadow.camera.near = 0.5;
      this.dirLight.shadow.camera.far = 50;
      this.dirLight.shadow.camera.left = -15;
      this.dirLight.shadow.camera.right = 15;
      this.dirLight.shadow.camera.top = 15;
      this.dirLight.shadow.camera.bottom = -15;
    }
    this.scene.add(this.dirLight);

    // Gold point light follows queen
    this.queenLight = new THREE.PointLight(0xb8971f, 2.0, 8, 2);
    this.queenLight.position.set(0, 3, 0);
    if (!this.isMobile) this.queenLight.castShadow = true;
    this.scene.add(this.queenLight);

    // Spot from above
    this.spotLight = new THREE.SpotLight(0xfff5d6, 0.8, 40, 0.4, 0.5);
    this.spotLight.position.set(0, 20, 0);
    if (!this.isMobile) this.spotLight.castShadow = true;
    this.scene.add(this.spotLight);
  }

  // ─── BLOOM ───────────────────────────────────────
  setupBloom() {
    if (typeof THREE.EffectComposer === 'undefined') return;

    this.composer = new THREE.EffectComposer(this.renderer);
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      0.8, 0.4, 0.6
    );
    this.composer.addPass(this.bloomPass);
  }

  // ─── PARTICLES ───────────────────────────────────
  spawnParticles(x, y, z, count = 30) {
    if (this.isMobile) return;
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb8971f, emissive: 0xff9900, emissiveIntensity: 0.8,
      transparent: true, opacity: 1
    });
    const geo = new THREE.SphereGeometry(0.04, 8, 8);

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat.clone());
      mesh.position.set(x, y + 0.5, z);
      const vx = (Math.random() - 0.5) * 0.16;
      const vy = Math.random() * 0.12 + 0.04;
      const vz = (Math.random() - 0.5) * 0.16;
      mesh.layers.enable(1);
      this.scene.add(mesh);
      this.particles.push({
        mesh, vx, vy, vz, life: 1.5, age: 0
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      p.vy -= 0.003;
      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;
      p.mesh.material.opacity = Math.max(0, 1 - p.age / p.life);

      if (p.age >= p.life) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  // ─── CELL ANIMATION ──────────────────────────────
  animateCell(col, row, glowDuration = 3000) {
    const key = `${col},${row}`;
    const cell = this.cells.find(c => c.col === col && c.row === row);
    if (!cell) return;

    // Bump up
    if (!this.isMobile) {
      const mesh = cell.mesh;
      const start = performance.now();
      const bump = () => {
        const elapsed = performance.now() - start;
        if (elapsed < 200) {
          mesh.position.y = cell.originalY + 0.3 * this.easeOutCubic(elapsed / 200);
        } else if (elapsed < 600) {
          mesh.position.y = cell.originalY + 0.3 * (1 - this.easeInCubic((elapsed - 200) / 400));
        } else {
          mesh.position.y = cell.originalY;
          return;
        }
        requestAnimationFrame(bump);
      };
      bump();
    }

    // Gold glow
    const goldColor = new THREE.Color(0xb8971f);
    cell.mesh.material.color.copy(goldColor);
    cell.mesh.material.emissive = goldColor.clone();
    cell.mesh.material.emissiveIntensity = 0.3;

    setTimeout(() => {
      const fadeStart = performance.now();
      const fadeDuration = 1500;
      const fade = () => {
        const t = Math.min(1, (performance.now() - fadeStart) / fadeDuration);
        cell.mesh.material.color.lerpColors(goldColor, cell.originalColor, t);
        cell.mesh.material.emissiveIntensity = 0.3 * (1 - t);
        if (t < 1) requestAnimationFrame(fade);
        else cell.mesh.material.emissive = new THREE.Color(0x000000);
      };
      fade();
    }, glowDuration);
  }

  // ─── QUEEN MOVEMENT ──────────────────────────────
  async moveQueen(targetCol, targetRow, speed = 800) {
    const startPos = this.boardPos(this.queenCol, this.queenRow);
    const endPos = this.boardPos(targetCol, targetRow);

    // Calculate intermediate steps for path
    const dc = Math.sign(targetCol - this.queenCol);
    const dr = Math.sign(targetRow - this.queenRow);
    const steps = Math.max(Math.abs(targetCol - this.queenCol), Math.abs(targetRow - this.queenRow));

    for (let s = 1; s <= steps; s++) {
      const ic = this.queenCol + dc * s;
      const ir = this.queenRow + dr * s;
      const from = this.boardPos(this.queenCol + dc * (s - 1), this.queenRow + dr * (s - 1));
      const to = this.boardPos(ic, ir);

      await this.tweenPosition(this.queenGroup.position, from, to, speed);
      this.animateCell(ic, ir);
      this.spawnParticles(to.x, 0, to.z, 15);
    }

    this.queenCol = targetCol;
    this.queenRow = targetRow;
  }

  tweenPosition(obj, from, to, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / duration);
        const e = this.easeInOutCubic(t);
        obj.x = from.x + (to.x - from.x) * e;
        obj.z = from.z + (to.z - from.z) * e;
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      tick();
    });
  }

  tweenValue(from, to, duration, onUpdate) {
    return new Promise(resolve => {
      const start = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / duration);
        const e = this.easeInOutCubic(t);
        onUpdate(from + (to - from) * e);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      tick();
    });
  }

  // ─── EVENT TEXT ──────────────────────────────────
  async showText(text, holdMs = 3000) {
    this.eventTextEl.textContent = text;
    this.eventTextEl.style.transition = 'opacity 0.6s ease';
    this.eventTextEl.style.opacity = '1';
    await this.wait(holdMs);
    this.eventTextEl.style.transition = 'opacity 0.4s ease';
    this.eventTextEl.style.opacity = '0';
    await this.wait(500);
  }

  // ─── 10 EVENTS ───────────────────────────────────
  setupEvents() {
    this.events = [
      this.event1.bind(this),
      this.event2.bind(this),
      this.event3.bind(this),
      this.event4.bind(this),
      this.event5.bind(this),
      this.event6.bind(this),
      this.event7.bind(this),
      this.event8.bind(this),
      this.event9.bind(this),
      this.event10.bind(this),
    ];
  }

  async startEventLoop() {
    await this.wait(1000);
    while (true) {
      this.eventRunning = true;
      await this.events[this.eventIndex]();
      this.eventRunning = false;
      this.eventIndex = (this.eventIndex + 1) % this.events.length;
      await this.wait(2000);
    }
  }

  // 1. Queen Entrance
  async event1() {
    this.queenGroup.visible = true;
    const pos = this.boardPos(4, 0);
    this.queenGroup.position.set(pos.x, -5, pos.z);
    this.queenCol = 4;
    this.queenRow = 0;

    // Rise up
    await this.tweenValue(-5, 0, 1000, v => { this.queenGroup.position.y = v; });

    // Light flash
    const origIntensity = this.queenLight.intensity;
    await this.tweenValue(0, 5, 300, v => { this.queenLight.intensity = v; });
    await this.tweenValue(5, 1.5, 500, v => { this.queenLight.intensity = v; });
    this.queenLight.intensity = origIntensity;

    this.spawnParticles(pos.x, 0, pos.z, 30);
    await this.showText("BLACK QUEEN ENTERS THE GAME");
  }

  // 2. Diagonal Strike a1→h8
  async event2() {
    this.queenCol = 0; this.queenRow = 0;
    this.queenGroup.position.copy(this.boardPos(0, 0));
    this.queenGroup.position.y = 0;

    await this.moveQueen(7, 7, 600);
    await this.showText("WE CROSS ANY MARKET IN ONE MOVE");
  }

  // 3. Territory Capture — perimeter
  async event3() {
    this.queenCol = 0; this.queenRow = 0;
    this.queenGroup.position.copy(this.boardPos(0, 0));
    this.queenGroup.position.y = 0;

    // Top edge
    await this.moveQueen(7, 0, 400);
    // Right edge
    await this.moveQueen(7, 7, 400);
    // Bottom edge
    await this.moveQueen(0, 7, 400);
    // Left edge
    await this.moveQueen(0, 0, 400);

    await this.showText("FULL COVERAGE. EVERY REGION.");
  }

  // 4. Checkmate in One
  async event4() {
    this.queenCol = 3; this.queenRow = 3;
    this.queenGroup.position.copy(this.boardPos(3, 3));
    this.queenGroup.position.y = 0;

    // Pulse
    for (let i = 0; i < 3; i++) {
      await this.tweenValue(1, 1.1, 300, v => { this.queenGroup.scale.setScalar(v); });
      await this.tweenValue(1.1, 1, 300, v => { this.queenGroup.scale.setScalar(v); });
    }

    await this.moveQueen(6, 6, 500);

    // Scene flash
    const origAmbient = this.ambientLight.intensity;
    await this.tweenValue(0.4, 2, 200, v => { this.ambientLight.intensity = v; });
    await this.tweenValue(2, 0.4, 600, v => { this.ambientLight.intensity = v; });
    this.ambientLight.intensity = origAmbient;
    this.spawnParticles(this.queenGroup.position.x, 0, this.queenGroup.position.z, 30);

    await this.showText("WE SEE THE WINNING MOVE FIRST");
  }

  // 5. Defense Wall — triangle
  async event5() {
    const triangle = [[2, 2], [5, 2], [3, 5]];
    this.queenCol = triangle[0][0]; this.queenRow = triangle[0][1];
    this.queenGroup.position.copy(this.boardPos(this.queenCol, this.queenRow));
    this.queenGroup.position.y = 0;

    for (let i = 0; i < 6; i++) {
      const next = triangle[(i + 1) % 3];
      await this.moveQueen(next[0], next[1], 300);
    }

    await this.showText("YOUR BUSINESS. PROTECTED.");
  }

  // 6. Double Attack
  async event6() {
    this.queenCol = 3; this.queenRow = 4;
    this.queenGroup.position.copy(this.boardPos(3, 4));
    this.queenGroup.position.y = 0;

    // Two target cells pulse
    const t1 = this.cells.find(c => c.col === 0 && c.row === 7);
    const t2 = this.cells.find(c => c.col === 6 && c.row === 1);

    for (let i = 0; i < 4; i++) {
      if (t1) this.animateCell(0, 7, 1000);
      if (t2) this.animateCell(6, 1, 1000);
      await this.wait(800);
    }

    await this.showText("ONE SOLUTION. TWO PROBLEMS SOLVED.");
  }

  // 7. Queen Sacrifice
  async event7() {
    this.queenCol = 4; this.queenRow = 4;
    this.queenGroup.position.copy(this.boardPos(4, 4));
    this.queenGroup.position.y = 0;

    // Sink down
    await this.tweenValue(0, -3, 1200, v => { this.queenGroup.position.y = v; });

    // All cells flash gold
    this.cells.forEach(c => this.animateCell(c.col, c.row, 2000));
    await this.wait(1000);

    // Queen returns with flash
    await this.tweenValue(-3, 0, 500, v => { this.queenGroup.position.y = v; });
    await this.tweenValue(2, 5, 200, v => { this.queenLight.intensity = v; });
    this.spawnParticles(this.queenGroup.position.x, 0, this.queenGroup.position.z, 30);
    await this.tweenValue(5, 2, 400, v => { this.queenLight.intensity = v; });

    await this.showText("THE BOLDEST MOVE IS COUNTERINTUITIVE");
  }

  // 8. Zugzwang
  async event8() {
    // Darken all cells
    const darkColor = new THREE.Color(0x0d0d0d);
    this.cells.forEach(c => {
      c.mesh.material.color.copy(darkColor);
    });

    // Queen glows brightly
    const origEmissive = 0.3;
    this.queenGroup.children.forEach(c => {
      if (c.material) c.material.emissiveIntensity = 1.0;
    });
    this.queenLight.intensity = 4;

    this.queenCol = 1; this.queenRow = 1;
    this.queenGroup.position.copy(this.boardPos(1, 1));
    this.queenGroup.position.y = 0;

    await this.moveQueen(6, 1, 600);
    await this.moveQueen(6, 6, 600);
    await this.moveQueen(1, 6, 600);

    await this.showText("WHILE OTHERS FREEZE — WE MOVE");

    // Restore
    this.cells.forEach(c => {
      c.mesh.material.color.copy(c.originalColor);
    });
    this.queenGroup.children.forEach(c => {
      if (c.material) c.material.emissiveIntensity = origEmissive;
    });
    this.queenLight.intensity = 2;
  }

  // 9. Promotion
  async event9() {
    // Create pawn at a2 (col=0, row=1)
    this.pawnMesh = this.createPawn();
    const pawnStart = this.boardPos(0, 1);
    this.pawnMesh.position.copy(pawnStart);
    this.scene.add(this.pawnMesh);

    // Hide queen temporarily
    this.queenGroup.visible = false;

    // Move pawn from a2 to a8
    for (let r = 2; r <= 7; r++) {
      const from = this.boardPos(0, r - 1);
      const to = this.boardPos(0, r);
      await this.tweenPawn(from, to, 500);
      this.animateCell(0, r, 2000);
    }

    // Flash — pawn disappears, queen appears
    const promoPos = this.boardPos(0, 7);
    this.scene.remove(this.pawnMesh);
    this.pawnMesh.traverse(c => { if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose(); });

    this.queenCol = 0; this.queenRow = 7;
    this.queenGroup.position.copy(promoPos);
    this.queenGroup.position.y = 0;
    this.queenGroup.visible = true;

    this.spawnParticles(promoPos.x, 0, promoPos.z, 30);
    await this.tweenValue(2, 6, 200, v => { this.queenLight.intensity = v; });
    await this.tweenValue(6, 2, 500, v => { this.queenLight.intensity = v; });

    await this.showText("WE TURN MERCHANTS INTO GLOBAL PLAYERS");
  }

  tweenPawn(from, to, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / duration);
        const e = this.easeInOutCubic(t);
        this.pawnMesh.position.x = from.x + (to.x - from.x) * e;
        this.pawnMesh.position.z = from.z + (to.z - from.z) * e;
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      tick();
    });
  }

  // 10. Endgame
  async event10() {
    // Darken all cells
    const darkColor = new THREE.Color(0x080808);
    this.cells.forEach(c => {
      c.mesh.material.color.copy(darkColor);
      c.mesh.material.emissive = new THREE.Color(0x000000);
    });

    // Queen walks to center d4 (col=3, row=3)
    this.queenCol = 0; this.queenRow = 0;
    this.queenGroup.position.copy(this.boardPos(0, 0));
    this.queenGroup.position.y = 0;

    await this.moveQueen(3, 3, 1200);

    // Freeze. Pulse gold light.
    for (let i = 0; i < 3; i++) {
      await this.tweenValue(2, 5, 800, v => { this.queenLight.intensity = v; });
      await this.tweenValue(5, 2, 800, v => { this.queenLight.intensity = v; });
    }

    await this.showText("THE GAME ISN'T OVER. IT'S JUST BEGINNING");

    // Restore cells
    this.cells.forEach(c => {
      c.mesh.material.color.copy(c.originalColor);
    });
  }

  // ─── ANIMATE LOOP ────────────────────────────────
  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = this.clock.getDelta();

    // Camera auto-rotate
    this.angle += 0.0008;
    const radius = 18 + this.scrollY * 0.01;
    const baseX = Math.sin(this.angle) * radius;
    const baseZ = Math.cos(this.angle) * radius;

    // Mouse parallax
    this.camOffset.x += (this.targetCamOffset.x - this.camOffset.x) * 0.03;
    this.camOffset.y += (this.targetCamOffset.y - this.camOffset.y) * 0.03;

    this.camera.position.x = baseX + this.camOffset.x;
    this.camera.position.z = baseZ;
    this.camera.position.y = 14 + this.camOffset.y;
    this.camera.lookAt(0, 0, 0);

    // Queen light follows
    if (this.queenGroup.visible) {
      this.queenLight.position.set(
        this.queenGroup.position.x,
        this.queenGroup.position.y + 3,
        this.queenGroup.position.z
      );
    }

    // Update particles
    this.updateParticles(dt);

    // Render
    if (this.composer && !this.isMobile) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ─── EVENTS ──────────────────────────────────────
  bindListeners() {
    window.addEventListener('mousemove', (e) => {
      if (this.isMobile) return;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      this.targetCamOffset.x = this.mouse.x * 2;
      this.targetCamOffset.y = -this.mouse.y * 2;
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    const ro = new ResizeObserver(() => {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      if (this.composer) {
        this.composer.setSize(this.width, this.height);
      }
      this.isMobile = window.innerWidth < 768;
    });
    ro.observe(this.container);
  }

  // ─── UTILS ───────────────────────────────────────
  easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  easeInCubic(t) { return t * t * t; }
  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}

// Auto-init when DOM ready
if (typeof window !== 'undefined') {
  window.ChessBackground3D = ChessBackground3D;
}
