// Saves options to chrome.storage
function save_options() {
  var incognito = document.getElementById('incognito').value;
  var closeExisting = document.getElementById('closeExisting').checked;
  chrome.storage.sync.set({
    incognito,
    closeExisting
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    incognito: 'saved.on',
    closeExisting: 'saved.on'
  }, function(items) {
    document.getElementById('incognito').checked = items.incognito;
    document.getElementById('closeExisting').checked = items.closeExisting;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);