/* =================================
   ELIZABETH NAILS
   Main JavaScript
================================= */

// LANGUAGE SWITCHING

const languageToggle = document.getElementById("language-toggle");

let currentLanguage = "en";

languageToggle.addEventListener("click", function () {

    currentLanguage = currentLanguage === "en" ? "es" : "en";

    document.documentElement.lang = currentLanguage;

    const translatableElements = document.querySelectorAll(
        "[data-en][data-es]"
    );

    translatableElements.forEach(function (element) {

        element.textContent = element.getAttribute(
            `data-${currentLanguage}`
        );

    });

    languageToggle.textContent =
        currentLanguage === "en" ? "ES" : "EN";

});


// MOBILE NAVIGATION

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", function () {

    navigation.classList.toggle("active");

    const menuIsOpen = navigation.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", menuIsOpen);

    menuToggle.textContent = menuIsOpen ? "×" : "☰";

});


// CLOSE MOBILE MENU AFTER SELECTING A LINK

const navigationLinks = navigation.querySelectorAll("a");

navigationLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navigation.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.textContent = "☰";

    });

});


// WEBSITE INITIALIZATION

console.log("Elizabeth Nails website loaded successfully!");