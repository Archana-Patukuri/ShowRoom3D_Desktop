function shadows(scene,shadowLight,sunLight,fanLight,room) {              
      
        function Shadows_SunLightOn(){  
          sunLight.castShadow=true      
          room.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = false;
            }
          });              
        }        
               
       
    let Shadows_SunLight=document.getElementById("Shadows_SunLight");
    Shadows_SunLight.addEventListener("change",(e)=>{
        if(e.target.checked){               
          Shadows_SunLightOn();          
        }else{                         
          sunLight.castShadow=false         
        }
      })

      //NIGHT LIGHT 1
      function Shadows_NightLight1On(){        
          fanLight.castShadow = true;
          room.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = false;
            }
          });       
      }
      function Shadows_NightLight1Of(){
        fanLight.castShadow=false        
      }                    

 let Shadows_NightLight1=document.getElementById("Shadows_NightLight1");
Shadows_NightLight1.addEventListener("change",(e)=>{
  if(e.target.checked){     
    Shadows_NightLight1On();    
  }else{                         
    Shadows_NightLight1Of();                      
  }
})    
    
 if(shadowLight==0){ 
  Shadows_SunLightOn();   
 }else{
  Shadows_NightLight1On();  
 }
}

export { shadows };