(() => {
    "use strict";

    const app = {
        brand: "Judeu Scripts",
        poweredBy: "PowerBy Judeu IA",
        version: "2.0.0"
    };

    const config = {
        scanEveryMs: 700,
        clickDelayMs: 120,
        toastMs: 2200
    };

    let scanTimer = null;
    let lastSummary = "";

    function createElement(tag, options = {}) {
        const element = document.createElement(tag);

        if (options.className) element.className = options.className;
        if (options.text) element.textContent = options.text;
        if (options.html) element.innerHTML = options.html;
        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        return element;
    }

    function injectStyles() {
        if (document.getElementById("judeu-scripts-styles")) return;

        document.head.appendChild(createElement("style", {
            attrs: { id: "judeu-scripts-styles" },
            html: `
                .judeu-toast {
                    position: fixed;
                    right: 16px;
                    bottom: 16px;
                    z-index: 2147483647;
                    max-width: min(360px, calc(100vw - 32px));
                    padding: 12px 14px;
                    border: 1px solid rgba(255, 255, 255, 0.16);
                    border-radius: 12px;
                    background: #101423;
                    color: #f7f7fb;
                    box-shadow: 0 18px 55px rgba(0, 0, 0, 0.38);
                    font: 600 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    opacity: 0;
                    transform: translateY(12px);
                    transition: opacity 180ms ease, transform 180ms ease;
                }

                .judeu-toast.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .judeu-toast strong {
                    display: block;
                    margin-bottom: 2px;
                    color: #ffffff;
                    font-size: 14px;
                }

                [data-judeu-highlight="true"] {
                    outline: 2px solid #4f8cff !important;
                    outline-offset: 2px !important;
                }
            `
        }));
    }

    function showToast(message) {
        const toast = createElement("div", {
            className: "judeu-toast",
            html: `<strong>${app.brand}</strong>${message}<br>${app.poweredBy}`
        });

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("is-visible"));

        window.setTimeout(() => {
            toast.classList.remove("is-visible");
            window.setTimeout(() => toast.remove(), 220);
        }, config.toastMs);
    }

    function dispatchInputEvents(element) {
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function setInputValue(field, value) {
        const prototype = field instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

        if (valueSetter) {
            valueSetter.call(field, value);
        } else {
            field.value = value;
        }

        dispatchInputEvents(field);
    }

    function answerTextFields() {
        const fields = document.querySelectorAll("input[data-judeu-answer], textarea[data-judeu-answer]");
        let answered = 0;

        fields.forEach((field) => {
            const answer = field.getAttribute("data-judeu-answer") || "";

            if (field.value === answer && field.getAttribute("data-judeu-done") === "true") return;

            setInputValue(field, answer);
            field.setAttribute("data-judeu-done", "true");
            field.setAttribute("data-judeu-highlight", "true");
            answered += 1;
        });

        return answered;
    }

    function answerChoices() {
        const choices = document.querySelectorAll(
            "button[data-judeu-correct='true'], [role='button'][data-judeu-correct='true'], input[type='radio'][data-judeu-correct='true'], input[type='checkbox'][data-judeu-correct='true']"
        );
        let clicked = 0;

        choices.forEach((choice, index) => {
            if (choice.getAttribute("data-judeu-done") === "true") return;

            choice.setAttribute("data-judeu-done", "true");
            choice.setAttribute("data-judeu-highlight", "true");

            window.setTimeout(() => {
                choice.click();
                choice.dispatchEvent(new Event("change", { bubbles: true }));
            }, index * config.clickDelayMs);

            clicked += 1;
        });

        return clicked;
    }

    function revealLabels() {
        const labels = document.querySelectorAll("[data-judeu-answer]:not(input):not(textarea)");
        let revealed = 0;

        labels.forEach((label) => {
            if (label.getAttribute("data-judeu-done") === "true") return;

            label.textContent = label.getAttribute("data-judeu-answer") || "";
            label.setAttribute("data-judeu-done", "true");
            label.setAttribute("data-judeu-highlight", "true");
            revealed += 1;
        });

        return revealed;
    }

    function submitLessonIfReady() {
        const submit = document.querySelector("[data-judeu-submit='true']");

        if (!submit || submit.getAttribute("data-judeu-done") === "true") return 0;

        submit.setAttribute("data-judeu-done", "true");
        window.setTimeout(() => submit.click(), config.clickDelayMs);
        return 1;
    }

    function runAutoAnswer() {
        const textFields = answerTextFields();
        const choices = answerChoices();
        const labels = revealLabels();
        const submits = submitLessonIfReady();
        const total = textFields + choices + labels + submits;

        if (!total) return;

        const summary = `${textFields} campo(s), ${choices} escolha(s), ${labels} texto(s), ${submits} envio(s).`;
        if (summary !== lastSummary) {
            lastSummary = summary;
            showToast(`Auto resposta executada: ${summary}`);
        }
    }

    function startObserver() {
        const observer = new MutationObserver(runAutoAnswer);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-judeu-answer", "data-judeu-correct", "data-judeu-submit"]
        });

        scanTimer = window.setInterval(runAutoAnswer, config.scanEveryMs);
        runAutoAnswer();
    }

    function boot() {
        injectStyles();
        showToast(`v${app.version} carregado. Auto resposta ativa.`);
        startObserver();
    }

    if (window.__judeuScriptsAutoAnswerLoaded) {
        showToast("Auto resposta ja estava ativa.");
        return;
    }

    window.__judeuScriptsAutoAnswerLoaded = true;
    window.__judeuScriptsStop = () => {
        if (scanTimer) window.clearInterval(scanTimer);
        window.__judeuScriptsAutoAnswerLoaded = false;
        showToast("Auto resposta pausada.");
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
