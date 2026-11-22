import * as THREE from "three";
import { products } from "./products.js";

export function createShowroom(canvas, onProductSelect = () => {}, onDirectoryToggle = () => {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e9e3d9");
  scene.fog = new THREE.Fog("#e9e3d9", 38, 105);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 180);
  camera.position.set(0, 2.35, 18);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const hemi = new THREE.HemisphereLight(0xfff8ef, 0x8a8176, 2.6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffead0, 3.6);
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
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x91aaa8, metalness: .12, roughness: .16, transmission: .28, transparent: true, opacity: .62, thickness: .12 });
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
    ctx.fillStyle = "#f1e4d1"; ctx.font = label === "AURÉ" ? "600 150px Georgia" : "500 82px Georgia"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
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
    const doorX=-side*1.29;
    // Large clear glass leaf with a visible bronze perimeter instead of a solid slab.
    const pane = new THREE.Mesh(new THREE.BoxGeometry(2.18,5.55,.07), glass);
    pane.position.set(doorX,3.03,.015); pivot.add(pane);
    const frameParts=[
      [2.58,.16,.16,doorX,3.02,.08],
      [2.58,.16,.16,doorX,6.00,.08],
      [.16,5.9,.16,doorX-1.21,3.02,.08],
      [.16,5.9,.16,doorX+1.21,3.02,.08]
    ];
    for(const [w,h,d,x,y,z] of frameParts){
      const part=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),brass);
      part.position.set(x,y,z);pivot.add(part);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.25,.075,.08), blackMetal);
    rail.position.set(doorX,1.08,.13); pivot.add(rail);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.9,16),brass);
    handle.position.set(-side*2.12,2.95,.18); pivot.add(handle);
    scene.add(pivot); doors.push({pivot,side});
  }
  // Brass threshold makes the entrance visible from the exterior approach.
  addBox(5.5,.12,.72,brass,0,.02,-1.05,{castShadow:false});
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
      // Narrow glazed sidelights frame the opening without blocking the department entrance.
      addBox(.08,5.1,.48,glass,wallX+side*.08,2.65,z-2.55);
      addBox(.08,5.1,.48,glass,wallX+side*.08,2.65,z+2.55);
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
  // Display garments as draped textile surfaces. These are static cloth meshes,
  // not rigid extruded silhouettes; the shoulder line is supported by a real hanger.
  function mannequin() {
    // Deliberately no mannequin meshes: the showroom uses hanging garments only.
    return null;
  }

  function makeGarment(kind, color, product) {
    const cols = 28, rows = 38;
    const positions = [], uvs = [], indices = [];
    const dress = kind === "dress" || kind === "kurta";
    const trouser = kind === "trouser";
    const height = trouser ? 1.42 : (kind === "kurta" ? 1.68 : dress ? 1.72 : 1.12);
    const widthAt = v => {
      if (trouser) return v < .18 ? .30 : v < .55 ? .38 : .54;
      if (dress) return v < .16 ? .42 : v < .46 ? .34 : .42 + (v-.46)*.43;
      return v < .2 ? .46 : v < .52 ? .34 : .39;
    };
    for (let j=0;j<=rows;j++) {
      const v=j/rows;
      const y=height*(1-v);
      const half=widthAt(v);
      for(let i=0;i<=cols;i++){
        const u=i/cols, x=(u*2-1)*half;
        const sideFall=Math.pow(Math.abs(u-.5)*2,2);
        const verticalWave=Math.sin(v*Math.PI*1.7 + u*2.1)*.018;
        const pleat=Math.sin(u*Math.PI*10 + (trouser?0.4:0))*0.012;
        const drape=sideFall*.055 + pleat*(.25+v*.9) + verticalWave;
        const z=drape + Math.sin(u*Math.PI*2)*.012*(.2+v);
        positions.push(x,y,z);
        uvs.push(u,1-v);
      }
    }
    for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){
      const a=j*(cols+1)+i,b=a+1,c=a+cols+1,d=c+1;
      indices.push(a,c,b,b,c,d);
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const material=new THREE.MeshPhysicalMaterial({
      color, roughness:.96, metalness:0, side:THREE.DoubleSide,
      sheen:1, sheenColor:new THREE.Color(0xffffff), sheenRoughness:.92,
      clearcoat:0, specularIntensity:.12
    });
    const cloth=new THREE.Mesh(geometry,material);
    cloth.position.y=.58;
    cloth.userData.productId=product?.id;
    cloth.castShadow=true; cloth.receiveShadow=true;
    // A subtle second surface gives the hem and shoulders a textile edge.
    return cloth;
  }
  function rack(x,z,colors,items=[]) {
    const g = new THREE.Group();
    for (const xx of [-1.5,1.5]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,2.45,10),blackMetal);
      leg.position.set(xx,1.22,0); g.add(leg);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.05,12),brass);
      foot.position.set(xx,.06,0); g.add(foot);
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,3.15,12),brass);
    bar.rotation.z=Math.PI/2; bar.position.y=2.45; g.add(bar);
    const count=Math.max(colors.length,items.length);
    for(let i=0;i<count;i++){
      const xPos=-1.25+i*.41;
      const hangerGroup=new THREE.Group();
      const hangerWood=new THREE.MeshStandardMaterial({color:0x76583d,roughness:.52});
      const hangerPoints=[
        new THREE.Vector3(-.22,.02,0),new THREE.Vector3(0,-.16,0),
        new THREE.Vector3(.22,.02,0),new THREE.Vector3(-.22,.02,0)
      ];
      const hangerCurve=new THREE.CatmullRomCurve3(hangerPoints);
      const hangerFrame=new THREE.Mesh(new THREE.TubeGeometry(hangerCurve,32,.018,8,false),hangerWood);
      hangerGroup.add(hangerFrame);
      const hookCurve=new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,.02,0),new THREE.Vector3(0,.13,0),
        new THREE.Vector3(.045,.20,0),new THREE.Vector3(.10,.17,0),
        new THREE.Vector3(.10,.10,0)
      ]);
      const metalHook=new THREE.Mesh(new THREE.TubeGeometry(hookCurve,20,.012,8,false),brass);
      hangerGroup.add(metalHook);
      hangerGroup.position.set(xPos,2.30,.02);g.add(hangerGroup);
      const product=items.length?items[i%items.length]:null;
      const kind=product?.type==="Bottoms"?"trouser":
        product?.name?.toLowerCase().includes("kurta")?"kurta":
        product?.type==="Dresses"?"dress":"top";
      const cloth=makeGarment(kind,colors[i%colors.length],product);
      cloth.position.x=xPos;
      g.add(cloth);
    }
    g.position.set(x,0,z);
    g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    scene.add(g);
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
    // Refined boutique detailing: timber slat feature, floating shelves and warm integrated lighting.
    const featureSide = -d.side;
    for(let slat=0;slat<17;slat++){
      const sx=cx-4.35+slat*.54;
      addBox(.055,4.65,.10,oak,sx,3.05,cz-5.66,{castShadow:false});
    }
    addBox(9.65,.10,.14,brass,cx,5.48,cz-5.60,{castShadow:false});
    // Three floating display shelves on the inner side wall, clear of the garment rails.
    for(let level=0;level<3;level++){
      const shelfY=1.45+level*1.18;
      addBox(.72,.075,4.35,oak,cx+featureSide*5.18,shelfY,cz+.05,{castShadow:false});
      addBox(.78,.035,4.42,brass,cx+featureSide*5.18,shelfY+.055,cz+.05,{castShadow:false});
      const shelfGlow=new THREE.PointLight(0xffd7a4,3.5,4);
      shelfGlow.position.set(cx+featureSide*4.75,shelfY+.28,cz+.05);scene.add(shelfGlow);
    }
    // A low central styling table gives the room a real retail floor-plan focal point.
    addBox(1.65,.16,1.15,oak,cx,0.88,cz+.05);
    addBox(1.52,.055,1.02,brass,cx,0.99,cz+.05,{castShadow:false});
    for(const tx of [-.62,.62]){
      addBox(.09,.78,.09,blackMetal,cx+tx,.43,cz+.05);
    }
    // Folded knitwear stacks make the shelves and styling table read as a stocked boutique.
    const foldedPalette = [0xd8cbbb, 0x8c7460, 0x4a5350, 0xb18a72, 0x343b40];
    for (let level=0; level<3; level++) {
      for (let pile=0; pile<3; pile++) {
        const stackX = cx + featureSide*5.18;
        const stackZ = cz - 1.35 + pile*1.28;
        for (let layer=0; layer<3; layer++) {
          const textile = new THREE.Mesh(
            new THREE.BoxGeometry(.48,.075,.62),
            new THREE.MeshStandardMaterial({color:foldedPalette[(level+pile+layer)%foldedPalette.length],roughness:.96})
          );
          textile.position.set(stackX,1.56+level*1.18+layer*.078,stackZ);
          textile.castShadow=true; textile.receiveShadow=true; scene.add(textile);
        }
      }
    }
    for (let layer=0; layer<3; layer++) {
      const folded = new THREE.Mesh(
        new THREE.BoxGeometry(.82,.085,.62),
        new THREE.MeshStandardMaterial({color:foldedPalette[(layer+1)%foldedPalette.length],roughness:.98})
      );
      folded.position.set(cx-.48,1.11+layer*.087,cz+.05);
      folded.castShadow=true; scene.add(folded);
    }
    // Recessed linear ceiling track and three focused retail spotlights.
    addBox(7.6,.055,.12,blackMetal,cx,6.92,cz,{castShadow:false});
    for (const offset of [-2.65,0,2.65]) {
      const housing = new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,.16,20),brass);
      housing.position.set(cx+offset,6.82,cz-.15);
      scene.add(housing);
      const beam = new THREE.SpotLight(0xffe8cf,22,10,Math.PI/7,.58,1.4);
      beam.position.set(cx+offset,6.72,cz-.15);
      beam.target.position.set(cx+offset*.72,1.2,cz-.55);
      scene.add(beam,beam.target);
    }
    // Fine wall skirting and vertical wall-panel reveals add architectural scale.
    addBox(.10,.18,11.35,darkWood,cx+d.side*5.38,.12,cz,{castShadow:false});
    for (const panelZ of [-4.2,-2.1,0,2.1,4.2]) {
      addBox(.035,3.4,.035,brass,cx+d.side*5.36,3.0,cz+panelZ,{castShadow:false});
    }

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
    const roomProducts = products.filter(item =>
      name === "Men" || name === "Women" ? item.category === name :
      name === "Essentials" ? item.category === "Essentials" : item.type === name
    );
    rack(cx-2.6,cz-1.25,d.colors,roomProducts);
    rack(cx+2.6,cz+1.65,d.colors.slice().reverse(),roomProducts);
    const spot=new THREE.SpotLight(0xffe2c0,65,17,Math.PI/4,.5,1);
    spot.position.set(cx,6.8,cz); spot.target.position.set(cx,1,cz); scene.add(spot,spot.target);
  }

  // Family campaign display on the gallery's far feature wall.
  addSign("THE AURÉ FAMILY EDIT  ·  MEN  ·  WOMEN  ·  KIDS",0,5.55,-46.12,9.2);
  addBox(8.4,.22,2.1,oak,0,.14,-43.35);
  addBox(8.15,.08,1.9,brass,0,.29,-43.35);
  // No toy-like mannequin figures in the campaign gallery.

  const arrowMat = new THREE.MeshStandardMaterial({color:0xc49a69,metalness:.72,roughness:.22,emissive:0x68421c,emissiveIntensity:.45});
  const floorArrow = new THREE.Group();
  const arrowShaft = new THREE.Mesh(new THREE.BoxGeometry(.22,.035,1.35),arrowMat); arrowShaft.position.set(0,.035,0); floorArrow.add(arrowShaft);
  const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(.42,.78,4),arrowMat); arrowHead.rotation.x=-Math.PI/2; arrowHead.position.set(0,.055,-.78); floorArrow.add(arrowHead);
  floorArrow.position.set(0,0,-8.4); scene.add(floorArrow);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clickable = [];
  scene.traverse(object => { if (object.isMesh && object.userData.productId) clickable.push(object); });
  canvas.style.pointerEvents = "auto";
  const onCanvasClick = event => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(clickable, false)[0];
    if (hit && hit.object.userData.productId) onProductSelect(hit.object.userData.productId);
  };
  canvas.addEventListener("click", onCanvasClick);

  const resize=()=>{
    const w=canvas.clientWidth||window.innerWidth, h=canvas.clientHeight||window.innerHeight;
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  };
  window.addEventListener("resize",resize); resize();

  let progress=0, progressTarget=0, roomX=0, roomZ=18, roomTargetX=0, roomTargetZ=18;
  let activeDepartment=null, raf=0, directoryVisible=false;
  const setProgress=v=>{progressTarget=THREE.MathUtils.clamp(v,0,1);};
  const setDepartment=name=>{
    const d=departments[name]; if(!d)return;
    activeDepartment=name;
    // Move through the corresponding side opening and settle inside the room.
    roomTargetX=d.side*12.0;
    roomTargetZ=d.z+2.5;
  };
  const clearDepartment=()=>{activeDepartment=null;roomTargetX=0;roomTargetZ=-5;};
  const animate=()=>{
    raf=requestAnimationFrame(animate);
    progress=THREE.MathUtils.damp(progress,progressTarget,3.2,1/60);
    roomX=THREE.MathUtils.damp(roomX,roomTargetX,5.0,1/60);
    roomZ=THREE.MathUtils.damp(roomZ,roomTargetZ,5.0,1/60);
    const doorOpen=THREE.MathUtils.smoothstep(progress,.04,.42);
    doors.forEach(({pivot,side})=>{pivot.rotation.y=side*doorOpen*1.16;});
    const corridorZ=18-progress*22;
    const targetX=activeDepartment?roomX:0;
    const targetZ=activeDepartment?roomZ:corridorZ;
    camera.position.x=THREE.MathUtils.damp(camera.position.x,targetX,5.0,1/60);
    camera.position.y=THREE.MathUtils.damp(camera.position.y,2.35,3,1/60);
    camera.position.z=THREE.MathUtils.damp(camera.position.z,targetZ,5.0,1/60);
    camera.lookAt(activeDepartment?roomX:0,2.1,activeDepartment?roomZ-4.5:corridorZ-8);
    const nearArrow=!activeDepartment && progress>.72 && Math.abs(camera.position.z-floorArrow.position.z)<5.8;
    if(nearArrow!==directoryVisible){directoryVisible=nearArrow;onDirectoryToggle(nearArrow);}
    renderer.render(scene,camera);
  };
  animate();
  return {
    setProgress,
    setDepartment,
    clearDepartment,
    destroy(){onDirectoryToggle(false);cancelAnimationFrame(raf);window.removeEventListener("resize",resize);canvas.removeEventListener("click",onCanvasClick);renderer.dispose();}
  };
}
