function save_options() {
    var ibkr = document.getElementById('ibkr').checked;
    var cs = document.getElementById('cs').checked;
    var morganStanleyAtWork = document.getElementById('morganStanleyAtWork').checked;
    chrome.storage.sync.set({
        ibkr: ibkr,
        cs: cs,
        morganStanleyAtWork: morganStanleyAtWork,
    });
}
document.getElementById('ibkr').addEventListener('click', save_options);
document.getElementById('cs').addEventListener('click', save_options);
document.getElementById('morganStanleyAtWork').addEventListener('click', save_options);

function restore_options() {
    chrome.storage.sync.get({
        ibkr: true,
        cs: true,
		morganStanleyAtWork: true,
    }, function (items) {
        document.getElementById('ibkr').checked = items.ibkr;
        document.getElementById('cs').checked = items.cs;
        document.getElementById('morganStanleyAtWork').checked = items.morganStanleyAtWork;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
