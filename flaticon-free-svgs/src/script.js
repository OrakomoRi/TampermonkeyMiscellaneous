(function () {
	function init() {
		addDownloadButtons();
		addEditorButton();
	}

	function addDownloadButtons() {
		document.querySelectorAll('div.download').forEach(div => {
			const parent = div.parentElement;
			if (!parent.querySelector('.ayy')) {
				const btn = createButton('Pirate that shit (needs login)', 'ayy bj-button fullwidth', downloadSvgFromDetails);
				parent.appendChild(btn);
			}
		});
	}

	function addEditorButton() {
		if (document.querySelector('.ayy2')) return;
		const editActions = document.querySelector('div.edit-icons-user-actions');
		if (editActions) {
			const btn = createButton('Pirate that shit', 'ayy2 bj-button mg-left-lv1', downloadSvgFromEditor);
			editActions.insertAdjacentElement('afterend', btn);
		}
	}

	function createButton(text, className, onClick) {
		const btn = document.createElement('button');
		btn.textContent = text;
		btn.className = className;
		btn.onclick = onClick;
		return btn;
	}

	function triggerDownload(url, name = 'download.svg') {
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		a.click();
	}

	function getIconNameFallback() {
		return document.querySelector('#keyword')?.getAttribute('value') || 'download';
	}

	function downloadSvgFromEditor() {
		const holder = document.querySelector('.icon-holder');
		if (!holder) return;

		const svg = holder.innerHTML.replace(/\b(width|height)="[^"]*"/g, '');
		const url = `data:image/svg+xml,${encodeURIComponent(svg)}`;
		triggerDownload(url, getIconNameFallback() + '.svg');
	}

	function downloadSvgFromDetails() {
		const detailSection = document.querySelector('[data-id][data-elementid], section[data-id][data-icon_type], section[data-elementid][data-icon_type]');
		if (!detailSection) return;

		const iconId = detailSection.getAttribute('data-id') || detailSection.getAttribute('data-elementid');
		if (!iconId) return;

		fetch(`/editor/icon/svg/${iconId}`)
			.then(res => res.json())
			.then(res => {
				triggerDownload(res.url, getIconNameFallback() + '.svg');
			})
			.catch(console.error);
	}

	function downloadSvgFromPopover(popover) {
		const holder = popover.closest('.icon--holder') || popover.closest('section[data-id]');
		if (!holder) return;

		let iconId = null;
		let keyword = 'download';

		const link = holder.querySelector('a.view.link-icon-detail');
		if (link?.dataset.id) {
			iconId = link.dataset.id;
			keyword = link.getAttribute('title') || keyword;
		} else {
			iconId = holder.getAttribute('data-id');
			keyword = holder.getAttribute('data-keyword_id') || keyword;
		}

		if (!iconId) return;

		fetch(`/editor/icon/svg/${iconId}`)
			.then(res => res.json())
			.then(res => {
				triggerDownload(res.url, keyword + '.svg');
			})
			.catch(console.error);
	}

	function addPopoverButton(el) {
		if (!el.classList.contains('show-menu')) return;

		const ul = el.querySelector('ul');
		if (!ul || ul.querySelector('.ayy3')) return;

		const li = document.createElement('li');
		const btn = createButton('Pirate', 'ayy3 bj-button mg-top-lv2', () => {
			const insideEditor = el.closest('section.detail, .detail_editor, .icon-editor');
			if (insideEditor) {
				downloadSvgFromEditor();
			} else {
				downloadSvgFromPopover(el);
			}
		});
		li.appendChild(btn);
		ul.appendChild(li);
	}

	const observer = new MutationObserver(mutations => {
		addDownloadButtons();
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node instanceof HTMLElement && node.matches('.popover-content.show-menu')) {
					addPopoverButton(node);
				}
			});

			if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
				const el = mutation.target;
				if (el.classList.contains('popover-content') && el.classList.contains('show-menu')) {
					addPopoverButton(el);
				}
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['class']
	});

	init();
})();