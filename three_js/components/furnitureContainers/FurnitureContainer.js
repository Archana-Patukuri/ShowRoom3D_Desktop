import { furnitureTypesUI } from "../../systems/UI-Generators/furnitureTypesUI";
import { gltfLoad } from "../gltf_loader/gltfLoad.js";
import { animationUI } from "../../systems/UI-Generators/animationUI";
import { AnimationMixer, Group } from "three";
import { shadowEnabler } from "../../systems/shadowEnabler";
import measurements from "../../dataBase/measurements.json" assert { type: "json" };
class FurnitureContainer {
  constructor(assetsList, furnitureTypesUI, category, initialModelID,scene,renderer) {
    this.assetsList = assetsList;
    this.parentGroup = new Group();
    this.parentGroup.name = "selectable";
    this.models = [];
    this.furnitureTypesUI = furnitureTypesUI;
    this.model;
    this.category = category;
    this.initialModelID = initialModelID;  
    this.scene=scene;  
    this.renderer=renderer;        
    //AnimationsUIs to store the Animation UI created after loading a GLTF Model
    this.AnimationUIs = [];
    //AnimationMixers to store animationMixer for each GLTF model loaded
    this.animationMixers = [];
    console.log(this.furnitureTypesUI.id)
   
     /*  this.toastbody = document
      .getElementById(`${this.furnitureTypesUI.id}_AnimationsUI`)
      .getElementsByClassName("animationsUI")[0]; */
      this.toastbody = document.getElementById("animationsUI")
      
    
    this.currentAnimationMixer;
  }  
  async loadModel(URL, i, spinner) {
    
    this.toastbody.replaceChildren();
    
    //Load a Default Model with "initialModelID"
    URL ||= this.assetsList[this.initialModelID].URL;

    i ||= this.initialModelID;

    if (this.models[i] === undefined) {
      //Spinner Display block before loading

      this.spinnerDisplay(spinner, "block");
      let modelURL = await fetch(URL); 
      const { gltfData } = await gltfLoad(modelURL.url);      
      let loadedModel = gltfData.scene;  
      
      let measurements_Label_SideUI=document.querySelectorAll(".measurements_Label_SideUI")        
          measurements_Label_SideUI[0].innerHTML=gltfData.userData.gltfExtensions.KHR_xmp_json_ld.packets[0].measurements[0]
          measurements_Label_SideUI[1].innerHTML=gltfData.userData.gltfExtensions.KHR_xmp_json_ld.packets[0].measurements[1]
          measurements_Label_SideUI[2].innerHTML=gltfData.userData.gltfExtensions.KHR_xmp_json_ld.packets[0].measurements[2]
       console.log("added measurements in the side UI using xmp")
      shadowEnabler(loadedModel)           
      this.models[i] = loadedModel;

      let mixer = new AnimationMixer(this.models[i]);
      this.AnimationUIs[i] = animationUI(
        gltfData,
        mixer,
        this.category,
        URL,
        this.scene,
        this.renderer        
        );
      this.animationMixers[i] = mixer;
      //Spinner Display none after loading
      this.spinnerDisplay(spinner, "none");    
    }
    //console.log(this.parentGroup)
    if (this.model) {
      this.parentGroup.remove(this.model);
    }

    this.currentAnimationMixer = this.animationMixers[i];
    
    this.toastbody.appendChild(this.AnimationUIs[i]);
   
    this.model = this.models[i];
    this.parentGroup.add(this.model);
   
  }

  spinnerDisplay(spinnerElement, displayStatus) {
    if (spinnerElement) {
      spinnerElement.style.display = displayStatus;
    } else {
      let element = document.getElementById(
        `spinner${this.assetsList[this.initialModelID].Name}`
      );      
      if (element) {
        element.style.display = displayStatus;
      }
    }
  }

  createUI() {
    //Creates FurnitureTypes UI
    furnitureTypesUI(
      this.assetsList,
      this.furnitureTypesUI,
      this.category,
      this.loadModel.bind(this),
      this.initialModelID,  
      this.scene, 
      this.renderer        
    );
  }
}

export { FurnitureContainer };
