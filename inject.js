const script = document.createElement('script');
script.src = chrome.runtime.getURL('./assets/script.js');
document.head.appendChild(script);