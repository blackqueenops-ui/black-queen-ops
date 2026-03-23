/**
 * Black Queen Ops — 3D Chess Game v3
 * Full 32-piece game, blacks win with queen sacrifice
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
    this.elapsed = 0;
    this.angle = 0;
    this.autoRotateSpeed = 0.0004;
    this.cells = [];
    this.particles = [];
    this.boardOffsetX = this.isTablet ? 2 : 4;
    this.shakeUntil = 0;
    this.shakeIntensity = 0.05;

    // Board state: board[row][col] = piece ref or null
    // row 0 = rank 1 (white), row 7 = rank 8 (black)
    // col 0 = a, col 7 = h
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));

    this.init();
    this.createBoard();
    this.createLights();
    if (!this.isMobile) this.setupBloom();
    this.bindListeners();
    this.animate();
    this.startGame();
  }

  // ═══ INIT ═══════════════════════════════════════
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
    if (this.isMobile) this.renderer.domElement.style.opacity = '0.4';

    const c = this.renderer.domElement;
    Object.assign(c.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', zIndex: '0', pointerEvents: 'none'
    });
    this.container.appendChild(c);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);
    this.baseFogDensity = 0.035;

    this.camera = new THREE.PerspectiveCamera(
      this.isMobile ? 60 : 50, this.width / this.height, 0.1, 100
    );
    this.baseCamX = this.isTablet ? -2 : -4;
    this.camera.position.set(this.baseCamX, 12, 16);
    this.camera.lookAt(this.boardOffsetX - 1, 0, 0);
    this.baseCamY = 12;
    this.baseCamZ = 16;
    this.camZoomOffset = 0;

    // Text overlay
    this.textEl = document.createElement('div');
    Object.assign(this.textEl.style, {
      position: 'absolute', bottom: '40px', left: '40px', zIndex: '2',
      color: '#b8971f', fontSize: '12px', letterSpacing: '0.12em',
      fontFamily: 'inherit', fontWeight: '500', opacity: '0',
      transition: 'opacity 0.5s ease', pointerEvents: 'none', textTransform: 'uppercase',
    });
    this.container.appendChild(this.textEl);

    // Flash overlay
    this.flashEl = document.createElement('div');
    Object.assign(this.flashEl.style, {
      position: 'absolute', inset: '0', zIndex: '1',
      background: 'rgba(184,151,31,0)', pointerEvents: 'none',
      transition: 'background 0.1s ease',
    });
    this.container.appendChild(this.flashEl);

    // Capture light (red flash for takes)
    this.captureLight = new THREE.PointLight(0xff2200, 0, 6, 2);
    this.captureLight.position.set(0, 2, 0);
    this.scene.add(this.captureLight);
  }

  // ═══ BOARD ══════════════════════════════════════
  createBoard() {
    const dkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a0d, roughness: 0.8, metalness: 0.2 });
    const ltMat = new THREE.MeshStandardMaterial({ color: 0x2a2500, roughness: 0.6, metalness: 0.4 });
    const geo = this.isMobile
      ? new THREE.PlaneGeometry(1.96, 1.96)
      : new THREE.BoxGeometry(1.96, 0.2, 1.96);

    this.leftHalf = new THREE.Group();
    this.rightHalf = new THREE.Group();
    this.boardGroup = new THREE.Group();
    this.boardGroup.position.x = this.boardOffsetX;
    this.boardGroup.add(this.leftHalf);
    this.boardGroup.add(this.rightHalf);
    this.scene.add(this.boardGroup);

    this.leftHalf.rotation.z = Math.PI / 2;
    this.rightHalf.rotation.z = -Math.PI / 2;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const dark = (r + c) % 2 === 1;
        const m = new THREE.Mesh(geo, dark ? dkMat.clone() : ltMat.clone());
        const x = (c - 3.5) * 2, z = (r - 3.5) * 2;
        if (this.isMobile) m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0, z);
        m.receiveShadow = true;
        m.castShadow = !this.isMobile;
        (c < 4 ? this.leftHalf : this.rightHalf).add(m);
        this.cells.push({ col: c, row: r, mesh: m, origColor: null });
      }
    }
    this.cells.forEach(c => { c.origColor = c.mesh.material.color.clone(); });
  }

  bp(col, row) { return new THREE.Vector3((col - 3.5) * 2 + this.boardOffsetX, 0, (row - 3.5) * 2); }

  getCell(col, row) { return this.cells.find(c => c.col === col && c.row === row); }

  // ═══ MATERIALS ══════════════════════════════════
  wMat() { return new THREE.MeshStandardMaterial({ color: 0xd4c5a0, roughness: 0.4, metalness: 0.5 }); }
  bMat() { return new THREE.MeshStandardMaterial({ color: 0xb8971f, roughness: 0.15, metalness: 0.95, emissive: 0x3d2a00, emissiveIntensity: 0.4 }); }

  // ═══ PIECE BUILDERS ═════════════════════════════
  mkPawn(m) {
    const g = new THREE.Group();
    g.add(this._cy(0.2, 0.3, 0.15, m, 0.175));
    g.add(this._cy(0.15, 0.2, 0.45, m, 0.525));
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), m); h.position.y = 0.85; g.add(h);
    return g;
  }
  mkRook(m) {
    const g = new THREE.Group();
    g.add(this._cy(0.35, 0.4, 0.8, m, 0.5));
    g.add(this._cy(0.4, 0.4, 0.2, m, 1.0));
    for (let i = 0; i < 4; i++) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), m);
      const a = (i / 4) * Math.PI * 2;
      t.position.set(Math.cos(a) * 0.3, 1.2, Math.sin(a) * 0.3); g.add(t);
    }
    return g;
  }
  mkKnight(m) {
    const g = new THREE.Group();
    g.add(this._cy(0.3, 0.35, 0.7, m, 0.45));
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.35), m);
    h.position.set(0.05, 1.05, -0.05); h.rotation.x = -0.4; g.add(h);
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), m);
    n.position.set(0.1, 1.1, -0.25); g.add(n);
    return g;
  }
  mkBishop(m) {
    const g = new THREE.Group();
    g.add(this._cy(0.18, 0.35, 0.9, m, 0.55));
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), m); h.position.y = 1.15; g.add(h);
    g.add(this._cy(0.05, 0.05, 0.15, m, 1.45));
    return g;
  }
  mkQueen(m) {
    const g = new THREE.Group();
    g.add(this._cy(0.5, 0.65, 0.25, m, 0.225));
    g.add(this._cy(0.3, 0.5, 0.85, m, 0.775));
    g.add(this._cy(0.22, 0.3, 0.25, m, 1.325));
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), m); h.position.y = 1.65; g.add(h);
    for (let i = 0; i < 5; i++) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.35, 8), m);
      const a = (i / 5) * Math.PI * 2;
      s.position.set(Math.cos(a) * 0.24, 1.95, Math.sin(a) * 0.24);
      s.rotation.x = Math.cos(a) * 0.3; s.rotation.z = -Math.sin(a) * 0.3;
      g.add(s);
    }
    return g;
  }
  mkKing(m) {
    const g = new THREE.Group();
    g.add(this._cy(0.5, 0.65, 0.25, m, 0.225));
    g.add(this._cy(0.3, 0.5, 1.0, m, 0.85));
    g.add(this._cy(0.22, 0.3, 0.25, m, 1.475));
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), m); h.position.y = 1.8; g.add(h);
    const cv = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.35, 0.07), m); cv.position.y = 2.25; g.add(cv);
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.28), m); ch.position.y = 2.3; g.add(ch);
    return g;
  }
  _cy(rt, rb, h, m, y) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 20), m);
    c.position.y = y; return c;
  }

  // ═══ SETUP ALL 32 PIECES ════════════════════════
  setupPieces() {
    this.piecesGroup = new THREE.Group();
    this.piecesGroup.position.x = this.boardOffsetX;
    this.scene.add(this.piecesGroup);
    this.allPieces = [];
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));

    const W = 'w', B = 'b';
    // [col, row, type, side]
    const layout = [
      [0,0,'R',W],[1,0,'N',W],[2,0,'B',W],[3,0,'Q',W],[4,0,'K',W],[5,0,'B',W],[6,0,'N',W],[7,0,'R',W],
      [0,1,'P',W],[1,1,'P',W],[2,1,'P',W],[3,1,'P',W],[4,1,'P',W],[5,1,'P',W],[6,1,'P',W],[7,1,'P',W],
      [0,6,'P',B],[1,6,'P',B],[2,6,'P',B],[3,6,'P',B],[4,6,'P',B],[5,6,'P',B],[6,6,'P',B],[7,6,'P',B],
      [0,7,'R',B],[1,7,'N',B],[2,7,'B',B],[3,7,'Q',B],[4,7,'K',B],[5,7,'B',B],[6,7,'N',B],[7,7,'R',B],
    ];

    const builders = { P: 'mkPawn', R: 'mkRook', N: 'mkKnight', B: 'mkBishop', Q: 'mkQueen', K: 'mkKing' };

    layout.forEach(([col, row, type, side]) => {
      const mat = side === W ? this.wMat() : this.bMat();
      const mesh = this[builders[type]](mat);
      const x = (col - 3.5) * 2, z = (row - 3.5) * 2;
      mesh.position.set(x, 8, z);
      mesh.visible = false;
      mesh.traverse(c => {
        if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
      });
      this.piecesGroup.add(mesh);
      const piece = { mesh, col, row, type, side, alive: true };
      this.allPieces.push(piece);
      this.board[row][col] = piece;
    });
  }

  pieceAt(col, row) { return this.board[row] && this.board[row][col]; }

  // ═══ LIGHTS ═════════════════════════════════════
  createLights() {
    this.ambientLight = new THREE.AmbientLight(0x1a1400, 0.4);
    this.scene.add(this.ambientLight);
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.dirLight.position.set(5, 10, 5);
    if (!this.isMobile) {
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.set(2048, 2048);
      const sc = this.dirLight.shadow.camera;
      sc.near = 0.5; sc.far = 50; sc.left = -15; sc.right = 15; sc.top = 15; sc.bottom = -15;
    }
    this.scene.add(this.dirLight);

    this.queenLight = new THREE.PointLight(0xb8971f, 1.5, 8, 2);
    this.queenLight.position.set(this.boardOffsetX, 3, 0);
    this.scene.add(this.queenLight);

    this.spotLight = new THREE.SpotLight(0xfff5d6, 0.8, 40, 0.4, 0.5);
    this.spotLight.position.set(this.boardOffsetX, 20, 0);
    this.scene.add(this.spotLight);

    this.rimLight = new THREE.DirectionalLight(0x4a3800, 0.6);
    this.rimLight.position.set(-8, 4, -4);
    this.scene.add(this.rimLight);

    this.underLight = new THREE.PointLight(0x1a0f00, 0.3, 12, 2);
    this.underLight.position.set(this.boardOffsetX, -2, 0);
    this.scene.add(this.underLight);
  }

  // ═══ BLOOM ══════════════════════════════════════
  setupBloom() {
    if (typeof THREE.EffectComposer === 'undefined') return;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(this.width, this.height), 0.8, 0.4, 0.6);
    this.composer.addPass(this.bloomPass);
  }

  // ═══ ANIMATIONS ═════════════════════════════════
  async movePiece(fromCol, fromRow, toCol, toRow, duration = 900) {
    const piece = this.pieceAt(fromCol, fromRow);
    if (!piece) return;
    const captured = this.pieceAt(toCol, toRow);

    const from3 = this.bp(fromCol, fromRow);
    const to3 = this.bp(toCol, toRow);

    // Arc move: up → across → down
    await new Promise(resolve => {
      const start = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / duration);
        const e = this.easeInOutCubic(t);
        // XZ linear interpolation
        piece.mesh.position.x = from3.x + (to3.x - from3.x) * e - this.boardOffsetX;
        piece.mesh.position.z = from3.z + (to3.z - from3.z) * e;
        // Y arc: up then down
        const arc = Math.sin(t * Math.PI) * 1.5;
        piece.mesh.position.y = arc;
        if (t < 1) requestAnimationFrame(tick);
        else { piece.mesh.position.y = 0; resolve(); }
      };
      tick();
    });

    // Handle capture
    if (captured && captured !== piece) {
      await this.captureAnim(captured, toCol, toRow);
    }

    // Update board state
    this.board[fromRow][fromCol] = null;
    this.board[toRow][toCol] = piece;
    piece.col = toCol;
    piece.row = toRow;

    // Cell glow
    this.glowCell(toCol, toRow, 0xb8971f, 1500);
  }

  async captureAnim(captured, col, row) {
    // Red flash
    const p = this.bp(col, row);
    this.captureLight.position.set(p.x, 2, p.z);
    await this.tv(0, 4, 150, v => { this.captureLight.intensity = v; });
    await this.tv(4, 0, 150, v => { this.captureLight.intensity = v; });

    // Piece falls
    captured.alive = false;
    await this.tv(0, -3, 400, v => { captured.mesh.position.y = v; });
    captured.mesh.visible = false;
    this.board[captured.row][captured.col] = null;
  }

  glowCell(col, row, color, dur = 2000) {
    const cell = this.getCell(col, row);
    if (!cell) return;
    const gc = new THREE.Color(color);
    cell.mesh.material.color.copy(gc);
    cell.mesh.material.emissive = gc.clone();
    cell.mesh.material.emissiveIntensity = 0.3;

    // Bump
    if (!this.isMobile) {
      const st = performance.now();
      const bump = () => {
        const el = performance.now() - st;
        if (el < 200) cell.mesh.position.y = 0.3 * this.easeOutCubic(el / 200);
        else if (el < 500) cell.mesh.position.y = 0.3 * (1 - (el - 200) / 300);
        else { cell.mesh.position.y = 0; return; }
        requestAnimationFrame(bump);
      };
      bump();
    }

    setTimeout(() => {
      const st = performance.now();
      const fade = () => {
        const t = Math.min(1, (performance.now() - st) / 1200);
        cell.mesh.material.color.lerpColors(gc, cell.origColor, t);
        cell.mesh.material.emissiveIntensity = 0.3 * (1 - t);
        if (t < 1) requestAnimationFrame(fade);
        else cell.mesh.material.emissive = new THREE.Color(0);
      };
      fade();
    }, dur);
  }

  pulseCell(col, row, color, times = 2) {
    const cell = this.getCell(col, row);
    if (!cell) return;
    const gc = new THREE.Color(color);
    let count = 0;
    const pulse = () => {
      if (count >= times) { cell.mesh.material.color.copy(cell.origColor); cell.mesh.material.emissive = new THREE.Color(0); return; }
      cell.mesh.material.color.copy(gc);
      cell.mesh.material.emissive = gc.clone();
      cell.mesh.material.emissiveIntensity = 0.5;
      setTimeout(() => {
        cell.mesh.material.color.copy(cell.origColor);
        cell.mesh.material.emissive = new THREE.Color(0);
        count++;
        setTimeout(pulse, 200);
      }, 300);
    };
    pulse();
  }

  async shakeCamera(dur = 500, intensity = 0.05) {
    this.shakeUntil = performance.now() + dur;
    this.shakeIntensity = intensity;
  }

  async zoomCamera(dz, dur = 1000) {
    await this.tv(this.camZoomOffset, dz, dur, v => { this.camZoomOffset = v; });
  }

  screenFlash() {
    this.flashEl.style.transition = 'background 0.05s ease';
    this.flashEl.style.background = 'rgba(184,151,31,0.15)';
    setTimeout(() => {
      this.flashEl.style.transition = 'background 0.3s ease';
      this.flashEl.style.background = 'rgba(184,151,31,0)';
    }, 100);
  }

  spawnParticles(x, y, z, count = 30) {
    if (this.isMobile) return;
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb8971f, emissive: 0xff9900, emissiveIntensity: 0.8, transparent: true, opacity: 1
    });
    const geo = new THREE.SphereGeometry(0.04, 8, 8);
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, mat.clone());
      m.position.set(x, y + 0.5, z);
      this.scene.add(m);
      this.particles.push({
        mesh: m,
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
      p.age += dt; p.vy -= 0.003;
      p.mesh.position.x += p.vx; p.mesh.position.y += p.vy; p.mesh.position.z += p.vz;
      p.mesh.material.opacity = Math.max(0, 1 - p.age / p.life);
      if (p.age >= p.life) {
        this.scene.remove(p.mesh); p.mesh.geometry.dispose(); p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  async showText(text, holdMs = 2500, size = '12px', spacing = '0.12em') {
    this.textEl.style.fontSize = size;
    this.textEl.style.letterSpacing = spacing;
    this.textEl.textContent = text;
    this.textEl.style.transition = 'opacity 0.5s ease';
    this.textEl.style.opacity = '1';
    await this.wait(holdMs);
    this.textEl.style.transition = 'opacity 0.4s ease';
    this.textEl.style.opacity = '0';
    await this.wait(500);
  }

  // ═══ GAME LOOP ══════════════════════════════════
  async startGame() {
    while (true) {
      await this.wait(300);
      this.setupPieces();

      // Book-open
      await new Promise(resolve => {
        const start = performance.now();
        const tick = () => {
          const t = Math.min(1, (performance.now() - start) / 1800);
          const e = this.easeOutBounce(t);
          this.leftHalf.rotation.z = (Math.PI / 2) * (1 - e);
          this.rightHalf.rotation.z = -(Math.PI / 2) * (1 - e);
          if (t < 1) requestAnimationFrame(tick);
          else { this.leftHalf.rotation.z = 0; this.rightHalf.rotation.z = 0; resolve(); }
        };
        tick();
      });

      // Drop pieces with stagger
      const sorted = [...this.allPieces].sort((a, b) => a.row - b.row + (a.col - b.col) * 0.1);
      sorted.forEach((p, i) => {
        setTimeout(() => {
          p.mesh.visible = true;
          const st = performance.now();
          const tick = () => {
            const t = Math.min(1, (performance.now() - st) / 500);
            p.mesh.position.y = 8 + (0 - 8) * this.easeOutBack(t);
            if (t < 1) requestAnimationFrame(tick); else p.mesh.position.y = 0;
          };
          tick();
        }, i * 60);
      });

      await this.wait(sorted.length * 60 + 700);

      // ═══ PLAY THE GAME ═══
      await this.playGame();

      // ═══ RESET ═══
      await this.wait(2000);

      // Fade out all pieces
      await new Promise(resolve => {
        const st = performance.now();
        const tick = () => {
          const t = Math.min(1, (performance.now() - st) / 1500);
          this.allPieces.forEach(p => {
            p.mesh.traverse(c => {
              if (c.material) { c.material.transparent = true; c.material.opacity = 1 - t; }
            });
          });
          if (t < 1) requestAnimationFrame(tick);
          else {
            this.allPieces.forEach(p => { this.piecesGroup.remove(p.mesh); });
            resolve();
          }
        };
        tick();
      });

      this.scene.remove(this.piecesGroup);
      this.scene.fog.density = this.baseFogDensity;
      this.autoRotateSpeed = 0.0004;
      this.camZoomOffset = 0;
      this.cells.forEach(c => { c.mesh.material.color.copy(c.origColor); c.mesh.material.emissive = new THREE.Color(0); });

      // Re-fold board for next loop
      this.leftHalf.rotation.z = Math.PI / 2;
      this.rightHalf.rotation.z = -Math.PI / 2;

      await this.wait(1000);
    }
  }

  async playGame() {
    const M = (fc, fr, tc, tr, dur) => this.movePiece(fc, fr, tc, tr, dur || 900);

    // ─── MOVE 1: e2→e4 / e7→e5 ───
    await M(4, 1, 4, 3); await this.wait(700);
    await M(4, 6, 4, 4); await this.wait(800);

    // ─── MOVE 2: Nf3 / Nc6 ───
    await M(6, 0, 5, 2); await this.wait(700);
    await M(1, 7, 2, 5); await this.wait(800);

    // ─── MOVE 3: Bc4 / Bc5 ───
    await M(5, 0, 2, 3); await this.wait(700);
    await M(5, 7, 2, 4); await this.wait(400);
    await this.showText("POSITION YOUR PIECES");
    await this.wait(800);

    // ─── MOVE 4: Ng5 / d5 ───
    await M(5, 2, 6, 4); await this.wait(700);
    await M(3, 6, 3, 4);
    // d5 pawn pulses gold
    this.glowCell(3, 4, 0xb8971f, 2500);
    await this.showText("WE STRIKE BACK IMMEDIATELY");
    await this.wait(700);

    // ─── MOVE 5: exd5 / Na5 ───
    await M(4, 3, 3, 4); await this.wait(700); // pawn takes d5
    await M(2, 5, 0, 4); await this.wait(800); // knight to a5

    // ─── MOVE 6: Bb5+ / c6 ───
    await M(2, 3, 1, 4); await this.wait(300); // bishop to b5 check
    // Check effect — king cell e8 flashes red
    this.pulseCell(4, 7, 0xff2200, 2);
    this.shakeCamera(500);
    await this.wait(800);
    await M(2, 6, 2, 5); await this.wait(800); // c6

    // ─── MOVE 7: dxc6 / bxc6 ───
    await M(3, 4, 2, 5); await this.wait(700); // pawn takes c6
    await M(1, 6, 2, 5); await this.wait(800); // b takes c6

    // ─── MOVE 8: Be2 / h6 ───
    await M(1, 4, 4, 1); await this.wait(700); // bishop retreats to e2
    await M(7, 6, 7, 5); await this.wait(700); // h6

    // ─── MOVE 9: Nf3 / e4 ───
    await M(6, 4, 5, 2); await this.wait(700); // knight retreats
    await M(4, 4, 4, 3); // e5→e4 pawn push
    this.glowCell(4, 3, 0xb8971f, 3000);
    await this.showText("WE TAKE THE CENTER");
    await this.wait(700);

    // ═══ MOVE 10: Ne5 / Qd4!! KEY MOMENT ═══
    await M(5, 2, 4, 4); await this.wait(700); // knight to e5

    // Black queen comes out — SLOW
    await M(3, 7, 3, 3, 1800);

    // Effects
    const qp = this.bp(3, 3);
    await this.zoomCamera(-4, 1000);
    await this.tv(1.5, 5, 300, v => { this.queenLight.intensity = v; });
    this.queenLight.position.set(qp.x, 3, qp.z);
    this.spawnParticles(qp.x, 0, qp.z, 50);
    // Fork targets pulse
    this.pulseCell(5, 1, 0xff2200, 3); // f2
    this.pulseCell(0, 4, 0xff2200, 3); // a5 area
    this.spotLight.target.position.set(qp.x, 0, qp.z);

    await this.showText("BLACK QUEEN ENTERS THE GAME");
    await this.tv(5, 1.5, 800, v => { this.queenLight.intensity = v; });
    await this.zoomCamera(0, 800);
    await this.wait(1500);

    // ═══ MOVE 11: Nxf7 / Qxf2+!! QUEEN SACRIFICE ═══
    // White knight takes f7
    await M(4, 4, 5, 6, 600);
    await this.wait(400);

    // Black queen takes f2 — CHECK — SLOW
    await M(3, 3, 5, 1, 2000);
    this.screenFlash();
    this.shakeCamera(600, 0.08);
    this.pulseCell(4, 0, 0xff2200, 3); // king e1 flashes
    const qf2 = this.bp(5, 1);
    this.spawnParticles(qf2.x, 0, qf2.z, 80);
    await this.zoomCamera(3, 500); // zoom out

    await this.showText("THE QUEEN SACRIFICES HERSELF");
    await this.zoomCamera(0, 800);
    await this.wait(1500);

    // King takes queen: Kxf2
    await M(4, 0, 5, 1, 700);
    await this.wait(600);

    // ═══ MOVE 12: MATING SEQUENCE ═══

    // Bd4+ (black bishop from c5=col2,row4 to d4=col3,row3 — check)
    // Actually the bishop is at c5 (col=2, row=4)
    await M(2, 4, 3, 3, 800);
    this.pulseCell(5, 1, 0xff2200, 2);
    this.shakeCamera(400);
    await this.wait(600);

    // Kf2→e1 (king retreats)
    await M(5, 1, 4, 0, 700);
    await this.wait(600);

    // Na5→c4+ (knight check) — knight was at a5 (col=0, row=4)
    await M(0, 4, 2, 3, 800);
    this.pulseCell(4, 0, 0xff2200, 2);
    this.shakeCamera(400);
    await this.wait(600);

    // Ke1→d1
    await M(4, 0, 3, 0, 700);
    await this.wait(600);

    // Ne3# CHECKMATE
    await M(2, 3, 4, 2, 1200);

    // ═══ CHECKMATE EFFECTS ═══
    this.autoRotateSpeed = 0.003;

    // White king glows red
    const wKing = this.pieceAt(3, 0);
    if (wKing) {
      wKing.mesh.traverse(c => {
        if (c.material) {
          c.material.emissive = new THREE.Color(0xff0000);
          c.material.emissiveIntensity = 0;
        }
      });
      this.tv(0, 2, 2000, v => {
        if (wKing.mesh) wKing.mesh.traverse(c => {
          if (c.material && c.material.emissive) c.material.emissiveIntensity = v;
        });
      });
    }

    // All black pieces glow gold
    this.allPieces.filter(p => p.side === 'b' && p.alive).forEach(p => {
      p.mesh.traverse(c => {
        if (c.material) c.material.emissiveIntensity = 1.5;
      });
      const pos = this.bp(p.col, p.row);
      this.spawnParticles(pos.x, 0, pos.z, 25);
    });

    // Board golden wave
    const cx = 3.5, cy = 3.5;
    this.cells.forEach(c => {
      const dist = Math.sqrt((c.col - cx) ** 2 + (c.row - cy) ** 2);
      setTimeout(() => this.glowCell(c.col, c.row, 0xb8971f, 3000), dist * 120);
    });

    // Fog clears
    this.tv(0.035, 0.01, 2000, v => { this.scene.fog.density = v; });

    // CHECKMATE text — bigger
    await this.showText("CHECKMATE.", 3000, '20px', '0.3em');
    await this.showText("YOUR GATEWAY TO GLOBAL PAYMENTS", 4000, '14px', '0.15em');

    // Restore
    this.autoRotateSpeed = 0.0004;
    this.allPieces.filter(p => p.side === 'b' && p.alive).forEach(p => {
      p.mesh.traverse(c => { if (c.material) c.material.emissiveIntensity = 0.4; });
    });
    if (wKing && wKing.mesh) {
      wKing.mesh.traverse(c => {
        if (c.material) { c.material.emissive = new THREE.Color(0); c.material.emissiveIntensity = 0; }
      });
    }
  }

  // ═══ ANIMATE LOOP ═══════════════════════════════
  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = this.clock.getDelta();
    this.elapsed += dt;

    this.angle += this.autoRotateSpeed;
    const r = 16 + this.scrollY * 0.01 + this.camZoomOffset;
    const bx = this.baseCamX + Math.sin(this.angle) * 3;
    const bz = this.baseCamZ + Math.cos(this.angle) * 2;

    this.camOffset.x += (this.targetCamOffset.x - this.camOffset.x) * 0.03;
    this.camOffset.y += (this.targetCamOffset.y - this.camOffset.y) * 0.03;

    let cx = bx + this.camOffset.x;
    let cy = this.baseCamY + this.camOffset.y;
    let cz = bz + this.camZoomOffset;

    // Camera shake
    if (performance.now() < this.shakeUntil) {
      cx += Math.sin(this.elapsed * 50) * this.shakeIntensity;
      cy += Math.cos(this.elapsed * 47) * this.shakeIntensity * 0.5;
    }

    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(this.boardOffsetX - 1, 0, 0);

    // Idle piece sway (not mobile)
    if (this.allPieces && !this.isMobile) {
      this.allPieces.forEach((p, i) => {
        if (p.alive && p.mesh.visible) {
          p.mesh.rotation.y += Math.sin(this.elapsed + i * 0.7) * 0.001;
        }
      });
    }

    this.updateParticles(dt);

    if (this.composer && !this.isMobile) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  // ═══ LISTENERS ══════════════════════════════════
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

  // ═══ UTILS ══════════════════════════════════════
  tv(from, to, dur, fn) {
    return new Promise(resolve => {
      const s = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - s) / dur);
        fn(from + (to - from) * this.easeInOutCubic(t));
        if (t < 1) requestAnimationFrame(tick); else resolve();
      };
      tick();
    });
  }
  easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
  easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  easeOutBounce(t) {
    const n=7.5625,d=2.75;
    if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;
    if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375;
  }
  easeOutBack(t) { const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); }
  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}

if (typeof window !== 'undefined') window.ChessBackground3D = ChessBackground3D;
