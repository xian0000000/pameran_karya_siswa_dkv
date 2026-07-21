/**
 * Lighting.js — Pencahayaan dasar museum.
 *
 * Ambient sengaja diredupkan (remang-remang) supaya spotlight di tiap
 * karya (lihat Painting.js) jadi kontras dan kelihatan jelas sebagai
 * sumber cahaya utama, bukan cuma ambient rata. Ditambah beberapa titik
 * lampu plafon (tengah + pinggir-pinggir) sebagai pengisi suasana.
 *
 * Dependensi: THREE (global), Museum (ROOM)
 */

import { ROOM } from "./Museum.js";

export function buildLighting(scene) {
  // ── Ambient — diredupkan supaya spotlight karya lebih menonjol ──
  scene.add(new THREE.AmbientLight(0xfff8ec, 0.22));

  // ── Lampu plafon: tengah + pinggir-pinggir ──────────────────────
  const { W, D, H } = ROOM;
  const bulbGeo = new THREE.SphereGeometry(0.08, 10, 10);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff4c2 });

  function addCeilingLight(x, z, intensity, radius) {
    const pt = new THREE.PointLight(0xfff4d0, intensity, radius, 1.2);
    pt.position.set(x, H - 0.3, z);
    scene.add(pt);

    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.copy(pt.position);
    scene.add(bulb);
  }

  // Tengah plafon
  addCeilingLight(0, 0, 0.8, 16);

  // Pinggir-pinggir plafon (inset dari 4 sudut dinding)
  const ix = W / 2 - 3;
  const iz = D / 2 - 3;
  [[-ix, -iz], [ix, -iz], [-ix, iz], [ix, iz]].forEach(([x, z]) => {
    addCeilingLight(x, z, 0.55, 13);
  });
}
