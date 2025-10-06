// ==UserScript==
// @name         DetiFm Podcast Show All Button
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Заменяет "Показать ещё" на "Показать всё" и раскрывает все эпизоды за раз
// @match        https://detifm.ru/fairy_tales/id/*
// @grant        none
// @author       Denis-Alexeev
// @source       https://denis-alexeev.github.io/MyUserScripts/DetiFmPodcastShowAllButton.user.js
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

    function init() {
        const moreBtn = document.querySelector('.podcast-list__listen-more.js-more-button');
        if (!moreBtn) {
            setTimeout(init, 300);
            return;
        }

        if (moreBtn.dataset.listenerAlreadyAdded) return;
        moreBtn.dataset.listenerAlreadyAdded = 'true';

        moreBtn.textContent = 'Показать всё';

        moreBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            let btn = document.querySelector('.podcast-list__listen-more.js-more-button');
            while (btn && !btn.classList.contains('hidden')) {
                btn.click(); // вызывать родной обработчик
                await new Promise(r => setTimeout(r, 300)); // подождать подгрузку
                btn = document.querySelector('.podcast-list__listen-more.js-more-button');
            }
        }, { once: true });
    }

    init();


    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 800);
        }
    }, 1000);
})();
