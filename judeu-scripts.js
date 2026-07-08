(() => {
    "use strict";

    const app = {
        version: "1.0.0",
        brand: "Judeu Scripts",
        poweredBy: "PowerBy Judeu IA",
        storageKey: "judeuScriptsState"
    };

    const state = loadState();
    let timerInterval = null;
    let timerSeconds = state.timerSeconds || 25 * 60;
    let timerRunning = false;

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(app.storageKey)) || {};
        } catch {
            return {};
        }
    }

    function saveState(nextState = {}) {
        Object.assign(state, nextState);
        localStorage.setItem(app.storageKey, JSON.stringify(state));
    }

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

        const style = createElement("style", {
            attrs: { id: "judeu-scripts-styles" },
            html: `
                :root {
                    --js-bg: #08090f;
                    --js-panel: #111421;
                    --js-panel-2: #171b2b;
                    --js-text: #f7f7fb;
                    --js-muted: #a7adbd;
                    --js-border: rgba(255, 255, 255, 0.12);
                    --js-primary: #4f8cff;
                    --js-primary-2: #8b5cf6;
                    --js-good: #30d158;
                    --js-danger: #ff453a;
                    --js-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
                }

                #judeu-splash,
                #judeu-panel,
                #judeu-launcher,
                .judeu-toast {
                    box-sizing: border-box;
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                }

                #judeu-splash {
                    position: fixed;
                    inset: 0;
                    z-index: 2147483647;
                    display: grid;
                    place-items: center;
                    background: radial-gradient(circle at top, rgba(79, 140, 255, 0.28), transparent 34%), var(--js-bg);
                    color: var(--js-text);
                    opacity: 0;
                    transition: opacity 260ms ease;
                }

                #judeu-splash.is-visible {
                    opacity: 1;
                }

                .judeu-splash-card {
                    width: min(420px, calc(100vw - 32px));
                    padding: 28px;
                    border: 1px solid var(--js-border);
                    border-radius: 18px;
                    background: rgba(17, 20, 33, 0.88);
                    box-shadow: var(--js-shadow);
                    text-align: center;
                    backdrop-filter: blur(14px);
                }

                .judeu-logo {
                    display: inline-grid;
                    place-items: center;
                    width: 58px;
                    height: 58px;
                    margin-bottom: 14px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--js-primary), var(--js-primary-2));
                    color: white;
                    font-size: 26px;
                    font-weight: 900;
                }

                .judeu-title {
                    margin: 0;
                    font-size: 28px;
                    line-height: 1.1;
                    letter-spacing: 0;
                }

                .judeu-subtitle {
                    margin: 8px 0 0;
                    color: var(--js-muted);
                    font-size: 14px;
                }

                #judeu-launcher {
                    position: fixed;
                    right: 18px;
                    bottom: 18px;
                    z-index: 2147483645;
                    width: 54px;
                    height: 54px;
                    border: 0;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--js-primary), var(--js-primary-2));
                    color: white;
                    box-shadow: var(--js-shadow);
                    cursor: pointer;
                    font-size: 22px;
                    font-weight: 900;
                }

                #judeu-panel {
                    position: fixed;
                    right: 18px;
                    bottom: 84px;
                    z-index: 2147483646;
                    width: min(390px, calc(100vw - 24px));
                    max-height: min(720px, calc(100vh - 108px));
                    display: none;
                    overflow: hidden;
                    border: 1px solid var(--js-border);
                    border-radius: 18px;
                    background: var(--js-panel);
                    color: var(--js-text);
                    box-shadow: var(--js-shadow);
                }

                #judeu-panel.is-open {
                    display: flex;
                    flex-direction: column;
                }

                .judeu-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border-bottom: 1px solid var(--js-border);
                    background: linear-gradient(135deg, rgba(79, 140, 255, 0.18), rgba(139, 92, 246, 0.16));
                }

                .judeu-header .judeu-logo {
                    width: 42px;
                    height: 42px;
                    margin: 0;
                    border-radius: 12px;
                    font-size: 19px;
                }

                .judeu-header h2 {
                    margin: 0;
                    font-size: 18px;
                    line-height: 1.2;
                }

                .judeu-header p {
                    margin: 2px 0 0;
                    color: var(--js-muted);
                    font-size: 12px;
                }

                .judeu-close {
                    margin-left: auto;
                    width: 34px;
                    height: 34px;
                    border: 1px solid var(--js-border);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.06);
                    color: var(--js-text);
                    cursor: pointer;
                    font-size: 18px;
                }

                .judeu-body {
                    display: grid;
                    gap: 12px;
                    padding: 14px;
                    overflow: auto;
                }

                .judeu-section {
                    padding: 12px;
                    border: 1px solid var(--js-border);
                    border-radius: 12px;
                    background: var(--js-panel-2);
                }

                .judeu-section h3 {
                    margin: 0 0 10px;
                    font-size: 13px;
                    color: var(--js-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .judeu-row {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .judeu-input,
                .judeu-textarea {
                    width: 100%;
                    border: 1px solid var(--js-border);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.06);
                    color: var(--js-text);
                    outline: 0;
                    padding: 10px 11px;
                    font: inherit;
                }

                .judeu-textarea {
                    min-height: 92px;
                    resize: vertical;
                }

                .judeu-button {
                    border: 0;
                    border-radius: 10px;
                    background: var(--js-primary);
                    color: white;
                    cursor: pointer;
                    font-weight: 800;
                    padding: 10px 12px;
                    white-space: nowrap;
                }

                .judeu-button.secondary {
                    border: 1px solid var(--js-border);
                    background: rgba(255, 255, 255, 0.07);
                }

                .judeu-button.danger {
                    background: var(--js-danger);
                }

                .judeu-task-list {
                    display: grid;
                    gap: 8px;
                    margin-top: 10px;
                }

                .judeu-task {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 0;
                    padding: 9px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.05);
                }

                .judeu-task span {
                    flex: 1;
                    min-width: 0;
                    overflow-wrap: anywhere;
                }

                .judeu-task.is-done span {
                    color: var(--js-muted);
                    text-decoration: line-through;
                }

                .judeu-task button {
                    width: 28px;
                    height: 28px;
                    border: 0;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.08);
                    color: var(--js-text);
                    cursor: pointer;
                }

                .judeu-timer {
                    font-size: 38px;
                    font-weight: 900;
                    text-align: center;
                    font-variant-numeric: tabular-nums;
                }

                .judeu-footer {
                    padding: 10px 14px 14px;
                    color: var(--js-muted);
                    font-size: 11px;
                    text-align: center;
                }

                .judeu-toast {
                    position: fixed;
                    left: 50%;
                    bottom: 24px;
                    z-index: 2147483647;
                    transform: translateX(-50%) translateY(18px);
                    opacity: 0;
                    max-width: min(420px, calc(100vw - 32px));
                    padding: 11px 14px;
                    border: 1px solid var(--js-border);
                    border-radius: 12px;
                    background: #111421;
                    color: var(--js-text);
                    box-shadow: var(--js-shadow);
                    transition: opacity 180ms ease, transform 180ms ease;
                }

                .judeu-toast.is-visible {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
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
        });

        document.head.appendChild(style);
    }

    function showToast(message) {
        const toast = createElement("div", {
            className: "judeu-toast",
            text: message
        });

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("is-visible"));

        window.setTimeout(() => {
            toast.classList.remove("is-visible");
            window.setTimeout(() => toast.remove(), 220);
        }, 2600);
    }

    function showSplash() {
        const splash = createElement("div", {
            attrs: { id: "judeu-splash" },
            html: `
                <div class="judeu-splash-card">
                    <div class="judeu-logo">JS</div>
                    <h1 class="judeu-title">${app.brand}</h1>
                    <p class="judeu-subtitle">${app.poweredBy} - carregando painel</p>
                </div>
            `
        });

        document.body.appendChild(splash);
        requestAnimationFrame(() => splash.classList.add("is-visible"));

        window.setTimeout(() => {
            splash.classList.remove("is-visible");
            window.setTimeout(() => splash.remove(), 300);
        }, 1100);
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    function renderTasks(listElement) {
        const tasks = state.tasks || [];
        listElement.innerHTML = "";

        if (!tasks.length) {
            listElement.appendChild(createElement("div", {
                className: "judeu-task",
                text: "Nenhuma tarefa adicionada ainda."
            }));
            return;
        }

        tasks.forEach((task, index) => {
            const item = createElement("div", {
                className: `judeu-task${task.done ? " is-done" : ""}`
            });
            const checkbox = createElement("input", {
                attrs: { type: "checkbox", "aria-label": "Marcar tarefa" }
            });
            checkbox.checked = Boolean(task.done);
            checkbox.addEventListener("change", () => {
                tasks[index].done = checkbox.checked;
                saveState({ tasks });
                renderTasks(listElement);
            });

            const text = createElement("span", { text: task.text });
            const remove = createElement("button", {
                text: "x",
                attrs: { type: "button", "aria-label": "Remover tarefa" }
            });
            remove.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveState({ tasks });
                renderTasks(listElement);
                showToast("Tarefa removida.");
            });

            item.append(checkbox, text, remove);
            listElement.appendChild(item);
        });
    }

    function buildPanel() {
        if (document.getElementById("judeu-panel")) return;

        const launcher = createElement("button", {
            attrs: { id: "judeu-launcher", type: "button", title: app.brand },
            text: "JS"
        });

        const panel = createElement("aside", {
            attrs: { id: "judeu-panel", "aria-label": `${app.brand} painel` },
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
                    <section class="judeu-section">
                        <h3>Perfil</h3>
                        <input class="judeu-input" id="judeu-name" placeholder="Seu nome" value="${state.name || ""}">
                    </section>

                    <section class="judeu-section">
                        <h3>Timer de foco</h3>
                        <div class="judeu-timer" id="judeu-timer">${formatTime(timerSeconds)}</div>
                        <div class="judeu-row">
                            <button class="judeu-button" id="judeu-start" type="button">Iniciar</button>
                            <button class="judeu-button secondary" id="judeu-reset" type="button">Resetar</button>
                        </div>
                    </section>

                    <section class="judeu-section">
                        <h3>Tarefas</h3>
                        <div class="judeu-row">
                            <input class="judeu-input" id="judeu-task-input" placeholder="Adicionar tarefa">
                            <button class="judeu-button" id="judeu-add-task" type="button">Add</button>
                        </div>
                        <div class="judeu-task-list" id="judeu-task-list"></div>
                    </section>

                    <section class="judeu-section">
                        <h3>Anotações</h3>
                        <textarea class="judeu-textarea" id="judeu-notes" placeholder="Escreva suas anotações aqui...">${state.notes || ""}</textarea>
                    </section>

                    <section class="judeu-section">
                        <h3>Ações</h3>
                        <div class="judeu-row">
                            <button class="judeu-button secondary" id="judeu-save" type="button">Salvar</button>
                            <button class="judeu-button danger" id="judeu-clear" type="button">Limpar</button>
                        </div>
                    </section>
                </div>
                <div class="judeu-footer">${app.brand} - ${app.poweredBy}</div>
            `
        });

        document.body.append(launcher, panel);
        bindPanelEvents(panel, launcher);
    }

    function bindPanelEvents(panel, launcher) {
        const close = panel.querySelector(".judeu-close");
        const nameInput = panel.querySelector("#judeu-name");
        const notesInput = panel.querySelector("#judeu-notes");
        const taskInput = panel.querySelector("#judeu-task-input");
        const addTask = panel.querySelector("#judeu-add-task");
        const taskList = panel.querySelector("#judeu-task-list");
        const save = panel.querySelector("#judeu-save");
        const clear = panel.querySelector("#judeu-clear");
        const timer = panel.querySelector("#judeu-timer");
        const start = panel.querySelector("#judeu-start");
        const reset = panel.querySelector("#judeu-reset");

        const togglePanel = () => panel.classList.toggle("is-open");
        launcher.addEventListener("click", togglePanel);
        close.addEventListener("click", togglePanel);

        function persistForm() {
            saveState({
                name: nameInput.value.trim(),
                notes: notesInput.value,
                timerSeconds
            });
        }

        function addTaskFromInput() {
            const text = taskInput.value.trim();
            if (!text) {
                showToast("Digite uma tarefa primeiro.");
                return;
            }

            const tasks = state.tasks || [];
            tasks.push({ text, done: false });
            taskInput.value = "";
            saveState({ tasks });
            renderTasks(taskList);
            showToast("Tarefa adicionada.");
        }

        function updateTimer() {
            timer.textContent = formatTime(timerSeconds);
            saveState({ timerSeconds });
        }

        addTask.addEventListener("click", addTaskFromInput);
        taskInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") addTaskFromInput();
        });

        save.addEventListener("click", () => {
            persistForm();
            showToast("Tudo salvo.");
        });

        clear.addEventListener("click", () => {
            localStorage.removeItem(app.storageKey);
            Object.keys(state).forEach(key => delete state[key]);
            timerSeconds = 25 * 60;
            nameInput.value = "";
            notesInput.value = "";
            updateTimer();
            renderTasks(taskList);
            showToast("Dados limpos.");
        });

        start.addEventListener("click", () => {
            timerRunning = !timerRunning;
            start.textContent = timerRunning ? "Pausar" : "Iniciar";

            if (!timerRunning) {
                clearInterval(timerInterval);
                timerInterval = null;
                return;
            }

            timerInterval = window.setInterval(() => {
                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    timerRunning = false;
                    timerSeconds = 25 * 60;
                    start.textContent = "Iniciar";
                    updateTimer();
                    showToast("Tempo finalizado.");
                    return;
                }

                timerSeconds -= 1;
                updateTimer();
            }, 1000);
        });

        reset.addEventListener("click", () => {
            clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
            timerSeconds = 25 * 60;
            start.textContent = "Iniciar";
            updateTimer();
            showToast("Timer resetado.");
        });

        nameInput.addEventListener("input", persistForm);
        notesInput.addEventListener("input", persistForm);
        renderTasks(taskList);
    }

    function boot() {
        injectStyles();
        showSplash();
        buildPanel();
        showToast(`${app.brand} carregado com sucesso.`);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
