(() => {
    "use strict";

    const app = {
        brand: "Judeu Scripts",
        poweredBy: "PowerBy Judeu IA",
        version: "3.0.0"
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
        const optionRegex = /\b([A-D])\s+([^A-D]{1,120}?)(?=\s+[A-D]\s+|$)/g;
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

        const lines = [
            "Analise da IA:",
            `A tabela mostra os pares (${x1}, ${y1}) e (${x2}, ${y2}).`,
            `A variacao foi ${y2} - ${y1} = ${y2 - y1}.`,
            `Como ${x2} - ${x1} = ${x2 - x1}, a taxa por unidade e ${slope}.`,
            `Usando y = ${slope}x + b e o par (${x1}, ${y1}):`,
            `${y1} = ${slope} * ${x1} + b, entao b = ${intercept}.`,
            `Expressao final: T = ${slope}m${intercept < 0 ? " - " + Math.abs(intercept) : intercept > 0 ? " + " + intercept : ""}.`
        ];

        if (matched) lines.push(`Resultado: alternativa ${matched.label}, ${matched.value}.`);
        else lines.push("Resultado: encontrei a expressao, mas nao consegui casar com uma alternativa visivel.");

        return lines.join("\n");
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

        return [
            "Analise da IA:",
            `A conta identificada foi ${a} ${op} ${b}.`,
            `Fazendo a operacao, o resultado e ${result}.`,
            `Resultado: ${result}.`
        ].join("\n");
    }

    function fallbackAnalysis(text) {
        const options = extractOptions(text);
        const optionText = options.length
            ? `\n\nAlternativas detectadas:\n${options.map(option => `${option.label}) ${option.value}`).join("\n")}`
            : "";

        return [
            "Analise da IA:",
            "Eu li a questao, mas nao consegui resolver automaticamente com seguranca.",
            "Como fazer:",
            "1. Identifique o que a pergunta quer encontrar.",
            "2. Separe os dados importantes do enunciado.",
            "3. Teste as alternativas ou monte uma equacao.",
            "4. Confira se o resultado atende todos os dados.",
            "",
            "Resultado: preciso que voce cole o enunciado completo ou selecione a parte da questao para eu analisar melhor.",
            optionText
        ].join("\n");
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
                    <textarea class="judeu-textarea" id="judeu-question" placeholder="Clique em Capturar questão ou cole o enunciado aqui."></textarea>
                    <div class="judeu-row">
                        <button class="judeu-button" id="judeu-capture" type="button">Capturar questão</button>
                        <button class="judeu-button secondary" id="judeu-analyze" type="button">Analisar</button>
                    </div>
                    <div class="judeu-result" id="judeu-result">Abra uma lição, capture a questão e clique em Analisar.</div>
                    <div class="judeu-note">Este modo explica o raciocinio e mostra o resultado para estudo. Ele nao clica nem preenche respostas automaticamente.</div>
                </div>
            `
        });

        document.body.append(launcher, panel);

        const question = panel.querySelector("#judeu-question");
        const result = panel.querySelector("#judeu-result");
        const close = panel.querySelector(".judeu-close");

        launcher.addEventListener("click", () => panel.classList.toggle("is-open"));
        close.addEventListener("click", () => panel.classList.remove("is-open"));

        panel.querySelector("#judeu-capture").addEventListener("click", () => {
            question.value = extractProblemText();
            result.textContent = "Questao capturada. Clique em Analisar.";
        });

        panel.querySelector("#judeu-analyze").addEventListener("click", () => {
            const text = question.value.trim() || extractProblemText();
            question.value = text;
            result.textContent = analyze(text);
        });
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
