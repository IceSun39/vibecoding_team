const pactModal = document.querySelector("[data-pact-modal]");
const openPactButton = document.querySelector("[data-open-pact]");
const closePactButton = document.querySelector("[data-close-pact]");
const pactForm = document.querySelector("[data-pact-form]");
if (!pactModal || !pactForm) {
    throw new Error("Pact modal markup is missing from this page.");
}

const serviceSelect = pactForm.querySelector('[name="service"]');
const orcCountInput = pactForm.querySelector('[name="orcs"]');
const trollCountInput = pactForm.querySelector('[name="trolls"]');
const pactSubmitButton = pactForm.querySelector('button[type="submit"]');
const pactSuccessMessage = pactModal.querySelector(".pact-modal__success");
const initialSubmitLabel = pactSubmitButton.textContent;

const serviceCreatureDefaults = {
    "ФІЗИЧНА ОХОРОНА": { orcs: 0, trolls: 3 },
    "СИЛОВІ ПЕРЕГОВОРИ": { orcs: 2, trolls: 1 },
    "СТЯГНЕННЯ АКТИВІВ": { orcs: 4, trolls: 0 },
    "КРАШ-ТЕСТ ОХОРОНИ": { orcs: 1, trolls: 2 },
    "ЗАЧИСТКА ТЕРИТОРІЙ": { orcs: 5, trolls: 0 },
    "АНТИРЕЙДЕРСЬКИЙ ПРОТОКОЛ": { orcs: 4, trolls: 2 },
    "ОХОРОНА ПЕРИМЕТРУ": { orcs: 0, trolls: 4 },
    "ПСИХОЛОГІЧНИЙ ТИСК": { orcs: 2, trolls: 1 },
    "ГАРНІЗОННА ОХОРОНА": { orcs: 0, trolls: 5 },
    "СУПРОВІД ВАНТАЖІВ": { orcs: 3, trolls: 1 },
    "ГЛУХЕ БЛОКУВАННЯ": { orcs: 0, trolls: 4 },
    "ОХОРОНА ЗАХОДІВ": { orcs: 1, trolls: 2 },
};

let signingTimer;

if (openPactButton) {
    openPactButton.addEventListener("click", () => {
        pactModal.showModal();
    });
}

if (new URLSearchParams(window.location.search).has("openPact")) {
    pactModal.showModal();
}

serviceSelect.addEventListener("change", () => {
    const defaults = serviceCreatureDefaults[serviceSelect.value] ?? { orcs: 0, trolls: 0 };
    orcCountInput.value = defaults.orcs;
    trollCountInput.value = defaults.trolls;
});

if (closePactButton) {
    closePactButton.addEventListener("click", () => {
        pactModal.close();
    });
}

pactModal.addEventListener("click", (event) => {
    if (event.target === pactModal) {
        pactModal.close();
    }
});

pactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    pactSubmitButton.disabled = true;
    pactSubmitButton.textContent = "ПІДПИС КРОВ’Ю...";

    signingTimer = window.setTimeout(() => {
        pactForm.hidden = true;
        pactSuccessMessage.hidden = false;
        signingTimer = undefined;
    }, 1200);
});

pactModal.addEventListener("close", () => {
    window.clearTimeout(signingTimer);
    signingTimer = undefined;
    pactForm.reset();
    pactForm.hidden = false;
    pactSuccessMessage.hidden = true;
    pactSubmitButton.disabled = false;
    pactSubmitButton.textContent = initialSubmitLabel;
});
