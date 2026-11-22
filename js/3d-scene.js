import * as THREE from "three";
export function createShowroom(canvas){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x100e0c);scene.fog=new THREE.Fog(0x100e0c,18,55);
 const camera=new THREE.PerspectiveCamera(43,1,.1,120);camera.position.set(0,2.2,17);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 scene.add(new THREE.HemisphereLight(0xd9c7b1,0x17110e,2.1));const key=new THREE.DirectionalLight(0xffdfbf,3.5);key.position.set(-5,9,8);scene.add(key);const warm=new THREE.PointLight(0xc28a68,35,32);warm.position.set(0,5,-7);scene.add(warm);
 const floorMat=new THREE.MeshStandardMaterial({color:0x29231e,roughness:.35,metalness:.15});const floor=new THREE.Mesh(new THREE.PlaneGeometry(22,70),floorMat);floor.rotation.x=-Math.PI/2;floor.position.set(0,-.08,-15);scene.add(floor);
 const brass=new THREE.MeshStandardMaterial({color:0x9c7957,metalness:.72,roughness:.28}),stone=new THREE.MeshStandardMaterial({color:0x38302a,roughness:.72}),glass=new THREE.MeshStandardMaterial({color:0x5c5148,metalness:.35,roughness:.22,transparent:true,opacity:.32});
 // Street-facing boutique facade and glowing sign.
 const facade=new THREE.Mesh(new THREE.BoxGeometry(14,8,.65),stone);facade.position.set(0,4,-1.3);scene.add(facade);
 const opening=new THREE.Mesh(new THREE.BoxGeometry(5.1,6.2,.9),new THREE.MeshBasicMaterial({color:0x080706}));opening.position.set(0,3.1,-.82);scene.add(opening);
 for(const x of [-3.15,3.15]){const pil=new THREE.Mesh(new THREE.BoxGeometry(.18,6.5,.25),brass);pil.position.set(x,3.25,-.65);scene.add(pil);}
 const sign=new THREE.Mesh(new THREE.BoxGeometry(4.4,.75,.16),new THREE.MeshStandardMaterial({color:0x171411,emissive:0x4b2d1d,emissiveIntensity:.7}));sign.position.set(0,7.0,-.83);scene.add(sign);
 // Two real pivoting door leaves; scroll progress swings them outward.
 const doors=[];
 for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.set(side*2.5,0,-.55);const leaf=new THREE.Mesh(new THREE.BoxGeometry(2.5,5.8,.16),brass);leaf.position.x=-side*1.25;pivot.add(leaf);const pane=new THREE.Mesh(new THREE.BoxGeometry(1.85,4.7,.05),glass);pane.position.set(-side*1.25,2.95,.1);pivot.add(pane);const handle=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.65,12),brass);handle.position.set(-side*2.05,2.8,.18);pivot.add(handle);scene.add(pivot);doors.push({pivot,side});}
 // Interior walls and ceiling frames.
 for(const x of [-6.7,6.7]){const wall=new THREE.Mesh(new THREE.BoxGeometry(.28,8,48),stone);wall.position.set(x,4,-20);scene.add(wall);}
 const back=new THREE.Mesh(new THREE.BoxGeometry(13.5,8,.3),stone);back.position.set(0,4,-43);scene.add(back);
 for(let z=-5;z>-42;z-=5){const frame=new THREE.Group();for(const x of [-5.8,5.8]){const post=new THREE.Mesh(new THREE.BoxGeometry(.07,6,.07),brass);post.position.set(x,3,0);frame.add(post);}const top=new THREE.Mesh(new THREE.BoxGeometry(11.6,.07,.07),brass);top.position.y=6;frame.add(top);frame.position.z=z;scene.add(frame);}
 // Mannequin dolls wearing sculpted clothing: torso, neck, head, arms and flared skirt/trousers.
 function mannequin(x,z,color,skirt=true){const outfit=new THREE.MeshStandardMaterial({color,roughness:.78});const skin=new THREE.MeshStandardMaterial({color:0x9b715a,roughness:.85});const group=new THREE.Group();group.position.set(x,0,z);
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.34,.85,5,12),outfit);torso.position.y=2.15;group.add(torso);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.22,12),skin);neck.position.y=2.78;group.add(neck);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.23,20,16),skin);head.position.y=3.08;group.add(head);
 for(const side of [-1,1]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.085,.72,4,8),outfit);arm.position.set(side*.43,2.05,0);arm.rotation.z=side*-.12;group.add(arm);}
 if(skirt){const skirtMesh=new THREE.Mesh(new THREE.CylinderGeometry(.28,.68,1.25,24,1),outfit);skirtMesh.position.y=1.12;group.add(skirtMesh);}else{for(const side of [-1,1]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.17,.13,1.2,12),outfit);leg.position.set(side*.19,.65,0);group.add(leg);}}
 const stand=new THREE.Mesh(new THREE.CylinderGeometry(.55,.62,.12,24),brass);stand.position.y=.06;group.add(stand);scene.add(group);return group;}
 mannequin(-3.9,-9,0x8a5144,true);mannequin(3.9,-9,0x253d45,false);mannequin(-3.9,-20,0xb8a28b,true);mannequin(3.9,-20,0x55404a,true);mannequin(0,-31,0x65705b,false);
 // Garment rails with multiple hanging pieces at either side of the aisle.
 function rack(x,z){const rail=new THREE.Group();const metal=new THREE.MeshStandardMaterial({color:0x9a7959,metalness:.7,roughness:.3});for(const xx of [-1.45,1.45]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,2.5,8),metal);leg.position.set(xx,1.25,0);rail.add(leg);}const bar=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,3.1,10),metal);bar.rotation.z=Math.PI/2;bar.position.y=2.45;rail.add(bar);
 for(let j=0;j<7;j++){const hanger=new THREE.Mesh(new THREE.TorusGeometry(.12,.018,6,14,Math.PI),metal);hanger.position.set(-1.2+j*.4,2.25,.02);hanger.rotation.z=Math.PI;rail.add(hanger);const garment=new THREE.Mesh(new THREE.BoxGeometry(.31,.95,.12),new THREE.MeshStandardMaterial({color:[0x8b5547,0x263d43,0xc0aa8c,0x51404a,0x68745e,0x39312b,0xa77c61][j],roughness:.9}));garment.position.set(-1.2+j*.4,1.58,.02);rail.add(garment);}rail.position.set(x,0,z);scene.add(rail);}
 rack(-5,-14);rack(5,-14);rack(-5,-27);rack(5,-27);
 for(let z=-5;z>-40;z-=7){const strip=new THREE.Mesh(new THREE.BoxGeometry(2.8,.04,.18),new THREE.MeshBasicMaterial({color:0xe1c5a1}));strip.position.set(0,6.8,z);scene.add(strip);}
 const resize=()=>{const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};window.addEventListener("resize",resize);resize();
 let target=0,current=0,frame=0;const setProgress=v=>target=THREE.MathUtils.clamp(v,0,1);
 const animate=()=>{frame=requestAnimationFrame(animate);current=THREE.MathUtils.damp(current,target,3.4,1/60);const open=THREE.MathUtils.smoothstep(current,.08,.34);doors.forEach(({pivot,side})=>{pivot.rotation.y=side*open*1.18;});camera.position.set(0,2.25-current*.15,17-current*34);camera.lookAt(0,2.3,-3-current*9);renderer.render(scene,camera);};animate();
 return{setProgress,destroy(){cancelAnimationFrame(frame);window.removeEventListener("resize",resize);renderer.dispose();}};
}