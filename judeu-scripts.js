(() => {
    "use strict";

    const app = {
        brand: "Judeu Scripts",
        poweredBy: "PowerBy Judeu IA",
        version: "3.1.0"
    };

    function el(tag, options = {}) {
        const node = document.createElement(tag);
        if (options.className) node.className = options.className;
        if (options.text) node.textContent = options.text;
        if (options.html) node.innerHTML = options.html;
        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
        }
        return node;
    }

    function injectStyles() {
        if (document.getElementById("judeu-study-styles")) return;

        document.head.appendChild(el("style", {
            attrs: { id: "judeu-study-styles" },
            html: `
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
                    width: 54px;
                    height: 54px;
                    border: 0;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #4f8cff, #8b5cf6);
                    color: #fff;
                    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
                    cursor: pointer;
                    font-size: 22px;
                    font-weight: 900;
                }

                #judeu-panel {
                    position: fixed;
                    right: 18px;
                    bottom: 84px;
                    z-index: 2147483647;
                    display: none;
                    width: min(430px, calc(100vw - 24px));
                    max-height: min(760px, calc(100vh - 104px));
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    border-radius: 16px;
                    background: #101423;
                    color: #f7f7fb;
                    box-shadow: 0 22px 70px rgba(0, 0, 0, 0.45);
                }

                #judeu-panel.is-open {
                    display: flex;
                    flex-direction: column;
                }

                .judeu-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                    background: linear-gradient(135deg, rgba(79, 140, 255, 0.18), rgba(139, 92, 246, 0.16));
                    cursor: move;
                    user-select: none;
                }

                .judeu-logo {
                    display: grid;
                    place-items: center;
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #4f8cff, #8b5cf6);
                    color: #fff;
                    font-size: 19px;
                    font-weight: 900;
                }

                .judeu-header h2 {
                    margin: 0;
                    font-size: 17px;
                    line-height: 1.2;
                }

                .judeu-header p {
                    margin: 2px 0 0;
                    color: #a7adbd;
                    font-size: 12px;
                }

                .judeu-close {
                    margin-left: auto;
                    width: 34px;
                    height: 34px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.07);
                    color: #fff;
                    cursor: pointer;
                    font-size: 18px;
                }

                .judeu-body {
                    display: grid;
                    gap: 12px;
                    padding: 14px;
                    overflow: auto;
                }

                .judeu-tabs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .judeu-tab {
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.07);
                    color: #a7adbd;
                    cursor: pointer;
                    font-weight: 800;
                    padding: 9px 10px;
                }

                .judeu-tab.is-active {
                    background: #4f8cff;
                    color: #fff;
                }

                .judeu-page {
                    display: none;
                    gap: 12px;
                }

                .judeu-page.is-active {
                    display: grid;
                }

                .judeu-textarea {
                    width: 100%;
                    min-height: 150px;
                    resize: vertical;
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.06);
                    color: #f7f7fb;
                    outline: 0;
                    padding: 11px;
                    font: inherit;
                    line-height: 1.35;
                }

                .judeu-row {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .judeu-button {
                    border: 0;
                    border-radius: 10px;
                    background: #4f8cff;
                    color: white;
                    cursor: pointer;
                    font-weight: 800;
                    padding: 10px 12px;
                }

                .judeu-button.secondary {
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    background: rgba(255, 255, 255, 0.07);
                }

                .judeu-result {
                    min-height: 180px;
                    padding: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    color: #e8ebf5;
                    font-size: 13px;
                    line-height: 1.45;
                    white-space: pre-wrap;
                }

                .judeu-answer {
                    padding: 14px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(79, 140, 255, 0.18), rgba(139, 92, 246, 0.14));
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    font-size: 15px;
                    line-height: 1.45;
                    white-space: pre-wrap;
                }

                .judeu-answer strong {
                    display: block;
                    margin-bottom: 6px;
                    color: #ffffff;
                    font-size: 24px;
                }

                .judeu-note {
                    color: #a7adbd;
                    font-size: 11px;
                    line-height: 1.35;
                    text-align: center;
                }

                @media (max-width: 520px) {
                    #judeu-panel {
                        right: 12px;
                        bottom: 78px;
                    }

                    #judeu-launcher {
                        right: 12px;
                        bottom: 12px;
                    }
                }
            `
        }));
    }

    function normalizeText(text) {
        return text
            .replace(/\u00a0/g, " ")
            .replace(/[−–—]/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }

    function getVisibleLessonText() {
        const main = document.querySelector("main") || document.querySelector("[role='main']") || document.body;
        return normalizeText(main.innerText || document.body.innerText || "");
    }

    function getUsefulDomText() {
        const selectors = [
            "button",
            "[role='button']",
            "label",
            "input",
            "textarea",
            "[aria-label]",
            "[data-testid]",
            "[class]"
        ];

        return selectors
            .flatMap(selector => [...document.querySelectorAll(selector)])
            .slice(0, 220)
            .map(node => normalizeText([
                node.innerText,
                node.textContent,
                node.getAttribute("aria-label"),
                node.getAttribute("value")
            ].filter(Boolean).join(" ")))
            .filter(Boolean)
            .join(" | ");
    }

    function extractProblemText() {
        const text = getVisibleLessonText();
        const startWords = ["Qual", "Quanto", "Calcule", "Resolva", "Escolha", "Determine", "Encontre"];
        const starts = startWords
            .map(word => text.indexOf(word))
            .filter(index => index >= 0);
        const start = starts.length ? Math.min(...starts) : Math.max(0, text.length - 1800);
        return text.slice(start, start + 2200).trim();
    }

    function extractOptions(text) {
        const options = [];
        const compact = text.replace(/\s+/g, " ");
        const optionRegex = /\b([A-D])\s+(.{1,140}?)(?=\s+[A-D]\s+|$)/g;
        let match;

        while ((match = optionRegex.exec(compact))) {
            const label = match[1];
            const value = match[2].trim();
            if (/[=+\-*/^]|m|x|T|\d/.test(value)) options.push({ label, value });
        }

        return options.slice(0, 4);
    }

    function extractLinearPairs(text) {
        const numbers = [...text.matchAll(/-?\d+(?:[.,]\d+)?/g)].map(match => Number(match[0].replace(",", ".")));
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
        const match = rightSide.match(/^([+-]?\d*)[mx]([+-]\d+)?$/i);

        if (!match) return null;

        let slopeText = match[1];
        if (slopeText === "" || slopeText === "+") slopeText = "1";
        if (slopeText === "-") slopeText = "-1";

        return {
            slope: Number(slopeText),
            intercept: Number(match[2] || 0)
        };
    }

    function analyzeLinearQuestion(text) {
        const options = extractOptions(text);
        const pairs = extractLinearPairs(text);

        if (pairs.length < 2 || !options.length) return null;

        const [x1, y1] = pairs[0];
        const [x2, y2] = pairs[1];
        const slope = (y2 - y1) / (x2 - x1);

        if (!Number.isFinite(slope)) return null;

        const intercept = y1 - slope * x1;
        const matched = options.find(option => {
            const parsed = parseLinearExpression(option.value);
            if (!parsed) return false;
            return Math.abs(parsed.slope - slope) < 0.0001 && Math.abs(parsed.intercept - intercept) < 0.0001;
        });

        const expression = `T = ${slope}m${intercept < 0 ? " - " + Math.abs(intercept) : intercept > 0 ? " + " + intercept : ""}`;

        return {
            answer: matched ? `R: ${matched.label}` : `R: ${expression}`,
            explanation: `A variacao e ${y2 - y1}, entao a taxa e ${slope}. Substituindo (${x1}, ${y1}), sobra b = ${intercept}.`,
            detail: matched ? `${matched.label}) ${matched.value}` : expression
        };
    }

    function analyzeBasicArithmetic(text) {
        const expression = text.match(/(-?\d+(?:[.,]\d+)?)\s*([+\-*/])\s*(-?\d+(?:[.,]\d+)?)/);
        if (!expression) return null;

        const a = Number(expression[1].replace(",", "."));
        const op = expression[2];
        const b = Number(expression[3].replace(",", "."));
        let result;

        if (op === "+") result = a + b;
        if (op === "-") result = a - b;
        if (op === "*") result = a * b;
        if (op === "/") result = b === 0 ? null : a / b;
        if (result === null || !Number.isFinite(result)) return null;

        return {
            answer: `R: ${result}`,
            explanation: `Conta direta: ${a} ${op} ${b} = ${result}.`,
            detail: String(result)
        };
    }

    function fallbackAnalysis(text) {
        const options = extractOptions(text);
        const optionText = options.length
            ? `\n${options.map(option => `${option.label}) ${option.value}`).join("\n")}`
            : "";

        return {
            answer: "R: ?",
            explanation: "Nao consegui ter certeza so pelo texto capturado. Cole o enunciado completo para melhorar.",
            detail: optionText ? `Alternativas detectadas:${optionText}` : "Nenhuma alternativa clara detectada."
        };
    }

    function analyze(text) {
        const clean = normalizeText(text);
        return analyzeLinearQuestion(clean) || analyzeBasicArithmetic(clean) || fallbackAnalysis(clean);
    }

    function buildPanel() {
        if (document.getElementById("judeu-panel")) return;

        const launcher = el("button", {
            attrs: { id: "judeu-launcher", type: "button", title: app.brand },
            text: "JS"
        });

        const panel = el("aside", {
            attrs: { id: "judeu-panel", "aria-label": `${app.brand} estudo` },
            html: `
                <div class="judeu-header">
                    <div class="judeu-logo">JS</div>
                    <div>
                        <h2>${app.brand}</h2>
                        <p>${app.poweredBy} - v${app.version}</p>
                    </div>
                    <button class="judeu-close" type="button" aria-label="Fechar">x</button>
                </div>
                <div class="judeu-body">
                    <div class="judeu-tabs">
                        <button class="judeu-tab is-active" id="judeu-tab-khan" type="button">Khan</button>
                        <button class="judeu-tab" id="judeu-tab-ai" type="button">Painel IA</button>
                    </div>

                    <div class="judeu-page is-active" id="judeu-page-khan">
                        <textarea class="judeu-textarea" id="judeu-question" placeholder="Clique em Ler tela ou cole o enunciado aqui."></textarea>
                        <div class="judeu-row">
                            <button class="judeu-button" id="judeu-capture" type="button">Ler tela</button>
                            <button class="judeu-button secondary" id="judeu-analyze" type="button">Enviar para IA</button>
                        </div>
                    </div>

                    <div class="judeu-page" id="judeu-page-ai">
                        <div class="judeu-answer" id="judeu-answer"><strong>R: ?</strong>A resposta aparece aqui.</div>
                        <div class="judeu-result" id="judeu-result">Aguardando leitura da tela.</div>
                    </div>

                    <div class="judeu-row">
                        <button class="judeu-button secondary" id="judeu-copy" type="button">Copiar resposta</button>
                    </div>
                    <div class="judeu-note">Le a tela e o DOM visivel, resume curto e mostra a resposta sugerida. Nao clica nem preenche sozinho.</div>
                </div>
            `
        });

        document.body.append(launcher, panel);

        const question = panel.querySelector("#judeu-question");
        const result = panel.querySelector("#judeu-result");
        const answer = panel.querySelector("#judeu-answer");
        const close = panel.querySelector(".judeu-close");
        const header = panel.querySelector(".judeu-header");
        const tabKhan = panel.querySelector("#judeu-tab-khan");
        const tabAi = panel.querySelector("#judeu-tab-ai");
        const pageKhan = panel.querySelector("#judeu-page-khan");
        const pageAi = panel.querySelector("#judeu-page-ai");

        launcher.addEventListener("click", () => panel.classList.toggle("is-open"));
        close.addEventListener("click", () => panel.classList.remove("is-open"));

        function setPage(page) {
            const ai = page === "ai";
            tabKhan.classList.toggle("is-active", !ai);
            tabAi.classList.toggle("is-active", ai);
            pageKhan.classList.toggle("is-active", !ai);
            pageAi.classList.toggle("is-active", ai);
        }

        function setAnalysis(analysis) {
            answer.innerHTML = `<strong>${analysis.answer}</strong>${analysis.explanation}`;
            result.textContent = analysis.detail;
            setPage("ai");
        }

        function readScreen() {
            const visible = extractProblemText();
            const dom = getUsefulDomText();
            return normalizeText(`${visible}\n\nCODIGOS/DOM VISIVEIS:\n${dom}`);
        }

        function makeDraggable() {
            let dragging = false;
            let startX = 0;
            let startY = 0;
            let startLeft = 0;
            let startTop = 0;

            header.addEventListener("pointerdown", (event) => {
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

            header.addEventListener("pointermove", (event) => {
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

        tabKhan.addEventListener("click", () => setPage("khan"));
        tabAi.addEventListener("click", () => setPage("ai"));

        panel.querySelector("#judeu-capture").addEventListener("click", () => {
            question.value = readScreen();
        });

        panel.querySelector("#judeu-analyze").addEventListener("click", () => {
            const text = question.value.trim() || readScreen();
            question.value = text;
            setAnalysis(analyze(text));
        });

        panel.querySelector("#judeu-copy").addEventListener("click", async () => {
            const text = answer.innerText || "";
            if (!text.trim()) return;
            await navigator.clipboard?.writeText(text);
        });

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
