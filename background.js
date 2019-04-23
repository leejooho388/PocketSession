// chrome.runtime.onInstalled.addListener(function() {
  
// });

// chrome.runtime.onMessage.addListener(function(message, callback) {
//   if (message == 'hello') {
//     sendResponse({greeting: 'welcome!'})
//   } else if (message == 'goodbye') {
//     chrome.runtime.Port.disconnect();
//   }
  
//   (message.data === 'runLogic') {
//     chrome.tabs.executeScript({file: 'logic.js'});
//   }
// });

chrome.commands.onCommand.addListener(function(command) {
  if(command === "save-session"){
    chrome.storage.sync.set({
      session: []
    }, () => {
      console.log('saved');
    })
  } else if (command === "load-session"){
   chrome.storage.sync.get('session', (session) => {
     console.log('sessions ', session)
   }) 
  }
});