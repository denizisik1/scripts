// If you refresh the page firefox console has a little button for "Previous Expression".

(function forceTitleAnySite() {
    const FORCED_TITLE = "title";

    function safeSetTitle(title) {
        try {
            if (document.title !== title) document.title = title;
            let titleEl = document.querySelector("head > title");
            if (!titleEl) {
                titleEl = document.createElement("title");
                const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                head.insertBefore(titleEl, head.firstChild);
            }
            if (titleEl.textContent !== title) titleEl.textContent = title;
        } catch (e) {}
    }

    (function overrideTitleProp() {
        try {
            const proto = Document.prototype || HTMLDocument.prototype;
            const originalDesc = Object.getOwnPropertyDescriptor(proto, "title");
            if (!originalDesc) return;
            if (!originalDesc.configurable) return;

            const originalSetter = originalDesc.set;
            const originalGetter = originalDesc.get;

            Object.defineProperty(document, "title", {
                configurable: true,
                enumerable: true,
                get() {
                    return FORCED_TITLE;
                },
                set(_) {
                    try {
                        if (originalSetter) {
                            originalSetter.call(document, FORCED_TITLE);
                        } else if (originalGetter) {
                            const titleEl = document.querySelector("head > title") || document.createElement("title");
                            titleEl.textContent = FORCED_TITLE;
                            if (!titleEl.parentElement) document.head.appendChild(titleEl);
                        } else {
                            const titleEl = document.querySelector("head > title") || document.createElement("title");
                            titleEl.textContent = FORCED_TITLE;
                            if (!titleEl.parentElement) document.head.appendChild(titleEl);
                        }
                    } catch (e) {}
                }
            });
        } catch (e) {}
    })();

    const titleObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === "characterData" || m.type === "childList" || m.type === "subtree") {
                safeSetTitle(FORCED_TITLE);
                break;
            }
        }
    });

    const headObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === "childList") {
                const added = Array.from(m.addedNodes || []);
                const removed = Array.from(m.removedNodes || []);
                if (added.some(n => n.nodeName && n.nodeName.toLowerCase() === "title") ||
                    removed.some(n => n.nodeName && n.nodeName.toLowerCase() === "title")) {
                    attachTitleObserver();
                }
                safeSetTitle(FORCED_TITLE);
            }
        }
    });

    function attachTitleObserver() {
        const titleEl = document.querySelector("head > title");
        try {
            titleObserver.disconnect();
            if (titleEl) {
                titleObserver.observe(titleEl, {
                    characterData: true,
                    childList: true,
                    subtree: true
                });
            }
            const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            headObserver.observe(head, {
                childList: true
            });
            safeSetTitle(FORCED_TITLE);
        } catch (e) {}
    }

    attachTitleObserver();

    const POLL_INTERVAL_MS = 400;
    const POLL_ATTEMPTS = 12;
    let polls = 0;
    const pollId = setInterval(() => {
        safeSetTitle(FORCED_TITLE);
        polls += 1;
        if (polls >= POLL_ATTEMPTS) {
            clearInterval(pollId);
        }
    }, POLL_INTERVAL_MS);

    safeSetTitle(FORCED_TITLE);

    Object.defineProperty(window, "__forceTitle", {
        configurable: true,
        enumerable: false,
        value: {
            stop() {
                try {
                    titleObserver.disconnect();
                    headObserver.disconnect();
                    clearInterval(pollId);
                    try {
                        delete document.title;
                    } catch (e) {}
                    try {
                        delete window.__forceTitle;
                    } catch (e) {}
                } catch (e) {}
            },
            setTitle(newTitle) {
                if (typeof newTitle !== "string") return;
                safeSetTitle(newTitle);
            }
        }
    });
})();
