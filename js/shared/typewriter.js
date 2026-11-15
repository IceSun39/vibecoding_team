(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll("[data-typewriter]");

    if (reduceMotion || !targets.length) {
        return;
    }

    // Збираємо символи елемента; <br> перетворюємо на маркер переносу рядка.
    function collectTokens(el) {
        const tokens = [];

        el.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                tokens.push(...node.textContent.replace(/\s+/g, " "));
            } else if (node.nodeName === "BR") {
                tokens.push("\n");
            }
        });

        // Прибираємо пробіли на початку/кінці та навколо переносів.
        const cleaned = [];
        tokens.forEach((token, i) => {
            const prev = cleaned[cleaned.length - 1];
            if (token === " " && (cleaned.length === 0 || prev === "\n")) return;
            if (token === "\n" && prev === " ") cleaned.pop();
            cleaned.push(token);
        });
        while (cleaned[cleaned.length - 1] === " ") cleaned.pop();

        return cleaned;
    }

    function setup(el) {
        const speed = Number(el.dataset.typewriterSpeed) || 55;
        const delay = Number(el.dataset.typewriterDelay) || 0;
        const tokens = collectTokens(el);

        if (!tokens.length) return;

        // Резервуємо висоту, щоб сторінка не «стрибала» під час друку.
        el.style.minHeight = el.offsetHeight + "px";
        el.setAttribute("aria-label", tokens.join("").replace(/\n/g, " "));

        const text = document.createElement("span");
        const cursor = document.createElement("span");
        text.setAttribute("aria-hidden", "true");
        cursor.className = "typewriter__cursor is-typing";
        cursor.setAttribute("aria-hidden", "true");

        el.textContent = "";
        el.append(text, cursor);

        let index = 0;

        function type() {
            const token = tokens[index++];
            text.append(token === "\n" ? document.createElement("br") : token);

            if (index < tokens.length) {
                const jitter = token === "," || token === " " ? speed * 2 : speed * (0.6 + Math.random() * 0.8);
                setTimeout(type, jitter);
            } else {
                cursor.classList.remove("is-typing");
            }
        }

        setTimeout(type, delay);
    }

    // Чекаємо шрифти, щоб виміряна висота була правильною.
    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(() => targets.forEach(setup));
})();
