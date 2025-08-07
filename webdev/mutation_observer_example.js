const observer = new MutationObserver(() => {
    document.querySelectorAll('body *').forEach(el => {
        if (el.children.length === 0) {
            const text = el.textContent.trim();
            if (text === 'expired') {
                el.style.color = 'red';
            } else if (text === 'enabled') {
                el.style.color = 'green';
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});
