const slides = document.querySelector(".slider")?.children;
const indicatorImages = document.querySelector(".slider-indicator")?.children;
if (indicatorImages?.length)
  for (let index = 0; index < indicatorImages.length; index++) {
    indicatorImages[index].addEventListener("click", function () {
      // console.log(this.getAttribute("data-id"));

      for (let j = 0; j < indicatorImages.length; j++) {
        indicatorImages[j].classList.remove("active");
      }

      this.classList.add("active");
      const id = this.getAttribute("data-id");

      for (let j = 0; j < slides.length; j++) {
        slides[j].classList.remove("active");
      }

      slides[id].classList.add("active");
    });
  }
