(() => {
    const root = document.querySelector("[data-live-status]");
    if (!root) return;

    const BASE_DAYS = 666;
    const STORAGE_KEY = "orcsec-uptime-start";

    const STATES = [
        { text: "SECURED", className: "", hold: [6000, 10000] },
        { text: "SCANNING...", className: "is-scanning", hold: [2500, 3500] },
        { text: "THREAT DETECTED", className: "is-threat", hold: [2000, 2800] },
    ];

    const statusLine = document.createElement("span");
    statusLine.className = "live-status__line";
    statusLine.append("STATUS: ");

    const statusValue = document.createElement("span");
    statusValue.className = "live-status__value";
    statusLine.append(statusValue);

    const uptimeLine = document.createElement("span");
    uptimeLine.className = "live-status__uptime";

    root.textContent = "";
    root.append(statusLine, uptimeLine);

    let step = 0;

    function randomBetween([min, max]) {
        return min + Math.random() * (max - min);
    }

    function showState(index) {
        const state = STATES[index];
        statusValue.textContent = state.text;
        root.classList.remove("is-scanning", "is-threat");
        if (state.className) {
            root.classList.add(state.className);
        }
        window.setTimeout(nextState, randomBetween(state.hold));
    }

    function nextState() {
        step = (step + 1) % STATES.length;
        showState(step);
    }

    showState(0);

    function getStartTime() {
        try {
            const saved = Number(sessionStorage.getItem(STORAGE_KEY));
            if (saved) return saved;

            const now = Date.now();
            sessionStorage.setItem(STORAGE_KEY, String(now));
            return now;
        } catch {
            return Date.now();
        }
    }

    const startedAt = getStartTime();
    const pad = (value) => String(value).padStart(2, "0");

    function renderUptime() {
        const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
        const days = BASE_DAYS + Math.floor(seconds / 86400);
        const time = `${pad(Math.floor(seconds / 3600) % 24)}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;

        uptimeLine.textContent = `UPTIME: ${days} ДНІВ ${time}`;
    }

    renderUptime();
    window.setInterval(renderUptime, 1000);
})();