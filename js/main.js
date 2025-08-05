// ===================================================================================
//
//  SECTION: INITIALIZATION & MAIN CONTROL
//
// ===================================================================================

function loadLanguageAndInit(lang, isInitialLoad) {
    const oldScript = document.getElementById('lang-script');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'lang-script';
    script.src = `js/translations/${lang}.js`;
    script.onload = () => {
        console.log(`Language file ${lang}.js loaded successfully.`);
        if (isInitialLoad) {
            const loadedState = loadGame();
            if (loadedState && loadedState.lastSaveTimestamp) {
                const offlineSeconds = (Date.now() - loadedState.lastSaveTimestamp) / 1000;
                processOfflineProgress(offlineSeconds);
            }
            recalculateAllStats();
            createAllDynamicElements();
            updateDisplay();
            showView('gathering');
            
            dom.resetButton.addEventListener('click', resetGame);
            dom.exportSaveButton.addEventListener('click', exportSave);
            dom.importSaveButton.addEventListener('click', importSave);
            dom.copySaveButton.addEventListener('click', () => {
                dom.exportTextarea.select();
                try { 
                    document.execCommand('copy'); 
                    queueMessage(_t('messages.copied'), 'success'); 
                }
                catch (err) { 
                    console.error('Failed to copy text: ', err);
                    queueMessage(_t('messages.copyFailed'), 'error');
                }
            });
            dom.saveToFileButton.addEventListener('click', saveToFile);

            dom.infoSettlerProgressContainer.addEventListener('mouseover', showSettlerTooltip);
            dom.infoSettlerProgressContainer.addEventListener('mouseout', hideTooltip);
            dom.infoSettlerProgressContainer.addEventListener('mousemove', (e) => {
                dom.tooltip.style.left = `${e.pageX + 15}px`;
                dom.tooltip.style.top = `${e.pageY + 15}px`;
            });
            
            if (!localStorage.getItem(SAVE_KEY)) {
                showModal('welcome-modal');
            }
            
            lastTick = Date.now();
            requestAnimationFrame(gameLoop);
            setInterval(updateDisplay, 250);
            setInterval(saveGame, 5000);

            document.addEventListener("visibilitychange", handleVisibilityChange);
        } else {
            createAllDynamicElements();
            updateDisplay();
        }
    };
    script.onerror = () => {
        console.error(`Failed to load language file: ${lang}.js. UI text will be broken.`);
        translations = {};
        if (isInitialLoad) {
            script.onload();
        }
    };
    document.head.appendChild(script);
}

function changeLanguage(lang) {
    if (currentLang === lang) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    loadLanguageAndInit(lang, false);
}

window.onload = function() {
    initializeDOM();
    loadLanguageAndInit('en', true);
};