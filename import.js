

const start = (ibkr, cs, morganStanleyAtWork) => {
	// find the buy/sell table
	const wv_table = document.querySelector('zhp-securities-detail-buy-sell-table');
	const da1_table = document.querySelector('zhp-da1-detail-buy-sell-table');
	if (!wv_table && !da1_table) {
		console.log('not on the right page, it seems: table missing. Import only works in the Wertschriftenverzeichnis or DA-1.');
		return;
	}
	const is_wv = !!wv_table;
	const table = is_wv ? wv_table : da1_table;
	// if the table already contains a import-progress span, then the stuff was already added
	if (table.querySelector('span#import-progress')) {
		return;
	}

	const addRowButton = table.querySelector('button.add-new-row-button');
	if (!addRowButton) {
		return;
	}

	const addInput = document.querySelector('input.atm-form_input__input');
	if (!addInput) {
		console.log('CS import: styled input not found');
		return;
	}

	// add a span to indicate progress
	const progressSpan = document.createElement('span');
	progressSpan.id = 'import-progress';
	addRowButton.insertAdjacentElement('afterend', progressSpan);
	chrome.storage.sync.get({
		ibkr: true,
		cs: true,
		morganStanleyAtWork: true,
	}, function (items) {
		// add a button next to this addRowButton for importing CSV
		if (items.ibkr) {
			const importButton = addRowButton.cloneNode(true);
			importButton.querySelector('span').textContent = 'IBKR import';
			importButton.onclick = () => ibkr.startImport(is_wv);
			addRowButton.insertAdjacentElement('afterend', importButton);
		}
		if (items.cs) {
			const container = document.createElement('span');
			container.style.display = 'inline-flex';
			container.style.gap = '6px';

			const importButton = addRowButton.cloneNode(true);
			importButton.querySelector('span').textContent = 'CS import';

			const tickerInput = addInput.cloneNode(true);
			tickerInput.removeAttribute('readonly');
			tickerInput.removeAttribute('disabled');
			tickerInput.value = '';
			tickerInput.placeholder = 'Ticker';
			tickerInput.style.width = '200px';
			tickerInput.style.height = '0px';

			const errorMsg = document.createElement('span');
			errorMsg.style.color = 'red';
			errorMsg.style.fontSize = '0.9em';
			errorMsg.style.marginLeft = '4px';

			importButton.onclick = () => {
				const ticker = tickerInput.value.trim();
				if (!ticker) {
					errorMsg.textContent = 'Ticker is required for CS import';
					return;
				}
				errorMsg.textContent = '';
				cs.startImport(is_wv, ticker);
			};

			tickerInput.style.order = 0;
			importButton.style.order = 1;
			errorMsg.style.order = 2;

			container.appendChild(importButton);
			container.appendChild(tickerInput);
			container.appendChild(errorMsg);

			addRowButton.insertAdjacentElement('afterend', container);
		}
		if (items.morganStanleyAtWork) {
			const importButton = addRowButton.cloneNode(true);
			importButton.querySelector('span').textContent = 'Morgan Stanley At Work import';
			importButton.onclick = () => morganStanleyAtWork.startImport(is_wv);
			addRowButton.insertAdjacentElement('afterend', importButton);
		}
	});

}

const importAndStart = async () => {
	const ibkr_src = chrome.runtime.getURL("import_ibkr.js");
	const ibkr = await import(ibkr_src);
	const cs_src = chrome.runtime.getURL("import_cs.js");
	const cs = await import(cs_src);
	const morganStanleyAtWork_src = chrome.runtime.getURL("import_morganStanleyAtWork.js");
	const morganStanleyAtWork = await import(morganStanleyAtWork_src);
	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(() => start(ibkr, cs, morganStanleyAtWork));

	// Start observing the target node for configured mutations
	observer.observe(document.body, { childList: true, subtree: true });
}

importAndStart();
