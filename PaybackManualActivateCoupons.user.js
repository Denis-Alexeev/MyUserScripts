// ==UserScript==
// @name            Payback Manual Activate Coupons
// @version         1.5
// @description:ru  Кнопка на странице для ручной активации всех купонов
// @description:de  Schaltfläche auf der Seite zur manuellen Aktivierung aller Gutscheine
// @description:en  Button on the page for manually activating all coupons
// @match           https://www.payback.de/coupons*
// @grant           none
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/Denis-Alexeev/MyUserScripts/master/PaybackManualActivateCoupons.user.js
// @downloadURL     https://raw.githubusercontent.com/Denis-Alexeev/MyUserScripts/master/PaybackManualActivateCoupons.user.js
// @homepageURL     https://github.com/Denis-Alexeev/MyUserScripts
// @supportURL      https://github.com/Denis-Alexeev/MyUserScripts/issues
// @iconURL         https://www.payback.de/resource/blob/4506/b8323ff55b34054722769ae5652c22ae/main-favicon.ico
// ==/UserScript==

/*
EN
🎟️ Description:
This script adds a button to the site [payback.de](https://www.payback.de/coupons)  
**"▶ Activate Coupons"**, which, when clicked, automatically clicks all available coupons.  
This allows you to **manually activate all offers at once** without visiting each coupon.

💡 Main features:
- Adds a floating button in the bottom-right corner of the page.
- When clicked, it goes through all `pbc-coupon` elements inside the Shadow DOM and activates them.
- After execution, shows a notification with the number of successfully activated coupons.
- Works entirely locally, without additional permissions or external requests.

⚙️ Technical details:
- Uses Shadow DOM traversal to access activation buttons.
- Automatically displays a popup notification with the result.
- No data is sent to external servers.

🧩 Supported pages:
`https://www.payback.de/coupons*`

📦 Requirements:
- [Tampermonkey](https://tampermonkey.net/) extension
- No `@grant` needed — works with regular DOM elements

Author: Denis-Alexeev
*/

/*
DE
🎟️ Beschreibung:
Dieses Skript fügt der Seite [payback.de](https://www.payback.de/coupons)  
eine Schaltfläche **"▶ Gutscheine aktivieren"** hinzu, die beim Klicken automatisch alle verfügbaren Gutscheine aktiviert.  
Damit können **alle Angebote auf einmal manuell aktiviert werden**, ohne jeden Gutschein einzeln anzuklicken.

💡 Hauptfunktionen:
- Fügt eine schwebende Schaltfläche in der unteren rechten Ecke der Seite hinzu.
- Beim Klicken werden alle `pbc-coupon`-Elemente innerhalb des Shadow DOM durchlaufen und aktiviert.
- Nach der Ausführung wird eine Benachrichtigung mit der Anzahl erfolgreich aktivierter Gutscheine angezeigt.
- Arbeitet vollständig lokal, ohne zusätzliche Berechtigungen oder externe Anfragen.

⚙️ Technische Details:
- Nutzt die Traversierung des Shadow DOM, um auf die Aktivierungsschaltflächen zuzugreifen.
- Zeigt automatisch eine Popup-Benachrichtigung mit dem Ergebnis an.
- Es werden keine Daten an externe Server gesendet.

🧩 Unterstützte Seiten:
`https://www.payback.de/coupons*`

📦 Voraussetzungen:
- [Tampermonkey](https://tampermonkey.net/) Erweiterung
- Kein `@grant` erforderlich — funktioniert mit normalen DOM-Elementen

Autor: Denis-Alexeev
*/


/*
RU
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
