/**
 * ModelDisplay.js — Meja pedestal untuk menampilkan model 3D (GLB) di tengah museum.
 *
 * Model dimuat async lewat THREE.GLTFLoader lalu diskalakan otomatis supaya
 * pas berdiri di atas meja, tanpa perlu tahu ukuran asli file GLB-nya.
 *
 * Kalau opts.videoUrl diisi, patung bisa "berubah" jadi video (toggleVideo())
 * — model 3D disembunyikan, layar video di atas meja ditampilkan & diputar.
 *
 * Dependensi: THREE (global), THREE.GLTFLoader (global, dari script tag di index.html), Materials
 */

import { Materials } from "./Materials.js";

const TABLE_TOP_Y = 1.1;   // tinggi permukaan meja dari lantai

/** Bracket sudut ala viewfinder — aksen desain komunikasi visual di 4 sudut layar */
function addCornerBrackets(group, center, w, h, mat, armLen = 0.18, thick = 0.028) {
  const halfW = w / 2, halfH = h / 2;
  const corners = [
    { x: -halfW, y:  halfH, sx:  1, sy: -1 },
    { x:  halfW, y:  halfH, sx: -1, sy: -1 },
    { x: -halfW, y: -halfH, sx:  1, sy:  1 },
    { x:  halfW, y: -halfH, sx: -1, sy:  1 },
  ];
  const meshes = [];
  corners.forEach(({ x, y, sx, sy }) => {
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(armLen, thick, thick), mat);
    hBar.position.set(center.x + x + (sx * armLen) / 2, center.y + y, center.z + 0.03);
    group.add(hBar);
    meshes.push(hBar);

    const vBar = new THREE.Mesh(new THREE.BoxGeometry(thick, armLen, thick), mat);
    vBar.position.set(center.x + x, center.y + y + (sy * armLen) / 2, center.z + 0.03);
    group.add(vBar);
    meshes.push(vBar);
  });
  return meshes;
}

/**
 * @param {THREE.Scene}   scene
 * @param {object}        opts
 * @param {THREE.Vector3} opts.position   – posisi meja (Y diabaikan, selalu di lantai)
 * @param {string}        opts.url        – path ke file .glb
 * @param {number}        [opts.targetSize=1.4] – ukuran sisi terpanjang model setelah diskalakan
 * @param {string}        [opts.videoUrl] – path video; kalau diisi, patung bisa di-toggle jadi video
 * @param {object}        [opts.data]     – data pameran untuk InfoPanel (title/desc/artist/year)
 */
export function createModelDisplay(scene, { position, url, targetSize = 1.4, videoUrl, data } = {}) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.set(position.x, 0, position.z);
  scene.add(group);

  // ── Meja / pedestal ────────────────────────────────────────
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 0.88, TABLE_TOP_Y, 28), mat.gold);
  base.position.y = TABLE_TOP_Y / 2;
  group.add(base);

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.86, 0.86, 0.06, 28), mat.darkGold);
  top.position.y = TABLE_TOP_Y + 0.03;
  group.add(top);

  // ── Spotlight dari atas menyorot patung ─────────────────────
  const spotPos   = new THREE.Vector3(0, TABLE_TOP_Y + 2.6, 0);
  const targetPos = new THREE.Vector3(0, TABLE_TOP_Y + 0.5, 0);

  const spot = new THREE.SpotLight(0xfff4d0, 5, 6, Math.PI / 5, 0.5, 0.8);
  spot.position.copy(spotPos);
  spot.target.position.copy(targetPos);
  group.add(spot);
  group.add(spot.target);

  // Housing + bohlam menyala (dekoratif)
  const fixture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.07, 0.14, 10), mat.darkGold);
  fixture.position.copy(spotPos);
  group.add(fixture);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff4c2 }),
  );
  bulb.position.set(spotPos.x, spotPos.y - 0.08, spotPos.z);
  group.add(bulb);

  // ── Model 3D (dimuat async) ─────────────────────────────────
  let model = null;

  // videoState.showing dibaca app.js tiap frame buat tahu apa meja ini
  // lagi nampilin video (kalau iya, meja berhenti diputar/turntable).
  const videoState = { showing: false };

  const loader = new THREE.GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      model = gltf.scene;
      model.updateMatrixWorld(true);

      const rawSize = new THREE.Vector3();
      new THREE.Box3().setFromObject(model).getSize(rawSize);
      const scale = targetSize / Math.max(rawSize.x, rawSize.y, rawSize.z);
      model.scale.setScalar(scale);
      model.updateMatrixWorld(true);

      const scaledBox = new THREE.Box3().setFromObject(model);
      model.position.y += (TABLE_TOP_Y + 0.06) - scaledBox.min.y;

      // Banyak GLB export default metalness=1 — tanpa environment map itu
      // bikin modelnya kelihatan gelap/hitam walau kena spotlight. Paksa
      // jadi permukaan matte supaya benar-benar merespons cahaya.
      model.traverse((o) => {
        if (o.isMesh && o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            if ("metalness" in m) m.metalness = 0;
            if ("roughness" in m) m.roughness = 0.8;
            m.needsUpdate = true;
          });
        }
      });

      model.visible = !videoState.showing;
      group.add(model);
    },
    undefined,
    (err) => console.error("Gagal memuat model 3D:", url, err),
  );

  // ── Layar video (opsional) — patung "berubah" jadi video ────
  let videoEl       = null;
  let toggleVideo   = null;

  if (videoUrl) {
    const VW = 2.1, VH = VW * (9 / 16);   // landscape 16:9

    videoEl = document.createElement("video");
    videoEl.src         = videoUrl;
    videoEl.loop        = true;
    videoEl.playsInline = true;
    videoEl.crossOrigin = "anonymous";

    const videoTex = new THREE.VideoTexture(videoEl);
    videoTex.encoding   = THREE.sRGBEncoding;
    videoTex.minFilter  = THREE.LinearFilter;
    videoTex.magFilter  = THREE.LinearFilter;

    const screenCenter = new THREE.Vector3(0, TABLE_TOP_Y + VH / 2 + 0.15, 0);

    // side: DoubleSide → layar tetap kelihatan dari depan MAUPUN belakang
    // meja (karena mejanya berhenti berputar saat video tampil).
    const screenMat = new THREE.MeshBasicMaterial({ map: videoTex, side: THREE.DoubleSide });
    const screen    = new THREE.Mesh(new THREE.PlaneGeometry(VW, VH), screenMat);
    screen.position.copy(screenCenter);
    screen.visible = false;
    group.add(screen);

    // Bingkai tipis di sekeliling layar
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(VW + 0.08, VH + 0.08, 0.04), mat.gold);
    frame.position.copy(screenCenter);
    frame.position.z -= 0.021;
    frame.visible = false;
    group.add(frame);

    // Bracket sudut — aksen desain komunikasi visual di 4 sudut layar
    const corners = addCornerBrackets(group, screenCenter, VW + 0.24, VH + 0.24, mat.gold);
    corners.forEach((c) => { c.visible = false; });

    toggleVideo = () => {
      videoState.showing = !videoState.showing;
      screen.visible = videoState.showing;
      frame.visible  = videoState.showing;
      corners.forEach((c) => { c.visible = videoState.showing; });
      if (model) model.visible = !videoState.showing;

      if (videoState.showing) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
      return videoState.showing;
    };
  }

  return {
    mesh:     group,
    position: new THREE.Vector3(position.x, 1.7, position.z),
    radius:   2.5,
    data,
    toggleVideo,
    videoState,
  };
}
