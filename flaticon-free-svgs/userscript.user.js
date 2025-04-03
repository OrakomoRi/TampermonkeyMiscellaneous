// ==UserScript==

// @name			Free SVGs on Flaticon
// @namespace		Flaticon
// @version			1.1.0
// @description		Adds a button to download an icon in SVG for free
// @author			OrakomoRi

// @icon			https://github.com/OrakomoRi/TampermonkeyMiscellaneous/blob/main/flaticon-free-svgs/images/icon.svg?raw=true

// @match			https://*.flaticon.com/*

// @connect			github.com
// @connect			raw.githubusercontent.com

// @run-at			document-start
// @grant			GM_xmlhttpRequest

// ==/UserScript==

GM_xmlhttpRequest({
	method: 'GET',
	url: 'https://github.com/OrakomoRi/TampermonkeyMiscellaneous/blob/main/flaticon-free-svgs/src/script.min.js?raw=true',
	nocache: !0,
	onload: data => {
		eval(data.responseText);
		console.log('Free SVGS: enabled');
	}
});