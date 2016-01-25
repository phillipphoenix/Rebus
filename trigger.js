var tabs;

chrome.browserAction.onClicked.addListener(function(tab) {
  // Insert styles.
  chrome.tabs.insertCSS(null, {file: "external/css/bootstrap.min.css"});
  chrome.tabs.insertCSS(null, {file: "external/css/font-awesome.min.css"});
  chrome.tabs.insertCSS(null, {file: "rebus.css"});

  // Execute scripts.
  chrome.tabs.executeScript(null, {file: "external/js/jquery.min.js"});
  chrome.tabs.executeScript(null, {file: "external/js/bootstrap.min.js"});
  chrome.tabs.executeScript(null, {file: "external/js/waitForImages.min.js"});
  chrome.tabs.executeScript(null, {file: "external/js/jquery.base64.js"});
  chrome.tabs.executeScript(null, {file: "external/js/jquery.bingSearch.js"});
  chrome.tabs.executeScript(null, {file: "external/js/getImageUrl.js"});

  // Execute rebus script.
  chrome.tabs.executeScript(null, {file: "rebus.js"});
});
