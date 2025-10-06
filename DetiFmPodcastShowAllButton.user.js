// ==UserScript==
// @name         DetiFm Podcast Show All Button
// @namespace    https://github.com/Denis-Alexeev/MyUserScripts
// @version      2.0
// @description  Заменяет "Показать ещё" на "Показать всё" и раскрывает все эпизоды за раз
// @match        https://detifm.ru/fairy_tales/id/*
// @grant        none
// @author       Denis-Alexeev
// @updateURL    https://raw.githubusercontent.com/Denis-Alexeev/MyUserScripts/master/DetiFmPodcastShowAllButton.user.js
// @downloadURL  https://raw.githubusercontent.com/Denis-Alexeev/MyUserScripts/master/DetiFmPodcastShowAllButton.user.js
// @homepageURL  https://github.com/Denis-Alexeev/MyUserScripts
// @supportURL   https://github.com/Denis-Alexeev/MyUserScripts/issues
// @iconURL      https://detifm.ru/favicon.ico
// ==/UserScript==

/*
📄 Описание:
Этот скрипт заменяет кнопку «Показать ещё» на «Показать всё» на сайте detifm.ru.
После нажатия он автоматически раскрывает все эпизоды подкаста, кликая по кнопке до тех пор,
пока не будут загружены все записи.

🔧 Особенности:
- Автоматически меняет текст кнопки.
- Раскрывает все эпизоды одним кликом.
- Работает при навигации без перезагрузки страницы.

🌐 Поддерживаемые страницы:
https://detifm.ru/fairy_tales/id/*

Автор: https://github.com/Denis-Alexeev/
*/

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
                await new Promise(r => setTimeout(r, 300));
                nextBtn = document.querySelector('.podcast-list__listen-more.js-more-button');
            }
        }, { once: true });
    }

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

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => {
                const btn = document.querySelector('.podcast-list__listen-more.js-more-button');
                handleButton(btn);
            }, 500);
        }
    }, 500);

})();
