const nav = document.querySelector(".nav-menu");
const navigation = document.querySelector(".navigation");
const openBtn = document.querySelector(".hamburger");
const closeBtn = document.querySelector(".close");
/*
const navLeft = nav.getBoundingClientRect().left;
openBtn.addEventListener("click", () => {
  if (navLeft < 0) {
    navigation.classList.add("show");
    nav.classList.add("show");
    document.body.classList.add("show");
  }
});

closeBtn.addEventListener("click", () => {
  if (navLeft < 0) {
    navigation.classList.remove("show");
    nav.classList.remove("show");
    document.body.classList.remove("show");
  }
});

//Fixed Nav
const navBar = document.querySelector(".navigation");
const navHeight = navBar.getBoundingClientRect().height;

window.addEventListener("scroll", () => {
  const scrollHeight = window.pageXOffset;
  if (scrollHeight > navHeight) {
    navBar.classList.add("fix-nav");
  } else {
    navBar.classList.remove("fix-nav");
  }
});*/
// Obtener todos los elementos de formulario del documento
let forms = document.querySelectorAll("form");

// Recorrer cada elemento de formulario
for (let form of forms) {
  // Agregar un evento de submit al formulario
  form.addEventListener("submit", function (event) {
    // Prevenir el comportamiento por defecto de enviar el formulario
    event.preventDefault();

    // Obtener la URL del action del formulario
    let action = form.getAttribute("action");

    let json = false;
    // Obtener los datos del formulario como un objeto FormData
    let formData;
    if (form.getAttribute("enctype") === "multipart/form-data")
      formData = new FormData(form);
    else {
      json = true;
      formData = [];
      for (i = 0; i < form.elements.length; i++) {
        let inputName = form.elements[i].name;
        let inputValue = form.elements[i].value;
        if (inputName) formData.push([inputName, inputValue]);
      }
      formData = Object.fromEntries(formData);
    }

    console.log(JSON.stringify(formData));
    fetch(action, {
      method: "POST",
      ...(json && {
        headers: {
          "Content-Type": "application/json",
        },
      }),
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (response.ok) {
          console.log(response);
          const jsonData = await response.json();
          Swal.fire("Success!", jsonData.message, "success");
          //  window.location.href = response.url;
        } else {
          // Si hay algún error, mostrar un mensaje
          Swal.fire({
            text: response.statusText,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        // Si hay algún error de red, mostrar un mensaje
        alert("Error de red: " + error);
      });
  });
}
