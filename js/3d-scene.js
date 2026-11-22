import * as THREE from "three";

export function createShowroom(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x24201b);
  scene.fog = new THREE.Fog(0x24201b, 26, 68);
  const camera = new THREE.PerspectiveCamera(43,1,.1,130);
  camera.position.set(0,2.3,17);
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;
  scene.add(new THREE.HemisphereLight(0xffedda,0x625348,3.0));
  const key = new THREE.DirectionalLight(0xffe2c2,4.2); key.position.set(-5,10,9); scene.add(key);
  const fill = new THREE.DirectionalLight(0xd9e8ff,2.0); fill.position.set(7,6,1); scene.add(fill);
  const brass = new THREE.MeshStandardMaterial({color:0xb18a60,metalness:.62,roughness:.3});
  const stone = new THREE.MeshStandardMaterial({color:0x62564a,roughness:.8});
  const dark = new THREE.MeshStandardMaterial({color:0x302820,roughness:.45});
  const glass = new THREE.MeshStandardMaterial({color:0x9bafa9,metalness:.15,roughness:.15,transparent:true,opacity:.22});
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(22,70),new THREE.MeshStandardMaterial({color:0x55483c,roughness:.28,metalness:.08}));
  floor.rotation.x=-Math.PI/2; floor.position.set(0,-.08,-15); scene.add(floor);
  const facade = new THREE.Mesh(new THREE.BoxGeometry(14,8,.65),stone); facade.position.set(0,4,-1.3); scene.add(facade);
  const opening = new THREE.Mesh(new THREE.BoxGeometry(5.1,6.2,.9),new THREE.MeshBasicMaterial({color:0x30271f})); opening.position.set(0,3.1,-.82); scene.add(opening);
  for(const x of [-3.15,3.15]) { const pil=new THREE.Mesh(new THREE.BoxGeometry(.18,6.5,.25),brass); pil.position.set(x,3.25,-.65); scene.add(pil); }
  const sign = new THREE.Mesh(new THREE.BoxGeometry(4.4,.75,.16),new THREE.MeshStandardMaterial({color:0x30251d,emissive:0x9b6137,emissiveIntensity:1.4})); sign.position.set(0,7,-.83); scene.add(sign);
  const doors=[];
  for(const side of [-1,1]) { const pivot=new THREE.Group(); pivot.position.set(side*2.5,0,-.55);
    const leaf=new THREE.Mesh(new THREE.BoxGeometry(2.5,5.8,.16),brass); leaf.position.x=-side*1.25; pivot.add(leaf);
    const pane=new THREE.Mesh(new THREE.BoxGeometry(1.85,4.7,.05),glass); pane.position.set(-side*1.25,2.95,.1); pivot.add(pane);
    const handle=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.65,12),brass); handle.position.set(-side*2.05,2.8,.18); pivot.add(handle);
    scene.add(pivot); doors.push({pivot,side});
  }
  for(const x of [-6.7,6.7]) { const wall=new THREE.Mesh(new THREE.BoxGeometry(.28,8,48),stone); wall.position.set(x,4,-20); scene.add(wall); }
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(13.3,48),new THREE.MeshStandardMaterial({color:0x4c4034,roughness:.8,side:THREE.DoubleSide})); ceiling.rotation.x=Math.PI/2; ceiling.position.set(0,7.8,-20); scene.add(ceiling);
  const back=new THREE.Mesh(new THREE.BoxGeometry(13.5,8,.3),stone); back.position.set(0,4,-43); scene.add(back);
  for(let z=-5;z>-42;z-=5) {
    const frame=new THREE.Group();
    for(const x of [-5.8,5.8]) { const post=new THREE.Mesh(new THREE.BoxGeometry(.07,6,.07),brass); post.position.set(x,3,0); frame.add(post); }
    const top=new THREE.Mesh(new THREE.BoxGeometry(11.6,.07,.07),brass); top.position.y=6; frame.add(top); frame.position.z=z; scene.add(frame);
    const strip=new THREE.Mesh(new THREE.BoxGeometry(4.4,.07,.22),new THREE.MeshBasicMaterial({color:0xffd9a2})); strip.position.set(0,7.25,z); scene.add(strip);
    const spot=new THREE.SpotLight(0xffd6a1,95,17,Math.PI/5,.55,1.2); spot.position.set(0,7,z+1); spot.target.position.set(0,1.2,z-2); scene.add(spot,spot.target);
  }
  // Tailored mannequin forms with shaped garments, sleeves, collars, hems and realistic proportions.
  function mannequin(x,z,color,style="dress") {
    const group=new THREE.Group(); group.position.set(x,0,z);
    const fabric=new THREE.MeshStandardMaterial({color,roughness:.88});
    const skin=new THREE.MeshStandardMaterial({color:0x9f755e,roughness:.9});
    const hair=new THREE.MeshStandardMaterial({color:0x211b18,roughness:.95});
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.27,.78,7,18),fabric); body.position.y=2.12; group.add(body);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.085,.105,.22,16),skin); neck.position.y=2.72; group.add(neck);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.22,24,20),skin); head.scale.set(.88,1.12,.92); head.position.y=2.99; group.add(head);
    const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.225,20,16,0,Math.PI*2,0,Math.PI*.58),hair); hairCap.position.set(0,3.06,-.015); group.add(hairCap);
    for(const side of [-1,1]) {
      const sleeve=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.48,5,12),fabric); sleeve.position.set(side*.38,2.22,0); sleeve.rotation.z=side*.22; group.add(sleeve);
      const hand=new THREE.Mesh(new THREE.SphereGeometry(.09,12,10),skin); hand.position.set(side*.49,1.82,.02); group.add(hand);
    }
    if(style==="dress" || style==="kurta") {
      const bodice=new THREE.Mesh(new THREE.CylinderGeometry(.24,.34,.68,24),fabric); bodice.position.y=1.65; group.add(bodice);
      const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.29,style==="kurta"?.48:.78,style==="kurta"?1.35:1.48,32,2),fabric); skirt.position.y=style==="kurta"?0.72:1.0; group.add(skirt);
      const belt=new THREE.Mesh(new THREE.TorusGeometry(.29,.025,8,32),brass); belt.position.y=1.95; group.add(belt);
    } else {
      const jacket=new THREE.Mesh(new THREE.CylinderGeometry(.3,.38,.75,24),fabric); jacket.position.y=1.75; group.add(jacket);
      for(const side of [-1,1]) { const leg=new THREE.Mesh(new THREE.CylinderGeometry(.16,.13,1.2,18),fabric); leg.position.set(side*.18,.66,0); group.add(leg); }
    }
    const stand=new THREE.Mesh(new THREE.CylinderGeometry(.48,.55,.1,24),brass); stand.position.y=.05; group.add(stand); scene.add(group); return group;
  }
  mannequin(-3.8,-9,0x9a5948,"dress"); mannequin(3.8,-9,0x324d5a,"trouser");
  mannequin(-3.8,-20,0xc9b99f,"kurta"); mannequin(3.8,-20,0x5b4652,"dress");
  mannequin(0,-31,0x667b62,"trouser");
  function rack(x,z) {
    const rail=new THREE.Group(); const metal=brass;
    for(const xx of [-1.45,1.45]) { const leg=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,2.5,8),metal); leg.position.set(xx,1.25,0); rail.add(leg); }
    const bar=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,3.1,10),metal); bar.rotation.z=Math.PI/2; bar.position.y=2.45; rail.add(bar);
    const colors=[0x8b5547,0x263d43,0xc0aa8c,0x51404a,0x68745e,0x39312b,0xa77c61];
    for(let j=0;j<7;j++) {
      const hanger=new THREE.Mesh(new THREE.TorusGeometry(.12,.018,6,14,Math.PI),metal); hanger.position.set(-1.2+j*.4,2.25,.02); hanger.rotation.z=Math.PI; rail.add(hanger);
      const garment=new THREE.Group();
      const top=new THREE.Mesh(new THREE.BoxGeometry(.31,.52,.12),new THREE.MeshStandardMaterial({color:colors[j],roughness:.92})); top.position.y=.18; garment.add(top);
      const hem=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,.48,12),new THREE.MeshStandardMaterial({color:colors[j],roughness:.95})); hem.position.y=-.28; garment.add(hem);
      garment.position.set(-1.2+j*.4,1.62,.02); rail.add(garment);
    }
    rail.position.set(x,0,z); scene.add(rail);
  }
  rack(-5,-14); rack(5,-14); rack(-5,-27); rack(5,-27);
  // Illuminated department portals: the selected department becomes the room the camera enters.
  const portals=[];
  for(let i=0;i<4;i++) {
    const x=i%2===0?-5.9:5.9, z=-10-Math.floor(i/2)*15;
    const frame=new THREE.Group();
    const left=new THREE.Mesh(new THREE.BoxGeometry(.12,5,.12),brass); left.position.set(-1.25,2.5,0); frame.add(left);
    const right=left.clone(); right.position.x=1.25; frame.add(right);
    const top=new THREE.Mesh(new THREE.BoxGeometry(2.6,.12,.12),brass); top.position.y=5; frame.add(top);
    const glow=new THREE.PointLight(0xffd29b,32,9); glow.position.set(0,4.3,.4); frame.add(glow);
    frame.position.set(x,0,z); scene.add(frame); portals.push(frame);
  }
  const resize=()=>{const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  window.addEventListener("resize",resize); resize();
  let target=0,current=0,frame=0,roomX=0,roomTargetX=0;
  const setProgress=v=>target=THREE.MathUtils.clamp(v,0,1);
  const setDepartment=name=>{const map={Men:-2.6,Women:2.6,Dresses:3.3,Tops:-3.2,Bottoms:-2.8,Essentials:0};roomTargetX=map[name]??0;};
  const animate=()=>{
    frame=requestAnimationFrame(animate); current=THREE.MathUtils.damp(current,target,3.4,1/60); roomX=THREE.MathUtils.damp(roomX,roomTargetX,2.8,1/60);
    const open=THREE.MathUtils.smoothstep(current,.08,.34); doors.forEach(({pivot,side})=>pivot.rotation.y=side*open*1.18);
    const baseZ=17-current*34;
    camera.position.set(roomX,2.3-current*.15,baseZ);
    camera.lookAt(roomX*.72,2.25,-3-current*9);
    renderer.render(scene,camera);
  }; animate();
  return {setProgress,setDepartment,destroy(){cancelAnimationFrame(frame);window.removeEventListener("resize",resize);renderer.dispose();}};
}
