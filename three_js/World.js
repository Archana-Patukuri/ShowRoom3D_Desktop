import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createCameraControls } from "./systems/cameraControls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { reflection } from "./systems/reflection.js";
import { lightControls } from "./systems/lightControls.js";
import { viewPoints } from "./systems/viewpoints.js";
import { basicControls } from "./systems/basicControls.js";
import { resetAndHelp } from "./systems/resetAndHelp.js";
import {shadows} from "./systems/shadows.js";
// import {shadowEnabler} from "./systems/shadowEnabler.js"

import  hdriLoad  from "./components/hdri_loader/hdri_loader.js";
import { Debug } from "./systems/Debug.js";

import LightStore from './store/lightStore';

import {
  Box3, 
  Clock,
  Group,  
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
  AmbientLight,
  Color,
  DirectionalLight,  
  RectAreaLight,   
  TextureLoader,    
} from "three";
import * as THREE from 'three';
import { createEffectComposer } from "./systems/effectComposer.js";

import { GammaCorrectionShader } from '../node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js'; 
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { TAARenderPass } from '../node_modules/three/examples/jsm/postprocessing/TAARenderPass.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

import { OutlinePass } from '../node_modules/three/examples/jsm/postprocessing/OutlinePass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';

import { TransformControls } from '../node_modules/three/examples/jsm/controls/TransformControls.js';
import { FurnitureContainer } from "./components/furnitureContainers/FurnitureContainer.js";
import { LightContainer } from "./components/furnitureContainers/LightContainer.js";
import { exportScene } from "./systems/export.js";

import { gltfLoad } from "./components/gltf_loader/gltfLoad.js";

import assets from "./dataBase/assets.json" assert { type: "json" };

import { Line2 } from "../node_modules/three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "../node_modules/three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "../node_modules/three/examples/jsm/lines/LineGeometry.js";


import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

import useSpinner from 'use-spinner';
import 'use-spinner/assets/use-spinner.css';
let container_3d=document.getElementById("3dcontainer");

import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
let mobile = false;
if (/Android|iPhone/i.test(navigator.userAgent)) {
  mobile = true;
}
let lineId = 0 
let measurementDiv
const measurementLabels = []

let prompt=document.getElementById("ar-prompt");

const container = document.querySelector("#scene-container");
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(container.clientWidth, container.clientHeight);
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
container.appendChild(labelRenderer.domElement); 

let cylindricalLampSpotLight1,
  cylindricalLampSpotLight2,
  cylindricalLampSpotLight3,
  cylindricalLampSpotLight4;
let ambientLightSun
let shadowLight;
let camera;
let renderer;
let scene;
let cameraControls;
let debug;
let clock;
let plantsParent, lampsParent,mirrorParent,vaseParent,laptopParent,fanParent,vaseFloorParent,framesParent,wallLightParent;
let composer;
let chairModels, tableModels, blindsModels,lightsModels;
let gui;   

let mouse = new Vector2();

let raycaster = new Raycaster();
let selectedObjects = [];
let selectableObjects = [];

let transformControl;
let box,outlinePass,effectFXAA;
let chairsUIContainer,tablesUIContainer,blindsUIContainer,lightsUIContainer

  chairsUIContainer = document.getElementById("Chair_Desktop");
  tablesUIContainer = document.getElementById("Table_Desktop");
  blindsUIContainer = document.getElementById("windowBlinds_Desktop");
  lightsUIContainer = document.getElementById("lightsUIContainer_Desktop");


let UIContainer;
let roomParent;
let sunLight

let dayLightSettings, nightLightSettings1;

plantsParent = new Group();
plantsParent.name="selectable";

mirrorParent=new Group();
mirrorParent.name="selectable";

vaseParent=new Group();
vaseParent.name="selectable";

lampsParent=new Group();
lampsParent.name="selectable";

laptopParent=new Group();
laptopParent.name="selectable";

vaseFloorParent=new Group();
vaseFloorParent.name="selectable";

framesParent=new Group();
framesParent.name="selectable";

wallLightParent=new Group();
wallLightParent.name="selectable";

let rectAreaLights = [];


let HDRI=document.getElementById("HDRI");
let Emissive=document.getElementById("Emissive");
const stateList = {"HDRI":HDRI,
 "Emissive":Emissive };
 
 let gui_ui=document.getElementById("gui_ui"); 
 let start,millis;
start = Date.now();
console.log("timer started")
let preset_val=0, fanLight ;
let intialLoad=true
class World {
  constructor() {        
    this.container = container;
    UIContainer = container;

    this.cylindricalLightArray = [];

    labelRenderer.setSize(container.clientWidth, container.clientHeight)

    scene = createScene();    
    this.lightState = new LightStore(scene);
    renderer = createRenderer(this.lightState);

    // renderer = createRenderer();
     renderer.info.autoReset = false;
    composer = createEffectComposer(renderer);          

    camera = createCamera(); 
    scene.add(camera);    
    camera.layers.enable(0);
    camera.layers.enable(2);
       
   renderer.domElement.addEventListener( 'pointermove', (e) => {
    prompt.style.display="none";
  }); 
    let desktopUI=document.getElementById("desktopUI")
    desktopUI.onclick= function(event) {      
      prompt.style.display="none";
    };  
    const grid = new THREE.GridHelper( 10, 20, 0x000000, 0x000000 );
    grid.material.opacity = .5;
    grid.position.y = - 0.02;
    grid.material.transparent = true;
    scene.add( grid );      

    box = new Box3();        

    fanParent=new Group();
    fanParent.name="selectable";

    roomParent = new Group();       

    clock = new Clock();
    //Parent Object where the loaded GLTF Models will be added
   
   
    chairModels = new FurnitureContainer(
      assets.Chairs,
      chairsUIContainer,
      "chairs",
      "0",
      scene,
      renderer          
    );
    tableModels = new FurnitureContainer(
      assets.Tables,
      tablesUIContainer,
      "tables",
      "0", 
      scene,
      renderer      
    );        

     blindsModels = new FurnitureContainer(
      assets.Blinds,
      blindsUIContainer,
      "windowBlinds",
      "0",  
      scene,
      renderer,
      clock                   
    ); 
    
     lightsModels = new LightContainer(
      assets.Lights,
      lightsUIContainer,
      "lights",
      "0",
      selectableObjects,      
      scene,
      renderer
    );    
    //for adding Helpers and FPS
    debug = new Debug();    
    
    ambientLightSun = new AmbientLight();
    ambientLightSun.color = new Color(0xffffff);    
    scene.add(ambientLightSun);
    ambientLightSun.name = "ambientLightSun"

    RectAreaLightUniformsLib.init();
    renderer.toneMappingExposure = 1; 

    
    for (let i = 0; i < 4; i++) {
      const rectLight = new RectAreaLight(0xffffff, 0.1, 3, 0.15);
      rectAreaLights.push(rectLight);
      // scene.add(rectLight);
    }

    rectAreaLights[0].position.set(0.085, 2.97, 1.9525);
    rectAreaLights[1].position.set(0.085, 2.97, -1.0855);
    rectAreaLights[1].rotateY(Math.PI);

    rectAreaLights[2].position.set(1.58, 2.97, 0.45);
    rectAreaLights[2].rotateY(Math.PI / 2);

    rectAreaLights[3].position.set(-1.41, 2.97, 0.45);
    rectAreaLights[3].rotateY(-Math.PI / 2);                             

    //WINDOW RESIZER
    const resizer = new Resizer(container, camera, renderer, composer,labelRenderer);
    container.append(renderer.domElement);
    //Orbit Controlls for Camera
    cameraControls = createCameraControls(camera, renderer.domElement);
    camera.position.set(0.01,2.165,4.73);      
    camera.updateMatrixWorld();
    camera.name="PerspectiveCamera"    
    basicControls(scene,camera,cameraControls,renderer);       
    resetAndHelp(camera);  
    this.loadHDRI();
  
  } 
  async loadHDRI() {
    console.time('Initial_HDRI_Loading');
    const { background0, hdri0, hdri1 } = await hdriLoad();
    this.background0 = background0;
    this.hdri0 = hdri0;
    this.hdri1 = hdri1;
    console.timeEnd('Initial_HDRI_Loading');
  }
  createUI() {
    //created FurnitureTypesUI from JSON data
    tableModels.createUI();
    chairModels.createUI();
    blindsModels.createUI();
    lightsModels.createUI();
  }  

  async loadBackground() {          
      scene.background=new Color(1,1,1)                
  }
  //LoadRoom
  async loadRoomGLTF() {       
    // let modelURL = await fetch(assets.Room[0].URL); 
    let modelURL = assets.Room[0].URL
    let { gltfData } = await gltfLoad(modelURL);
    let loadedmodel = gltfData.scene;  
    this.room=loadedmodel          
    roomParent.add(loadedmodel); 
    // shadowEnabler(loadedmodel)    
   let Themes_Desktop=document.getElementById("Themes_Desktop");

    for (let i = 0; i < gltfData.userData.variants.length; i++) {
      let div2 = document.createElement("div");
      div2.className = "d-flex flex-row"; 
     let input = document.createElement("input");
      input.type = "radio";
      input.value = gltfData.userData.variants[i];
      input.className = "form-check-input largerCheckbox";      
      input.name=gltfData.userData.variants[i].name;      
      input.id = gltfData.userData.variants[i]; 

      let label = document.createElement("label");
      
        label.className = "themes_Desktop_Label";
      
      
      label.setAttribute("for", gltfData.userData.variants[i]);
      label.innerHTML=gltfData.userData.variants[i]

      div2.appendChild(input);
      div2.appendChild(label);
        
      Themes_Desktop.appendChild(div2)      
      
       async function input_var_Fun(){
        let myPromise = new Promise(function(resolve) {                                                                        
          gltfData.functions.selectVariant(gltfData.scene,gltfData.userData.variants[i] );         
          reflection(scene,clock,gui);                  
        });                
        await myPromise;                 
      }                   
      input.addEventListener("click", function (e) {  
        if(e.target.checked){                             
          input_var_Fun(); 
        }        
      });            
      if(input.id=="Theme_3"){
        input.checked=true;                          
      }
      
    }
   
    let fan=roomParent.children[0].children[6]
    fanParent.add(fan)      
    for (let i = 0; i < loadedmodel.children.length; i++) {
      if (loadedmodel.children[i].name == "BlindsPosition") {
        let blindsPos = loadedmodel.children[i].position;
        blindsModels.parentGroup.position.copy(blindsPos);        
      }
    }    
    roomParent.add(fanParent)     
    scene.add(fanParent)    
    scene.add(roomParent);      
    selectableObjects.push(fanParent);  
    fanLight = scene.getObjectByName("fanLight"); 
    fanLight.intensity=30      

    renderer.render(scene, camera);   
    console.log("room drawcalls ",renderer.info.render.calls)         
  }    
async loadTableGLTF() {  
  await tableModels.loadModel();  
  tableModels.parentGroup.position.set(0, 0, 0.5);  
  selectableObjects.push(tableModels.parentGroup);
  //  scene.add(tableModels.parentGroup) 
  renderer.info.reset();
  renderer.render(scene, camera);       
  console.log("table drawcalls",renderer.info.render.calls)         
}
//LoadLights
async loadLightsGLTF() {    
  await lightsModels.loadModel();  
                
  if(lightsModels.assetsList[1].Name=="Floor Light"){  
    scene.add(lightsModels.parentGroup)  
    selectableObjects.push(lightsModels.parentGroup);      
  }
  if(lightsModels.assetsList[2].Name=="Wall Light"){  
    scene.add(lightsModels.parentGroup2)  
    selectableObjects.push(lightsModels.parentGroup2);      
  } 

  renderer.render(scene, camera);  
  // console.log(renderer.info.render.calls)          
}            

  //LoadBlinds
  async loadBlindsGLTF() {       
    await blindsModels.loadModel();   
    // scene.add(blindsModels.parentGroup);
    selectableObjects.push(blindsModels.parentGroup);   
    renderer.info.reset();       
    renderer.render(scene, camera);     
    console.log("blinds drawcalls",renderer.info.render.calls)                
  }
  //LoadChair
  async loadChairGLTF() {  
        await chairModels.loadModel();    
        chairModels.parentGroup.position.set(0, 0, -0.5);
        // scene.add(chairModels.parentGroup);    
        selectableObjects.push(chairModels.parentGroup); 
        renderer.info.reset();   
        renderer.render(scene, camera); 
        console.log("chair drawcalls",renderer.info.render.calls)          
      /* if (window.Worker) {
      const myWorker = new Worker("webworker.js");      
      myWorker.postMessage("Chair");                  
    
      myWorker.onmessage =async function(e) { 
        if(e.data=="Chair"){                  
        await chairModels.loadModel();    
        chairModels.parentGroup.position.set(0, 0, -0.5);
        scene.add(chairModels.parentGroup);    
        selectableObjects.push(chairModels.parentGroup);    
        renderer.render(scene, camera);  
        }      
      }
    } else {
      console.log('Your browser doesn\'t support web workers.');
    }       */          
  }    
  //LoadPlants

  async loadCylindricalLight() {            
    // let modelURL = await fetch(assets.Lights_2[0].URL);
    let modelURL = assets.Lights_2[0].URL
    const { gltfData } = await gltfLoad(modelURL);
    const loadedmodel = gltfData.scene;
    const cylindricalLight1 = loadedmodel;
    wallLightParent.add(cylindricalLight1)
    scene.add(wallLightParent);
    selectableObjects.push(wallLightParent)
    cylindricalLampSpotLight1 = scene.getObjectByName(
      "Cylindrical_spot_light_1"
    );
     cylindricalLampSpotLight2 = scene.getObjectByName(
      "Cylindrical_spot_light_2"
    );
     cylindricalLampSpotLight3 = scene.getObjectByName(
      "Cylindrical_spot_light_3"
    );
   cylindricalLampSpotLight4 = scene.getObjectByName(
      "Cylindrical_spot_light_4"
    );
    cylindricalLampSpotLight1.distance = 1;
    cylindricalLampSpotLight2.distance = 1;
    cylindricalLampSpotLight3.distance = 1;
    cylindricalLampSpotLight4.distance = 1;
    renderer.info.reset();
    renderer.render(scene, camera)  
    console.log("wall lights drawcalls ",renderer.info.render.calls)           
  }
  //LoadMirror
  async loadMirrorGLTF() {
     
    // let modelURL = await fetch(assets.Mirror[0].URL);    
    let modelURL = assets.Mirror[0].URL

    const { gltfData } = await gltfLoad(modelURL); 
    const loadedmodel = gltfData.scene; 
    // shadowEnabler(loadedmodel)    
    const mirror = loadedmodel;   
    mirrorParent.add(mirror)   
    scene.add(mirrorParent);    
    selectableObjects.push(mirrorParent); 
    renderer.info.reset();          
    renderer.render(scene, camera);   
    console.log("mirror drawcalls",renderer.info.render.calls)         
  } 
  async loadAccessoriesGLTF() {
     
    // let modelURL = await fetch(assets.Accessories[0].URL);    
    let modelURL = assets.Accessories[0].URL

    const { gltfData } = await gltfLoad(modelURL); 
    const loadedmodel = gltfData.scene; 
    // shadowEnabler(loadedmodel)   
    framesParent.add(loadedmodel)          
    scene.add(framesParent);   
    selectableObjects.push(framesParent);     
    renderer.info.reset();
    renderer.render(scene, camera); 
    console.log("frames drawcalls",renderer.info.render.calls)  
    viewPoints(camera,scene,framesParent);          
  } 
  async loadVaseGLTF() {     
    // let modelURL = await fetch(assets.Accessories[2].URL);    
    let modelURL = assets.Accessories[2].URL

    const { gltfData } = await gltfLoad(modelURL); 
    const loadedmodel = gltfData.scene;  
    // shadowEnabler(loadedmodel)   
    vaseFloorParent.add(loadedmodel)      
    scene.add(vaseFloorParent);  
    selectableObjects.push(vaseFloorParent);
    renderer.info.reset();      
    renderer.render(scene, camera); 
    console.log("vase drawcalls",renderer.info.render.calls)         
  }    
  async lightPresets() {      

   
  let tableLamp = scene.getObjectByName("Desktop_Lamp_Light002");                               
  let sunLight = scene.getObjectByName("Sun");         
  let Spinner = document.getElementById("Spinner");  

    /* dayLightSettings = function (hdri1) {            
      console.time("DayLight Preset time"); 
       scene.background = new Color(0xffffff);          
        tableLamp.intensity = 0;
        fanLight.intensity = 0;            
        cylindricalLampSpotLight1.intensity = 0;
        cylindricalLampSpotLight2.intensity = 0;
        cylindricalLampSpotLight3.intensity = 0;
        cylindricalLampSpotLight4.intensity = 0;                                                                  
        sunLight.intensity = 30;                           
        scene.environment = hdri1;  
        renderer.toneMappingExposure=0.2;  
        shadowLight=0;        
        shadows(scene,shadowLight,sunLight,fanLight,roomParent);             
    };   
         
    nightLightSettings1 = function (hdri0) { 
      console.time("NightLight Preset time");                
      renderer.toneMappingExposure = 1;                                     
         
      sunLight.intensity = 0;
      ambientLightSun.intensity = 0;   
      scene.environment = hdri0;      
      scene.background = new Color(0x000000);  
              
      fanLight.intensity = 30;                  
      fanLight.castShadow=true 
      cylindricalLampSpotLight1.intensity = 2;
      cylindricalLampSpotLight2.intensity = 2;
      cylindricalLampSpotLight3.intensity = 2;
      cylindricalLampSpotLight4.intensity = 2;
      if(flag==0){
      shadowLight=3;        
      shadows(scene,shadowLight,sunLight,fanLight,roomParent);  
     }else{
      shadowLight=1;        
      shadows(scene,shadowLight,sunLight,fanLight,roomParent);  
     } 
       flag+=1                              
    };
    */
    const dayLightSettings_fn = async () => {                      
        // dayLightSettings(this.hdri1);        
        Spinner.style.display="block";
        console.time("DayLight Preset time"); 
       scene.background = new Color(0xffffff);          
        tableLamp.intensity = 0;
        fanLight.intensity = 0;            
        cylindricalLampSpotLight1.intensity = 0;
        cylindricalLampSpotLight2.intensity = 0;
        cylindricalLampSpotLight3.intensity = 0;
        cylindricalLampSpotLight4.intensity = 0;                                                                  
        sunLight.intensity = 30;                           
        scene.environment = this.hdri1;  
        renderer.toneMappingExposure=0.2;  
        shadowLight=0;        
        shadows(scene,shadowLight,sunLight,fanLight,roomParent);  
          
    }; 
    async function dayLightSettings_Fun() {                                      
      const spinnedFn = useSpinner(dayLightSettings_fn, {
       container: container_3d
     });      
     // execute with a loading spinner     
     await spinnedFn(); 
     console.timeEnd("DayLight Preset time"); 
     Spinner.style.display="none";         
   }              
   let flag=0   
   const NightLight1_fn = async () => {     
    Spinner.style.display="block";          
      // nightLightSettings1(this.hdri0);     
      console.time("NightLight Preset time");                
      renderer.toneMappingExposure = 1;                                     
         
      sunLight.intensity = 0;
      ambientLightSun.intensity = 0;   
      scene.environment = this.hdri0;      
      scene.background = new Color(0x000000);  
              
      fanLight.intensity = 30;                  
      fanLight.castShadow=true 
      cylindricalLampSpotLight1.intensity = 2;
      cylindricalLampSpotLight2.intensity = 2;
      cylindricalLampSpotLight3.intensity = 2;
      cylindricalLampSpotLight4.intensity = 2;
      if(flag==0){
      shadowLight=3;        
      shadows(scene,shadowLight,sunLight,fanLight,roomParent);  
     }else{
      shadowLight=1;        
      shadows(scene,shadowLight,sunLight,fanLight,roomParent);  
     } 
       flag+=1              
       Spinner.style.display="none";                
    }; 
  async function NightLight1_Fun() {                                      
    const spinnedFn = useSpinner(NightLight1_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();    
   console.timeEnd("NightLight Preset time");          
 }       
       
    NightLight1_Fun();        
    let dayLight_Desktop=document.getElementById("dayLight_Desktop");
    let nightLight_Desktop=document.getElementById("nightLight_Desktop");
    dayLight_Desktop.addEventListener("click",function(){
      dayLightSettings_Fun();   
    
    // await dayLightSettings_fn()
     nightLight_Desktop.style.display="block"      
     dayLight_Desktop.style.display="none"    
    
    })
    nightLight_Desktop.addEventListener("click",function(){
     NightLight1_Fun();
     nightLight_Desktop.style.display="none"      
     dayLight_Desktop.style.display="block"
    })
   if(intialLoad){
      lightControls(
        scene,
        renderer,        
        sunLight,
        ambientLightSun,               
        fanLight,
        tableLamp,
        stateList,
        [cylindricalLampSpotLight1,cylindricalLampSpotLight2,cylindricalLampSpotLight3,cylindricalLampSpotLight4],
      );
      intialLoad=false
    }

  }
  //CreatePostProcess Effects
  createPostProcess() {        
    const renderPass = new RenderPass(scene, camera);
    //Disable Render Pass
    // renderPass.enabled = false;         
    composer.addPass(renderPass);                       
    let taaRenderPass
    function TAA_Fun(){
      taaRenderPass = new TAARenderPass(scene, camera);   
      taaRenderPass.sampleLevel = 1;  
      composer.addPass(taaRenderPass)      
    }
    function TAA_else_Fun(){
      taaRenderPass.sampleLevel = 0;  
      composer.removePass(taaRenderPass)
    }          
    let TAA_C=document.getElementById("TAA_C");
    TAA_C.addEventListener("click",function(e){
      if(e.target.checked){
        TAA_Fun()
      }else{
        TAA_else_Fun()
      }
    })   
    let intial_Loading_Val=0 
    let FXAA_C=document.getElementById("FXAA_C");
    function FXAA_Fun(){
      effectFXAA = new ShaderPass( FXAAShader );
      effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );     
      composer.addPass( effectFXAA );      
      if(intial_Loading_Val==0){
        prompt.style.display="block"; 
        intial_Loading_Val+=1
        } 
    }
    function FXAA_else_Fun(){
      composer.removePass( effectFXAA );      
    }         
    FXAA_Fun() 
    FXAA_C.addEventListener("click",function(e){
      if(e.target.checked){
        FXAA_Fun()
      }else{
        FXAA_else_Fun()
      }
    })    
    let ssaaRenderPass;				 
    let SSAA_C=document.getElementById("SSAA_C");
   
    function SSAA_Fun(){
      ssaaRenderPass = new SSAARenderPass( scene, camera );
      composer.addPass( ssaaRenderPass );              
    }
    function SSAA_Else_Fun(){
      composer.removePass( ssaaRenderPass );        
    }       
    SSAA_C.addEventListener("click",function(e){
      if(e.target.checked){
        SSAA_Fun()
      }else{
        SSAA_Else_Fun()
      }
    })    
    let SMAApass;				       
    let SMAA_C=document.getElementById("SMAA_C");      
    function SMAA_Fun(){
      SMAApass = new SMAAPass( (window.innerWidth*0.1) * renderer.getPixelRatio(), (window.innerHeight*0.1) * renderer.getPixelRatio() );
      composer.addPass( SMAApass );  
     
    }
    function SMAA_Else_Fun(){
      composer.removePass( SMAApass );
    }                         
    SMAA_C.addEventListener("click",function(e){
      if(e.target.checked){
        SMAA_Fun();       
      }else{
        SMAA_Else_Fun()
      }
    })     
    let ssaoPass;
    let SSAO_C=document.getElementById("SSAO_C");  
    function Ambient_Occlusion_Fun(){
      const width = container.clientWidth;
      const height = container.clientHeight;
      ssaoPass = new SSAOPass( scene, camera, width, height );
      composer.addPass( ssaoPass );  
    }           
    function Ambient_Occlusion_Else_Fun(){
      composer.removePass( ssaoPass );                  
    }        
    SSAO_C.addEventListener("click",function(e){
      if(e.target.checked){
        Ambient_Occlusion_Fun()
      }else{
        Ambient_Occlusion_Else_Fun()
      }
    })

    let saoPass
    let SAO_C=document.getElementById("SAO_C");
    function Ambient_Occlusion_sao_Fun(){
      saoPass = new SAOPass( scene, camera, false, true );                  
      composer.addPass( saoPass ); 
    }
    function Ambient_Occlusion_sao_Else_Fun(){
      composer.removePass( saoPass );               
    }
     
    SAO_C.addEventListener("click",function(e){
      if(e.target.checked){
        Ambient_Occlusion_sao_Fun()
      }else{
        Ambient_Occlusion_sao_Else_Fun()
      }
    })              


    let groundReflector,ssrPass,geometry,selects
    let ssr_ui=document.getElementById("ssr_ui");
    function SSR_fun(){
      start = Date.now();
      millis = Date.now() - start;        
     console.log('SSR loading Start time = ', millis ,'ms');
     const params = {
      enableSSR: true,      
      groundReflector: true,
    };          
    
    geometry = new THREE.PlaneGeometry( 3.88, 3.88 );

      groundReflector = new ReflectorForSSRPass( geometry, {
        clipBias: 0.0003,
        textureWidth: window.innerWidth*0.1,
        textureHeight: window.innerHeight*0.1,
        color: 0x888888,
        // useDepthTexture: true,
      } );
      // groundReflector.material.depthWrite = false;
      groundReflector.rotation.x = - Math.PI / 2;
      groundReflector.position.y = -0.01;
      groundReflector.position.z=0.43;
      groundReflector.position.x=0.08; 

      // groundReflector.visible = true;
      let Floor = scene.getObjectByName('Floor');    
     Floor.material.opacity=0.5;   
     Floor.material.transparent=true;   
      

      ssrPass = new SSRPass( {
        renderer,
        scene,
        camera,
        width: innerWidth*0.1,
        height: innerHeight*0.1,
        groundReflector: params.groundReflector ? groundReflector : null,
        selects: params.groundReflector ? selects : null
      } );

     
       if(gui)gui.destroy();
      gui = new GUI( );
      gui.add( params, 'enableSSR' ).name( 'Enable SSR' );
      gui.add( params, 'groundReflector' ).onChange( () => {

        if ( params.groundReflector ) {

          ssrPass.groundReflector = groundReflector,
          ssrPass.selects = selects;

        } else {

          ssrPass.groundReflector = null,
          ssrPass.selects = null;

        }

      } );
      // ssrPass.thickness = 0.018;
      gui.add( ssrPass, 'thickness' ).min( 0 ).max( .1 ).step( .0001 );
      // ssrPass.infiniteThick = false;
      gui.add( ssrPass, 'infiniteThick' );           

      const folder = gui.addFolder( 'more settings' );
      folder.add( ssrPass, 'fresnel' ).onChange( ()=>{

        groundReflector.fresnel = ssrPass.fresnel;

      } );
      folder.add( ssrPass, 'distanceAttenuation' ).onChange( ()=>{

        groundReflector.distanceAttenuation = ssrPass.distanceAttenuation;

      } );
      // ssrPass.maxDistance = .1;
      // groundReflector.maxDistance = ssrPass.maxDistance;
      folder.add( ssrPass, 'maxDistance' ).min( 0 ).max( .5 ).step( .001 ).onChange( ()=>{

        groundReflector.maxDistance = ssrPass.maxDistance;

      } );           
      folder.add( ssrPass, 'bouncing' );
      folder.add( ssrPass, 'output', {
        'Default': SSRPass.OUTPUT.Default,
        'SSR Only': SSRPass.OUTPUT.SSR,
        'Beauty': SSRPass.OUTPUT.Beauty,
        'Depth': SSRPass.OUTPUT.Depth,
        'Normal': SSRPass.OUTPUT.Normal,
        'Metalness': SSRPass.OUTPUT.Metalness,
      } ).onChange( function ( value ) {

        ssrPass.output = parseInt( value );

      } );
      // ssrPass.opacity = 0.5;
      // groundReflector.opacity = ssrPass.opacity;
      folder.add( ssrPass, 'opacity' ).min( 0 ).max( 1 ).onChange( ()=>{

        groundReflector.opacity = ssrPass.opacity;

      } );
      folder.add( ssrPass, 'blur' );
      // folder.open()
      // gui.close()
       composer.addPass( ssrPass );
      scene.add( groundReflector );

      millis = Date.now() - start;        
      console.log('SSR loading End time = ', millis ,'ms');
  
    }
    // SSR_fun()
      ssr_ui.addEventListener("click",function(e){        
        if(e.target.checked){
          SSR_fun()
        }else{
          composer.removePass( ssrPass );
         if(gui) gui.hide();
        }
      })
      gui_ui.addEventListener("click",function(e){        
        if(e.target.checked){
          if(gui) gui.show();
        }else{           
         if(gui) gui.hide();
        }
      })            

     //GammaCorrectionShader for the Colour fixing
    const copyPass2 = new ShaderPass(GammaCorrectionShader);    
    composer.addPass(copyPass2); 
    
    outlinePass = new OutlinePass(
      new Vector3(UIContainer.innerWidth, UIContainer.innerHeight),
      scene,
      camera
    );

    composer.addPass(outlinePass);                   

  }
  createTransfromCtrls() {
    exportScene(scene);
    reflection(scene,clock,gui);        
          

  let tranform_Desktop=document.querySelectorAll(".tranform_Desktop");
  tranform_Desktop[0].addEventListener("change", selectToolToggle);    

    let sideUI_BG_Active=document.querySelectorAll(".sideUI_BG_Active");
    transformControl = new TransformControls(camera, renderer.domElement);
    
    function selectToolToggle(event) {
      raycaster.layers.set( 0 );
      
        if (event.target.checked) {
          renderer.domElement.addEventListener("pointerdown", selectEvent); 
          for(let i=0;i<6;i++){ 
            if(i==0){
              sideUI_BG_Active[i].style.backgroundColor="#FFF"                  
              sideUI_BG_Active[i].classList.add("changeColor")                               
            }else{
              sideUI_BG_Active[i].style.backgroundColor="#F5F5F5" 
              sideUI_BG_Active[i].classList.remove("changeColor")                 
            }
          }
        } else {
          renderer.domElement.removeEventListener("pointerdown", selectEvent);          
          outlinePass.selectedObjects = [];
          selectedObjects = [];         
          transformControl.detach();
        }      
    }

    function selectEvent(event) {
      raycaster.layers.set(0);
      let drag = false;
      renderer.domElement.addEventListener("pointermove", () => (drag = true));
      renderer.domElement.addEventListener("pointerup", startSelecting);
      function startSelecting() {        
        if (!drag) {          
          onPointerMove(event);
        }
        drag = false;
      }
    }

    function onPointerMove(event) {
      mouse.x = (event.clientX / UIContainer.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / UIContainer.clientHeight) * 2 + 1;
      checkIntersection();
    }

    function addSelectedObject(object) {
      selectedObjects = [];
      selectedObjects.push(object);
    }

    function checkIntersection() {
      renderer.setRenderTarget( null );
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(selectableObjects, true);
      if (intersects.length > 0) {        
        let i = intersects[0].object;
        while (i.name !== "selectable") {
          i = i.parent;
          if (i.name === "selectable") {            
            addSelectedObject(i);            
            outlinePass.selectedObjects = selectedObjects;            
            outlinePass.edgeStrength = Number(10);
            outlinePass.edgeThickness = Number(0.1);    
            outlinePass.visibleEdgeColor.set('#161ef8');
            outlinePass.hiddenEdgeColor.set( '#161ef8' );                            
             if (transformControl.enabled) {
              transformControl.attach(i);               
              box.setFromObject(i);
              let boxCenter = new Vector3();
              box.getCenter(boxCenter);
              transformControl.position.copy(boxCenter);               
            } 

            
          }
        }
      }
    }

   
    transformControl.enabled = false;
    setTransformControlLayer(2);

    function setTransformControlLayer(layer) {
      transformControl.traverse((object) => object.layers.set(layer));
      transformControl.getRaycaster().layers.set(layer);
    }

  
    tranform_Desktop[2].addEventListener("click", allowUncheck);    
    tranform_Desktop[3].addEventListener("click", allowUncheck);    
    tranform_Desktop[4].addEventListener("click", allowUncheck);    
  

    function allowUncheck(e) {
      transformControl.setMode(e.target.value);      
      raycaster.layers.set( 0 );

      transformControl.enabled = true;
      scene.add(transformControl);      
      if (selectedObjects.length != 0) {
        transformControl.attach(selectedObjects[0]);            
         box.setFromObject(selectedObjects[0]);        
        let boxCenter = new Vector3();
        box.getCenter(boxCenter);
        transformControl.position.copy(boxCenter);             
      }
      if (this.previous) {
        this.checked = false;
        scene.remove(transformControl);
        transformControl.enabled = false;
      }
      console.log(this.name)
      document
        .querySelectorAll(`input[type=radio][name=${this.name}]`)
        .forEach((elem) => {
          elem.previous = elem.checked;
        });        
        function translate_Fun(){
          transformControl.showY=true;  
          transformControl.showX=true;
          transformControl.showZ=true;                      
        }
           
        function rotate_Fun(){
          transformControl.showX=false;
          transformControl.showY=true;
          transformControl.showZ=false;           
        }
                
        function scale_Fun(){
          transformControl.showX=true;
          transformControl.showZ=true; 
          transformControl.showY=true;           
        }
                                            
      
        if(e.target.value=="translate"){  
          for(let i=0;i<6;i++){ 
            if(i==2){
              sideUI_BG_Active[i].style.backgroundColor="#FFF"   
              sideUI_BG_Active[i].classList.add("changeColor")                
            }else{
              sideUI_BG_Active[i].style.backgroundColor="#F5F5F5"  
              sideUI_BG_Active[i].classList.remove("changeColor")                 
            }
          }    
          translate_Fun()   

        }
        if(e.target.value=="rotate"){  
          for(let i=0;i<6;i++){ 
            if(i==3){
              sideUI_BG_Active[i].style.backgroundColor="#FFF"  
              sideUI_BG_Active[i].classList.add("changeColor")                 
            }else{
              sideUI_BG_Active[i].style.backgroundColor="#F5F5F5" 
              sideUI_BG_Active[i].classList.remove("changeColor")                  
            }
          }        
          rotate_Fun()       
        }
        if(e.target.value=="scale"){
          for(let i=0;i<6;i++){ 
            if(i==4){
              sideUI_BG_Active[i].style.backgroundColor="#FFF" 
              sideUI_BG_Active[i].classList.add("changeColor")                  
            }else{
              sideUI_BG_Active[i].style.backgroundColor="#F5F5F5"  
              sideUI_BG_Active[i].classList.remove("changeColor")                 
            }
          }
          scale_Fun()     
        }    
      }

      function Unselect_Fun(){
        raycaster.layers.set( 1 );
        outlinePass.selectedObjects = selectedObjects;
        outlinePass.edgeStrength = 0;
        outlinePass.edgeThickness=0;
        outlinePass.edgeGlow=0;            
  
        transformControl.reset();
        transformControl.detach();
        selectedObjects=[];        
       
      }         
      tranform_Desktop[1].addEventListener("change", (e) => {
        if (e.target.checked) {
          Unselect_Fun();
          for(let i=0;i<6;i++){ 
            if(i==1){
              sideUI_BG_Active[i].style.backgroundColor="#FFF"  
              sideUI_BG_Active[i].classList.add("changeColor")                 
            }else{
              sideUI_BG_Active[i].style.backgroundColor="#F5F5F5"  
              sideUI_BG_Active[i].classList.remove("changeColor")                 
            }
          }
        }
      });
      function del_Fun(){
        if(selectedObjects[0]!=undefined){
          /* selectedObjects[0].traverse(function(node){
            if(node.isMesh){
              node.material.dispose();
              node.geometry.dispose();
              if(node.material.normalMap){
              node.material.normalMap.dispose();
              }           
            }
          })        */      
          scene.remove(selectedObjects[0]); 
          
        }else{
          console.log("select an object to delete")
        }                                                                                  
          transformControl.detach();            
          //console.log("memory ",renderer.info.memory)   
        
      }    
        
      tranform_Desktop[5].addEventListener("change", (e) => {
        if (e.target.checked) {
          del_Fun();
          for(let i=0;i<6;i++){ 
            if(i==5){
              sideUI_BG_Active[i].classList.add("changeColor") 
              sideUI_BG_Active[i].style.backgroundColor="#FFF"                  
            }else{
              sideUI_BG_Active[i].style.backgroundColor="#F5F5F5" 
              sideUI_BG_Active[i].classList.remove("changeColor")                  
            }
          }
        }
      });
      let helper;
      function bounding_box_Fun(){
        scene.traverse(function(node){
          if(node.isMesh){
            helper = new THREE.BoxHelper(node, 0xff0000);            
            scene.add(helper);  
          }
        })
      }
      function bounding_box_Else_Fun(){
        scene.traverse(function(node){            
          if(node.type=="BoxHelper"){               
            node.visible=false;
          }
        })
      }                  
   
    transformControl.addEventListener("dragging-changed", function (event) {
      cameraControls.enabled = !event.value;
    });
  }
  createMeasurements() {   
    let measurements_Desktop=document.getElementById("measurements_Desktop");
    measurements_Desktop.addEventListener("change", selectToolToggleM);
    let measurements=document.querySelector(".Measurements");
    function selectToolToggleM(event) {
      if (mobile) {
        if (event.target.checked) {
          renderer.domElement.addEventListener("click", onPointerMove);
          camera.layers.enable(1);
          measurements.style.backgroundColor="#FF5A50";
          measurements.style.color="#FFFFFF";
          container.appendChild(labelRenderer.domElement);          
          if(measurementLabels.length!=0){
            scene.add(measurementLabels[lineId])
          }
        } else {
          renderer.domElement.removeEventListener("click", onPointerMove);
          camera.layers.disable(1);
          measurements.style.backgroundColor="#e5e5e5";
          measurements.style.color="#000000";                   
          container.removeChild(labelRenderer.domElement);          
          scene.remove(measurementLabels[lineId]); 
        }
      } else {
        if (event.target.checked) {
          renderer.domElement.addEventListener("pointerdown", selectEvent);
          camera.layers.enable(1);
          measurements.style.backgroundColor="#FF5A50";
          measurements.style.color="#FFFFFF";
          
          container.appendChild(labelRenderer.domElement); 
          if(measurementLabels.length!=0){
            scene.add(measurementLabels[lineId])
          }
        } else {
          renderer.domElement.removeEventListener("pointerdown", selectEvent);
          camera.layers.disable(1);
          measurements.style.backgroundColor="#e5e5e5";
          measurements.style.color="#000000";           
          container.removeChild(labelRenderer.domElement);          
          scene.remove(measurementLabels[lineId]); 
        }
      }
    }

    function selectEvent(event) {
      let drag = false;
      renderer.domElement.addEventListener("pointermove", () => (drag = true));
      renderer.domElement.addEventListener("pointerup", startSelecting);
      function startSelecting() {
        // console.log(drag ? "drag" : "click");
        if (!drag) {
          onPointerMove(event);
          drag = false;
        }
      }
    }

    function onPointerMove(event) {
      mouse.x = (event.clientX / UIContainer.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / UIContainer.clientHeight) * 2 + 1;
      checkIntersection();
    }

    let matLine = new LineMaterial({
      color: 0x000000,
      linewidth: 0.005, // in world units with size attenuation, pixels otherwise
      //resolution:  // to be set by renderer, eventually
      dashed: false,
      // alphaToCoverage: false,
    });

    let points = [],geo2,lin2,pointsArray = [];

    let sphereGeo = new SphereGeometry(0.05, 16, 16);
    let sphereMat = new MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x000000,
    });

    let sphereMesh = new Mesh(sphereGeo, sphereMat);
    let sphereMeshClone;    

    function checkIntersection() {
      raycaster.setFromCamera(mouse, camera);
      raycaster.params.Line.threshold = 0;
      raycaster.layers.set(0);
      const intersects = raycaster.intersectObject(scene, true);
      if (intersects.length > 0) {
        points.push(intersects[0].point);
        sphereMeshClone = sphereMesh.clone();       
        sphereMeshClone.layers.set(1);

        sphereMeshClone.position.copy(intersects[0].point);
        scene.add(sphereMeshClone);        

        if (points.length == 2) {
          pointsArray.push(points[0].x);
          pointsArray.push(points[0].y);
          pointsArray.push(points[0].z);
          pointsArray.push(points[1].x);
          pointsArray.push(points[1].y);
          pointsArray.push(points[1].z);

          geo2 = new LineGeometry().setPositions(pointsArray);
          lin2 = new Line2(geo2, matLine);
          lin2.layers.set(1);
          scene.add(lin2);
          
          measurementDiv = document.createElement('div')          
          const measurementLabel = new CSS2DObject(measurementDiv)        
          measurementLabels[lineId] = measurementLabel;
          scene.add(measurementLabels[lineId])

          const v0 =new Vector3(pointsArray[0], pointsArray[1], pointsArray[2]);
          const v1 = new Vector3( pointsArray[3], pointsArray[4], pointsArray[5] );
         
          const distance = v0.distanceTo(v1)          
          measurementLabels[lineId].element.innerText = distance.toFixed(2) + 'm'; 
          measurementLabels[lineId].position.lerpVectors(v0, v1,0.5);            
             

          points = [];
          pointsArray = [];          
        }
      }
    }
   
   
  }  

  start() {
    renderer.setAnimationLoop(function () {      

      cameraControls.update();
      //  renderer.info.reset();       
       composer.render();     
      //renderer.render(scene, camera);
      camera.updateMatrixWorld()       
      const delta = clock.getDelta();  
      if(chairModels.currentAnimationMixer){
        chairModels.currentAnimationMixer.update(delta);       
      }           
      if(tableModels.currentAnimationMixer){       
        tableModels.currentAnimationMixer.update(delta);        
      }  
      if(blindsModels.currentAnimationMixer){               
        blindsModels.currentAnimationMixer.update(delta);
      }     
      // console.log(renderer.info.memory);
      labelRenderer.render(scene, camera)          
      //DEBUG      
      debug.update(renderer);
      TWEEN.update()                     
    });  
       
    //Spinner Remove after starting to render the scene
    let loadingSpinner = document.getElementById("loadingSpinner");   
    loadingSpinner.remove();                 
    renderer.render(scene, camera);
    //DEBUG
    debug.displayStats();         
  }
  
}

export { World };
