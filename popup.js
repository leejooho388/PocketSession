//used to prevent usage of id named elements
const important = ['listSessions', 'inputText', 'newSession', 'quicksave'];

//Used to filter out when appending
const options = ['quicksave', 'closeExisting'];

//Used to keep track of important elements and named sesssions
let blockInputs = [...important];

//Used to unload tabs when loading multiple tabs
let markUnload = {};

chrome.storage.sync.get(undefined, (output) => {
  let keys = Object.keys(output);
  for(let i = 0; i < keys.length; i++){
    if(!options.includes(keys[i])){
      appendSession(keys[i]);
    }
  }
})

document.addEventListener('click', (e) => {
  if(e.target.tagName === "BUTTON"){
    switch (e.target.innerHTML){
      case 'Save':
        save(e.target.className);
        break;

      case 'Load':
        load(e.target.className);
        break;

      case 'Delete':
        deleteSession(e.target.className);
        break;

      case 'Create':
        let inputText = document.getElementById('inputText').value;

        //blocks inputs that are already used as ids
        if(blockInputs.includes(inputText)){
          var status = document.getElementById('inputResponse');
          status.textContent = 'That title is a reserved word. Please try something else.';
          setTimeout(function() {
            status.textContent = '';
          }, 3000);
        } else {
          save(inputText);
          appendSession(inputText);
        }
        break;

      default:
    }
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

    var status = document.getElementById('inputResponse');
    status.textContent = 'Saved!';
    setTimeout(function() {
      status.textContent = '';
    }, 3000);
  })
}

let deleteSession = (sessionName) => {
  //deletes from storage
  chrome.storage.sync.remove(sessionName);
  removeSession(sessionName);
}

let load = (sessionName) => {
  let temp = {};
  temp[sessionName] = sessionName;
  //Gets quicksave back
  chrome.storage.sync.get(temp, (session) => {
    //Gets the keys of session.session which is window ids
    let keys = Object.keys(session[sessionName]);

    //Loops through to create windows
    for(let i = 0; i < keys.length; i++){
      if(typeof session[sessionName][keys[i]] !== 'string'){
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

let appendSession = (inputText) => {
  let newSession = document.createElement("DIV");
  newSession.id = inputText;
  newSession.className = "session";

  let title = document.createElement("h3");
  title.innerText = inputText;
  newSession.appendChild(title);

  let save = document.createElement("BUTTON");
  save.className = inputText;
  save.innerText = "Save";
  newSession.appendChild(save);

  let load = document.createElement("BUTTON");
  load.className = inputText;
  load.innerText = "Load";
  newSession.appendChild(load);

  let deleteSession = document.createElement("BUTTON");
  deleteSession.className = inputText;
  deleteSession.innerText = "Delete";
  newSession.appendChild(deleteSession);

  document.getElementById('listSessions').appendChild(newSession);
  blockInputs.push(inputText);
}

let removeSession = (inputText) => {
  if(!important.includes(inputText)){
    document.getElementById("listSessions").removeChild(
      document.getElementById(inputText)
    )
    
    blockInputs.splice(blockInputs.findIndex( (ele) => {
      return inputText === ele;
    }), 1)
  }
}