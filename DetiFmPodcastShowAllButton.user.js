// ==UserScript==
// @name         DetiFm Podcast Show All Button (Stable SPA Version)
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Надёжно заменяет "Показать ещё" на "Показать всё" и раскрывает все эпизоды, работает с SPA-навигацией
// @match        https://detifm.ru/*
// @grant        none
// @author       Denis-Alexeev
// @updateURL    https://raw.githubusercontent.com/Denis-Alexeev/MyUserScripts/master/DetiFmPodcastShowAllButton.user.js
// @downloadURL  https://raw.githubusercontent.com/Denis-Alexeev/MyUserScripts/master/DetiFmPodcastShowAllButton.user.js
// @homepageURL  https://github.com/Denis-Alexeev/MyUserScripts
// @supportURL   https://github.com/Denis-Alexeev/MyUserScripts/issues
// @iconURL      https://detifm.ru/favicon.ico
// ==/UserScript==

console.log("START");

(function() {
    'use strict';

    function handleButton(btn) {
        if (!btn || btn.dataset.listenerAlreadyAdded) return;
        btn.dataset.listenerAlreadyAdded = 'true';

        btn.textContent = 'Показать всё';

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            let nextBtn = document.querySelector('.podcast-list__listen-more.js-more-button');
            while (nextBtn && !nextBtn.classList.contains('hidden')) {
                nextBtn.click();
                //await new Promise(r => setTimeout(r, 300));
                nextBtn = document.querySelector('.podcast-list__listen-more.js-more-button');
            }
        }, { once: true });
    };

    const btn = document.querySelector('.podcast-list__listen-more.js-more-button');
    handleButton(btn);

    // MutationObserver для отслеживания появления кнопки в DOM
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return; // Только элементы
                if (node.matches('.podcast-list__listen-more.js-more-button')) {
                    handleButton(node);
                } else {
                    const btn = node.querySelector('.podcast-list__listen-more.js-more-button');
                    if (btn) handleButton(btn);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });



})();
