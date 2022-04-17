document.addEventListener('mouseup', function (e) {
    var text = window.getSelection().toString().trim();
    var amount = get_amount(text);
    var currency = get_currency(text);
    if (amount && currency) {
        chrome.runtime.sendMessage(
            null,
            {
                type: "getConvertedCurrency",
                amount: amount,
                currency: currency
            },
            function (newAmount) {e.srcElement.innerHTML =
                e.srcElement.innerHTML.replace(text, newAmount)}
        );
    }
}
);

function get_amount(text) {
    return text.replace('$', '').replace('€', '').replace('£', '').replace('₪', '');
}

function get_currency(text)
{
    currency = "";
    if (text.indexOf('$') >= 0) {
        currency = "USD"
    }
    else if (text.indexOf('€') >= 0) {
        currency = "EUR"
    }
    else if (text.indexOf('£') >= 0) {
        currency = "GBP"
    }
    else if (text.indexOf('₪') >= 0) {
        currency = "ILS"
    }

    return currency
}


document.addEventListener('keypress', function (e) {
    chrome.runtime.sendMessage(
        null,
        {
            type: "keyup",
            key: String.fromCharCode(event.which)
        }
    );
}
);




