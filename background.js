let markUnload = {};

chrome.commands.onCommand.addListener(function(command) {
  if(command === "save-session"){
    save('quicksave');
  } else if (command === "load-session"){
    chrome.storage.sync.get({closeExisting: false}, (sessionOption) => {
      if(sessionOption.closeExisting){
        chrome.windows.getAll({}, (windows) => {
          for(let i = 0; i < windows.length; i++){
            console.log(windows[i]);
            chrome.windows.remove(windows[i].id);
          }
        });
      }
    })
    load('quicksave');
  }
});

let save = (sessionName) => {
  //Gets all tabs
  chrome.tabs.query({}, (tabs) => {
    let windows = {};

    //Organizes tabs into respective windows as keys
    for(let i = 0; i < tabs.length; i++){
      windows[tabs[i].windowId] = windows[tabs[i].windowId] ? [...windows[tabs[i].windowId], tabs[i].url] : [tabs[i].url]; 
    }

    let sessionWindows = {};
    sessionWindows[sessionName] = windows;

    //saves into storage
    chrome.storage.sync.set(sessionWindows);
  })
}

let load = (sessionName) => {
  let temp = {};
  temp[sessionName] = sessionName;
  //Gets quicksave back
  chrome.storage.sync.get(temp, (session) => {
    //Gets the keys of session.session which is window ids
    let keys = Object.keys(session[sessionName]);
    console.log(session);

    //Loops through to create windows
    for(let i = 0; i < keys.length; i++){
      chrome.windows.create({
        url: session[sessionName][keys[i]],
        focused: false
      }, (window) => {
        //Maximizes window here instead of in create, because the function above doesn't work with state
        chrome.windows.update(window.id, {state: 'maximized'});

        //Marks for unloading so that when they load, the listener can unload them
        for(let j = 1; j < window.tabs.length; j++){
          markUnload[window.tabs[j].id] = true;
        }
      })
    }

  //Helps the tabs to reduce ram usage
  chrome.tabs.onUpdated.addListener(unloadTab)

 });
}

let unloadTab = (tab) => {
  if(markUnload[tab]){
    markUnload[tab] = undefined;
    chrome.tabs.discard(tab, () => {
      //check if there are no more tabs to unload and then removes listener
      if(Object.keys(markUnload).length <= 0){
        chrome.tabs.onUpdated.removeListener(unloadTab);
      }
    })
  }
}