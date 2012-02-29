var googleTabs = {};
var googleRegexp = /^https?:\/\/(www\.)?google\./i;
var settingsRegexp = /^https:\/\/www.google.com\/settings\//i;

chrome.webNavigation.onBeforeNavigate.addListener(function(info) {
  if (googleRegexp.test(info.url)) {
    if(settingsRegexp.test(info.url)) {
      delete googleTabs[info.tabId];
    } else {
      googleTabs[info.tabId] = true;
    }
  } else {
    delete googleTabs[info.tabId];
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(function(info) {
  if (googleTabs[info.tabId] === true) {
    var headers = info.requestHeaders;
    headers.forEach(function(header) {
      if (header.name == 'Cookie') {
        header.value = '';
      }
    });
    return {requestHeaders: headers};
  } else {
    return {};
  }
},
{
  urls: [ "*://*/*" ]
},
["requestHeaders", "blocking"]);
