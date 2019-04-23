// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };


  // "commands": {
  //   "save-session": {
  //     "suggested_key": {
  //       "default": "Ctrl+Shift+Right",
  //       "mac": "Command+Shift+Right"
  //     },
  //     "description": "Flip tabs forward"
  //   },
  //   "load-session": {
  //     "suggested_key": {
  //       "default": "Ctrl+Shift+Left",
  //       "mac": "Command+Shift+Left"
  //     },
  //     "description": "Flip tabs backwards"
  //   }
  // }