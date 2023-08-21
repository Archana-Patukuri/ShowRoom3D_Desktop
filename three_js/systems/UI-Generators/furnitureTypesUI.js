const furnitureTypesUI = function (
  assetsList,
  UIContainer,
  category,
  loadModel,
  initialModelID,
  scene,  
  renderer,
  clock
) {
  const UIToggleButtons=document.querySelectorAll(".furnitureToggleButton");
  const furnitureUI=document.querySelectorAll(".furnitureUIContainer");
  UIToggleButtons.forEach((button,index)=>{
    button.addEventListener('click',()=>{
      furnitureUI.forEach((ui)=>ui.classList.remove('active','show'));
      UIToggleButtons.forEach((btn)=>btn.classList.remove('active'));
      furnitureUI[index].classList.add('active','show');
    });
  });
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

    input.type = "radio";
    input.value = assetsList[i].URL;
    input.className = "btn-check";
    input.name = category;
    input.id = (assetsList[i].Name);
    input.autocomplete = "off";
    input.addEventListener("click", function (event) {
      loadModel(event.target.value, i, spinnerContainer);        
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

    
    UIContainer.appendChild(input);
    UIContainer.appendChild(label);       
    let container_3d=document.getElementById("3dcontainer");                
    
    input.addEventListener("click", function () {              
        container_3d.appendChild(spinnerContainer);                           
    });
  }
};

export { furnitureTypesUI };
