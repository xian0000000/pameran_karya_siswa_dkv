/**
 * PhotoPanel.js — Panel foto besar menempel di dinding, dengan keterangan
 * di bawahnya (dipakai untuk foto "Guru Produktif DKV" di sebelah papan
 * selamat datang).
 *
 * Dependensi: THREE (global), Materials
 */

import { Materials } from "./Materials.js";

function makeCaptionTexture(caption) {
  const W = 1024, H = 160;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, W, 0);
  bg.addColorStop(0,   "#f3f0eb");
  bg.addColorStop(0.5, "#ece4d7");
  bg.addColorStop(1,   "#f3f0eb");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#786a5d";
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  ctx.fillStyle = "#786a5d";
  ctx.font = "bold 58px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(caption.toUpperCase(), W / 2, H / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

/**
 * @param {THREE.Scene} scene
 * @param {object}      opts
 * @param {number}      opts.x, opts.z, opts.rotY – posisi & rotasi (menempel di dinding)
 * @param {string}      opts.imageUrl   – path foto
 * @param {string}      opts.caption    – teks keterangan di bawah foto
 * @param {number}      [opts.width=3.0]       – lebar foto
 * @param {number}      [opts.aspect=1.514]    – rasio tinggi/lebar foto asli (h/w)
 * @param {number}      [opts.centerY=3.8]     – tinggi tengah panel (samakan dgn papan selamat datang)
 */
export function createPhotoPanel(scene, { x, z, rotY, imageUrl, caption, width = 3.0, aspect = 1.514, centerY = 3.8 }) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotY;

  const h         = width * aspect;
  const CENTER_Y  = centerY;

  const goldMat = new THREE.MeshLambertMaterial({ color: 0x786a5d });
  const backMat = new THREE.MeshLambertMaterial({ color: 0xf3f0eb });

  const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.22, h + 0.22, 0.10), goldMat);
  outerFrame.position.y = CENTER_Y;
  group.add(outerFrame);

  const innerFrame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.06, h + 0.06, 0.11), backMat);
  innerFrame.position.y = CENTER_Y;
  group.add(innerFrame);

  const photoMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const photo    = new THREE.Mesh(new THREE.PlaneGeometry(width, h), photoMat);
  photo.position.set(0, CENTER_Y, 0.065);
  group.add(photo);

  new THREE.TextureLoader().load(imageUrl, (tex) => {
    tex.encoding          = THREE.sRGBEncoding;
    photoMat.map          = tex;
    photoMat.needsUpdate  = true;
  });

  // ── Plakat kecil di bawah ────────────────────────────────
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(width * 0.5, 0.06, 0.045), goldMat);
  plaque.position.set(0, CENTER_Y - h / 2 - 0.16, 0.04);
  group.add(plaque);

  // ── Keterangan (caption) di bawah foto ───────────────────
  const capH  = width * 0.16;
  const capMat = new THREE.MeshBasicMaterial({ map: makeCaptionTexture(caption), transparent: true });
  const captionMesh = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.05, capH), capMat);
  captionMesh.position.set(0, CENTER_Y - h / 2 - 0.16 - capH / 2 - 0.14, 0.05);
  group.add(captionMesh);

  // ── Spotlight ─────────────────────────────────────────────
  const spotPos   = new THREE.Vector3(0, Math.min(CENTER_Y + h / 2 + 0.6, 7.5), 1.1);
  const targetPos = new THREE.Vector3(0, CENTER_Y, 0.07);
  const spot = new THREE.SpotLight(0xfff4d0, 5.5, 9, Math.PI / 4, 0.5, 0.7);
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

  return {
    position: new THREE.Vector3(x, 1.7, z),
    radius:   2.5,
    data: { title: caption, artist: caption, year: "", desc: caption },
  };
}
