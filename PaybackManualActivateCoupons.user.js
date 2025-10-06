// ==UserScript==
// @name         Payback Manual Activate Coupons
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Кнопка на странице для ручной активации всех купонов
// @match        https://www.payback.de/coupons*
// @grant        none
// @run-at       document-end
// @updateURL    https://denis-alexeev.github.io/MyUserScripts/PaybackManualActivateCoupons.user.js
// @downloadURL  https://denis-alexeev.github.io/MyUserScripts/PaybackManualActivateCoupons.user.js
// @source       https://denis-alexeev.github.io/MyUserScripts/
// ==/UserScript==

/*
🎟️ Описание:
Скрипт добавляет на сайт [payback.de](https://www.payback.de/coupons) кнопку  
**«▶ Активировать купоны»**, при нажатии на которую автоматически кликаются все доступные купоны.  
Это позволяет **активировать все предложения вручную за один раз**, не переходя по каждому купону.

💡 Основные возможности:
- Добавляет плавающую кнопку в правом нижнем углу страницы.
- При нажатии на неё проходит по всем элементам `pbc-coupon` внутри Shadow DOM и активирует их.
- После выполнения показывает уведомление о количестве успешно активированных купонов.
- Работает полностью локально, без дополнительных разрешений или внешних запросов.

⚙️ Технические детали:
- Использует обход Shadow DOM для доступа к кнопкам активации.
- Автоматически отображает всплывающее уведомление с результатом.
- Никакие данные не отправляются на внешние серверы.

🧩 Поддерживаемые страницы:
`https://www.payback.de/coupons*`

📦 Требования:
- Расширение [Tampermonkey](https://tampermonkey.net/)
- Не требует `@grant` — работает с обычными DOM-элементами

Автор: Denis-Alexeev
*/


(function() {
    'use strict';

    function activateCoupons() {
        const host = document.getElementById('coupon-center');
        if (!host || !host.shadowRoot) {
            showMessage('❌ Не найден coupon-center или у него нет shadowRoot');
            return;
        }

        const coupons = host.shadowRoot.querySelectorAll('pbc-coupon');
        console.log(`Найдено купонов: ${coupons.length}`);
        let clicked = 0;

        coupons.forEach((coupon, i) => {
            if (!coupon.shadowRoot) return;

            const action = coupon.shadowRoot.querySelector('pbc-coupon-call-to-action');
            if (!action || !action.shadowRoot) return;

            const btn = action.shadowRoot.querySelector('button.not-activated');
            if (btn) {
                btn.click();
                clicked++;
                console.log(`✅ Активирован купон #${i+1}`);
            }
        });

        showMessage(`Готово! Активировано ${clicked}/${coupons.length} купонов.`);
    }

    function showMessage(text) {
        const msg = document.createElement('div');
        msg.textContent = text;
        Object.assign(msg.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            background: '#4caf50',
            color: 'white',
            fontSize: '16px',
            borderRadius: '8px',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
    }

    function addControlButton() {
        const btn = document.createElement('button');
        btn.textContent = '▶ Активировать купоны';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 15px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });
        btn.addEventListener('click', activateCoupons);
        document.body.appendChild(btn);
    }

    addControlButton();
})();
