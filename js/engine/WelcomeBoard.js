/**
 * WelcomeBoard.js — Papan selamat datang, nempel di dinding museum.
 *
 * Terdiri dari:
 *   - Bingkai emas luar & dalam (menempel rata di dinding, seperti bingkai lukisan)
 *   - Tekstur canvas: judul, garis ornamen, teks sambutan, nama pembuat
 *   - Spotlight hangat dari atas yang menerangi papan
 *
 * Cara mengubah isi teks:
 *   Edit konstanta BOARD_TEXT di bawah, lalu refresh browser.
 *
 * Dependensi: THREE (global)
 */

// ─── Konten Teks Papan ────────────────────────────────────────────────────────
const BOARD_TEXT = {
  subtitle: "Selamat Datang Di",
  title:    "Museum 3D",
  tagline:  "Galeri Seni Digital",
  divider:  "",
  body: [
    "Koleksi Portofolio SMK Teratai Putih Global 2 Kota Bekasi",
  ],
  creator:  "Dibuat oleh  Akmal Alfian N, S.Ars. dan xina - 2026",
};

// ─── Ukuran papan (unit Three.js) ────────────────────────────────────────────
const W = 4.2;  // lebar papan
const H = 2.8;  // tinggi papan

// ─────────────────────────────────────────────────────────────────────────────

/** Buat tekstur canvas untuk panel papan */
function makeTexture() {
  const SIZE = 1024;
  const HALF_H = 640;  // tinggi konten dalam pixel

  const canvas = document.createElement("canvas");
  canvas.width  = SIZE;
  canvas.height = HALF_H;
  const ctx = canvas.getContext("2d");

  // ── Background putih terang dengan vignette lembut ─────────────
  const bg = ctx.createLinearGradient(0, 0, SIZE, HALF_H);
  bg.addColorStop(0,   "#f3f0eb");
  bg.addColorStop(0.5, "#ece4d7");
  bg.addColorStop(1,   "#f3f0eb");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, HALF_H);

  // ── Border ornamen emas ───────────────────────────────────────
  const PAD = 22;
  ctx.strokeStyle = "#786a5d";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, PAD, SIZE - PAD * 2, HALF_H - PAD * 2);

  ctx.strokeStyle = "rgba(120,106,93,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(PAD + 7, PAD + 7, SIZE - (PAD + 7) * 2, HALF_H - (PAD + 7) * 2);

  // Sudut ornamen
  const corners = [
    [PAD, PAD], [SIZE - PAD, PAD],
    [PAD, HALF_H - PAD], [SIZE - PAD, HALF_H - PAD],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#786a5d";
    ctx.fill();
  });

  // ── Subtitle ──────────────────────────────────────────────────
  ctx.fillStyle = "#8a7050";
  ctx.font = "600 28px Georgia, serif";
  ctx.textAlign = "center";

  ctx.fillText(BOARD_TEXT.subtitle, SIZE / 2, 110);

  // ── Judul Utama ───────────────────────────────────────────────
  ctx.fillStyle = "#786a5d";
  ctx.font = "bold 112px Georgia, serif";

  // Bayangan judul
  ctx.shadowColor = "rgba(120,106,93,0.30)";
  ctx.shadowBlur = 18;
  ctx.fillText(BOARD_TEXT.title, SIZE / 2, 220);
  ctx.shadowBlur = 0;

  // Garis bawah judul
  const lineY = 240;
  const lineGrad = ctx.createLinearGradient(PAD + 30, 0, SIZE - PAD - 30, 0);
  lineGrad.addColorStop(0,   "transparent");
  lineGrad.addColorStop(0.2, "#786a5d");
  lineGrad.addColorStop(0.8, "#786a5d");
  lineGrad.addColorStop(1,   "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD + 30, lineY);
  ctx.lineTo(SIZE - PAD - 30, lineY);
  ctx.stroke();

  // ── Tagline ───────────────────────────────────────────────────
  ctx.fillStyle = "#6a5a3a";
  ctx.font = "italic 34px Georgia, serif";

  ctx.fillText(BOARD_TEXT.tagline, SIZE / 2, 292);

  // ── Divider ornamen ───────────────────────────────────────────
  ctx.fillStyle = "rgba(120,106,93,0.55)";
  ctx.font = "24px serif";

  ctx.fillText(BOARD_TEXT.divider, SIZE / 2, 346);

  // ── Body teks ─────────────────────────────────────────────────
  ctx.fillStyle = "#5a4a2a";
  ctx.font = "28px Georgia, serif";

  BOARD_TEXT.body.forEach((line, i) => {
    ctx.fillText(line, SIZE / 2, 410 + i * 44);
  });

  // ── Garis pembatas bawah ──────────────────────────────────────
  const line2Y = 500;
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 80, line2Y);
  ctx.lineTo(SIZE - PAD - 80, line2Y);
  ctx.stroke();

  // ── Nama pembuat ──────────────────────────────────────────────
  ctx.fillStyle = "#786a5d";
  ctx.font = "bold 24px Georgia, serif";

  ctx.fillText(BOARD_TEXT.creator, SIZE / 2, HALF_H - 64);

  // Vignette penutup
  const vig = ctx.createRadialGradient(SIZE / 2, HALF_H / 2, HALF_H * 0.15,
    SIZE / 2, HALF_H / 2, HALF_H * 0.85);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.08)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, SIZE, HALF_H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

/**
 * Buat dan tambahkan papan selamat datang ke scene, menempel rata di dinding
 * (seperti bingkai lukisan) — bukan berdiri bebas dengan tiang.
 *
 * @param {THREE.Scene} scene
 * @param {object}      [opts]
 * @param {number}      [opts.x=0]    – posisi X
 * @param {number}      [opts.z=10]   – posisi Z (dinding tempat papan menempel)
 * @param {number}      [opts.rotY=0] – rotasi Y dalam radian
 */
export function createWelcomeBoard(scene, { x = 0, z = 10, rotY = 0 } = {}) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotY;

  const CENTER_Y = 3.8;   // tinggi tengah papan (disesuaikan untuk langit-langit 8m)

  const goldMat = new THREE.MeshLambertMaterial({ color: 0x786a5d });
  const backMat = new THREE.MeshLambertMaterial({ color: 0xf3f0eb });

  // ── Bingkai luar emas ────────────────────────────────────────
  const outerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.28, H + 0.28, 0.10),
    goldMat,
  );
  outerFrame.position.y = CENTER_Y;
  group.add(outerFrame);

  // ── Bingkai dalam (latar) ────────────────────────────────────
  const innerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.08, H + 0.08, 0.11),
    backMat,
  );
  innerFrame.position.y = CENTER_Y;
  group.add(innerFrame);

  // ── Panel teks ─────────────────────────────────────────────
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshLambertMaterial({ map: makeTexture() }),
  );
  panel.position.set(0, CENTER_Y, 0.07);
  group.add(panel);

  // ── Plakat emas kecil di bawah bingkai ──────────────────────
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.07, 0.05),
    goldMat,
  );
  plaque.position.set(0, CENTER_Y - H / 2 - 0.20, 0.04);
  group.add(plaque);

  // ── Spotlight hangat dari atas ─────────────────────────────
  const SPOT_ANGLE = Math.PI / 4.2;
  const lightPos   = new THREE.Vector3(0, CENTER_Y + 2.2, 1.2);
  const targetPos  = new THREE.Vector3(0, CENTER_Y, 0.07);

  const light = new THREE.SpotLight(0xfff4d0, 6, 10, SPOT_ANGLE, 0.5, 0.7);
  light.position.copy(lightPos);
  light.target.position.copy(targetPos);
  group.add(light);
  group.add(light.target);

  // Housing + bohlam menyala (dekoratif)
  const fixture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.16, 10), goldMat);
  fixture.position.copy(lightPos);
  group.add(fixture);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff4c2 }),
  );
  bulb.position.set(lightPos.x, lightPos.y - 0.10, lightPos.z);
  group.add(bulb);

  scene.add(group);
}
