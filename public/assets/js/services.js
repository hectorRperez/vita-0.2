    
//Doesnt works with window on load anymore
    const services = document.querySelectorAll(".service-btn")
    const serviceArticles = document.querySelectorAll(".services-desc article")

    services.forEach((s,i) => {
        s.addEventListener("click", (x => {
        serviceArticles.forEach( a => a.style.display = "none")
        services.forEach( z => z.classList.remove("active") )
        document.querySelector('.service'+(i+1)+"-desc").style.display = 'block'

        s.classList.add("active")
    }))
    })



