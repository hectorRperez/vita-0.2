// configuracion para el loading de la web

let loader = document.getElementById("preloader");
if(loader)
window.addEventListener("load", function () {
  loader.style.display = "none";
});
