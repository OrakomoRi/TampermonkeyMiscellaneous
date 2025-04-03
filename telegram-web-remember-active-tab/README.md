# Remember Active Tab for Telergam Web

A lightweight [Tampermonkey](https://www.tampermonkey.net/) userscript that remembers your active folder tab in [Telegram Web](https://web.telegram.org/k/) and restores it after a page reload.

## :gear: Features

- Remembers the last active tab you clicked on
- Automatically restores that tab after page reload
- Works dynamically with Telegram’s single-page application (SPA) behavior
- Uses `MutationObserver` to attach listeners even when Telegram updates the DOM
- Lightweight and fast, with minimal overhead

## :camera: Preview

When you select a folder like “Work”, “Friends”, or “Saved Messages”, the script will remember that choice. Upon refreshing or revisiting Telegram Web, the same folder will be automatically reactivated.

## :bulb: Getting Started

1. Make sure you have [Tampermonkey](https://www.tampermonkey.net/) installed in your browser.
2. [Click here to install the script](https://github.com/OrakomoRi/TampermonkeyMiscellaneous/raw/refs/heads/main/telegram-web-remember-active-tab/userscript.user.js)
3. Reload [Telegram Web](https://web.telegram.org/k/) and select any folder tab. The script takes care of the rest!
