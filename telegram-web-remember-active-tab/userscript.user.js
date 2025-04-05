// ==UserScript==

// @name			Remember Active Tab
// @namespace		TelegramWeb
// @version			1.1.1
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

	// Arrays to hold references to tab buttons and corresponding content containers
	let tabButtons = [];

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

		// Get all tab buttons
		tabButtons = Array.from(tabsContainer.querySelectorAll(':scope > div'));

		if (!tabButtons.length) {
			console.warn('No child div elements found inside #folders-tabs.');
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

		// Restore the previously active tab
		restoreActiveTab();
	}

	// Wait for tabs to be fully loaded and stable before initializing
	function waitForStableTabs(callback) {
		let lastCount = 0;
		let stableTicks = 0;
		const maxStableTicks = 2;
		const interval = setInterval(() => {
			const currentTabs = document.querySelectorAll('#folders-tabs > div');
			if (currentTabs.length === lastCount) {
				stableTicks++;
			} else {
				stableTicks = 0;
				lastCount = currentTabs.length;
			}

			// When the number of tabs remains the same for N checks, initialize
			if (stableTicks >= maxStableTicks) {
				clearInterval(interval);
				callback();
			}
		}, 5); // Check every 5ms
	}

	// Restore previously saved active tab index and simulate click on it
	function restoreActiveTab() {
		let savedIndex = GM_getValue(ACTIVE_TAB_INDEX_KEY, 0);
		if (savedIndex >= tabButtons.length) savedIndex = 0;
		activateTab(savedIndex);
	}

	// Add active class to tab and content divs and simulate click on Telegram tab
	function activateTab(index) {
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
		return tabButtons.findIndex(btn => btn.classList.contains('active')) || 0;
	}

	// Observe DOM changes to catch dynamically added tabs and content
	const observer = new MutationObserver(() => {
		const tabsReady = document.querySelector('#folders-tabs > div');
		const containersReady = document.querySelector('#folders-container > div');
		if (tabsReady && containersReady) {
			observer.disconnect(); // Stop observing once elements are found
			waitForStableTabs(initScript);
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });

	// Save tab index before leaving page
	window.addEventListener('beforeunload', storeActiveTab);
})();