import { World } from "./three_js/World.js";
async function main() {  
  
  const world = new World();
  world.createUI();  
  world.loadBackground();
  
  await world.loadRoomGLTF() 
  await world.loadBlindsGLTF()
  await world.loadLightsGLTF()

  world.createTransfromCtrls();
  world.createMeasurements(); 
  world.createPostProcess();
    
  world.start(); 
  
  let Spinner = document.getElementById("Spinner");  
  let prompt=document.getElementById("ar-prompt");
 
    let load_Furniture_Desktop=document.getElementById("load_Furniture_Desktop");
    load_Furniture_Desktop.addEventListener("click",async function(){   
      console.time('Furniture Loading Time');  
      Spinner.style.display="block";
       await Promise.all([                 
        await world.loadTableGLTF(),                              
        await world.loadChairGLTF(),              
       ]);      
      Spinner.style.display="none";  
      prompt.style.display="block";   
      console.timeEnd('Furniture Loading Time');  
      
    })
    let load_Lighting_Desktop=document.getElementById("load_Lighting_Desktop");    
    load_Lighting_Desktop.addEventListener("click",async function(){    
      console.time('Lighting Loading Time');    
      Spinner.style.display="block";      
       await Promise.all([                                                                      
        await world.loadCylindricalLight(), 
        await world.lightPresets()      
       ]);             
    Spinner.style.display="none";  
    prompt.style.display="block";     
    console.timeEnd('Lighting Loading Time');       
    })
    let load_Accessories_Desktop=document.getElementById("load_Accessories_Desktop");
    load_Accessories_Desktop.addEventListener("click",async function(){     
      console.time('Accessories Loading Time');     
      Spinner.style.display="block"; 
      await Promise.all([                                   
        // await world.loadPlants(),
        await world.loadMirrorGLTF(),  
        await world.loadAccessoriesGLTF(),
        // await world.loadWallPlantsGLTF(),
        await world.loadVaseGLTF() 
      ]);                               
      Spinner.style.display="none";     
      prompt.style.display="block";   
      console.timeEnd('Accessories Loading Time');        
      })        
      let lightControls_Button=document.getElementById("lightControls_Button")
      let LightsContainer=document.getElementById("LightsContainer")
      lightControls_Button.addEventListener("click",function(){        
        LightsContainer.style.display="block"
      })
  }  


main().catch((err) => {
  console.error(err);
});


