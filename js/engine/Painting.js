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

  // ── Spotlight penyorot karya ──────────────────────────────
  const SPOT_ANGLE = Math.PI / 4;
  const spotPos    = new THREE.Vector3(0, h / 2 + 0.75, 1.1);
  const targetPos  = new THREE.Vector3(0, 0, 0.07);

  const spot = new THREE.SpotLight(0xfff4d0, 5.5, 8, SPOT_ANGLE, 0.5, 0.7);
  spot.position.copy(spotPos);
  spot.target.position.copy(targetPos);
  group.add(spot);
  group.add(spot.target);

  // Housing kecil lampu sorot (dekoratif)
  const fixture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.07, 0.14, 10), mat.darkGold);
  fixture.position.copy(spotPos);
  group.add(fixture);

  // Bohlam menyala — bola kecil emissive di ujung housing
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff4c2 }),
  );
  bulb.position.set(spotPos.x, spotPos.y - 0.08, spotPos.z);
  group.add(bulb);

  // (Label nama author di atas bingkai dihapus — daftar nama sekarang
  // dikumpulkan di satu papan di sebelah papan selamat datang, lihat NamesBoard.js)

  scene.add(group);

  return {
    position: pos.clone().setY(1.7),
    radius:   Math.max(w, 2.2),
    data,
  };
}
