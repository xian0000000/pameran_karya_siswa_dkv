/**
 * NamesBoard.js — Papan daftar nama peserta, menempel di dinding
 * (dipasang di sebelah papan selamat datang, menggantikan label nama
 * yang dulu melayang di atas tiap bingkai lukisan).
 *
 * Dependensi: THREE (global), Materials
 */

import { Materials } from "./Materials.js";

function makeTexture(names, w, h) {
  const SIZE = 1024;
  const HALF_H = Math.round(SIZE * (h / w));

  const canvas = document.createElement("canvas");
  canvas.width  = SIZE;
  canvas.height = HALF_H;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, SIZE, HALF_H);
  bg.addColorStop(0,   "#f3f0eb");
  bg.addColorStop(0.5, "#ece4d7");
  bg.addColorStop(1,   "#f3f0eb");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, HALF_H);

  const PAD = 26;
  ctx.strokeStyle = "#786a5d";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, PAD, SIZE - PAD * 2, HALF_H - PAD * 2);
  ctx.strokeStyle = "rgba(120,106,93,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(PAD + 7, PAD + 7, SIZE - (PAD + 7) * 2, HALF_H - (PAD + 7) * 2);

  // ── Judul ─────────────────────────────────────────────────
  ctx.fillStyle = "#786a5d";
  ctx.font = "bold 56px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("PESERTA PAMERAN", SIZE / 2, 120);

  ctx.fillStyle = "#8a7050";
  ctx.font = "600 28px Georgia, serif";
  ctx.fillText("Desain Kemasan Sabun", SIZE / 2, 162);

  const lineGrad = ctx.createLinearGradient(PAD + 40, 0, SIZE - PAD - 40, 0);
  lineGrad.addColorStop(0,   "transparent");
  lineGrad.addColorStop(0.2, "#786a5d");
  lineGrad.addColorStop(0.8, "#786a5d");
  lineGrad.addColorStop(1,   "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD + 40, 192);
  ctx.lineTo(SIZE - PAD - 40, 192);
  ctx.stroke();

  // ── Daftar nama, 2 kolom (teks diperbesar) ──────────────────
  const startY  = 270;
  const lineH   = 78;
  const perCol  = Math.ceil(names.length / 2);
  const colX    = [SIZE * 0.12, SIZE * 0.56];

  ctx.textAlign = "left";
  names.forEach((name, i) => {
    const col = i < perCol ? 0 : 1;
    const row = i < perCol ? i : i - perCol;
    const y   = startY + row * lineH;

    ctx.fillStyle = "rgba(120,106,93,0.6)";
    ctx.font = "30px serif";
    ctx.fillText("✦", colX[col], y);

    ctx.fillStyle = "#3a2e18";
    ctx.font = "600 42px Georgia, serif";
    ctx.fillText(name, colX[col] + 42, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

/**
 * @param {THREE.Scene} scene
 * @param {object}      opts
 * @param {number}      opts.x, opts.z, opts.rotY – posisi & rotasi (menempel di dinding)
 * @param {string[]}    opts.names – daftar nama peserta
 * @param {number}      [opts.width=3.0]   – lebar papan
 * @param {number}      [opts.height=3.6]  – tinggi papan
 * @param {number}      [opts.centerY=3.8] – tinggi tengah papan (samakan dgn papan selamat datang)
 */
export function createNamesBoard(scene, { x, z, rotY, names, width = 3.0, height = 3.6, centerY = 3.8 }) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotY;

  const W = width, H = height;
  const CENTER_Y = centerY;

  const goldMat = new THREE.MeshLambertMaterial({ color: 0x786a5d });
  const backMat = new THREE.MeshLambertMaterial({ color: 0xf3f0eb });

  const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, H + 0.24, 0.10), goldMat);
  outerFrame.position.y = CENTER_Y;
  group.add(outerFrame);

  const innerFrame = new THREE.Mesh(new THREE.BoxGeometry(W + 0.06, H + 0.06, 0.11), backMat);
  innerFrame.position.y = CENTER_Y;
  group.add(innerFrame);

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshLambertMaterial({ map: makeTexture(names, W, H) }),
  );
  panel.position.set(0, CENTER_Y, 0.07);
  group.add(panel);

  const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.045), goldMat);
  plaque.position.set(0, CENTER_Y - H / 2 - 0.18, 0.04);
  group.add(plaque);

  // ── Spotlight ─────────────────────────────────────────────
  const spotPos   = new THREE.Vector3(0, Math.min(CENTER_Y + H / 2 + 0.6, 7.5), 1.1);
  const targetPos = new THREE.Vector3(0, CENTER_Y, 0.07);
  const spot = new THREE.SpotLight(0xfff4d0, 5, 8, Math.PI / 4, 0.5, 0.7);
  spot.position.copy(spotPos);
  spot.target.position.copy(targetPos);
  group.add(spot, spot.target);

  const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.14, 10), mat.darkGold);
  fixture.position.copy(spotPos);
  group.add(fixture);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff4c2 }),
  );
  bulb.position.set(spotPos.x, spotPos.y - 0.08, spotPos.z);
  group.add(bulb);

  scene.add(group);
}
