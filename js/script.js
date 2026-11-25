/* =================================
   ELIZABETH NAILS
   Main JavaScript
================================= */


// =================================
// LANGUAGE SWITCHING
// =================================

const languageToggle = document.getElementById("language-toggle");

let currentLanguage = "en";

languageToggle.addEventListener("click", function () {

    currentLanguage = currentLanguage === "en" ? "es" : "en";

    document.documentElement.lang = currentLanguage;

    const translatableElements = document.querySelectorAll(
        "[data-en][data-es], [data-en-placeholder][data-es-placeholder]"
    );

    translatableElements.forEach(function (element) {

        if (element.hasAttribute("data-en") &&
            element.hasAttribute("data-es")) {

            element.textContent = element.getAttribute(
                `data-${currentLanguage}`
            );

        }

        if (element.hasAttribute("data-en-placeholder") &&
            element.hasAttribute("data-es-placeholder")) {

            element.setAttribute(
                "placeholder",
                element.getAttribute(`data-${currentLanguage}-placeholder`)
            );

        }

    });

    languageToggle.textContent =
        currentLanguage === "en" ? "ES" : "EN";

    // Refresh dynamic elements
    updateTimePlaceholder();
    updateDateDisplay();
    renderCalendar();

});


// =================================
// MOBILE NAVIGATION
// =================================

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


// =================================
// APPOINTMENT DATE & TIME AVAILABILITY
// =================================

const appointmentDate = document.getElementById("appointment-date");
const appointmentTime = document.getElementById("appointment-time");

const timeOptions = {

    weekdays: ["3:30 PM", "6:30 PM"],

    fridaySaturday: [
        "8:30 AM",
        "10:30 AM",
        "1:00 PM",
        "3:30 PM",
        "6:00 PM",
        "8:00 PM"
    ],

    sunday: ["1:30 PM", "3:30 PM"]

};


// TRANSLATE TIME DROPDOWN PLACEHOLDER

function updateTimePlaceholder() {

    const placeholder = appointmentTime.querySelector(
        'option[value=""]'
    );

    if (placeholder) {

        placeholder.textContent =
            currentLanguage === "en"
                ? "Select a preferred time"
                : "Selecciona una hora";

    }

}


// POPULATE AVAILABLE APPOINTMENT TIMES

function updateAvailableTimes() {

    const selectedDate = appointmentDate.value;

    const previouslySelectedTime = appointmentTime.value;

    appointmentTime.innerHTML = "";

    const placeholder = document.createElement("option");

    placeholder.value = "";
    placeholder.textContent =
        currentLanguage === "en"
            ? "Select a preferred time"
            : "Selecciona una hora";

    appointmentTime.appendChild(placeholder);

    if (!selectedDate) {

        appointmentTime.disabled = true;
        return;

    }

    const date = new Date(selectedDate + "T12:00:00");

    const day = date.getDay();

    let availableTimes;

    if (day >= 1 && day <= 4) {

        availableTimes = timeOptions.weekdays;

    } else if (day === 5 || day === 6) {

        availableTimes = timeOptions.fridaySaturday;

    } else {

        availableTimes = timeOptions.sunday;

    }

    availableTimes.forEach(function (time) {

        const option = document.createElement("option");

        option.value = time;
        option.textContent = time;

        appointmentTime.appendChild(option);

    });

    appointmentTime.disabled = false;

    // Preserve the previous selection if still available
    if (availableTimes.includes(previouslySelectedTime)) {

        appointmentTime.value = previouslySelectedTime;

    }

}


// UPDATE TIMES WHEN DATE CHANGES

appointmentDate.addEventListener("change", updateAvailableTimes);

updateAvailableTimes();


// =================================
// CUSTOM BILINGUAL CALENDAR
// =================================

const dateDisplay = document.getElementById("appointment-date-display");

const calendarContainer = document.getElementById("calendar-container");

const today = new Date();

today.setHours(0, 0, 0, 0);

let calendarMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
);


// MONTH NAMES

const monthFormatter = {

    en: new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    }),

    es: new Intl.DateTimeFormat("es-ES", {
        month: "long",
        year: "numeric"
    })

};


// UPDATE SELECTED DATE DISPLAY

function updateDateDisplay() {

    if (!appointmentDate.value) {

        dateDisplay.value = "";
        return;

    }

    const selectedDate = new Date(
        appointmentDate.value + "T12:00:00"
    );

    const locale = currentLanguage === "en" ? "en-US" : "es-ES";

    dateDisplay.value = new Intl.DateTimeFormat(locale, {

        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"

    }).format(selectedDate);

}


// RENDER CALENDAR

function renderCalendar() {

    const language = currentLanguage;

    const year = calendarMonth.getFullYear();

    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Monday-first calendar
    const startingDay = (firstDay.getDay() + 6) % 7;

    const weekdays = language === "en"

        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

        : ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];


    let calendarHTML = `

        <div class="calendar-header">

            <button type="button"
                    data-calendar-nav="prev"
                    aria-label="${language === "en" ? "Previous month" : "Mes anterior"}">

                &#8249;

            </button>

            <strong>
                ${monthFormatter[language].format(calendarMonth)}
            </strong>

            <button type="button"
                    data-calendar-nav="next"
                    aria-label="${language === "en" ? "Next month" : "Mes siguiente"}">

                &#8250;

            </button>

        </div>

        <div class="calendar-grid">

    `;


    weekdays.forEach(function (day) {

        calendarHTML += `
            <span class="calendar-weekday">${day}</span>
        `;

    });


    for (let i = 0; i < startingDay; i++) {

        calendarHTML += `
            <span class="calendar-empty"></span>
        `;

    }


    for (let day = 1; day <= daysInMonth; day++) {

        const date = new Date(year, month, day, 12);

        const dateString = [

            year,

            String(month + 1).padStart(2, "0"),

            String(day).padStart(2, "0")

        ].join("-");


        const isPast = date < today;

        const isSelected = appointmentDate.value === dateString;


        calendarHTML += `

            <button type="button"

                    class="calendar-day ${isPast ? "disabled" : ""} ${isSelected ? "selected" : ""}"

                    data-date="${dateString}"

                    ${isPast ? "disabled" : ""}>

                ${day}

            </button>

        `;

    }


    calendarHTML += `</div>`;

    calendarContainer.innerHTML = calendarHTML;


    // PREVIOUS MONTH

    const previousButton = calendarContainer.querySelector(
        '[data-calendar-nav="prev"]'
    );

    const currentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    previousButton.disabled = calendarMonth <= currentMonth;

    previousButton.addEventListener("click", function () {

        calendarMonth.setMonth(calendarMonth.getMonth() - 1);

        renderCalendar();

    });


    // NEXT MONTH

    calendarContainer.querySelector(
        '[data-calendar-nav="next"]'
    ).addEventListener("click", function () {

        calendarMonth.setMonth(calendarMonth.getMonth() + 1);

        renderCalendar();

    });


    // SELECT DATE

    calendarContainer.querySelectorAll("[data-date]").forEach(function (button) {

        button.addEventListener("click", function () {

            appointmentDate.value = button.dataset.date;

            updateDateDisplay();

            appointmentDate.dispatchEvent(new Event("change"));

            calendarContainer.classList.remove("active");

            renderCalendar();

        });

    });

}


// OPEN AND CLOSE CALENDAR

dateDisplay.addEventListener("click", function () {

    calendarContainer.classList.toggle("active");

    if (calendarContainer.classList.contains("active")) {

        renderCalendar();

    }

});


// INITIALIZE CALENDAR

renderCalendar();


// =================================
// WEBSITE INITIALIZATION
// =================================

console.log("Elizabeth Nails website loaded successfully!");

// =================================
// APPOINTMENT FORM VALIDATION
// =================================

const appointmentForm = document.getElementById("appointment-form");
const nailPhoto = document.getElementById("nail-photo");

// Validate selected photo
nailPhoto.addEventListener("change", function () {

    const file = nailPhoto.files[0];

    nailPhoto.setCustomValidity("");

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];

    const allowedExtension = /\.(jpg|jpeg|png)$/i.test(file.name);

    if (!allowedTypes.includes(file.type) || !allowedExtension) {

        nailPhoto.setCustomValidity(
            currentLanguage === "en"
                ? "Please select a JPG or PNG image."
                : "Por favor, selecciona una imagen JPG o PNG."
        );

    } else if (file.size > 10 * 1024 * 1024) {

        nailPhoto.setCustomValidity(
            currentLanguage === "en"
                ? "Your photo must be smaller than 10 MB."
                : "Tu foto debe pesar menos de 10 MB."
        );

    }

});

// Validate appointment before submission
appointmentForm.addEventListener("submit", function (event) {

    const selectedDate = appointmentDate.value;
    const selectedTime = appointmentTime.value;

    const now = new Date();

    const localToday = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    dateDisplay.setCustomValidity("");

    appointmentTime.setCustomValidity("");

    // Confirm a valid, non-past date
    if (!selectedDate || selectedDate < localToday) {

        dateDisplay.setCustomValidity(
            currentLanguage === "en"
                ? "Please select a valid future date."
                : "Por favor, selecciona una fecha futura válida."
        );

    }

    // Confirm the selected time belongs to the selected date
    const validTime = Array.from(appointmentTime.options).some(
        option => option.value === selectedTime
    );

    if (!selectedTime || !validTime || appointmentTime.disabled) {

        appointmentTime.setCustomValidity(
            currentLanguage === "en"
                ? "Please select an available appointment time."
                : "Por favor, selecciona una hora disponible."
        );

    }

    // Stop submission if any validation fails
    if (!appointmentForm.checkValidity()) {

        event.preventDefault();

        appointmentForm.reportValidity();

    }

});

/* =================================
   ROTATING TESTIMONIALS
================================= */

const testimonialStyles = document.createElement("style");
testimonialStyles.textContent = `
.testimonials-section {
    background: #f4f0e9;
    color: #211e1a;
}

.testimonials-section .section-heading h2 {
    color: #211e1a;
}

.testimonials-section .section-heading > p:last-child {
    color: #665d52;
}

.testimonials-display {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
    transition: opacity 0.35s ease;
}

.testimonials-display.changing {
    opacity: 0;
}

.testimonial-card {
    min-height: 260px;
    padding: 30px 26px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #fffdf9;
    border: 1px solid rgba(198, 161, 91, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
    animation: testimonial-appear 0.55s ease both;
}

@keyframes testimonial-appear {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.testimonial-quote {
    font-family: Georgia, serif;
    font-size: 55px;
    line-height: 0.8;
    color: #b18b4e;
}

.testimonial-card h3 {
    margin: 22px 0 12px;
    font-family: Georgia, serif;
    font-size: 21px;
    font-weight: 400;
    color: #211e1a;
}

.testimonial-card p {
    margin: 0;
    font-size: 14px;
    line-height: 1.8;
    color: #625a50;
}

.testimonial-label {
    margin-top: auto;
    padding-top: 22px;
    font-size: 10px;
    letter-spacing: 1.8px;
    font-weight: 600;
    color: #a27c40;
}

/* Navigation controls */

.testimonial-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 22px;
    margin-top: 35px;
}

.testimonial-controls button {
    width: 38px;
    height: 38px;
    border: 1px solid #b18b4e;
    border-radius: 50%;
    background: transparent;
    color: #8c6936;
    font-size: 24px;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease;
}

.testimonial-controls button:hover {
    background: #b18b4e;
    color: white;
}

.testimonial-indicators {
    display: flex;
    gap: 9px;
}

.testimonial-dot {
    width: 7px;
    height: 7px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: #c9bda9;
    cursor: pointer;
}

.testimonial-dot.active {
    background: #a27c40;
    transform: scale(1.35);
}

/* Mobile layout */

@media (max-width: 700px) {

    .testimonials-display {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
    }

    .testimonial-card {
        min-height: 280px;
        padding: 22px 17px;
    }

    .testimonial-card h3 {
        font-size: 18px;
    }

    .testimonial-card p {
        font-size: 12px;
    }

    .testimonial-label {
        font-size: 9px;
        letter-spacing: 1px;
    }

    .testimonial-controls {
        gap: 16px;
    }

}

@media (prefers-reduced-motion: reduce) {

    .testimonials-display,
    .testimonial-card,
    .testimonial-controls button {
        animation: none;
        transition: none;
    }

}
`;
document.head.appendChild(testimonialStyles);

// =================================
// AUTOMATIC GALLERY CAROUSEL
// =================================

const galleryCarousel = document.getElementById("gallery-carousel");
const galleryTrack = document.getElementById("gallery-track");

if (galleryCarousel && galleryTrack) {

    const originalCards = Array.from(galleryTrack.children);

    const cardCount = originalCards.length;

    // Duplicate cards to create the continuous loop
    originalCards.forEach(function (card) {

        const clone = card.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");

        galleryTrack.appendChild(clone);

    });

    let galleryOffset = 0;
    let galleryLoopWidth = 0;

    let previousFrame = 0;

    const gallerySpeed = 28;

    let isDragging = false;
    let isMouseOver = false;

    let dragStartX = 0;
    let dragStartOffset = 0;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Measure the width of one complete set of cards
    function measureGallery() {

        galleryLoopWidth = galleryTrack.children[cardCount].offsetLeft;

        galleryOffset = galleryOffset % galleryLoopWidth;

        galleryTrack.style.transform =
            `translate3d(-${galleryOffset}px, 0, 0)`;

    }

    // Keep the carousel moving
    function animateGallery(timestamp) {

        if (!previousFrame) {
            previousFrame = timestamp;
        }

        const elapsed = Math.min(
            (timestamp - previousFrame) / 1000,
            0.05
        );

        previousFrame = timestamp;

        const shouldPause =
            isDragging ||
            isMouseOver ||
            document.hidden ||
            reducedMotion.matches;

        if (!shouldPause && galleryLoopWidth > 0) {

            galleryOffset += gallerySpeed * elapsed;

            if (galleryOffset >= galleryLoopWidth) {
                galleryOffset -= galleryLoopWidth;
            }

            galleryTrack.style.transform =
                `translate3d(-${galleryOffset}px, 0, 0)`;

        }

        requestAnimationFrame(animateGallery);

    }

    // Pause when a desktop visitor hovers
    galleryCarousel.addEventListener("mouseenter", function () {
        isMouseOver = true;
    });

    galleryCarousel.addEventListener("mouseleave", function () {
        isMouseOver = false;
    });

    // Begin manual dragging or swiping
    galleryCarousel.addEventListener("pointerdown", function (event) {

        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        isDragging = true;

        dragStartX = event.clientX;
        dragStartOffset = galleryOffset;

        galleryCarousel.setPointerCapture(event.pointerId);

    });

    // Move the gallery with the visitor's pointer
    galleryCarousel.addEventListener("pointermove", function (event) {

        if (!isDragging) return;

        const movement = event.clientX - dragStartX;

        galleryOffset = dragStartOffset - movement;

        if (galleryLoopWidth > 0) {

            galleryOffset =
                ((galleryOffset % galleryLoopWidth) + galleryLoopWidth)
                % galleryLoopWidth;

        }

        galleryTrack.style.transform =
            `translate3d(-${galleryOffset}px, 0, 0)`;

    });

    // Resume automatic movement after dragging
    function stopGalleryDrag() {
        isDragging = false;
    }

    galleryCarousel.addEventListener("pointerup", stopGalleryDrag);
    galleryCarousel.addEventListener("pointercancel", stopGalleryDrag);
    galleryCarousel.addEventListener("lostpointercapture", stopGalleryDrag);

    // Recalculate dimensions when the screen changes
    window.addEventListener("resize", measureGallery);

    // Initial setup
    measureGallery();

    requestAnimationFrame(animateGallery);

}
// =================================
// ROTATING TESTIMONIAL COLLECTION
// =================================

const testimonialDisplay = document.getElementById("testimonials-display");

if (testimonialDisplay) {

    const testimonials = [
        {
            titleEn: "A Moment Just for You.",
            titleEs: "Un Momento Solo Para Ti.",
            textEn: "Enjoy a personalized experience where your comfort, style, and preferences come first.",
            textEs: "Disfruta de una experiencia personalizada donde tu comodidad, estilo y preferencias son lo primero.",
            labelEn: "PERSONALIZED CARE",
            labelEs: "ATENCIÓN PERSONALIZADA"
        },
        {
            titleEn: "Beauty Is in the Details.",
            titleEs: "La Belleza Está en los Detalles.",
            textEn: "Thoughtful finishing touches and careful attention help bring every nail design together.",
            textEs: "Los toques finales y la atención cuidadosa ayudan a completar cada diseño de uñas.",
            labelEn: "ATTENTION TO DETAIL",
            labelEs: "ATENCIÓN A LOS DETALLES"
        },
        {
            titleEn: "Your Style, Your Expression.",
            titleEs: "Tu Estilo, Tu Expresión.",
            textEn: "From timeless simplicity to creative designs, your nails should reflect your personality.",
            textEs: "Desde la sencillez atemporal hasta los diseños creativos, tus uñas deben reflejar tu personalidad.",
            labelEn: "INDIVIDUAL STYLE",
            labelEs: "ESTILO PERSONAL"
        },
        {
            titleEn: "Confidence in Every Detail.",
            titleEs: "Confianza en Cada Detalle.",
            textEn: "Feel polished, comfortable, and ready to express yourself with a style you love.",
            textEs: "Siéntete elegante, cómoda y lista para expresarte con un estilo que te encante.",
            labelEn: "CONFIDENCE & STYLE",
            labelEs: "CONFIANZA Y ESTILO"
        },
        {
            titleEn: "Your Beauty, Your Way.",
            titleEs: "Tu Belleza, a Tu Manera.",
            textEn: "Every design is an opportunity to celebrate your individuality and personal taste.",
            textEs: "Cada diseño es una oportunidad para celebrar tu individualidad y gusto personal.",
            labelEn: "PERSONAL EXPRESSION",
            labelEs: "EXPRESIÓN PERSONAL"
        },
        {
            titleEn: "A Touch of Elegance.",
            titleEs: "Un Toque de Elegancia.",
            textEn: "Discover the beauty of refined details, beautiful finishes, and timeless inspiration.",
            textEs: "Descubre la belleza de los detalles delicados, acabados hermosos e inspiración atemporal.",
            labelEn: "TIMELESS ELEGANCE",
            labelEs: "ELEGANCIA ATEMPORAL"
        },
        {
            titleEn: "Made to Match You.",
            titleEs: "Diseñado Para Ti.",
            textEn: "Choose a look that complements your personality, lifestyle, and favorite colors.",
            textEs: "Elige un estilo que complemente tu personalidad, estilo de vida y colores favoritos.",
            labelEn: "YOUR PERSONAL STYLE",
            labelEs: "TU ESTILO PERSONAL"
        },
        {
            titleEn: "Little Details, Big Impact.",
            titleEs: "Pequeños Detalles, Gran Impacto.",
            textEn: "Sometimes the smallest details create the most memorable finishing touches.",
            textEs: "A veces, los detalles más pequeños crean los acabados más memorables.",
            labelEn: "THE FINISHING TOUCH",
            labelEs: "EL TOQUE FINAL"
        },
        {
            titleEn: "Beauty Meets Creativity.",
            titleEs: "La Belleza se Une a la Creatividad.",
            textEn: "Explore fresh ideas and creative designs that make your next nail look unique.",
            textEs: "Explora nuevas ideas y diseños creativos que hacen único tu próximo estilo de uñas.",
            labelEn: "CREATIVE DESIGNS",
            labelEs: "DISEÑOS CREATIVOS"
        },
        {
            titleEn: "A Beautiful Experience.",
            titleEs: "Una Experiencia Hermosa.",
            textEn: "Enjoy a welcoming experience with care and attention throughout your visit.",
            textEs: "Disfruta de una experiencia acogedora con cuidado y atención durante tu visita.",
            labelEn: "CARE & COMFORT",
            labelEs: "CUIDADO Y COMODIDAD"
        },
        {
            titleEn: "Elegance Never Goes Out of Style.",
            titleEs: "La Elegancia Nunca Pasa de Moda.",
            textEn: "Classic inspiration and modern creativity come together in beautiful nail designs.",
            textEs: "La inspiración clásica y la creatividad moderna se unen en hermosos diseños de uñas.",
            labelEn: "CLASSIC BEAUTY",
            labelEs: "BELLEZA CLÁSICA"
        },
        {
            titleEn: "Your Next Favorite Look.",
            titleEs: "Tu Próximo Estilo Favorito.",
            textEn: "Find inspiration for a look that feels fresh, beautiful, and unmistakably yours.",
            textEs: "Encuentra inspiración para un estilo fresco, hermoso y que sea completamente tuyo.",
            labelEn: "FRESH INSPIRATION",
            labelEs: "NUEVA INSPIRACIÓN"
        }
    ];

    let currentIndex = 0;
    let shuffledTestimonials = [...testimonials];

    let visibleCount = window.innerWidth <= 700 ? 2 : 6;

    let transitionTimer;
    let isPaused = false;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Shuffle the messages randomly
    function shuffleTestimonials() {

        shuffledTestimonials = [...testimonials];

        for (let i = shuffledTestimonials.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [
                shuffledTestimonials[i],
                shuffledTestimonials[j]
            ] = [
                shuffledTestimonials[j],
                shuffledTestimonials[i]
            ];

        }

    }

    // Create elements with English and Spanish text
    function createTranslatedElement(tag, className, english, spanish) {

        const element = document.createElement(tag);

        element.className = className;

        element.setAttribute("data-en", english);
        element.setAttribute("data-es", spanish);

        element.textContent =
            currentLanguage === "en" ? english : spanish;

        return element;

    }

    // Build the visible testimonial cards
    function renderTestimonials(animate = true) {

        clearTimeout(transitionTimer);

        function updateCards() {

            testimonialDisplay.innerHTML = "";

            for (let i = 0; i < visibleCount; i++) {

                const index =
                    (currentIndex + i) % shuffledTestimonials.length;

                const message = shuffledTestimonials[index];

                const card = document.createElement("article");
                card.className = "testimonial-card";

                const quote = document.createElement("span");
                quote.className = "testimonial-quote";
                quote.textContent = "“";

                const title = createTranslatedElement(
                    "h3",
                    "",
                    message.titleEn,
                    message.titleEs
                );

                const text = createTranslatedElement(
                    "p",
                    "",
                    message.textEn,
                    message.textEs
                );

                const label = createTranslatedElement(
                    "span",
                    "testimonial-label",
                    message.labelEn,
                    message.labelEs
                );

                card.appendChild(quote);
                card.appendChild(title);
                card.appendChild(text);
                card.appendChild(label);

                testimonialDisplay.appendChild(card);

            }

        }

        if (animate && !reducedMotion.matches) {

            testimonialDisplay.classList.add("changing");

            transitionTimer = setTimeout(function () {

                updateCards();
                testimonialDisplay.classList.remove("changing");

            }, 350);

        } else {

            updateCards();
            testimonialDisplay.classList.remove("changing");

        }

    }

    // Build the navigation dots
    function updateIndicators() {

        testimonialIndicators.innerHTML = "";

        testimonials.forEach(function (_, index) {

            const dot = document.createElement("button");

            dot.type = "button";

            dot.className =
                "testimonial-dot" +
                (index === currentIndex ? " active" : "");

            dot.setAttribute(
                "aria-label",
                currentLanguage === "en"
                    ? `Show message collection ${index + 1}`
                    : `Mostrar colección de mensajes ${index + 1}`
            );

            dot.setAttribute(
                "aria-current",
                index === currentIndex ? "true" : "false"
            );

            dot.addEventListener("click", function () {

                currentIndex = index;
                renderTestimonials();

            });

            testimonialIndicators.appendChild(dot);

        });

    }

    // Move forward through the messages
    function nextTestimonials() {

        currentIndex++;

        if (currentIndex >= shuffledTestimonials.length) {

            shuffleTestimonials();
            currentIndex = 0;

        }

        renderTestimonials();

    }

    // Move backward through the messages
    function previousTestimonials() {

        currentIndex =
            (currentIndex - 1 + shuffledTestimonials.length) %
            shuffledTestimonials.length;

        renderTestimonials();

    }

    // Connect the navigation buttons

    // Automatic rotation every 6.5 seconds
    setInterval(function () {

        if (!isPaused && !document.hidden && !reducedMotion.matches) {

            nextTestimonials();

        }

    }, 15000);

    // Pause when visitors interact with the cards
    testimonialDisplay.addEventListener("mouseenter", function () {
        isPaused = true;
    });

    testimonialDisplay.addEventListener("mouseleave", function () {
        isPaused = false;
    });

    testimonialDisplay.addEventListener("focusin", function () {
        isPaused = true;
    });

    testimonialDisplay.addEventListener("focusout", function () {
        isPaused = false;
    });

    // Adjust the number of cards for mobile screens
    window.addEventListener("resize", function () {

        const newCount = window.innerWidth <= 700 ? 2 : 6;

        if (newCount !== visibleCount) {

            visibleCount = newCount;
            renderTestimonials(false);

        }

    });

    // Start the collection
    shuffleTestimonials();
    renderTestimonials(false);
}

// =================================
// PROGRESSIVE WEB APP (PWA)
// =================================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then((registration) => {
                console.log("PWA Service Worker registered:", registration.scope);
            })
            .catch((error) => {
                console.error("PWA Service Worker registration failed:", error);
            });
    });
}