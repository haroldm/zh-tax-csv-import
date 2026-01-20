import { enterTransactions, Transaction } from "./import_transaction.js";

const startImport = (is_wv, ticker) => {
    let input = document.createElement("input");
    input.type = "file";
    input.setAttribute("multiple", false);
    input.setAttribute("accept", ".csv");
    input.onchange = function () {
        const file = input.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = (e) => {
            performImport(e.target.result, is_wv, ticker);
        };
        reader.readAsText(file, "UTF-8");
    };
    input.click();
};

const performImport = (inputFileContent, is_wv, ticker) => {
    // get ID from current url.
    // Structure is https://zhp.services.zh.ch/app/ZHprivateTax2024/#/${TAXID}/dialogs/securities/securities-detail
    const taxId = document.location.hash.split('/')[1];
    if (!taxId) {
        return;
    }
    const entries = inputFileContent.split('\n').map(line => line.split(',').map(v => v.replaceAll('"', '')))
    const matchingEntries = entries.filter(e => e[2] == ticker && (e[1] == "Deposit" || e[1] == "Sale"));
    const transactions = matchingEntries.map(entry => {
        let date = entry[0]; // is in format MM/DD/YYYY and needs to be 'DD.MM.YYYY'
        const dateParts = date.split('/');
        date = `${dateParts[1]}.${dateParts[0]}.${dateParts[2]}`

        let amount = entry[4];
        if (entry[1] == "Sale") {
            amount *= -1;
        }

        return new Transaction(amount, date);
    });
    enterTransactions(taxId, transactions, is_wv);
}

export {startImport};
