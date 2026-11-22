import * as THREE from "three";

export function createShowroom(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e9e3d9");
  scene.fog = new THREE.Fog("#e9e3d9", 38, 105);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 180);
  camera.position.set(0, 2.35, 18);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const hemi = new THREE.HemisphereLight(0xfff7ec, 0x817365, 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffead0, 3.0);
  sun.position.set(-10, 17, 13);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -28; sun.shadow.camera.right = 28;
  sun.shadow.camera.top = 28; sun.shadow.camera.bottom = -55;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xe7efff, 1.05);
  fill.position.set(14, 9, -20);
  scene.add(fill);

  const makeMarble = () => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 512, 512);
    g.addColorStop(0, "#d9d2c7"); g.addColorStop(.5, "#f1ece3"); g.addColorStop(1, "#c9c0b4");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 28; i++) {
      ctx.beginPath(); ctx.moveTo(Math.random() * 512, 0);
      ctx.bezierCurveTo(Math.random()*512, 160, Math.random()*512, 330, Math.random()*512, 512);
      ctx.strokeStyle = i % 3 ? "rgba(130,116,99,.10)" : "rgba(255,255,255,.32)";
      ctx.lineWidth = i % 4 === 0 ? 3 : 1; ctx.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 9); return t;
  };
  const marble = new THREE.MeshStandardMaterial({ map: makeMarble(), roughness: .25, metalness: .04 });
  const plaster = new THREE.MeshStandardMaterial({ color: 0xe8e0d4, roughness: .88 });
  const warmWall = new THREE.MeshStandardMaterial({ color: 0xc9b9a5, roughness: .82 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x49372b, roughness: .42 });
  const oak = new THREE.MeshStandardMaterial({ color: 0x9b7654, roughness: .55 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb18a58, metalness: .78, roughness: .24 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xdce8e5, metalness: .08, roughness: .08, transmission: .72, transparent: true, opacity: .34, thickness: .08 });
  const blackMetal = new THREE.MeshStandardMaterial({ color: 0x292725, metalness: .72, roughness: .3 });

  const addBox = (w,h,d,material,x,y,z,opts={}) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
    m.position.set(x,y,z); m.castShadow = opts.castShadow !== false; m.receiveShadow = true;
    scene.add(m); return m;
  };
  const addSign = (label, x, y, z, width=3.8) => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#382b21"; ctx.fillRect(0,0,1024,256);
    ctx.strokeStyle = "#bd9867"; ctx.lineWidth = 5; ctx.strokeRect(16,16,992,224);
    ctx.fillStyle = "#f1e4d1"; ctx.font = "500 82px Georgia"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label.toUpperCase(),512,128);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, .95), new THREE.MeshStandardMaterial({ map:tex, roughness:.65, emissive:0x1b1008, emissiveIntensity:.12 }));
    panel.position.set(x,y,z); scene.add(panel); return panel;
  };

  // Grand entrance and central gallery.
  addBox(14.2, .22, 51, marble, 0, -.12, -21);
  addBox(14.2, .28, 51, darkWood, 0, 7.65, -21, {castShadow:false});
  addBox(14.2, 7.5, .45, warmWall, 0, 3.75, -46.4);
  addBox(14.2, .24, .55, brass, 0, 7.7, -1.4, {castShadow:false});
  // Entry portal, bronze framing and two glazed pivot doors.
  addBox(4.35, 8, .5, warmWall, -4.93, 4, -1.5);
  addBox(4.35, 8, .5, warmWall, 4.93, 4, -1.5);
  addBox(5.55, 1.6, .5, warmWall, 0, 7.2, -1.5);
  for (const x of [-2.85, 2.85]) {
    addBox(.14, 6.8, .22, brass, x, 3.4, -.55);
    addBox(.12, 6.8, .22, brass, x*1.12, 3.4, -.55);
  }
  const doors = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(side*2.62,0,-.55);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(2.58,6.05,.12), brass);
    leaf.position.x = -side*1.29; pivot.add(leaf);
    const pane = new THREE.Mesh(new THREE.BoxGeometry(2.2,5.55,.055), glass);
    pane.position.set(-side*1.29,3.03,.09); pivot.add(pane);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.28,.08,.08), blackMetal);
    rail.position.set(-side*1.29,1.05,.15); pivot.add(rail);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.78,16),brass);
    handle.position.set(-side*2.12,2.85,.18); pivot.add(handle);
    scene.add(pivot); doors.push({pivot,side});
  }
  // Clear, front-facing brand fascia above the entrance.
  addSign("AURÉ", 0, 7.05, -.42, 6.8);
  addSign("ATELIER OF EVERYDAY", 0, 6.48, -.42, 4.8);

  // Gallery side walls are broken into real openings for six department rooms.
  const rows = [-8, -23, -38];
  for (const side of [-1,1]) {
    const wallX = side*6.9;
    const wallSegments = [[-2.1,3.8],[-15.5,8.4],[-30.5,8.4],[-44.2,3.6]];
    for (const [z,len] of wallSegments) addBox(.32,7.5,len,plaster,wallX,3.75,z);
    for (const z of rows) {
      // Brass portal frame and glass side lights.
      addBox(.16,5.7,.16,brass,wallX,2.85,z-2.9);
      addBox(.16,5.7,.16,brass,wallX,2.85,z+2.9);
      addBox(.16,.16,6,brass,wallX,5.7,z);
      addBox(.08,5.1,2.65,glass,wallX+side*.08,2.65,z);
      const glow = new THREE.PointLight(0xffd7a7, 18, 10);
      glow.position.set(side*7.2,4.9,z); scene.add(glow);
    }
  }
  // Soft architectural light strips.
  for (let z=-5; z>-45; z-=5) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(5.2,.055,.16),new THREE.MeshBasicMaterial({color:0xffe2b9}));
    strip.position.set(0,7.48,z); scene.add(strip);
    const light = new THREE.PointLight(0xffe3c4, 7, 12);
    light.position.set(0,6.9,z); scene.add(light);
  }

  // A department room has a distinct entrance, floor, display walls, rails and mannequins.
  function mannequin(x,z,color,style) {
    const group = new THREE.Group(); group.position.set(x,0,z);
    const skin = new THREE.MeshStandardMaterial({color:0x9b705a,roughness:.72});
    const fabric = new THREE.MeshStandardMaterial({color,roughness:.82});
    const hair = new THREE.MeshStandardMaterial({color:0x211b18,roughness:.95});
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.27,.66,8,20),fabric); torso.position.y=1.95; group.add(torso);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(.085,.1,.2,16),skin); neck.position.y=2.48; group.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(.2,24,20),skin); head.scale.set(.9,1.12,.92); head.position.y=2.73; group.add(head);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(.207,24,16,0,Math.PI*2,0,Math.PI*.58),hair); cap.position.set(0,2.79,-.015); group.add(cap);
    for (const s of [-1,1]) {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.09,.52,6,12),fabric);
      arm.position.set(s*.37,1.95,0); arm.rotation.z=s*.16; group.add(arm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(.075,12,10),skin); hand.position.set(s*.43,1.57,.02); group.add(hand);
    }
    if (style==="dress" || style==="kurta") {
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(.25,style==="kurta"?.42:.68,style==="kurta"?1.2:1.42,32,2),fabric);
      skirt.position.y=style==="kurta"?.75:.88; group.add(skirt);
    } else {
      for (const s of [-1,1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(.14,.12,1.05,20),fabric);
        leg.position.set(s*.16,.62,0); group.add(leg);
      }
    }
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.4,.46,.08,28),brass); base.position.y=.04; group.add(base);
    group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    scene.add(group);
    return group;
  }

  function rack(x,z,colors) {
    const g = new THREE.Group();
    const postMat = blackMetal;
    for (const xx of [-1.5,1.5]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,2.45,10),postMat);
      leg.position.set(xx,1.22,0); g.add(leg);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.05,12),brass);
      foot.position.set(xx,.06,0); g.add(foot);
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,3.15,12),brass);
    bar.rotation.z=Math.PI/2; bar.position.y=2.45; g.add(bar);
    colors.forEach((color,i)=>{
      const hanger = new THREE.Mesh(new THREE.TorusGeometry(.12,.014,6,18,Math.PI),brass);
      hanger.position.set(-1.25+i*.41,2.23,.02); hanger.rotation.z=Math.PI; g.add(hanger);
      const cloth = new THREE.MeshStandardMaterial({color,roughness:.94});
      const body = new THREE.Mesh(new THREE.BoxGeometry(.34,.62,.12),cloth);
      body.position.set(-1.25+i*.41,1.7,.02); g.add(body);
      const hem = new THREE.Mesh(new THREE.CylinderGeometry(.13,.2,.38,16),cloth);
      hem.position.set(-1.25+i*.41,1.2,.02); g.add(hem);
    });
    g.position.set(x,0,z); g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}}); scene.add(g);
  }

  const departments = {
    Men: {side:-1,z:-8,colors:[0x273d48,0x8d6b4c,0x33302d,0x9a8c79,0x53635b,0xddd2c0,0x5d4640],styles:["trouser","kurta"]},
    Women: {side:1,z:-8,colors:[0x8c514b,0xc7a58d,0x51404c,0xd8c8b2,0x647267,0x9d735e,0x343a3d],styles:["dress","dress"]},
    Dresses: {side:1,z:-23,colors:[0x9b5c58,0xcbb49c,0x4c4857,0x697b69,0xd7cbb8,0x765b49,0x393b43],styles:["dress","dress"]},
    Tops: {side:-1,z:-23,colors:[0x31434a,0xb38b6b,0xeee2d0,0x65504a,0x79836e,0x3c3935,0xa76e59],styles:["trouser","kurta"]},
    Bottoms: {side:-1,z:-38,colors:[0x293c4b,0x6c6b67,0x9a8067,0x343434,0x8a8c7d,0x4d4140,0xc5b7a2],styles:["trouser","trouser"]},
    Essentials: {side:1,z:-38,colors:[0xeee5d8,0x30383a,0x9a8d7b,0x6b786d,0x8b5549,0x3a3531,0xc3b29b],styles:["trouser","kurta"]}
  };
  for (const [name,d] of Object.entries(departments)) {
    const cx=d.side*12.35, cz=d.z;
    // Boutique room envelope and its own warm wood feature wall.
    addBox(10.9,.2,11.7,marble,cx,-.1,cz);
    addBox(.25,7.4,11.7,warmWall,d.side*17.75,3.7,cz);
    addBox(10.9,7.4,.25,plaster,cx,3.7,cz-5.85);
    addBox(10.9,7.4,.25,plaster,cx,3.7,cz+5.85);
    addBox(10.9,.18,11.7,darkWood,cx,7.25,cz,{castShadow:false});
    addBox(.12,6.4,.12,brass,cx-4.9,3.2,cz-5.65);
    addBox(.12,6.4,.12,brass,cx+4.9,3.2,cz-5.65);
    addBox(9.9,.12,.12,brass,cx,6.4,cz-5.65);
    addSign(name+"  COLLECTION",cx,5.55,cz-5.48,4.7);
    // Large editorial campaign portrait panels use real Indian fashion photography.
    const campaignUrl = (name==="Women" || name==="Dresses")
      ? "https://images.unsplash.com/photo-1666160525588-95294b909229?auto=format&fit=crop&w=900&q=85"
      : "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85";
    const portraitMaterial = new THREE.MeshStandardMaterial({color:0xe8dfd3,roughness:.8});
    const portrait = new THREE.Mesh(new THREE.PlaneGeometry(2.55,3.35),portraitMaterial);
    portrait.position.set(cx,3.35,cz-5.66); scene.add(portrait);
    addBox(2.72,3.52,.10,brass,cx,3.35,cz-5.54,{castShadow:false});
    const portraitLoader = new THREE.TextureLoader();
    portraitLoader.setCrossOrigin("anonymous");
    portraitLoader.load(campaignUrl,texture=>{
      texture.colorSpace=THREE.SRGBColorSpace;
      portrait.material.map=texture;
      portrait.material.color.set(0xffffff);
      portrait.material.needsUpdate=true;
    },undefined,()=>{});
    // Timber display plinths and illuminated shelving.
    for (const xx of [-4.1,4.1]) {
      addBox(1.35,.18,1.25,oak,cx+xx,.5,cz-3.5);
      addBox(1.25,.07,1.15,brass,cx+xx,.64,cz-3.5);
      addBox(.08,3.5,.08,brass,cx+xx,2.35,cz+4.75);
      addBox(1.9,.08,.28,oak,cx+xx,3.8,cz+4.65);
      const lamp=new THREE.PointLight(0xffd7a4,8,5); lamp.position.set(cx+xx,3.7,cz+3.8); scene.add(lamp);
    }
    rack(cx-2.6,cz-1.25,d.colors);
    rack(cx+2.6,cz+1.65,d.colors.slice().reverse());
    mannequin(cx-1.6,cz+3.15,d.colors[0],d.styles[0]);
    mannequin(cx+1.7,cz-3.3,d.colors[2],d.styles[1]);
    const spot=new THREE.SpotLight(0xffe2c0,65,17,Math.PI/4,.5,1);
    spot.position.set(cx,6.8,cz); spot.target.position.set(cx,1,cz); scene.add(spot,spot.target);
  }

  // Family campaign display on the gallery's far feature wall.
  addSign("THE AURÉ FAMILY EDIT  ·  MEN  ·  WOMEN  ·  KIDS",0,5.55,-46.12,9.2);
  addBox(8.4,.22,2.1,oak,0,.14,-43.35);
  addBox(8.15,.08,1.9,brass,0,.29,-43.35);
  const father=mannequin(-2.15,-43.35,0x344653,"trouser");
  father.scale.set(1.08,1.08,1.08);
  const mother=mannequin(0,-43.35,0x925b58,"dress");
  mother.scale.set(1.04,1.04,1.04);
  const child=mannequin(2.05,-43.35,0xb59a70,"dress");
  child.scale.set(.68,.68,.68);

  const resize=()=>{
    const w=canvas.clientWidth||window.innerWidth, h=canvas.clientHeight||window.innerHeight;
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  };
  window.addEventListener("resize",resize); resize();

  let progress=0, progressTarget=0, roomX=0, roomZ=18, roomTargetX=0, roomTargetZ=18;
  let activeDepartment=null, raf=0;
  const setProgress=v=>{progressTarget=THREE.MathUtils.clamp(v,0,1);};
  const setDepartment=name=>{
    const d=departments[name]; if(!d)return;
    activeDepartment=name;
    // Move through the corresponding side opening and settle inside the room.
    roomTargetX=d.side*12.0;
    roomTargetZ=d.z+1.7;
  };
  const clearDepartment=()=>{activeDepartment=null;roomTargetX=0;roomTargetZ=-5;};
  const animate=()=>{
    raf=requestAnimationFrame(animate);
    progress=THREE.MathUtils.damp(progress,progressTarget,3.2,1/60);
    roomX=THREE.MathUtils.damp(roomX,roomTargetX,2.4,1/60);
    roomZ=THREE.MathUtils.damp(roomZ,roomTargetZ,2.4,1/60);
    const doorOpen=THREE.MathUtils.smoothstep(progress,.04,.42);
    doors.forEach(({pivot,side})=>{pivot.rotation.y=side*doorOpen*1.16;});
    const corridorZ=18-progress*22;
    const targetX=activeDepartment?roomX:0;
    const targetZ=activeDepartment?roomZ:corridorZ;
    camera.position.x=THREE.MathUtils.damp(camera.position.x,targetX,2.8,1/60);
    camera.position.y=THREE.MathUtils.damp(camera.position.y,2.35,3,1/60);
    camera.position.z=THREE.MathUtils.damp(camera.position.z,targetZ,2.8,1/60);
    camera.lookAt(activeDepartment?roomX:0,2.1,activeDepartment?roomZ-4:corridorZ-8);
    renderer.render(scene,camera);
  };
  animate();
  return {
    setProgress,
    setDepartment,
    clearDepartment,
    destroy(){cancelAnimationFrame(raf);window.removeEventListener("resize",resize);renderer.dispose();}
  };
}
