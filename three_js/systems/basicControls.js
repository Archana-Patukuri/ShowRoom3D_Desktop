import {MOUSE} from "three";
function basicControls(scene,camera,controls,renderer) {  

  controls.enableZoom = true;
  controls.enablePan=true;
  controls.enableRotate=true;
  controls.minPolarAngle=controls.maxPolarAngle=1.57079
  controls.listenToKeyEvents( window );  

  document.addEventListener("keydown", onDocumentKeyDown, false);
  async function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 32) {
    //keyCode 32 is for spacebar
    scene.rotation.y -= 0.01;
  }
  if (keyCode == 189) {
    //keyCode 32 is for spacebar
    camera.position.z += 1;
  }
  if (keyCode == 187) {
    //keyCode 32 is for spacebar
    camera.position.z -= 1;
  }
}
  controls.mouseButtons = {
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN
  } 
    let navigationOpt=document.querySelectorAll(".navigationOpt");
   
    function Zoom_Fun(){     
        console.log("zoom clicked")
        controls.enableZoom = true;    
        navigationOpt[0].style.background="#FF5A50";
        navigationOpt[0].style.color="#FFFFFF";       
    };     
    function Zoom_Else_Fun(){     
        controls.enableZoom = false;  
        navigationOpt[0].style.background="#FFFFFF";
        navigationOpt[0].style.color="#000000";       
    };     
   
        function Rotate_Fun(){          
            console.log("rotate clicked")
            controls.enableRotate=true;  
            navigationOpt[2].style.background="#FF5A50";
            navigationOpt[2].style.color="#FFFFFF";            
        }; 
           
        function Rotate_Else_Fun(){          
            controls.enableRotate=false; 
            navigationOpt[2].style.background="#FFFFFF";
            navigationOpt[2].style.color="#000000";            
        };           
   
        function Pan_Fun(){          
            console.log("PAN clicked")
            controls.enablePan=true;   
            navigationOpt[1].style.background="#FF5A50";
            navigationOpt[1].style.color="#FFFFFF";             
        };          
          
        function Pan_Else_Fun(){         
            controls.enablePan=false; 
            navigationOpt[1].style.background="#FFFFFF";
            navigationOpt[1].style.color="#000000";                    
        };                    
     
      
             
    let navigation_Desktop=document.querySelectorAll(".navigation_Desktop");
    navigation_Desktop[0].addEventListener("click",function(){Zoom_Fun()})
    navigation_Desktop[1].addEventListener("click",function(){Pan_Fun()})
    navigation_Desktop[2].addEventListener("click",function(){Rotate_Fun()})
  controls.maxDistance=10;  
  controls.update();
  
}

export { basicControls };
