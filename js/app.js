/**
 * app.js — Entry point Museum 3D.
 *
 * ════════════════════════════════════════════════════════════════
 *  DENAH MUSEUM (top-view, sumbu Z positif = selatan)
 * ════════════════════════════════════════════════════════════════
 *
 *  z=-14  ╔══[P0 Arduino]═[P1 Cuaca]═[P2 Detektif]══╗
 *         ║          Galeri Utara                     ║
 *  z=-8   ║ [P5 Life Dash]     [P3 Chat Ocean]       ║  ← barat & timur
 *         ║                                           ║
 *         ║   ◻ GitHub      ◻ LinkedIn               ║
 *  z= 2.5 ║   ◻ Khanza  ◻ Azra  ◻ Yasmin (3D)        ║
 *         ║                                           ║
 *  z= 3   ║ [P6 StatLab]       [P4 Perpustakaan]    ║  ← barat & timur
 *         ║                                           ║
 *  z=+11  ║    [PAPAN SELAMAT DATANG]                ║
 *  z=+12  ║  ◻ Open to Work    ◻ Tech Stack          ║
 *  z=+14  ╚═══════════════════════════════════════════╝
 *
 *  Kamera start: (0, 1.7, 10) → menghadap utara (-z)
 *  Musik latar diputar otomatis saat klik "Masuk Museum" (lihat _initHint)
 * ════════════════════════════════════════════════════════════════
 *
 * ── Cara tambah pameran baru ────────────────────────────────────
 *  Lukisan  : edit EXHIBITS (exhibits.js) + PAINTING_LAYOUT (bawah)
 *  Patung 3D: tambah entry di MODEL_DISPLAYS (_buildExhibits, bawah)
 *  Gaya UI  : edit js/config/exhibit-styles.js
 * ════════════════════════════════════════════════════════════════
 */

import { EXHIBITS }          from "./data/exhibits.js";
import { buildMuseum, ROOM } from "./engine/Museum.js";
import { buildLighting }     from "./engine/Lighting.js";
import { createPainting }    from "./engine/Painting.js";
import { createWelcomeBoard} from "./engine/WelcomeBoard.js";
import { createModelDisplay} from "./engine/ModelDisplay.js";
import { createPhotoPanel }  from "./engine/PhotoPanel.js";
import { createNamesBoard }  from "./engine/NamesBoard.js";
import { InfoPanel }         from "./ui/InfoPanel.js";
import { DragControls }      from "./ui/DragControls.js";
import { runLoadingScreen, preWarmRenderer } from "./ui/LoadingScreen.js";
import { MusicPlayer }       from "./ui/MusicPlayer.js";

// ════════════════════════════════════════════════════════════════
//  KONSTANTA RUANGAN
// ════════════════════════════════════════════════════════════════

const { W, D } = ROOM;                    // W=22, D=28

const WALL = {
  N: -(D / 2) + 0.30,   // z = -13.70
  S:  (D / 2) - 0.30,   // z = +13.70
  E:  (W / 2) - 0.30,   // x = +10.70
  W: -(W / 2) + 0.30,   // x = -10.70
};

const FRAME_Y   = 2.8;    // ketinggian bingkai standar (diturunkan sedikit)

// ════════════════════════════════════════════════════════════════
//  LAYOUT LUKISAN
//  idx = indeks dalam array paintings (EXHIBITS filtered type==="painting")
//  Untuk tambah lukisan: tambah slot baru di sini + data di exhibits.js
// ════════════════════════════════════════════════════════════════

const PAINTING_LAYOUT = [
  // ── Dinding Utara — 5 bingkai foto (idx 7–11) ─────────────
  // Foto mulai dari paintings[7] karena paintings[0-6] = 7 proyek (slot dihapus)
  { idx: 7, pos: [-8.0, FRAME_Y, WALL.N], rotY: 0, w: 2.6, h: 2.0 },
  { idx: 8, pos: [-4.0, FRAME_Y, WALL.N], rotY: 0, w: 2.6, h: 2.0 },
  { idx: 9, pos: [   0, FRAME_Y, WALL.N], rotY: 0, w: 2.6, h: 2.0 },
  { idx:10, pos: [ 4.0, FRAME_Y, WALL.N], rotY: 0, w: 2.6, h: 2.0 },
  { idx:11, pos: [ 8.0, FRAME_Y, WALL.N], rotY: 0, w: 2.6, h: 2.0 },

  // ── Dinding Timur — 4 bingkai foto (idx 12–15) ────────────
  { idx:12, pos: [WALL.E, FRAME_Y,  -6.0], rotY: -Math.PI / 2, w: 2.6, h: 2.0 },
  { idx:13, pos: [WALL.E, FRAME_Y,  -1.5], rotY: -Math.PI / 2, w: 2.6, h: 2.0 },
  { idx:14, pos: [WALL.E, FRAME_Y,   3.0], rotY: -Math.PI / 2, w: 2.6, h: 2.0 },
  { idx:15, pos: [WALL.E, FRAME_Y,   7.5], rotY: -Math.PI / 2, w: 2.6, h: 2.0 },

  // ── Dinding Barat — 4 bingkai foto (idx 16–19) ────────────
  { idx:16, pos: [WALL.W, FRAME_Y,  -6.0], rotY:  Math.PI / 2, w: 2.6, h: 2.0 },
  { idx:17, pos: [WALL.W, FRAME_Y,  -1.5], rotY:  Math.PI / 2, w: 2.6, h: 2.0 },
  { idx:18, pos: [WALL.W, FRAME_Y,   3.0], rotY:  Math.PI / 2, w: 2.6, h: 2.0 },
  { idx:19, pos: [WALL.W, FRAME_Y,   7.5], rotY:  Math.PI / 2, w: 2.6, h: 2.0 },
];

// ════════════════════════════════════════════════════════════════
//  LABEL RUANGAN
// ════════════════════════════════════════════════════════════════

function getRoomLabel(z) {
  if (z < -5.5) return "Galeri Utara — Lukisan Seni";
  if (z <  5.5) return "Aula Tengah — Kubus Interaktif";
  return "Galeri Selatan — Proyek Digital";
}

// ════════════════════════════════════════════════════════════════
//  MuseumApp
// ════════════════════════════════════════════════════════════════

class MuseumApp {
  constructor() {
    this._exhibits      = [];
    this._modelDisplays = [];
    this._videoToggles  = {};
    this._clock       = new THREE.Clock();
    this._rlNameEl    = document.getElementById("rl-name");
    this._musicPlayer = null;
  }

  // ── Inisialisasi renderer ─────────────────────────────────

  _initRenderer() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
                  || window.innerWidth < 768;

    this._renderer = new THREE.WebGLRenderer({
      antialias:       !isMobile,
      powerPreference: "high-performance",
      precision:       isMobile ? "mediump" : "highp",
    });
    this._renderer.setSize(innerWidth, innerHeight);
    this._renderer.setPixelRatio(
      isMobile ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, 1.5)
    );
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this._renderer.domElement);
  }

  _initScene() {
    this._scene            = new THREE.Scene();
    this._scene.fog        = new THREE.FogExp2(0x8f8778, 0.014);
    this._scene.background = new THREE.Color(0x8f8778);
  }

  _initCamera() {
    this._camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.05, 60);
    this._camera.position.set(0, 1.7, 10);
  }

  _initResize() {
    window.addEventListener("resize", () => {
      this._camera.aspect = innerWidth / innerHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(innerWidth, innerHeight);
    });
  }

  // ── Bangun semua pameran ──────────────────────────────────

  _buildExhibits() {
    const scene     = this._scene;
    const paintings  = EXHIBITS.filter(e => e.type === "painting");

    // Lukisan di dinding
    for (const { idx, pos, rotY, w, h } of PAINTING_LAYOUT) {
      const data = paintings[idx];
      if (!data) continue;
      this._exhibits.push(
        createPainting(scene, data, new THREE.Vector3(...pos), rotY, w, h)
      );
    }

    // Papan selamat datang (lobby selatan)
    createWelcomeBoard(scene, { x: 0, z: WALL.S, rotY: Math.PI });

    // Foto "Guru Produktif DKV" — di sebelah kiri papan selamat datang
    // (jarak dilebarkan lagi, sejajar tinggi dgn papan selamat datang)
    this._exhibits.push(
      createPhotoPanel(scene, {
        x: 6.0, z: WALL.S, rotY: Math.PI,
        imageUrl: "assets/people/guru-dkv.jpeg",
        caption:  "Guru Produktif DKV",
        width:    3.8,
      })
    );

    // Daftar nama peserta — di sebelah kanan papan selamat datang, ukuran
    // disamakan dgn panel foto (menggantikan label nama yang dulu melayang
    // di atas tiap bingkai)
    const galleryNames = paintings.filter((p) => p.style === "gallery").map((p) => p.artist);

    // Tukar posisi Shafira & Azra di papan nama (permintaan Shafira) —
    // posisi lukisan di dinding tidak berubah, hanya urutan di papan ini.
    const iShafira = galleryNames.indexOf("Shafira");
    const iAzra    = galleryNames.indexOf("Azra");
    if (iShafira !== -1 && iAzra !== -1) {
      [galleryNames[iShafira], galleryNames[iAzra]] = [galleryNames[iAzra], galleryNames[iShafira]];
    }

    createNamesBoard(scene, {
      x: -6.0, z: WALL.S, rotY: Math.PI,
      width: 3.8, height: 3.8 * 1.514,
      names: [...galleryNames, "Aqiela", "Arkhan"],
    });

    // Papan denah (dinding barat, zona selatan)

    // Patung 3D — 3 model GLB di atas meja, berjejer di tengah aula
    const MODEL_DISPLAYS = [
      {
        position: new THREE.Vector3(-4.5, 0, 2.5),
        url:      "assets/models/sabun-khanza-3d.glb",
        videoUrl: "assets/videos/khanza.mp4",
        data: {
          id:     "khanza-3d",
          title:  "LOTUSOAP 3D — Khanza",
          artist: "Khanza",
          year:   "2026",
          desc:   "Replika 3D kemasan sabun LOTUSOAP — versi tiga dimensi dari desain kemasan karya Khanza.",
          videoUrl: "assets/videos/khanza.mp4",
        },
      },
      {
        position: new THREE.Vector3(0, 0, 2.5),
        url:      "assets/models/sabun-azra-3d.glb",
        videoUrl: "assets/videos/azra.mp4",
        data: {
          id:     "azra-3d",
          title:  "Terapure 3D — Azra",
          artist: "Azra",
          year:   "2026",
          desc:   "Replika 3D kemasan sabun Terapure — versi tiga dimensi dari desain jaring-jaring kemasan karya Azra.",
          videoUrl: "assets/videos/azra.mp4",
        },
      },
      {
        position: new THREE.Vector3(4.5, 0, 2.5),
        url:      "assets/models/sabun-yasmin-3d.glb",
        data: {
          id:     "yasmin-3d",
          title:  "Sabun Yasmin 3D — Yasmin",
          artist: "Yasmin",
          year:   "2026",
          desc:   "Replika 3D desain kemasan sabun karya Yasmin.",
        },
      },
    ];

    for (const opts of MODEL_DISPLAYS) {
      const modelDisplay = createModelDisplay(scene, opts);
      this._exhibits.push(modelDisplay);
      this._modelDisplays.push(modelDisplay);
      if (modelDisplay.toggleVideo) {
        this._videoToggles[opts.data.id] = modelDisplay.toggleVideo;
      }
    }
  }

  // ── Musik ─────────────────────────────────────────────────

  _initMusic() {
    const videoId = "LxVOZlP78dg";

    this._musicPlayer = new MusicPlayer(videoId);

    const badge = document.getElementById("now-playing");
    const label = badge?.querySelector(".np-text");

    this._musicPlayer.onStateChange((playing) => {
      if (badge) {
        badge.classList.add("np-on");
        badge.classList.toggle("paused", !playing);
        badge.setAttribute("aria-pressed", String(playing));
        badge.setAttribute("aria-label", playing ? "Jeda musik latar" : "Lanjutkan musik latar");
      }
      if (label) label.textContent = playing ? "Now Playing" : "Dijeda";
      document.dispatchEvent(
        new CustomEvent("museum:music-state", { detail: { playing } })
      );
    });

    document.addEventListener("museum:music-toggle", () => {
      this._musicPlayer.toggle();
    });

    // Panel di kanan bawah bisa diklik langsung utk pause/lanjutkan musik
    if (badge) {
      const toggle = () => document.dispatchEvent(new CustomEvent("museum:music-toggle"));
      badge.addEventListener("click", toggle);
      badge.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    }
  }

  // ── Video patung (toggle 3D ↔ video) ───────────────────────

  _initVideoToggle() {
    document.addEventListener("museum:video-toggle", (e) => {
      const { id } = e.detail;
      const toggle = this._videoToggles[id];
      if (!toggle) return;
      const showing = toggle();
      document.dispatchEvent(
        new CustomEvent("museum:video-state", { detail: { id, showing } })
      );
    });
  }

  // ── Layar hint (selamat datang) ───────────────────────────

  _initHint() {
    const hint    = document.getElementById("hint");
    const dismiss = () => {
      hint.classList.add("off");
      this._musicPlayer.play();   // musik otomatis main begitu masuk museum
    };

    document.getElementById("enter-btn").addEventListener("click", dismiss);
    this._renderer.domElement.addEventListener("mousedown",  dismiss);
    this._renderer.domElement.addEventListener("touchstart", dismiss, { passive: true });
  }

  // ── Game loop ─────────────────────────────────────────────

  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this._clock.getDelta();

    this._controls.update(dt);
    this._rlNameEl.textContent = getRoomLabel(this._camera.position.z);
    this._infoPanel.update(this._camera.position, this._exhibits);

    // Putar pelan meja model 3D (efek turntable) — kalau lagi tampilkan
    // video, berhenti muter & langsung hadapkan layarnya lurus ke kamera
    // (bukan berhenti di sudut sisa putaran yang miring/acak).
    this._modelDisplays.forEach((md) => {
      if (md.videoState.showing) {
        const dx = this._camera.position.x - md.mesh.position.x;
        const dz = this._camera.position.z - md.mesh.position.z;
        md.mesh.rotation.y = Math.atan2(dx, dz);
      } else {
        md.mesh.rotation.y += 0.006;
      }
    });

    this._renderer.render(this._scene, this._camera);
  }

  // ── Start ─────────────────────────────────────────────────

  async start() {
    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initResize();

    buildMuseum(this._scene);
    buildLighting(this._scene);
    this._buildExhibits();
    this._initMusic();
    this._initVideoToggle();

    this._infoPanel = new InfoPanel();
    this._controls  = new DragControls(this._camera, this._renderer.domElement, ROOM);

    this._initHint();

    await preWarmRenderer(this._renderer, this._scene, this._camera);
    await runLoadingScreen();
    this._loop();
  }
}

new MuseumApp().start();
