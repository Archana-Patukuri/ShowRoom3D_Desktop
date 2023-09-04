import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";

function viewPoints(camera,scene,framesParent) {
  function view1_Fun(){
    var tween = new TWEEN.Tween(camera.position).to({
      x: 0.01,
      y: 2.165,
      z: 4.73}, 1500);          
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.start();   
  }
  function view2_Fun(){
    var tween = new TWEEN.Tween(camera.position).to({
      x: 0.479,
      y: 1.065,
      z: 6.433}, 1500);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.start(); 
  }
  function view3_Fun(){
    var tween = new TWEEN.Tween(camera.position).to({
      x: 0,
      y: 2.165,
      z: -4.5}, 1500);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.start();  
  }
  function view4_Fun(){
    var tween = new TWEEN.Tween(camera.position).to({
      x: 0.0479,
      y: 4.165,
      z: 2.0533}, 1500);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.start(); 
  }
  function view5_Fun(){
    var tween = new TWEEN.Tween(camera.position).to({
      x: 2.479,
      y: 2.165,
      z: 2.433}, 1500);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.start();    
  }
  
  function view6_Fun(){
    var tween = new TWEEN.Tween(camera.position).to({
      x: 3.479,
      y: 0.165,
      z: 0}, 1500);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.start();     
    scene.remove(framesParent) 
    
  }
  
   

    let Viewpoints_Desktop=document.querySelectorAll(".Viewpoints_Desktop");
    Viewpoints_Desktop[0].addEventListener("change", (e) => {
      if (e.target.checked) {                                            
        view1_Fun();
        let Frames=scene.getObjectByName("Frames")        
        if(Frames==undefined){
          scene.add(framesParent)
        }
    }
    })   
    Viewpoints_Desktop[4].addEventListener("change", (e) => {
      if (e.target.checked) {                                            
        view2_Fun();
        let Frames=scene.getObjectByName("Frames")        
        if(Frames==undefined){
          scene.add(framesParent)
        }
    }
    })   
    Viewpoints_Desktop[5].addEventListener("change", (e) => {
      if (e.target.checked) {                                            
        view3_Fun();
        let Frames=scene.getObjectByName("Frames")        
        if(Frames==undefined){
          scene.add(framesParent)
        }
    }
    })   
    Viewpoints_Desktop[1].addEventListener("change", (e) => {
      if (e.target.checked) {                                            
        view4_Fun();
        let Frames=scene.getObjectByName("Frames")        
        if(Frames==undefined){
          scene.add(framesParent)
        }
    }
    })   
    Viewpoints_Desktop[3].addEventListener("change", (e) => {
      if (e.target.checked) {                                            
        view5_Fun();
        let Frames=scene.getObjectByName("Frames")        
        if(Frames==undefined){
          scene.add(framesParent)
        }
    }
    })   
    Viewpoints_Desktop[2].addEventListener("change", (e) => {
      if (e.target.checked) {                                            
        view6_Fun();
    }
    })       

  
    
}
 
export { viewPoints };
