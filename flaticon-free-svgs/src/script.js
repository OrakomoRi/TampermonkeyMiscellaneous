function init() {
	// download page
	const downloadDivs = document.querySelectorAll('div.download');
	downloadDivs.forEach(div => {
		const parent = div.parentElement;
		if (!parent.querySelector('.ayy')) {
			const btn = document.createElement('button');
			btn.textContent = 'Pirate that shit (needs login)';
			btn.className = 'ayy bj-button fullwidth';
			btn.onclick = getSvg;
			parent.appendChild(btn);
		}
	});

	function getSvg() {
		let iconInput;
	
		if (typeof icon_id === 'number') {
			iconInput = icon_id;
		} else if (typeof icon_id === 'string') {
			const el = document.querySelector(icon_id);
			iconInput = el?.getAttribute('value');
		} else if (icon_id instanceof HTMLElement) {
			iconInput = icon_id.getAttribute('value');
		} else {
			console.error('icon_id has unexpected type:', icon_id);
			return;
		}
	
		fetch(`/editor/icon/svg/${iconInput}?type=${RESOURCE_TYPE}`)
			.then(res => res.json())
			.then(res => {
				const a = document.createElement('a');
				const keyword = document.querySelector('#keyword')?.getAttribute('value') || 'download';
				a.href = res.url;
				a.download = `${keyword}.svg`;
				a.click();
			});
	}
	

	// check if editor button already exists
	if (document.querySelector('.ayy2')) return;

	// editor page
	const editActions = document.querySelector('div.edit-icons-user-actions');
	if (editActions) {
		const pirateBtn = document.createElement('button');
		pirateBtn.textContent = 'Pirate that shit';
		pirateBtn.className = 'ayy2 bj-button mg-left-lv1';
		pirateBtn.onclick = grabSvg;
		editActions.insertAdjacentElement('afterend', pirateBtn);
	}

	function grabSvg() {
		const holder = document.querySelector('.icon-holder');
		if (!holder) return;

		let svg = holder.innerHTML;
		svg = svg.replace(/ \b(width|height)="[^"]*"/g, '');

		const encodedSvg = encodeURIComponent(svg);
		const url = `data:image/svg+xml,${encodedSvg}`;

		const a = document.createElement('a');
		a.href = url;
		a.download = document.querySelector('#keyword')?.getAttribute('value') + '.svg';
		a.click();
	}
}

init();

// observe for page with .download and .ayy missing next to each other
const observer = new MutationObserver(() => {
	const downloadDivs = document.querySelectorAll('div.download');
	downloadDivs.forEach(div => {
		if (!div.parentElement.querySelector('.ayy')) {
			init();
		}
	});
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});