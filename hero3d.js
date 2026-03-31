/*──────────────────────────────────────────────
  THREE.JS HERO 3D SCENE
──────────────────────────────────────────────*/
(function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(380, 380);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  // Central icosahedron
  const geo = new THREE.IcosahedronGeometry(1.4, 1);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x4f9eff,
    emissive: 0x1a3a6e,
    shininess: 100,
    wireframe: false,
    transparent: true,
    opacity: 0.85
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Wireframe overlay
  const wgeo = new THREE.IcosahedronGeometry(1.42, 1);
  const wmat = new THREE.MeshBasicMaterial({ color: 0x4f9eff, wireframe: true, transparent: true, opacity: 0.18 });
  const wire = new THREE.Mesh(wgeo, wmat);
  scene.add(wire);

  // Outer ring
  const ringGeo = new THREE.TorusGeometry(2.2, 0.015, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.4 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  scene.add(ring);

  // Second ring
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.01, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.25 })
  );
  ring2.rotation.x = Math.PI / 5;
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);

  // Orbiting spheres
  const orbitSpheres = [];
  const orbitData = [
    { color: 0x4f9eff, radius: 0.12, orbitR: 2.2, speed: 0.8, phase: 0 },
    { color: 0xa78bfa, radius: 0.09, orbitR: 2.6, speed: 0.5, phase: 2 },
    { color: 0x22d3ee, radius: 0.07, orbitR: 1.9, speed: 1.2, phase: 4 },
  ];
  orbitData.forEach(d => {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(d.radius, 8, 8),
      new THREE.MeshBasicMaterial({ color: d.color })
    );
    scene.add(s);
    orbitSpheres.push({ mesh: s, ...d });
  });

  // Lights
  scene.add(new THREE.AmbientLight(0x334477, 0.5));
  const pLight = new THREE.PointLight(0x4f9eff, 2, 10);
  pLight.position.set(3, 3, 3);
  scene.add(pLight);
  const pLight2 = new THREE.PointLight(0xa78bfa, 1.5, 10);
  pLight2.position.set(-3, -2, 2);
  scene.add(pLight2);

  let t = 0;
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function render3D() {
    requestAnimationFrame(render3D);
    t += 0.008;
    mesh.rotation.x = t * 0.4 + mouseY * 0.3;
    mesh.rotation.y = t * 0.6 + mouseX * 0.3;
    wire.rotation.x = mesh.rotation.x;
    wire.rotation.y = mesh.rotation.y;
    ring.rotation.z = t * 0.3;
    ring2.rotation.z = -t * 0.2;

    orbitSpheres.forEach(o => {
      const a = t * o.speed + o.phase;
      o.mesh.position.x = Math.cos(a) * o.orbitR;
      o.mesh.position.y = Math.sin(a) * o.orbitR * 0.4;
      o.mesh.position.z = Math.sin(a * 0.7) * 0.5;
    });

    // Dynamic color based on theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    mat.color.setHex(isDark ? 0x4f9eff : 0x4338ca);
    mat.emissive.setHex(isDark ? 0x1a3a6e : 0x2d3a8c);

    renderer.render(scene, camera);
  }
  render3D();
})();
