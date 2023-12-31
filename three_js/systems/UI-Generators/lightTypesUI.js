const lightTypesUI = function (
  assetsList,
  UIContainer,
  category,
  loadModel,
  initialModelID,
  scene
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

    input.type = "radio";
    input.value = assetsList[i].URL;
    input.className = "btn-check";
    input.name = category;
    input.id = assetsList[i].Name;
    input.autocomplete = "off";
    input.addEventListener("click", function (event) {
      loadModel(event.target.value, i, spinnerContainer);       
    });
    

    let label = document.createElement("label");
       
    label.setAttribute("for", assetsList[i].Name);

    let img = document.createElement("img");
    img.src = assetsList[i].thumbnail;
    
    img.alt = "chair_1";
    img.style.background="#ffffff";
    
    
        label.className = "btn px-0 py-0 position-relative furnitureThumbnail"; 
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
    label1.className="objectName1"
    div1.appendChild(input);
    div1.appendChild(label);
    
    div.appendChild(div1)    
    div.appendChild(label1); 
    UIContainer.appendChild(div);

    
/*
    UIContainer.appendChild(input);
    UIContainer.appendChild(label);       */ 

    let container_3d=document.getElementById("3dcontainer");  
    input.addEventListener("click", function () {     
        container_3d.appendChild(spinnerContainer);        
    });
  }
};

export { lightTypesUI };
