const menuToggle = document.querySelector("#burger-toggle");

document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
        if (menuToggle) {
            menuToggle.checked = false;
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle) {
        menuToggle.checked = false;
    }
});

function openPact() {
    const pactModal = document.querySelector("[data-pact-modal]");

    if (menuToggle) {
        menuToggle.checked = false;
    }

    if (pactModal) {
        pactModal.showModal();
    }
}

function openContactForm() {
    if (menuToggle) {
        menuToggle.checked = false;
    }

    document.querySelector("[data-contact-modal]")?.showModal();
}

document.querySelectorAll(".contacts-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        openContactForm();
    });
});

document.querySelectorAll(".red-button, .purple-button, .make-pact").forEach((button) => {
    button.addEventListener("click", () => {
        openPact();
    });
});

const contactModal = document.querySelector("[data-contact-modal]");
if (contactModal) {
    const contactForm = contactModal.querySelector("[data-contact-form]");
    const contactSubmitButton = contactForm.querySelector('button[type="submit"]');
    const contactSuccessMessage = contactModal.querySelector("[data-contact-success]");
    const initialContactSubmitLabel = contactSubmitButton.textContent;
    let contactSubmitTimer;

    contactModal.querySelector("[data-close-contact]").addEventListener("click", () => {
        contactModal.close();
    });

    contactModal.addEventListener("click", (event) => {
        if (event.target === contactModal) {
            contactModal.close();
        }
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contactSubmitButton.disabled = true;
        contactSubmitButton.textContent = "ВІДПРАВЛЯЄМО...";

        contactSubmitTimer = window.setTimeout(() => {
            contactForm.hidden = true;
            contactSuccessMessage.hidden = false;
            contactSubmitTimer = undefined;
        }, 800);
    });

    contactModal.addEventListener("close", () => {
        window.clearTimeout(contactSubmitTimer);
        contactSubmitTimer = undefined;
        contactForm.reset();
        contactForm.hidden = false;
        contactSuccessMessage.hidden = true;
        contactSubmitButton.disabled = false;
        contactSubmitButton.textContent = initialContactSubmitLabel;
    });
}

const serviceSearch = document.querySelector("[data-service-search]");
if (serviceSearch) {
    const serviceCards = [...document.querySelectorAll(".cards .card")];
    const resultCount = document.querySelector("[data-service-count]");
    const emptyMessage = document.querySelector("[data-service-empty]");

    function filterServices() {
        const query = serviceSearch.value.trim().toLocaleLowerCase("uk");
        let visibleCount = 0;

        document.querySelector(".cards").classList.toggle("is-filtering", query.length > 0);
        serviceCards.forEach((card) => {
            const matches = card.textContent.toLocaleLowerCase("uk").includes(query);
            card.hidden = !matches;
            visibleCount += Number(matches);
        });

        resultCount.textContent = `Знайдено послуг: ${visibleCount} з ${serviceCards.length}`;
        emptyMessage.hidden = visibleCount > 0;
    }

    serviceSearch.addEventListener("input", filterServices);
    filterServices();
}

document.querySelectorAll("[data-squad-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
        const grid = button.closest(".squad-section").querySelector(".character-grid");
        const expanded = button.getAttribute("aria-expanded") === "true";

        grid.hidden = expanded;
        button.setAttribute("aria-expanded", String(!expanded));
        button.textContent = expanded ? "РОЗГОРНУТИ СКЛАД" : "ЗГОРНУТИ СКЛАД";
    });
});

const priceListButton = document.querySelector(".pricelist");
if (priceListButton) {
    priceListButton.addEventListener("click", () => {
        const services = [...document.querySelectorAll(".cards .card")].map((card) => {
            const title = card.querySelector("h2").textContent.trim();
            const description = card.querySelector("p").textContent.trim();

            return `${title}\n${description}\nВартість: за запитом`;
        });
        const file = new Blob([`ORC.SEC — ОПЕРАТИВНИЙ КАТАЛОГ ПОСЛУГ\n\n${services.join("\n\n")}`], {
            type: "text/plain;charset=utf-8",
        });
        const downloadLink = document.createElement("a");
        const fileUrl = URL.createObjectURL(file);

        downloadLink.href = fileUrl;
        downloadLink.download = "orc-sec-catalog.txt";
        downloadLink.click();
        window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    });
}

const animatedElements = document.querySelectorAll(".cards .card, .character-card, .service-card, .stat");
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
                    bar.style.width = bar.dataset.targetWidth;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach((element) => {
        element.classList.add("reveal-item");
        element.querySelectorAll(".bar-fill").forEach((bar) => {
            bar.dataset.targetWidth = bar.style.width;
            bar.style.width = "0";
        });
        revealObserver.observe(element);
    });
} else {
    animatedElements.forEach((element) => element.classList.add("is-visible"));
}

const counters = document.querySelectorAll("[data-count]");
if (counters.length) {
    const numberFormatter = new Intl.NumberFormat("uk-UA");
    const animateCounter = (counter) => {
        const target = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix || "";

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            counter.textContent = `${numberFormatter.format(target)}${suffix}`;
            return;
        }

        const duration = 900;
        const startTime = performance.now();

        function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            counter.textContent = `${numberFormatter.format(Math.round(target * progress))}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    };

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }
}
