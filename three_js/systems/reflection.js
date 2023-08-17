
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import {
    PlaneGeometry,    
    Color 
  } from "three";
import { Reflector } from '../../node_modules/three/examples/jsm/objects/Reflector.js';
function reflection(scene,clock,gui) {
    let groundMirror,verticalMirror,Floor ;          
    let geometry = new PlaneGeometry( 3.88, 3.88 );  
    Floor = scene.getObjectByName('Floor');    
    Floor.material.opacity=0.7;   
    Floor.material.transparent=true;   
    
    groundMirror = new Reflector( geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio*0.5,
    textureHeight: window.innerHeight * window.devicePixelRatio*0.5,
    color: 0x888888,
    multisample:4,
    } );           
    groundMirror.position.y = -0.001;
    groundMirror.position.z=0.43;
    groundMirror.position.x=0.08;
    groundMirror.rotateX( -Math.PI/2 );                         

    let geometry1 = new PlaneGeometry( 0.52, 0.7 );        
    verticalMirror = new Reflector(geometry1, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio*0.1,
        textureHeight: window.innerHeight * window.devicePixelRatio*0.1,        
        color: 0x889999,
        multisample:4
    } );        
  
    verticalMirror.position.x = 0.1;
    verticalMirror.position.y = 1.83;    
    verticalMirror.position.z = -1.46; 
    
    function Reflections_Floor_Add(){
      scene.add( groundMirror );
      Floor.material.transparent=true;      
    }
      let gui_ref=document.getElementById("gui_ref");
      gui_ref.addEventListener("click",function(e){
        if(e.target.checked){
          const params = {                                      
            opacity:0.7,
            color:1,
             width_Height:0.1,
             samples:4               
          };  
          if(gui)gui.destroy()                 
          gui = new GUI();
          const shadowFolder = gui.addFolder( 'Floor Reflections' );                 
          shadowFolder.add( params, 'opacity', 0, 1, 0.01 ).onChange( function () {
            Floor.material.opacity = params.opacity;            
          } );  
          shadowFolder.add( params, 'color', 0, 1, 0.001 ).onChange( function () {
            Floor.material.color=new Color(params.color,params.color,params.color)          
          } );  
          shadowFolder.add( params, 'width_Height', 0, 1, 0.001 ).onChange( function () {
            groundMirror.getRenderTarget().setSize(
              window.innerWidth * window.devicePixelRatio*params.width_Height,
              window.innerHeight * window.devicePixelRatio*params.width_Height
            );   
          } );  
          shadowFolder.add( params, 'samples', 0, 10, 1 ).onChange( function () {
            groundMirror.getRenderTarget().samples=params.samples;
          } );     
                                                                         
        }else{
          gui.hide();
        }
      })
      function Reflections_Floor_Remove(){
        Floor.material.transparent=false;
        scene.remove( groundMirror );
      if(gui)gui.hide();
      }     
     function ReflectionsMirror_Add(){
      scene.add( verticalMirror );   
     }
     function ReflectionsMirror_Remove(){
      scene.remove( verticalMirror ); 
     }                   
    let ReflectionsMirror_C=document.getElementById("ReflectionsMirror_C");   
    ReflectionsMirror_C.addEventListener("change",(e)=>{
        if(e.target.checked){                  
            ReflectionsMirror_Add();            
        }else{             
            ReflectionsMirror_Remove();
        }
    })    
    Reflections_Floor_Add();  
    let ReflectionsFloor_C=document.getElementById("ReflectionsFloor_C");      
    ReflectionsFloor_C.addEventListener("change",(e)=>{
        if(e.target.checked){                                     
            Reflections_Floor_Add();                        
        }else{
            Reflections_Floor_Remove();                                
        }
    })   
}

export { reflection };