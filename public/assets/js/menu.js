//Doesnt works with window on load anymore
//check how the views are hooked, and in which order
//

let openFlag = false;
const menu = document.querySelector('.menu');
console.log(document.querySelector('.hamburger'));
document.querySelector('.hamburger').onclick = (x) => {
	if (!openFlag) {
		menu.classList.add('opened');
		openFlag = !openFlag;
		document.body.classList.add('no-scroll');
	}
};
document.querySelector('.menu + .close').onclick = (x) => {
	menu.classList.remove('opened');
	openFlag = !openFlag;
	document.body.classList.remove('no-scroll');
};

console.log('scroll');
// scrollreveal APLICADO AL HOME Y A SKINCARE
ScrollReveal().reveal('.section-scroll', { delay: 400 });
