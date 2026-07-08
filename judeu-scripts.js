(() => {
    "use strict";

    const app = {
        brand: "Judeu Scripts",
        poweredBy: "PowerBy Judeu IA",
        version: "3.3.0",
        storageKey: "judeuScriptsAccessDemo"
    };

    const config = {
        aiEndpoint: window.JUDEU_IA_ENDPOINT || ""
    };

    const state = loadState();

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(app.storageKey)) || {
                currentUser: makeUser(),
                approvedUsers: [],
                blockedUsers: [],
                requests: [],
                mode: "normal",
                paidPlanReady: false
            };
        } catch {
            return { currentUser: makeUser(), approvedUsers: [], blockedUsers: [], requests: [], mode: "normal", paidPlanReady: false };
        }
    }

    function saveState() {
        localStorage.setItem(app.storageKey, JSON.stringify(state));
    }

    function makeUser() {
        const id = "user-" + Math.random().toString(36).slice(2, 8);
        return {
            id,
            name: "Visitante " + id.slice(-4),
            createdAt: new Date().toISOString()
        };
    }

    function el(tag, options = {}) {
        const node = document.createElement(tag);
        if (options.className) node.className = options.className;
        if (options.text) node.textContent = options.text;
        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
        }
        return node;
    }

    function injectStyles() {
        if (document.getElementById("judeu-study-styles")) return;

        const style = el("style", { attrs: { id: "judeu-study-styles" } });
        style.textContent = `
            #judeu-launcher,
            #judeu-panel,
            #judeu-panel * {
                box-sizing: border-box;
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }

            #judeu-launcher {
                position: fixed;
                right: 18px;
                bottom: 18px;
                z-index: 2147483646;
                width: 52px;
                height: 52px;
                border: 1px solid #ffffff;
                border-radius: 12px;
                background: #050505;
                color: #ffffff;
                box-shadow: 0 16px 42px rgba(0, 0, 0, 0.5);
                cursor: pointer;
                font-size: 20px;
                font-weight: 900;
            }

            #judeu-panel {
                position: fixed;
                right: 18px;
                bottom: 84px;
                z-index: 2147483647;
                display: none;
                width: min(420px, calc(100vw - 24px));
                max-height: min(720px, calc(100vh - 104px));
                overflow: hidden;
                border: 1px solid #ffffff;
                border-radius: 10px;
                background: #0a0a0a;
                color: #ffffff;
                box-shadow: 0 22px 70px rgba(0, 0, 0, 0.55);
            }

            #judeu-panel.is-open {
                display: flex;
                flex-direction: column;
            }

            .judeu-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                border-bottom: 1px solid #343434;
                background: #111111;
                cursor: move;
                user-select: none;
            }

            .judeu-logo {
                display: grid;
                place-items: center;
                width: 38px;
                height: 38px;
                border: 1px solid #ffffff;
                border-radius: 8px;
                background: #000000;
                color: #ffffff;
                font-size: 16px;
                font-weight: 900;
            }

            .judeu-header h2 {
                margin: 0;
                font-size: 16px;
                line-height: 1.2;
            }

            .judeu-header p {
                margin: 2px 0 0;
                color: #bdbdbd;
                font-size: 11px;
            }

            .judeu-close {
                margin-left: auto;
                width: 32px;
                height: 32px;
                border: 1px solid #555555;
                border-radius: 8px;
                background: #191919;
                color: #ffffff;
                cursor: pointer;
                font-size: 16px;
            }

            .judeu-body {
                display: grid;
                gap: 10px;
                padding: 12px;
                overflow: auto;
            }

            .judeu-button,
            .judeu-mode {
                border: 1px solid #ffffff;
                border-radius: 8px;
                background: #ffffff;
                color: #000000;
                cursor: pointer;
                font-weight: 900;
                padding: 10px 12px;
            }

            .judeu-button.secondary,
            .judeu-mode {
                border-color: #555555;
                background: #171717;
                color: #ffffff;
            }

            .judeu-mode.is-active {
                border-color: #ffffff;
                background: #ffffff;
                color: #000000;
            }

            .judeu-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .judeu-screen {
                min-height: 84px;
                padding: 12px;
                border: 1px solid #343434;
                border-radius: 8px;
                background: #111111;
                color: #dedede;
                font-size: 12px;
                line-height: 1.38;
                white-space: pre-wrap;
            }

            .judeu-answer {
                padding: 14px;
                border: 1px solid #ffffff;
                border-radius: 8px;
                background: #000000;
                color: #ffffff;
                font-size: 13px;
                line-height: 1.4;
                white-space: pre-wrap;
            }

            .judeu-answer strong {
                display: block;
                margin-bottom: 8px;
                font-size: 56px;
                line-height: 1;
                letter-spacing: 0;
            }

            .judeu-admin {
                display: none;
                gap: 8px;
                padding-top: 8px;
                border-top: 1px solid #343434;
            }

            .judeu-admin.is-open {
                display: grid;
            }

            .judeu-user {
                display: grid;
                gap: 8px;
                padding: 10px;
                border: 1px solid #343434;
                border-radius: 8px;
                background: #111111;
                color: #dedede;
                font-size: 12px;
            }

            .judeu-note {
                color: #a8a8a8;
                font-size: 11px;
                line-height: 1.35;
                text-align: center;
            }
        `;

        document.head.appendChild(style);
    }

    function normalizeText(text) {
        return text
            .replace(/\u00a0/g, " ")
            .replace(/[−–—]/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }

    function getVisibleText() {
        const main = document.querySelector("main") || document.querySelector("[role='main']") || document.body;
        return normalizeText(main.innerText || document.body.innerText || "");
    }

    function getDomText() {
        const selectors = ["button", "[role='button']", "label", "input", "textarea", "[aria-label]", "[data-testid]"];
        return selectors
            .flatMap(selector => [...document.querySelectorAll(selector)])
            .slice(0, 180)
            .map(node => normalizeText([
                node.innerText,
                node.textContent,
                node.getAttribute("aria-label"),
                node.getAttribute("value")
            ].filter(Boolean).join(" ")))
            .filter(Boolean)
            .join(" | ");
    }

    function readScreen() {
        const text = getVisibleText();
        const starts = ["Qual", "Quanto", "Calcule", "Resolva", "Escolha", "Determine", "Encontre"]
            .map(word => text.indexOf(word))
            .filter(index => index >= 0);
        const start = starts.length ? Math.min(...starts) : Math.max(0, text.length - 1500);
        return normalizeText(`${text.slice(start, start + 1800)}\nDOM: ${getDomText()}`);
    }

    function extractOptions(text) {
        const options = [];
        const compact = normalizeText(text);
        const optionRegex = /\b([A-D])\s+(.{1,160}?)(?=\s+[A-D]\s+|$)/g;
        let match;

        while ((match = optionRegex.exec(compact))) {
            const value = match[2].trim();
            if (value.length > 1) options.push({ label: match[1], value });
        }

        return options.slice(0, 4);
    }

    function extractLinearPairs(text) {
        const beforeOptions = text.split(/\bA\s+/)[0] || text;
        const numbers = [...beforeOptions.matchAll(/-?\d+(?:[.,]\d+)?/g)].map(match => Number(match[0].replace(",", ".")));
        const pairs = [];

        for (let i = 0; i < numbers.length - 1; i += 2) {
            const x = numbers[i];
            const y = numbers[i + 1];
            if (Number.isFinite(x) && Number.isFinite(y)) pairs.push([x, y]);
            if (pairs.length >= 4) break;
        }

        return pairs;
    }

    function parseLinearExpression(expression) {
        const clean = expression.replace(/\s+/g, "").replace(/[−–—]/g, "-");
        const rightSide = clean.includes("=") ? clean.split("=").pop() : clean;
        const match = rightSide.match(/^([+-]?\d*)[a-z]([+-]\d+)?$/i);
        if (!match) return null;

        let slopeText = match[1];
        if (slopeText === "" || slopeText === "+") slopeText = "1";
        if (slopeText === "-") slopeText = "-1";

        return {
            slope: Number(slopeText),
            intercept: Number(match[2] || 0)
        };
    }

    function analyzeLinear(text) {
        const options = extractOptions(text);
        const pairs = extractLinearPairs(text);
        if (pairs.length < 2 || options.length < 2) return null;

        const [x1, y1] = pairs[0];
        const [x2, y2] = pairs[1];
        const slope = (y2 - y1) / (x2 - x1);
        if (!Number.isFinite(slope)) return null;

        const intercept = y1 - slope * x1;
        const match = options.find(option => {
            const parsed = parseLinearExpression(option.value);
            return parsed && Math.abs(parsed.slope - slope) < 0.0001 && Math.abs(parsed.intercept - intercept) < 0.0001;
        });

        if (!match) return null;

        return {
            letter: match.label,
            brief: `Varia ${slope} por unidade e o termo fixo e ${intercept}.`,
            detail: `${match.label}) ${match.value}`
        };
    }

    function analyzeFunctionGraph(text) {
        const match = text.match(/f\s*\(\s*x\s*\)\s*=\s*([+-]?\d+(?:[,.]\d+)?)\s*x\s*([+-]\s*\d+(?:[,.]\d+)?)?/i);
        if (!match) return null;

        const slope = Number(match[1].replace(",", "."));
        const intercept = Number((match[2] || "0").replace(/\s+/g, "").replace(",", "."));
        if (!Number.isFinite(slope) || !Number.isFinite(intercept)) return null;

        const direction = slope > 0 ? "crescente" : slope < 0 ? "decrescente" : "horizontal";
        const xIntercept = slope === 0 ? null : -intercept / slope;
        const detail = [
            `Funcao: f(x) = ${slope}x${intercept < 0 ? " - " + Math.abs(intercept) : intercept > 0 ? " + " + intercept : ""}`,
            `Reta ${direction}.`,
            `Corta o eixo y em ${intercept}.`,
            xIntercept === null ? "" : `Corta o eixo x em ${Number(xIntercept.toFixed(3))}.`,
            "Compare com os graficos A/B/C/D."
        ].filter(Boolean).join("\n");

        return {
            letter: "?",
            brief: `Grafico: escolha a reta ${direction}, com y = ${intercept}.`,
            detail
        };
    }

    function analyze(text) {
        const clean = normalizeText(text);
        const graph = analyzeFunctionGraph(clean);
        if (graph) return graph;

        const linear = analyzeLinear(clean);
        if (linear) return linear;

        return {
            letter: "?",
            brief: "Nao consegui detectar com seguranca. Cole o enunciado completo ou use o modo normal para conferir.",
            detail: "Sem alternativa A/B/C/D confiavel."
        };
    }

    async function analyzeWithExternalAi(text) {
        if (!config.aiEndpoint) return null;

        try {
            const response = await fetch(config.aiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: location.href,
                    title: document.title,
                    text,
                    html: document.body.innerHTML.slice(0, 120000),
                    instruction: "Responda apenas em JSON com letter A/B/C/D/? e brief curto. Nao clique nem preencha nada."
                })
            });

            if (!response.ok) throw new Error("HTTP " + response.status);
            const data = await response.json();

            return {
                letter: /^[A-D?]$/.test(String(data.letter || "").trim().toUpperCase())
                    ? String(data.letter).trim().toUpperCase()
                    : "?",
                brief: String(data.brief || "Resposta gerada pela IA.").slice(0, 180),
                detail: String(data.detail || data.brief || "").slice(0, 1000)
            };
        } catch {
            return null;
        }
    }

    async function analyzeScreen(text) {
        return await analyzeWithExternalAi(text) || analyze(text);
    }

    function ensureAccessRequest() {
        const user = state.currentUser || makeUser();
        state.currentUser = user;

        if (!state.requests.some(request => request.id === user.id) &&
            !state.approvedUsers.includes(user.id) &&
            !state.blockedUsers.includes(user.id)) {
            state.requests.push({
                id: user.id,
                name: user.name,
                createdAt: new Date().toISOString(),
                plan: "free"
            });
            saveState();
        }
    }

    function accessStatus() {
        const id = state.currentUser.id;
        if (state.blockedUsers.includes(id)) return "blocked";
        if (state.approvedUsers.includes(id)) return "approved";
        return "pending";
    }

    function buildPanel() {
        if (document.getElementById("judeu-panel")) return;

        ensureAccessRequest();

        const launcher = el("button", {
            attrs: { id: "judeu-launcher", type: "button", title: app.brand },
            text: "JS"
        });

        const panel = el("aside", { attrs: { id: "judeu-panel", "aria-label": `${app.brand} estudo` } });
        const header = el("div", { className: "judeu-header" });
        const logo = el("div", { className: "judeu-logo", text: "JS" });
        const titleBox = el("div");
        titleBox.append(el("h2", { text: app.brand }), el("p", { text: `${app.poweredBy} - v${app.version}` }));
        const close = el("button", { className: "judeu-close", text: "x", attrs: { type: "button" } });
        header.append(logo, titleBox, close);

        const body = el("div", { className: "judeu-body" });
        const answer = el("div", { className: "judeu-answer" });
        const answerTitle = el("strong", { text: "R: ?" });
        const answerBrief = el("span", { text: "Pressione N ou clique em LER TELA." });
        answer.append(answerTitle, answerBrief);

        const modeRow = el("div", { className: "judeu-row" });
        const normalMode = el("button", { className: "judeu-mode is-active", text: "Normal", attrs: { type: "button" } });
        const flashMode = el("button", { className: "judeu-mode", text: "Flash", attrs: { type: "button" } });
        modeRow.append(normalMode, flashMode);

        const actionRow = el("div", { className: "judeu-row" });
        const readButton = el("button", { className: "judeu-button", text: "LER TELA", attrs: { type: "button" } });
        const adminButton = el("button", { className: "judeu-button secondary", text: "ADM", attrs: { type: "button" } });
        actionRow.append(readButton, adminButton);

        const screen = el("div", { className: "judeu-screen", text: "Leitura aparece aqui em modo Normal." });
        const status = el("div", { className: "judeu-note", text: accessMessage() });

        const admin = el("div", { className: "judeu-admin" });
        const adminTitle = el("div", { className: "judeu-screen", text: "ADM local/demo. Para aprovar usuarios reais em outros PCs, precisa ligar uma API/backend." });
        const requestList = el("div");
        const paidPlan = el("div", { className: "judeu-screen", text: "Plano pago: espaco reservado para integrar login, pagamentos e limites depois." });
        admin.append(adminTitle, requestList, paidPlan);

        body.append(answer, modeRow, actionRow, screen, status, admin);
        panel.append(header, body);
        document.body.append(launcher, panel);

        function accessMessage() {
            const statusNow = accessStatus();
            if (statusNow === "approved") return "Acesso aprovado neste navegador.";
            if (statusNow === "blocked") return "Acesso bloqueado neste navegador.";
            return "Solicitacao enviada. Aguardando aprovacao do administrador.";
        }

        function setMode(mode) {
            state.mode = mode;
            saveState();
            normalMode.classList.toggle("is-active", mode === "normal");
            flashMode.classList.toggle("is-active", mode === "flash");
        }

        async function runRead() {
            if (accessStatus() === "blocked") {
                answerTitle.textContent = "R: X";
                answerBrief.textContent = "Usuario bloqueado.";
                return;
            }

            const text = readScreen();
            answerTitle.textContent = "R: ...";
            answerBrief.textContent = config.aiEndpoint ? "IA lendo a tela..." : "Lendo texto da tela...";
            screen.textContent = "Analisando...";

            const result = await analyzeScreen(text);
            answerTitle.textContent = `R: ${result.letter}`;
            answerBrief.textContent = state.mode === "flash" ? "Resposta rapida." : result.brief;
            screen.textContent = state.mode === "flash" ? result.detail : `${result.brief}\n\n${result.detail}`;
        }

        function renderRequests() {
            requestList.replaceChildren();

            if (!state.requests.length) {
                requestList.append(el("div", { className: "judeu-user", text: "Nenhuma solicitacao pendente." }));
                return;
            }

            state.requests.forEach(request => {
                const item = el("div", { className: "judeu-user" });
                const label = el("div", { text: `${request.name} - ${request.id} - plano ${request.plan}` });
                const row = el("div", { className: "judeu-row" });
                const approve = el("button", { className: "judeu-button", text: "Aprovar", attrs: { type: "button" } });
                const block = el("button", { className: "judeu-button secondary", text: "Bloquear", attrs: { type: "button" } });

                approve.addEventListener("click", () => {
                    state.approvedUsers = [...new Set([...state.approvedUsers, request.id])];
                    state.blockedUsers = state.blockedUsers.filter(id => id !== request.id);
                    state.requests = state.requests.filter(item => item.id !== request.id);
                    saveState();
                    status.textContent = accessMessage();
                    renderRequests();
                });

                block.addEventListener("click", () => {
                    state.blockedUsers = [...new Set([...state.blockedUsers, request.id])];
                    state.approvedUsers = state.approvedUsers.filter(id => id !== request.id);
                    state.requests = state.requests.filter(item => item.id !== request.id);
                    saveState();
                    status.textContent = accessMessage();
                    renderRequests();
                });

                row.append(approve, block);
                item.append(label, row);
                requestList.append(item);
            });
        }

        function makeDraggable() {
            let dragging = false;
            let startX = 0;
            let startY = 0;
            let startLeft = 0;
            let startTop = 0;

            header.addEventListener("pointerdown", event => {
                if (event.target.closest("button")) return;
                dragging = true;
                const rect = panel.getBoundingClientRect();
                startX = event.clientX;
                startY = event.clientY;
                startLeft = rect.left;
                startTop = rect.top;
                panel.style.left = `${startLeft}px`;
                panel.style.top = `${startTop}px`;
                panel.style.right = "auto";
                panel.style.bottom = "auto";
                header.setPointerCapture(event.pointerId);
            });

            header.addEventListener("pointermove", event => {
                if (!dragging) return;
                const left = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, startLeft + event.clientX - startX));
                const top = Math.max(8, Math.min(window.innerHeight - panel.offsetHeight - 8, startTop + event.clientY - startY));
                panel.style.left = `${left}px`;
                panel.style.top = `${top}px`;
            });

            header.addEventListener("pointerup", () => {
                dragging = false;
            });
        }

        launcher.addEventListener("click", () => panel.classList.toggle("is-open"));
        close.addEventListener("click", () => panel.classList.remove("is-open"));
        normalMode.addEventListener("click", () => setMode("normal"));
        flashMode.addEventListener("click", () => setMode("flash"));
        readButton.addEventListener("click", runRead);
        adminButton.addEventListener("click", () => {
            admin.classList.toggle("is-open");
            renderRequests();
        });

        document.addEventListener("keydown", event => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
            if (event.key.toLowerCase() === "n") {
                panel.classList.add("is-open");
                runRead();
            }
            if (event.key.toLowerCase() === "m") {
                panel.classList.add("is-open");
                admin.classList.toggle("is-open");
                renderRequests();
            }
        });

        setMode(state.mode || "normal");
        makeDraggable();
    }

    function boot() {
        injectStyles();
        buildPanel();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();

