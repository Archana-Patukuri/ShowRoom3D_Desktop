 let home_card_close_Desktop=document.getElementById("home_card_close_Desktop");
  let home_card_container_Desktop=document.getElementById("home_card_container_Desktop")
  let desktopUIContainer=document.getElementById("desktopUIContainer")
  let scene_buttons=document.getElementById("scene_buttons");
  home_card_close_Desktop.addEventListener("click",function(){
  home_card_container_Desktop.style.display="none"
  desktopUIContainer.style.display="block"    
  scene_buttons.style.display="block"
}) 

let OpenModal=document.querySelector(".OpenModal")
let myModal=document.getElementById("myModal")
OpenModal.addEventListener("click",function(){
  myModal.classList.remove("fade")
  myModal.classList.add("show")
})




