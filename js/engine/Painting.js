/**
 * Painting.js — Membuat bingkai lukisan 3D di dinding museum.
 */

import { Materials }      from "./Materials.js";
import { TextureFactory } from "./TextureFactory.js";

export function createPainting(scene, data, pos, rotY, w = 3.0, h = 2.2) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.copy(pos);
  group.rotation.y = rotY;

  // ── Bingkai luar emas ────────────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.20, h + 0.20, 0.09), mat.gold));

  // ── Bingkai dalam emas gelap ─────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.05, h + 0.05, 0.10), mat.darkGold));

  // ── Kanvas — tekstur prosedural atau PNG ──────────────────
  const tex       = TextureFactory.painting(data.colors);
  const canvasMat = new THREE.MeshLambertMaterial({ map: tex });

  if (data.png) {
    new THREE.TextureLoader().load(
      data.png,
      (loaded) => {
        loaded.encoding       = THREE.sRGBEncoding;
        canvasMat.map         = loaded;
        canvasMat.needsUpdate = true;
      }
    );
  }
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w, h), canvasMat);
  canvas.position.z = 0.065;
  group.add(canvas);

  // ── Plakat emas bawah ────────────────────────────────────
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(Math.min(w * 0.45, 1.2), 0.06, 0.045), mat.gold);
  plaque.position.set(0, -(h / 2 + 0.20), 0.04);
  group.add(plaque);

  // ── Label nama author di atas bingkai (mesh, tidak ikut kamera) ──
  if (data.artist) {
    const isTop3 = !!data.top3;
    const lw = 640, lh = 120;
    const labelCanvas  = document.createElement("canvas");
    labelCanvas.width  = lw;
    labelCanvas.height = lh;
    const ctx          = labelCanvas.getContext("2d");

    // Gradien emas — lebih terang untuk top3
    const grad = ctx.createLinearGradient(0, 0, 0, lh);
    if (isTop3) {
      grad.addColorStop(0.00, "#fffbe8");
      grad.addColorStop(0.20, "#f7df8c");
      grad.addColorStop(0.55, "#e8b840");
      grad.addColorStop(0.80, "#c8a050");
      grad.addColorStop(1.00, "#a07820");
    } else {
      grad.addColorStop(0.00, "#f0d070");
      grad.addColorStop(0.45, "#c8a050");
      grad.addColorStop(1.00, "#8a5e18");
    }

    ctx.shadowColor  = isTop3 ? "rgba(255,220,80,0.90)" : "rgba(200,160,80,0.55)";
    ctx.shadowBlur   = isTop3 ? 32 : 18;

    const fontSize   = isTop3 ? 62 : 54;
    ctx.font         = `700 ${fontSize}px 'Georgia', serif`;
    ctx.fillStyle    = grad;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.artist, lw / 2, lh / 2);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const planeMat = new THREE.MeshBasicMaterial({
      map:         labelTex,
      transparent: true,
      depthWrite:  false,
      side:        THREE.FrontSide,
    });

    const aspect  = lw / lh;
    const sW      = isTop3 ? Math.min(w * 1.05, 2.9) : Math.min(w * 0.90, 2.5);
    const sH      = sW / aspect;
    const plane   = new THREE.Mesh(new THREE.PlaneGeometry(sW, sH), planeMat);
    plane.position.set(0, h / 2 + sH / 2 + 0.18, 0.07);
    group.add(plane);
  }

  scene.add(group);

  return {
    position: pos.clone().setY(1.7),
    radius:   Math.max(w, 2.2),
    data,
  };
}
