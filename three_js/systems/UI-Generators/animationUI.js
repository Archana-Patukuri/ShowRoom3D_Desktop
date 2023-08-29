import { Clock, LoopOnce, Vector3,AmbientLight,Color,DirectionalLightHelper } from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import tablesHeights from "../../dataBase/tablesHeights.json" assert { type: "json" };
let initialLoadingValue=0
function animationUI(gltfData, mixer, category, URL,scene,renderer) {  

  let animationClips = [];

  let modelName = URL.slice(0, -4);
  modelName = modelName.substring(modelName.lastIndexOf("/") + 1);
  let indx=modelName.lastIndexOf("1")+1
  let model_name=modelName.slice(0,indx) 

  let form, input, label, img;
  let mainDiv = document.createElement("div");

  let div1 = document.createElement("div");  
    div1.className="animationsContainer d-none"    
  
 //Animations UI
   if (category == "tables") {
    let tweens = [];   
    
    let tableTopPos = gltfData.scene.getObjectByName("Table_Top").position;          
    for (let i = 0; i < tablesHeights[model_name].length; i++) {
      //TweenSetup      
      let level = { y: tablesHeights[model_name][i] };      
      let tween = new TWEEN.Tween(tableTopPos).to(level, 1200);
      tween.easing(TWEEN.Easing.Sinusoidal.InOut);      
      tweens.push(tween);      
      //UI
      form = document.createElement("div");
      form.className = "form-check";      
      input = document.createElement("input");
      
      input.type = "radio";
      input.name = model_name;
      input.id = tablesHeights[model_name][i];  
      
      if(i==0){
        input.checked=true;                
      }     
     
      label = document.createElement("label");
      label.className = "form-check-label";
      label.for = tablesHeights[model_name][i];
      label.innerHTML = "Level" + i; 

     
          input.className = "form-check-input animationInput";  
          label.className = "form-check-label animationLabel";                  
        

      input.addEventListener("click", function () {        
        tweens[i].start();              
      });
      
      form.appendChild(input);
      form.appendChild(label);
      div1.appendChild(form);
      mainDiv.appendChild(div1);      
      
    }
   
    let animation_label = document.createElement("button");
    animation_label.innerText="Dynamics";
    animation_label.className="accordion d-flex justify-content-between furnitureArrow"

    let downArrow = document.createElement("p");
    downArrow.className="downArrow"
    let iconDn=document.createElement("i");
    iconDn.className="arrow down"
    downArrow.appendChild(iconDn)

    let upArrow = document.createElement("p");
    upArrow.className="upArrow d-none"
    let iconUp=document.createElement("i");
    iconUp.className="arrow up"
    upArrow.appendChild(iconUp)

    animation_label.appendChild(downArrow)
    animation_label.appendChild(upArrow)       
    mainDiv.appendChild(animation_label);
    mainDiv.appendChild(div1);
    
    animation_label.addEventListener("click",function(){       
      if(downArrow.className=="downArrow" || downArrow.className=="downArrow d-block"){           
      downArrow.classList.add("d-none")
      upArrow.classList.remove("d-none")
      upArrow.classList.add("d-block")
      div1.classList.remove("d-none")
      div1.classList.add("d-block")
      }else{
        downArrow.classList.remove("d-none")
        downArrow.classList.add("d-block")
        upArrow.classList.remove("d-block")
        upArrow.classList.add("d-none")
        div1.classList.remove("d-block")
        div1.classList.add("d-none")
      }
    }) 
  }else{   
    for (let i = 0; i < gltfData.animations.length; i++) {
      form = document.createElement("div");
      form.className = "form-check";

      input = document.createElement("input");      
      
      input.type = "radio";
      input.name = "animations";
      input.id = gltfData.animations[0].name+i;
      input.className = "form-check-input animationInput";  
      
      label = document.createElement("label");   
      label.className = "form-check-label animationLabel";    
      label.for = gltfData.animations[0].name+i;
      label.innerHTML = gltfData.animations[i].name;

      form.appendChild(input);
      form.appendChild(label);

      div1.appendChild(form);

      //Animation Clips
      animationClips[i] = mixer.clipAction(gltfData.animations[i]);
      animationClips[i].setLoop(LoopOnce);
      animationClips[i].blendMode = 1;
      animationClips[i].clampWhenFinished = true;                 
          
        let dayLight_Desktop=document.getElementById("dayLight_Desktop")  
        dayLight_Desktop.addEventListener("click",function(){
          if(animationClips[i]._clip.name=="Half Open"){        
            animationClips[i].play();                
          }  
        })
    
      async function input_anim_Fun(){
        let myPromise = new Promise(function(resolve) {
          mixer.stopAllAction();
          animationClips[i].play();  
        });
        await myPromise;  
      }       

      input.addEventListener("click", function () {
        input_anim_Fun();           
      });
    }
 
    let animation_label = document.createElement("button");
    animation_label.innerText="Dynamics";
    animation_label.className="accordion d-flex justify-content-between furnitureArrow"

    let downArrow = document.createElement("p");
    downArrow.className="downArrow"
    let iconDn=document.createElement("i");
    iconDn.className="arrow down"
    downArrow.appendChild(iconDn)

    let upArrow = document.createElement("p");
    upArrow.className="upArrow d-none"
    let iconUp=document.createElement("i");
    iconUp.className="arrow up"
    upArrow.appendChild(iconUp)

    animation_label.appendChild(downArrow)
    animation_label.appendChild(upArrow)       
    mainDiv.appendChild(animation_label);
    mainDiv.appendChild(div1);
    
    animation_label.addEventListener("click",function(){       
      if(downArrow.className=="downArrow" || downArrow.className=="downArrow d-block"){           
      downArrow.classList.add("d-none")
      upArrow.classList.remove("d-none")
      upArrow.classList.add("d-block")
      div1.classList.remove("d-none")
      div1.classList.add("d-block")
      }else{
        downArrow.classList.remove("d-none")
        downArrow.classList.add("d-block")
        upArrow.classList.remove("d-block")
        upArrow.classList.add("d-none")
        div1.classList.remove("d-block")
        div1.classList.add("d-none")
      }
    })
    
  }

  //Material Variants UI
  let div2_Container = document.createElement("div");  
  div2_Container.className = "d-none";    
  let div2 = document.createElement("div");  
    div2.className = "d-flex";    
  
  for (let i = 0; i < gltfData.userData.variants.length; i++) {
    input = document.createElement("input");
    input.type = "radio";
    input.value = gltfData.userData.variants[i];
    input.className = "btn-check";
    input.name = `${category}variants`;
    input.id = gltfData.userData.variants[i];
    input.autocomplete = "off";

    async function input_var_Fun(){
      let myPromise = new Promise(function(resolve) {
        gltfData.functions.selectVariant(gltfData.scene, event.target.value);      
      });
      await myPromise;  
    } 
    input.addEventListener("click", function (event) {
      input_var_Fun();
    });

    label = document.createElement("label");    
    label.setAttribute("for", gltfData.userData.variants[i]);
    label.className = "btn px-0 py-0 position-relative border-2 mt-0";

    img = document.createElement("img");    
    img.src =    
      "https://d1asmhoz5zfmcr.cloudfront.net/variantsThumbnails/" +
      model_name +
      "/" +
      gltfData.userData.variants[i] +
      ".webp";    
    img.alt = "chair_1";       
          
      img.className = "img-thumbnail p-0 img-max-width-1";      
    
    label.appendChild(img);
    div2.appendChild(input);
    div2.appendChild(label);
  }


  
  let variants_label = document.createElement("button");
  variants_label.innerText="Material Variants";
  variants_label.className="accordion d-flex justify-content-between furnitureArrow"

  let downArrow = document.createElement("p");
  downArrow.className="downArrow"
  let iconDn=document.createElement("i");
  iconDn.className="arrow down"
  downArrow.appendChild(iconDn)

  let upArrow = document.createElement("p");
  upArrow.className="upArrow d-none"
  let iconUp=document.createElement("i");
  iconUp.className="arrow up"
  upArrow.appendChild(iconUp)

  variants_label.appendChild(downArrow)
  variants_label.appendChild(upArrow) 
  div2_Container.appendChild(div2)      
  mainDiv.appendChild(variants_label);
  mainDiv.appendChild(div2_Container);
  
  variants_label.addEventListener("click",function(){       
    if(downArrow.className=="downArrow" || downArrow.className=="downArrow d-block"){           
    downArrow.classList.add("d-none")
    upArrow.classList.remove("d-none")
    upArrow.classList.add("d-block")
    div2_Container.classList.remove("d-none")
    div2_Container.classList.add("d-block")
    }else{
      downArrow.classList.remove("d-none")
      downArrow.classList.add("d-block")
      upArrow.classList.remove("d-block")
      upArrow.classList.add("d-none")
      div2_Container.classList.remove("d-block")
      div2_Container.classList.add("d-none")
    }
  })



if(initialLoadingValue==0){
  mainDiv.style.display="none"
}else{
  mainDiv.style.display="block"
}
initialLoadingValue=initialLoadingValue+1

  return mainDiv;
}

export { animationUI };
