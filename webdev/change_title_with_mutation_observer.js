// Force page title to a chosen value on any website using MutationObserver + property override + fallback polling.
// Usage: paste into the browser console on any page, install as a content script, or convert to a bookmarklet.
// At the top you can change FORCED_TITLE to any string (or set it programmatically before running).

(function forceTitleAnySite() {
  // --- CONFIG: change this to whatever title you want ---
  const FORCED_TITLE = "My Forced Title";
  // ----------------------------------------------------------------

  // Small helpers.
  function safeSetTitle(title) {
    try {
      // update document.title (this may trigger site code)
      if (document.title !== title) document.title = title;
      // ensure the <title> element is synced.
      let titleEl = document.querySelector("head > title");
      if (!titleEl) {
        titleEl = document.createElement("title");
        // Insert at beginning of head for consistency.
        const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        head.insertBefore(titleEl, head.firstChild);
      }
      if (titleEl.textContent !== title) titleEl.textContent = title;
    } catch (e) {
      // ignore errors (some pages have read-only docs or CSP that forbids changes)
    }
  }

  // 1) Try to override document.title property on this document instance so assignments by page code are intercepted.
  // We only override if the descriptor is configurable; otherwise skip to observers/fallbacks.
  (function overrideTitleProp() {
    try {
      const proto = Document.prototype || HTMLDocument.prototype;
      const originalDesc = Object.getOwnPropertyDescriptor(proto, "title");
      if (!originalDesc) return;
      if (!originalDesc.configurable) return;

      // Keep a reference to the original setter so we can call it if needed.
      const originalSetter = originalDesc.set;
      const originalGetter = originalDesc.get;

      Object.defineProperty(document, "title", {
        configurable: true,
        enumerable: true,
        get() {
          // Always return the forced title to callers reading document.title
          return FORCED_TITLE;
        },
        set(_) {
          // Ignore the provided value and force our title into the DOM and underlying setter.
          try {
            if (originalSetter) {
              originalSetter.call(document, FORCED_TITLE);
            } else if (originalGetter) {
              // If only getter existed (unlikely), try to set via DOM directly
              const titleEl = document.querySelector("head > title") || document.createElement("title");
              titleEl.textContent = FORCED_TITLE;
              if (!titleEl.parentElement) document.head.appendChild(titleEl);
            } else {
              // Fallback to direct DOM update
              const titleEl = document.querySelector("head > title") || document.createElement("title");
              titleEl.textContent = FORCED_TITLE;
              if (!titleEl.parentElement) document.head.appendChild(titleEl);
            }
          } catch (e) {
            // ignore
          }
        }
      });
    } catch (e) {
      // overriding may fail in some environments (CSP, sealed prototypes). Observers will handle those cases.
    }
  })();

  // 2) MutationObservers: watch <title> element text and head child changes (SPA might replace <title>)
  const titleObserver = new MutationObserver((mutations) => {
    // If any relevant mutation happened, set title
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
        // If a title node was added or replaced, attach titleObserver to it.
        const added = Array.from(m.addedNodes || []);
        const removed = Array.from(m.removedNodes || []);
        // If title added or replaced, re-observe.
        if (added.some(n => n.nodeName && n.nodeName.toLowerCase() === "title") ||
            removed.some(n => n.nodeName && n.nodeName.toLowerCase() === "title")) {
          attachTitleObserver();
        }
        // Always enforce after structural changes.
        safeSetTitle(FORCED_TITLE);
      }
    }
  });

  function attachTitleObserver() {
    const titleEl = document.querySelector("head > title");
    try {
      titleObserver.disconnect();
      if (titleEl) {
        // Observe character data changes inside <title>
        titleObserver.observe(titleEl, { characterData: true, childList: true, subtree: true });
      }
      // Observe head for title replacement or re-insertions.
      const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      headObserver.observe(head, { childList: true });
      // Ensure forced title is set immediately.
      safeSetTitle(FORCED_TITLE);
    } catch (e) {
      // ignore...
    }
  }

  // Start observers.
  attachTitleObserver();

  // 3) Fallback polling for pages that actively resist mutation observer or property override.
  const POLL_INTERVAL_MS = 400;
  const POLL_ATTEMPTS = 12; // ~5 seconds total
  let polls = 0;
  const pollId = setInterval(() => {
    safeSetTitle(FORCED_TITLE);
    polls += 1;
    if (polls >= POLL_ATTEMPTS) {
      clearInterval(pollId);
    }
  }, POLL_INTERVAL_MS);

  // Ensure immediate enforcement.
  safeSetTitle(FORCED_TITLE);

  // Expose a control object to stop enforcement or change the forced title at runtime.
  Object.defineProperty(window, "__forceTitle", {
    configurable: true,
    enumerable: false,
    value: {
      stop() {
        try {
          titleObserver.disconnect();
          headObserver.disconnect();
          clearInterval(pollId);
          // Optionally try to delete the overridden document.title property (best-effort).
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
        // NOTE: this won't change the const FORCED_TITLE captured above; it will immediately set the new title once.
        safeSetTitle(newTitle);
      }
    }
  });

  // Informational log: remove or comment out if not wanted.
  // console.info("Title enforcement active:", FORCED_TITLE);
})();
