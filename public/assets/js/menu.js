window.onload = () => {
	let openFlag = false;
	const menu =  document.querySelector(".menu")
	document.querySelector(".hamburger").onclick = x => {
		
		if(!openFlag)
		{
			menu.classList.add("opened")
			openFlag = !openFlag
			document.body.classList.add("no-scroll")
		}
	}
	document.querySelector(".menu + .close").onclick = x =>{

			menu.classList.remove("opened")
			openFlag = !openFlag
			document.body.classList.remove("no-scroll")

	}

	// if(document.querySelector(".menu.opened")){

	// 	document.querySelector(".menu.opened .has-submenu").onclick = x => {
	// 		x.preventDefault()
	// 		console.log("culo")
	// 	}
	// }
}
