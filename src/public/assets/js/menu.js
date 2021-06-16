window.onload = () => {
	let openFlag = false;
	const menu =  document.querySelector(".menu")
	document.querySelector(".hamburger").onclick = x => {
		if(openFlag)
		{
			menu.classList.remove("opened")
			openFlag = !openFlag
			document.body.classList.remove("no-scroll")
		}
		else
		{
			menu.classList.add("opened")
			openFlag = !openFlag
			document.body.classList.add("no-scroll")
		}
	}
}
