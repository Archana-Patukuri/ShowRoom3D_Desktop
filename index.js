import { World } from "./three_js/World.js";
async function main() {  
  
  const world = new World();
  world.createUI();  
  world.loadBackground();
  
  await world.loadRoomGLTF() 
  await world.loadBlindsGLTF()
  await world.loadLightsGLTF()

  world.createTransfromCtrls();
  world.createPostProcess();
  world.createMeasurements();   
  world.start(); 
  
  let Spinner = document.getElementById("Spinner");  

 
    let load_Furniture_Desktop=document.getElementById("load_Furniture_Desktop");
    load_Furniture_Desktop.addEventListener("click",async function(){     
      Spinner.style.display="block";
       await Promise.all([                 
        await world.loadTableGLTF(),                              
        await world.loadChairGLTF(),              
       ]);      
      Spinner.style.display="none";     
    })
    let load_Lighting_Desktop=document.getElementById("load_Lighting_Desktop");
    let initialControlsContainer=document.querySelector(".initialControlsContainer")
    load_Lighting_Desktop.addEventListener("click",async function(){      
      Spinner.style.display="block";
      
       await Promise.all([                                                                      
        await world.loadCylindricalLight(), 
        await world.lightPresets()      
       ]);       
      initialControlsContainer.style.display="block"
    Spinner.style.display="none";     
    })
    let load_Accessories_Desktop=document.getElementById("load_Accessories_Desktop");
    load_Accessories_Desktop.addEventListener("click",async function(){      
      Spinner.style.display="block"; 
      await Promise.all([                                   
        // await world.loadPlants(),
        await world.loadMirrorGLTF(),  
        await world.loadAccessoriesGLTF(),
        await world.loadWallPlantsGLTF(),
        await world.loadVaseGLTF() 
      ]);                               
      Spinner.style.display="none";      
      })  
  }  


main().catch((err) => {
  console.error(err);
});


