const furnitureTypesUI = function (
  assetsList,
  UIContainer,
  category,
  loadModel,
  initialModelID,
  scene,  
  renderer
) {
  for (let i = 0; i < assetsList.length; i++) {
    let input = document.createElement("input");
    
    let spinnerContainer = document.createElement("div");
    spinnerContainer.className =
      "position-absolute top-50 start-50 translate-middle";
    spinnerContainer.id = `spinner${assetsList[i].Name}`;    

    let spinner = document.createElement("div");
    spinner.className = "spinner-border text-light";
    spinner.role = "status";

    if (initialModelID == i) {
      input.checked = true;      
    }
    let data
    input.type = "radio";
    input.value = assetsList[i].URL;
    input.className = "btn-check";
    input.name = category;
    input.id = (assetsList[i].Name);
    input.autocomplete = "off";

    let measurements_Label=document.querySelectorAll(".measurements_Label_SideUI")  
    let measurements_SideUI_Container=document.getElementById("measurements_SideUI_Container")
    let measurements_Label_len=measurements_Label.length
    let animationsUIContainer=document.getElementById("animationsUIContainer")
    input.addEventListener("click", function (event) {
      let myPromise = new Promise(function(resolve) {
        // "Producing Code" (May take some time)
        data= loadModel(event.target.value, i, spinnerContainer);
        // return data
          resolve(data);          
        });
        myPromise.then(
          function(value) { 
            console.log(value[0])
                   
        for(let j=0;j<measurements_Label_len;j++){   
          console.log(value[0].userData.gltfExtensions.KHR_xmp_json_ld.packets[0].measurements[j])       
          measurements_Label[j].innerHTML=value[0].userData.gltfExtensions.KHR_xmp_json_ld.packets[0].measurements[j]        
        } 
        measurements_SideUI_Container.style.display="block"
        animationsUIContainer.style.display="block"
          }          
        );                     
    });
    
      

    let img,label
    label = document.createElement("label");
    label.setAttribute("for", assetsList[i].Name);  
    img = document.createElement("img");
    img.src = assetsList[i].thumbnail;
    img.style.background="#ffffff";
    
      label.className = "btn px-0 py-0 position-relative border-1"; 
      img.className = "Objectthumbnail";        
    

    spinnerContainer.appendChild(spinner);

    spinnerContainer.style.display = "none";    
    // spinnerContainer.style.display = "block";

    label.appendChild(img);
    let div=document.createElement("div");
    div.className="d-flex flex-column furniture_Style"
    let div1=document.createElement("div");    
    let label1 = document.createElement("label");
    label1.innerText=assetsList[i].Name
    label1.className="objectName"
    div1.appendChild(input);
    div1.appendChild(label);
    
    div.appendChild(div1)    
    div.appendChild(label1); 
    UIContainer.appendChild(div);

    let container_3d=document.getElementById("3dcontainer");                
    
    input.addEventListener("click", function () {              
        container_3d.appendChild(spinnerContainer);                                          
    });
  }
};

export { furnitureTypesUI };
