function resetAndHelp(camera){
    let reset=document.getElementById("Reload");
    async function reset_Fun(){
      let myPromise = new Promise(function(resolve) {
        window.location.reload(true);    
      });
      await myPromise;  
    }      
   
    async function ResetView_Fun(){
      let myPromise = new Promise(function(resolve) {        
        camera.position.set(0.01,1.5,4.7);                  
      });
      await myPromise;  
    }      
    let reset_Desktop=document.getElementById("reset_Desktop")
    reset_Desktop.onclick = function() {
      ResetView_Fun()
    }      
  
    document.addEventListener("keydown", onDocumentKeyDown, false);
    async function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 27) {
      ResetView_Fun()
    } 
  }
    async function Help_Fun(){
      let myPromise = new Promise(function(resolve) {
        window.open("../../help.html");   
      });
      await myPromise;  
    }      

  
    let help3DButton=document.getElementById("help3DButton")
    help3DButton.addEventListener("click",function(){
      Help_Fun()
    })    
}
export {resetAndHelp};