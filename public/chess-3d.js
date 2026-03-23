/**
 * Black Queen Ops — 3D Chess Hero Background v2
 * Book-opening board, full piece set, right-shifted composition
 */

class ChessBackground3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.isMobile = window.innerWidth < 768;
    this.isTablet = window.innerWidth < 1024;
    this.mouse = { x: 0, y: 0 };
    this.targetCamOffset = { x: 0, y: 0 };
    this.camOffset = { x: 0, y: 0 };
    this.scrollY = 0;
    this.clock = new THREE.Clock();
    this.elapsedTime = 0;
    this.angle = 0;
    this.cells = [];
    this.cellMeshes = {};
    this.particles = [];
    this.pieces = [];       // all piece meshes with metadata
    this.eventIndex = 0;
    this.eventRunning = false;
    this.eventTextEl = null;
    this.boardReady = false;
    this.boardOffsetX = this.isTablet ? 2 : 4;

    this.init();
    this.createBoard();
    this.createAllPieces();
    this.createLights();
    if (!this.isMobile) this.setupBloom();
    this.setupEvents();
    this.bindListeners();
    this.animate();
    this.startIntro();
  }

  // ─── INIT ──────────────────────────────────────
  init() {
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

    // Mobile: 40% opacity overlay
    if (this.isMobile) {
      this.renderer.domElement.style.opacity = '0.4';
    }

    const canvas = this.renderer.domElement;
    Object.assign(canvas.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', zIndex: '0', pointerEvents: 'none'
    });
    this.container.appendChild(canvas);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);

    // Camera — shifted right, lower angle
    const fov = this.isMobile ? 60 : 50;
    this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 0.1, 100);
    const camX = this.isTablet ? -2 : -4;
    this.camera.position.set(camX, 10, 16);
    this.camera.lookAt(this.boardOffsetX - 1, 0, 0);
    this.baseCamX = camX;

    // Event text
    this.eventTextEl = document.createElement('div');
    Object.assign(this.eventTextEl.style, {
      position: 'absolute', bottom: '40px', left: '40px', zIndex: '2',
      color: '#b8971f', fontSize: '13px', letterSpacing: '0.1em',
      fontFamily: 'inherit', fontWeight: '500', opacity: '0',
      transition: 'opacity 0.6s ease', pointerEvents: 'none', textTransform: 'uppercase',
    });
    this.container.appendChild(this.eventTextEl);
  }

  // ─── BOARD (two halves for book-open) ──────────
  createBoard() {
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a0d, roughness: 0.8, metalness: 0.2 });
    const lightMat = new THREE.MeshStandardMaterial({ color: 0x2a2500, roughness: 0.6, metalness: 0.4 });
    const geo = this.isMobile
      ? new THREE.PlaneGeometry(1.96, 1.96)
      : new THREE.BoxGeometry(1.96, 0.2, 1.96);

    // Two pivot groups for book opening
    // Left half: cols 0-3, pivots at col 3.5 edge (x=0 relative to board center)
    // Right half: cols 4-7, pivots at col 3.5 edge
    this.boardGroup = new THREE.Group();
    this.boardGroup.position.x = this.boardOffsetX;
    this.scene.add(this.boardGroup);

    this.leftHalf = new THREE.Group();
    this.rightHalf = new THREE.Group();
    // Pivot point at the center seam
    this.leftHalf.position.set(0, 0, 0);
    this.rightHalf.position.set(0, 0, 0);
    this.boardGroup.add(this.leftHalf);
    this.boardGroup.add(this.rightHalf);

    // Start folded (book closed) — rotated on Z axis
    this.leftHalf.rotation.z = Math.PI / 2;   // left half stands up to the left
    this.rightHalf.rotation.z = -Math.PI / 2;  // right half stands up to the right

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 === 1;
        const mesh = new THREE.Mesh(geo, isDark ? darkMat.clone() : lightMat.clone());
        const x = (col - 3.5) * 2;
        const z = (row - 3.5) * 2;

        if (this.isMobile) {
          mesh.rotation.x = -Math.PI / 2;
        }
        mesh.position.set(x, 0, z);
        mesh.receiveShadow = true;
        mesh.castShadow = !this.isMobile;

        if (col < 4) {
          this.leftHalf.add(mesh);
        } else {
          this.rightHalf.add(mesh);
        }

        const key = `${col},${row}`;
        this.cellMeshes[key] = mesh;
        this.cells.push({ col, row, mesh, originalY: 0, originalColor: null });
      }
    }

    this.cells.forEach(c => { c.originalColor = c.mesh.material.color.clone(); });
  }

  boardPos(col, row) {
    return new THREE.Vector3((col - 3.5) * 2 + this.boardOffsetX, 0, (row - 3.5) * 2);
  }

  // ─── MATERIALS ─────────────────────────────────
  get whiteMat() {
    return new THREE.MeshStandardMaterial({ color: 0xe8d5a3, roughness: 0.3, metalness: 0.6 });
  }
  get blackQueenMat() {
    return new THREE.MeshStandardMaterial({
      color: 0xb8971f, roughness: 0.15, metalness: 0.95,
      emissive: 0x3d2a00, emissiveIntensity: 0.5,
    });
  }

  // ─── PIECE BUILDERS ────────────────────────────
  buildPawn(mat) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.15, 16), mat);
    base.position.y = 0.175;
    g.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.45, 16), mat);
    body.position.y = 0.525;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), mat);
    head.position.y = 0.85;
    g.add(head);
    return g;
  }

  buildRook(mat) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.8, 16), mat);
    body.position.y = 0.5;
    g.add(body);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), mat);
    top.position.y = 1.0;
    g.add(top);
    // 4 crenellations
    for (let i = 0; i < 4; i++) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), mat);
      const a = (i / 4) * Math.PI * 2;
      tooth.position.set(Math.cos(a) * 0.3, 1.2, Math.sin(a) * 0.3);
      g.add(tooth);
    }
    return g;
  }

  buildKnight(mat) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.7, 16), mat);
    body.position.y = 0.45;
    g.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.35), mat);
    head.position.set(0.05, 1.05, -0.05);
    head.rotation.x = -0.4;
    g.add(head);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), mat);
    nose.position.set(0.1, 1.1, -0.25);
    g.add(nose);
    return g;
  }

  buildBishop(mat) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 0.9, 16), mat);
    body.position.y = 0.55;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), mat);
    head.position.y = 1.15;
    g.add(head);
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.15, 8), mat);
    spire.position.y = 1.45;
    g.add(spire);
    return g;
  }

  buildQueen(mat) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.65, 0.25, 24), mat);
    base.position.y = 0.225;
    g.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.85, 24), mat);
    body.position.y = 0.775;
    g.add(body);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.25, 24), mat);
    neck.position.y = 1.325;
    g.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), mat);
    head.position.y = 1.65;
    g.add(head);
    for (let i = 0; i < 5; i++) {
      const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.35, 8), mat);
      const a = (i / 5) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 0.24, 1.95, Math.sin(a) * 0.24);
      spike.rotation.x = Math.cos(a) * 0.3;
      spike.rotation.z = -Math.sin(a) * 0.3;
      g.add(spike);
    }
    return g;
  }

  buildKing(mat) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.65, 0.25, 24), mat);
    base.position.y = 0.225;
    g.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.0, 24), mat);
    body.position.y = 0.85;
    g.add(body);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.25, 24), mat);
    neck.position.y = 1.475;
    g.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), mat);
    head.position.y = 1.8;
    g.add(head);
    // Cross on top
    const cv = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.35, 0.07), mat);
    cv.position.y = 2.25;
    g.add(cv);
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.28), mat);
    ch.position.y = 2.3;
    g.add(ch);
    return g;
  }

  // ─── PLACE ALL PIECES ──────────────────────────
  createAllPieces() {
    this.piecesGroup = new THREE.Group();
    this.piecesGroup.position.x = this.boardOffsetX;
    this.scene.add(this.piecesGroup);

    const wm = this.whiteMat;
    const bqm = this.blackQueenMat;

    // Layout: [col, row, builder, material, name]
    const layout = [];

    // White back rank (row=0)
    layout.push([0, 0, 'Rook', wm, 'wR1']);
    layout.push([1, 0, 'Knight', wm, 'wN1']);
    layout.push([2, 0, 'Bishop', wm, 'wB1']);
    layout.push([3, 0, 'Queen', wm, 'wQ']);
    layout.push([4, 0, 'King', wm, 'wK']);
    layout.push([5, 0, 'Bishop', wm, 'wB2']);
    layout.push([6, 0, 'Knight', wm, 'wN2']);
    layout.push([7, 0, 'Rook', wm, 'wR2']);

    // White pawns (row=1) — skip on tablet
    if (!this.isTablet || !this.isMobile) {
      for (let c = 0; c < 8; c++) {
        layout.push([c, 1, 'Pawn', wm, `wP${c}`]);
      }
    }

    // Black queen on d8 (col=3, row=7)
    layout.push([3, 7, 'Queen', bqm, 'bQ']);

    this.queenPieceIndex = layout.length - 1;

    // On tablet: keep only queen, king, 2 rooks, black queen
    const tabletKeep = ['wR1', 'wK', 'wQ', 'wR2', 'bQ'];

    layout.forEach((def, index) => {
      const [col, row, type, mat, name] = def;

      // Tablet filter
      if (this.isTablet && !this.isMobile && !tabletKeep.includes(name) && type === 'Pawn') return;

      const builder = this['build' + type];
      if (!builder) return;
      const mesh = builder.call(this, mat.clone());

      // Position on board (local to piecesGroup)
      const x = (col - 3.5) * 2;
      const z = (row - 3.5) * 2;
      mesh.position.set(x, 8, z); // start above for drop-in anim
      mesh.visible = false;

      mesh.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (!this.isMobile && name === 'bQ') c.layers.enable(1);
        }
      });

      this.piecesGroup.add(mesh);
      this.pieces.push({ mesh, col, row, name, type, index, startRotY: 0 });
    });

    // Reference to black queen for events
    this.blackQueen = this.pieces.find(p => p.name === 'bQ');
    this.queenGroup = this.blackQueen ? this.blackQueen.mesh : null;
    this.queenCol = 3;
    this.queenRow = 7;
  }

  // ─── LIGHTS ────────────────────────────────────
  createLights() {
    this.ambientLight = new THREE.AmbientLight(0x1a1400, 0.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.dirLight.position.set(5, 10, 5);
    if (!this.isMobile) {
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.set(2048, 2048);
      this.dirLight.shadow.camera.near = 0.5;
      this.dirLight.shadow.camera.far = 50;
      this.dirLight.shadow.camera.left = -15;
      this.dirLight.shadow.camera.right = 15;
      this.dirLight.shadow.camera.top = 15;
      this.dirLight.shadow.camera.bottom = -15;
    }
    this.scene.add(this.dirLight);

    this.queenLight = new THREE.PointLight(0xb8971f, 2.0, 8, 2);
    this.queenLight.position.set(this.boardOffsetX, 3, 0);
    if (!this.isMobile) this.queenLight.castShadow = true;
    this.scene.add(this.queenLight);

    this.spotLight = new THREE.SpotLight(0xfff5d6, 0.8, 40, 0.4, 0.5);
    this.spotLight.position.set(this.boardOffsetX, 20, 0);
    if (!this.isMobile) this.spotLight.castShadow = true;
    this.scene.add(this.spotLight);

    // Rim light from left
    this.rimLight = new THREE.DirectionalLight(0x4a3800, 0.6);
    this.rimLight.position.set(-8, 4, -4);
    this.scene.add(this.rimLight);

    // Warm under-board glow
    this.underLight = new THREE.PointLight(0x1a0f00, 0.3, 12, 2);
    this.underLight.position.set(this.boardOffsetX, -2, 0);
    this.scene.add(this.underLight);
  }

  // ─── BLOOM ─────────────────────────────────────
  setupBloom() {
    if (typeof THREE.EffectComposer === 'undefined') return;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(this.width, this.height), 0.8, 0.4, 0.6
    );
    this.composer.addPass(this.bloomPass);
  }

  // ─── INTRO: BOOK-OPEN + PIECE DROP ─────────────
  async startIntro() {
    await this.wait(300);

    // Book-open animation: 1.8 seconds
    const duration = 1800;
    const start = performance.now();

    await new Promise(resolve => {
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / duration);
        const e = this.easeOutBounce(t);
        this.leftHalf.rotation.z = (Math.PI / 2) * (1 - e);
        this.rightHalf.rotation.z = -(Math.PI / 2) * (1 - e);
        if (t < 1) requestAnimationFrame(tick);
        else {
          this.leftHalf.rotation.z = 0;
          this.rightHalf.rotation.z = 0;
          resolve();
        }
      };
      tick();
    });

    // Pieces drop in with stagger
    const sortedPieces = [...this.pieces].sort((a, b) => a.col - b.col + (a.row - b.row) * 0.5);
    const stagger = 100;
    const dropDuration = 600;

    sortedPieces.forEach((p, i) => {
      setTimeout(() => {
        p.mesh.visible = true;
        const startTime = performance.now();
        const x = p.mesh.position.x;
        const z = p.mesh.position.z;
        const tick = () => {
          const t = Math.min(1, (performance.now() - startTime) / dropDuration);
          const e = this.easeOutBack(t);
          p.mesh.position.y = 8 + (0 - 8) * e;
          if (t < 1) requestAnimationFrame(tick);
          else p.mesh.position.y = 0;
        };
        tick();
      }, i * stagger);
    });

    await this.wait(sortedPieces.length * stagger + dropDuration + 500);
    this.boardReady = true;

    // Start event loop
    this.startEventLoop();
  }

  // ─── PARTICLES ─────────────────────────────────
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
      mesh.layers.enable(1);
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.16,
        vy: Math.random() * 0.12 + 0.04,
        vz: (Math.random() - 0.5) * 0.16,
        life: 1.5, age: 0
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

  // ─── CELL ANIMATION ────────────────────────────
  animateCell(col, row, glowDuration = 3000) {
    const cell = this.cells.find(c => c.col === col && c.row === row);
    if (!cell) return;

    if (!this.isMobile) {
      const mesh = cell.mesh;
      const start = performance.now();
      const bump = () => {
        const elapsed = performance.now() - start;
        if (elapsed < 200) {
          mesh.position.y = cell.originalY + 0.3 * this.easeOutCubic(elapsed / 200);
        } else if (elapsed < 600) {
          mesh.position.y = cell.originalY + 0.3 * (1 - this.easeInCubic((elapsed - 200) / 400));
        } else { mesh.position.y = cell.originalY; return; }
        requestAnimationFrame(bump);
      };
      bump();
    }

    const goldColor = new THREE.Color(0xb8971f);
    cell.mesh.material.color.copy(goldColor);
    cell.mesh.material.emissive = goldColor.clone();
    cell.mesh.material.emissiveIntensity = 0.3;

    setTimeout(() => {
      const fadeStart = performance.now();
      const fade = () => {
        const t = Math.min(1, (performance.now() - fadeStart) / 1500);
        cell.mesh.material.color.lerpColors(goldColor, cell.originalColor, t);
        cell.mesh.material.emissiveIntensity = 0.3 * (1 - t);
        if (t < 1) requestAnimationFrame(fade);
        else cell.mesh.material.emissive = new THREE.Color(0x000000);
      };
      fade();
    }, glowDuration);
  }

  // ─── QUEEN MOVEMENT ────────────────────────────
  async moveQueen(targetCol, targetRow, speed = 800) {
    if (!this.queenGroup) return;
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
        if (t < 1) requestAnimationFrame(tick); else resolve();
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
        if (t < 1) requestAnimationFrame(tick); else resolve();
      };
      tick();
    });
  }

  // ─── EVENT TEXT ────────────────────────────────
  async showText(text, holdMs = 3000) {
    this.eventTextEl.textContent = text;
    this.eventTextEl.style.transition = 'opacity 0.6s ease';
    this.eventTextEl.style.opacity = '1';
    await this.wait(holdMs);
    this.eventTextEl.style.transition = 'opacity 0.4s ease';
    this.eventTextEl.style.opacity = '0';
    await this.wait(500);
  }

  // ─── 10 EVENTS ─────────────────────────────────
  setupEvents() {
    this.events = [
      this.event1, this.event2, this.event3, this.event4, this.event5,
      this.event6, this.event7, this.event8, this.event9, this.event10,
    ].map(fn => fn.bind(this));
  }

  async startEventLoop() {
    await this.wait(500);
    while (true) {
      this.eventRunning = true;
      await this.events[this.eventIndex]();
      this.eventRunning = false;
      this.eventIndex = (this.eventIndex + 1) % this.events.length;
      await this.wait(2000);
      // Between events: pieces "look" at queen
      if (!this.isMobile) this.piecesLookAtQueen();
      await this.wait(1000);
    }
  }

  piecesLookAtQueen() {
    if (!this.queenGroup) return;
    this.pieces.forEach(p => {
      if (p.name === 'bQ') return;
      const dx = this.queenGroup.position.x - p.mesh.position.x;
      const dz = this.queenGroup.position.z - p.mesh.position.z;
      const targetAngle = Math.atan2(dx, dz);
      const startAngle = p.mesh.rotation.y;
      const startTime = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - startTime) / 800);
        p.mesh.rotation.y = startAngle + (targetAngle - startAngle) * this.easeInOutCubic(t);
        if (t < 1) requestAnimationFrame(tick);
      };
      tick();
    });
  }

  // 1. Queen Entrance
  async event1() {
    if (!this.queenGroup) return;
    const pos = this.boardPos(3, 7);
    this.queenGroup.position.set(pos.x, -5, pos.z);
    this.queenCol = 3; this.queenRow = 7;
    this.queenGroup.visible = true;

    await this.tweenValue(-5, 0, 1000, v => { this.queenGroup.position.y = v; });
    await this.tweenValue(0, 5, 300, v => { this.queenLight.intensity = v; });
    await this.tweenValue(5, 2, 500, v => { this.queenLight.intensity = v; });
    this.spawnParticles(pos.x, 0, pos.z, 30);
    await this.showText("BLACK QUEEN ENTERS THE GAME");
  }

  // 2. Diagonal Strike
  async event2() {
    this.queenCol = 0; this.queenRow = 0;
    this.queenGroup.position.copy(this.boardPos(0, 0)); this.queenGroup.position.y = 0;
    await this.moveQueen(7, 7, 600);
    await this.showText("WE CROSS ANY MARKET IN ONE MOVE");
  }

  // 3. Territory Capture
  async event3() {
    this.queenCol = 0; this.queenRow = 0;
    this.queenGroup.position.copy(this.boardPos(0, 0)); this.queenGroup.position.y = 0;
    await this.moveQueen(7, 0, 400);
    await this.moveQueen(7, 7, 400);
    await this.moveQueen(0, 7, 400);
    await this.moveQueen(0, 0, 400);
    await this.showText("FULL COVERAGE. EVERY REGION.");
  }

  // 4. Checkmate in One
  async event4() {
    this.queenCol = 3; this.queenRow = 3;
    this.queenGroup.position.copy(this.boardPos(3, 3)); this.queenGroup.position.y = 0;
    for (let i = 0; i < 3; i++) {
      await this.tweenValue(1, 1.1, 300, v => { this.queenGroup.scale.setScalar(v); });
      await this.tweenValue(1.1, 1, 300, v => { this.queenGroup.scale.setScalar(v); });
    }
    await this.moveQueen(6, 6, 500);
    await this.tweenValue(0.4, 2, 200, v => { this.ambientLight.intensity = v; });
    await this.tweenValue(2, 0.4, 600, v => { this.ambientLight.intensity = v; });
    this.spawnParticles(this.queenGroup.position.x, 0, this.queenGroup.position.z, 30);
    await this.showText("WE SEE THE WINNING MOVE FIRST");
  }

  // 5. Defense Wall
  async event5() {
    const tri = [[2,2],[5,2],[3,5]];
    this.queenCol = tri[0][0]; this.queenRow = tri[0][1];
    this.queenGroup.position.copy(this.boardPos(this.queenCol, this.queenRow)); this.queenGroup.position.y = 0;
    for (let i = 0; i < 6; i++) { const n = tri[(i+1)%3]; await this.moveQueen(n[0], n[1], 300); }
    await this.showText("YOUR BUSINESS. PROTECTED.");
  }

  // 6. Double Attack
  async event6() {
    this.queenCol = 3; this.queenRow = 4;
    this.queenGroup.position.copy(this.boardPos(3, 4)); this.queenGroup.position.y = 0;
    for (let i = 0; i < 4; i++) {
      this.animateCell(0, 7, 1000); this.animateCell(6, 1, 1000);
      await this.wait(800);
    }
    await this.showText("ONE SOLUTION. TWO PROBLEMS SOLVED.");
  }

  // 7. Queen Sacrifice
  async event7() {
    this.queenCol = 4; this.queenRow = 4;
    this.queenGroup.position.copy(this.boardPos(4, 4)); this.queenGroup.position.y = 0;
    await this.tweenValue(0, -3, 1200, v => { this.queenGroup.position.y = v; });
    this.cells.forEach(c => this.animateCell(c.col, c.row, 2000));
    await this.wait(1000);
    await this.tweenValue(-3, 0, 500, v => { this.queenGroup.position.y = v; });
    await this.tweenValue(2, 5, 200, v => { this.queenLight.intensity = v; });
    this.spawnParticles(this.queenGroup.position.x, 0, this.queenGroup.position.z, 30);
    await this.tweenValue(5, 2, 400, v => { this.queenLight.intensity = v; });
    await this.showText("THE BOLDEST MOVE IS COUNTERINTUITIVE");
  }

  // 8. Zugzwang
  async event8() {
    const dark = new THREE.Color(0x0d0d0d);
    this.cells.forEach(c => { c.mesh.material.color.copy(dark); });
    this.queenGroup.traverse(c => { if (c.material) c.material.emissiveIntensity = 1.0; });
    this.queenLight.intensity = 4;
    this.queenCol = 1; this.queenRow = 1;
    this.queenGroup.position.copy(this.boardPos(1, 1)); this.queenGroup.position.y = 0;
    await this.moveQueen(6, 1, 600);
    await this.moveQueen(6, 6, 600);
    await this.moveQueen(1, 6, 600);
    await this.showText("WHILE OTHERS FREEZE — WE MOVE");
    this.cells.forEach(c => { c.mesh.material.color.copy(c.originalColor); });
    this.queenGroup.traverse(c => { if (c.material) c.material.emissiveIntensity = 0.5; });
    this.queenLight.intensity = 2;
  }

  // 9. Promotion
  async event9() {
    const pawnMesh = this.buildPawn(this.whiteMat);
    const pawnStart = this.boardPos(0, 1);
    pawnMesh.position.copy(pawnStart);
    this.scene.add(pawnMesh);
    this.queenGroup.visible = false;

    for (let r = 2; r <= 7; r++) {
      const from = this.boardPos(0, r-1); const to = this.boardPos(0, r);
      await new Promise(resolve => {
        const s = performance.now();
        const tick = () => {
          const t = Math.min(1, (performance.now() - s) / 500);
          const e = this.easeInOutCubic(t);
          pawnMesh.position.x = from.x + (to.x - from.x) * e;
          pawnMesh.position.z = from.z + (to.z - from.z) * e;
          if (t < 1) requestAnimationFrame(tick); else resolve();
        };
        tick();
      });
      this.animateCell(0, r, 2000);
    }

    const pp = this.boardPos(0, 7);
    this.scene.remove(pawnMesh);
    pawnMesh.traverse(c => { if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose(); });
    this.queenCol = 0; this.queenRow = 7;
    this.queenGroup.position.copy(pp); this.queenGroup.position.y = 0;
    this.queenGroup.visible = true;
    this.spawnParticles(pp.x, 0, pp.z, 30);
    await this.tweenValue(2, 6, 200, v => { this.queenLight.intensity = v; });
    await this.tweenValue(6, 2, 500, v => { this.queenLight.intensity = v; });
    await this.showText("WE TURN MERCHANTS INTO GLOBAL PLAYERS");
  }

  // 10. Endgame
  async event10() {
    const dark = new THREE.Color(0x080808);
    this.cells.forEach(c => { c.mesh.material.color.copy(dark); c.mesh.material.emissive = new THREE.Color(0); });
    this.queenCol = 0; this.queenRow = 0;
    this.queenGroup.position.copy(this.boardPos(0, 0)); this.queenGroup.position.y = 0;
    await this.moveQueen(3, 3, 1200);
    for (let i = 0; i < 3; i++) {
      await this.tweenValue(2, 5, 800, v => { this.queenLight.intensity = v; });
      await this.tweenValue(5, 2, 800, v => { this.queenLight.intensity = v; });
    }
    await this.showText("THE GAME ISN'T OVER. IT'S JUST BEGINNING");
    this.cells.forEach(c => { c.mesh.material.color.copy(c.originalColor); });
  }

  // ─── ANIMATE LOOP ──────────────────────────────
  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = this.clock.getDelta();
    this.elapsedTime += dt;

    // Camera auto-rotate (gentle)
    this.angle += 0.0008;
    const radius = 16 + this.scrollY * 0.01;
    const baseX = this.baseCamX + Math.sin(this.angle) * 3;
    const baseZ = 16 + Math.cos(this.angle) * 2;

    this.camOffset.x += (this.targetCamOffset.x - this.camOffset.x) * 0.03;
    this.camOffset.y += (this.targetCamOffset.y - this.camOffset.y) * 0.03;

    this.camera.position.x = baseX + this.camOffset.x;
    this.camera.position.z = baseZ;
    this.camera.position.y = 10 + this.camOffset.y;
    this.camera.lookAt(this.boardOffsetX - 1, 0, 0);

    // Queen light follows
    if (this.queenGroup && this.queenGroup.visible) {
      this.queenLight.position.set(
        this.queenGroup.position.x, this.queenGroup.position.y + 3, this.queenGroup.position.z
      );
    }

    // Idle animations (only if board ready and not mobile)
    if (this.boardReady && !this.isMobile) {
      const time = this.elapsedTime;
      this.pieces.forEach((p, idx) => {
        // Gentle sway
        p.mesh.rotation.y += Math.sin(time + idx * 1.1) * 0.003;

        // Black queen pulse
        if (p.name === 'bQ') {
          p.mesh.traverse(c => {
            if (c.material && c.material.emissiveIntensity !== undefined) {
              c.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
            }
          });
        }
      });
    }

    this.updateParticles(dt);

    if (this.composer && !this.isMobile) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ─── LISTENERS ─────────────────────────────────
  bindListeners() {
    window.addEventListener('mousemove', e => {
      if (this.isMobile) return;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      this.targetCamOffset.x = this.mouse.x * 2;
      this.targetCamOffset.y = -this.mouse.y * 2;
    });
    window.addEventListener('scroll', () => { this.scrollY = window.scrollY; });

    const ro = new ResizeObserver(() => {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      if (this.composer) this.composer.setSize(this.width, this.height);
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth < 1024;
    });
    ro.observe(this.container);
  }

  // ─── EASING ────────────────────────────────────
  easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
  easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  easeInCubic(t) { return t * t * t; }
  easeOutBounce(t) {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1/d1) return n1*t*t;
    if (t < 2/d1) return n1*(t -= 1.5/d1)*t + 0.75;
    if (t < 2.5/d1) return n1*(t -= 2.25/d1)*t + 0.9375;
    return n1*(t -= 2.625/d1)*t + 0.984375;
  }
  easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}

if (typeof window !== 'undefined') {
  window.ChessBackground3D = ChessBackground3D;
}
