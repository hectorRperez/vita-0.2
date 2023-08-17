const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");

if (tabs)
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.tabTarget);

      tabContents.forEach((tabContent) =>
        tabContent.classList.remove("active")
      );

      target.classList.add("active");
    });
  });
