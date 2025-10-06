// ==UserScript==
// @name         DetiFM Podcast Downloader with Progress
// @namespace    detifm_downloader
// @version      0.4
// @description  Добавляет кнопки для скачивания mp3 с прогрессом и подпапкой автора на detifm.ru
// @match        https://detifm.ru/fairy_tales/id/*
// @grant        GM_download
// @run-at       document-end
// updateURL     https://denis-alexeev.github.io/MyUserScripts/DetiFMPodcastDownloaderWithProgress.user.js
// ==/UserScript==

(function() {
    'use strict';

    function sanitizeFileName(name) {
        return name
            .replace(/[\/\\?%*:|"<>]/g, '-') // запрещённые символы
            .replace(/\u00A0/g, ' ') // неразрывные пробелы
            .trim();
    }

    function addDownloadButtons() {
        document.querySelectorAll('li.podcast_player_wrap:not([data-gm-download-added])').forEach(li => {

            const btn = document.createElement('button');
            btn.textContent = 'Скачать';
            btn.style.cssText = `
                margin-left: 10px;
                padding: 6px 10px;
                background-color: #1976d2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            `;
            btn.style.minWidth = '120px';

            const trackUrl = li.querySelector('[data-track]')?.dataset?.track;
            const title = li.querySelector('.player__title')?.textContent?.trim() || 'podcast';
            const author = li.querySelector('[data-track-author]')?.dataset?.trackAuthor?.trim() || 'unknown_author';

            if (trackUrl) {

                btn.addEventListener('click', () => {
                    btn.disabled = true;
                    console.log(`Начало загрузки: ${title}\n${trackUrl}`);

                    try {
                        GM_download({
                            url: trackUrl,
                            name: `${sanitizeFileName(author)}/${sanitizeFileName(title)}.mp3`,
                            saveAs: true,
                            onprogress: (progress) => {
                                // console.log('onprogress event:', progress);
                                if(progress.total) {
                                    const percent = ((progress.loaded / progress.total) * 100).toFixed(1);
                                    btn.textContent = `${percent}%`;
                                }
                            },
                            onload: () => {
                                console.log(`✅ Загрузка завершена: ${title}`);
                                btn.textContent = 'Скачано';
                                btn.style.backgroundColor = '#388e3c'; // зелёный
                            },
                            onerror: (err) => {
                                console.error(`❌ Ошибка загрузки ${title}:`, err);

                                // Если пользователь отменил загрузку
                                if (err?.error === "Download canceled by the user") {
                                    btn.textContent = 'Скачать';
                                    btn.style.backgroundColor = '#1976d2'; // синяя кнопка
                                    btn.disabled = false;
                                } else {
                                    btn.textContent = 'Ошибка';
                                    btn.style.backgroundColor = '#d32f2f'; // красная
                                    btn.disabled = false;
                                }
                            }
                        });
                    } catch (e) {
                        console.error('GM_download exception:', e);
                        btn.textContent = 'Ошибка';
                        btn.style.backgroundColor = '#d32f2f';
                        btn.disabled = false;
                    }
                });
            } else {
                btn.textContent = 'Без ссылки';
                btn.style.backgroundColor = 'red';
            }

            const container = li.querySelector('.podcast__right') || li;
            container.appendChild(btn);
            li.dataset.gmDownloadAdded = 'true';
        });
    }

    // Добавляем кнопки сразу и при динамической подгрузке
    addDownloadButtons();
    const observer = new MutationObserver(addDownloadButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();
