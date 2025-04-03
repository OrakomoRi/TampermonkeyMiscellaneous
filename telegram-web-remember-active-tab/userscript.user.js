// ==UserScript==

// @name			Remember Active Tab
// @namespace		TelegramWeb
// @version			1.1.0
// @description		Saves the active tab index and restores it on page reload
// @author			OrakomoRi

// @icon			https://github.com/OrakomoRi/TampermonkeyMiscellaneous/blob/main/telegram-web-remember-active-tab/images/icon.svg?raw=true

// @match			https://web.telegram.org/k/*

// @run-at			document-start

// @grant			GM_getValue
// @grant			GM_setValue

// ==/UserScript==

(function () {
	'use strict';

	// Key used to store the active tab index in Tampermonkey storage
	const ACTIVE_TAB_INDEX_KEY = 'activeTabIndex';

	// Used to detect when tab loading is stable (no new tabs appearing)
	let lastTabCount = 0;
	let stableCounter = 0;
	let hasRestored = false;

	// Arrays to hold references to tab buttons and corresponding content containers
	let tabButtons = [];
	let containerDivs = [];

	// Main logic to find tabs and apply click handlers
	function initScript() {
		// Find containers holding the tab buttons and chat containers
		const tabsContainer = document.querySelector('#folders-tabs');
		const contentContainer = document.querySelector('#folders-container');

		// Abort if required elements are missing
		if (!tabsContainer || !contentContainer) {
			console.warn('Required elements #folders-tabs or #folders-container were not found. The script will not run.');
			return;
		}

		// Select all tab buttons (divs) and content areas (divs)
		tabButtons = Array.from(tabsContainer.querySelectorAll(':scope > div'));
		containerDivs = Array.from(contentContainer.querySelectorAll(':scope > div'));

		if (!tabButtons.length || !containerDivs.length) {
			console.warn('No child div elements found inside #folders-tabs or #folders-container.');
			return;
		}

		// Add click listeners only to new tab buttons
		tabButtons.forEach((button, index) => {
			if (!button.dataset.listenerAttached) {
				button.addEventListener('click', () => {
					activateTab(index);
					GM_setValue(ACTIVE_TAB_INDEX_KEY, index);
				});
				button.dataset.listenerAttached = 'true';
			}
		});

		// Check for stability of tab list to restore only once
		if (!hasRestored) {
			if (tabButtons.length === lastTabCount) {
				stableCounter++;
			} else {
				stableCounter = 0;
				lastTabCount = tabButtons.length;
			}

			// When tab count is stable over 3 checks, restore saved tab
			if (stableCounter >= 3) {
				restoreActiveTab();
				hasRestored = true;
			}
		}
	}

	// Restore previously saved active tab index and simulate click on it
	function restoreActiveTab() {
		let savedIndex = GM_getValue(ACTIVE_TAB_INDEX_KEY, 0);

		// Ensure index is valid
		if (savedIndex >= tabButtons.length) {
			savedIndex = 0;
		}

		activateTab(savedIndex);
	}

	// Add active class to tab and content divs and simulate click on Telegram tab
	function activateTab(index) {
		for (const [i, button] of tabButtons.entries()) {
			button.classList.toggle('active', i === index);
		}

		for (const [i, div] of containerDivs.entries()) {
			div.classList.toggle('active', i === index);
		}

		// Important: simulate real Telegram tab click
		if (tabButtons[index]) {
			tabButtons[index].click();
			console.log(`Activated and clicked tab: ${index}`);
		}
	}

	// Save currently active tab index before page unload
	function storeActiveTab() {
		GM_setValue(ACTIVE_TAB_INDEX_KEY, getActiveTabIndex());
	}

	// Returns index of the currently active tab
	function getActiveTabIndex() {
		for (let i = 0; i < tabButtons.length; i++) {
			if (tabButtons[i].classList.contains('active')) {
				return i;
			}
		}
		return 0;
	}

	// Observe DOM changes to catch dynamically added tabs and content
	const observer = new MutationObserver(() => {
		const tabsReady = document.querySelector('#folders-tabs > div');
		const containersReady = document.querySelector('#folders-container > div');
		if (tabsReady && containersReady) {
			initScript();
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });

	// Save tab index before leaving page
	window.addEventListener('beforeunload', storeActiveTab);
})();