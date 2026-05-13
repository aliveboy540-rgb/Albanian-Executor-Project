const scripts = [
  { id: 1, title: 'Auto Farm', description: 'Simple auto-farm script for testing and learning.' },
  { id: 2, title: 'ESP Overlay', description: 'Clean ESP overlay mock script for discovery.' },
  { id: 3, title: 'Speed Boost', description: 'Speed boost script placeholder with simulated execution.' },
  { id: 4, title: 'Server Hop', description: 'Mock server hop script with join actions.' },
  { id: 5, title: 'Anti-AFK', description: 'Anti-AFK script example to prevent idle kick.' },
];

const scriptList = document.getElementById('scriptList');
const searchInput = document.getElementById('scriptSearch');
const statusLog = document.getElementById('statusLog');
const manualScript = document.getElementById('manualScript');
const executeManual = document.getElementById('executeManual');
const clearManual = document.getElementById('clearManual');
const saveScriptName = document.getElementById('saveScriptName');
const saveScriptContent = document.getElementById('saveScriptContent');
const saveScriptButton = document.getElementById('saveScriptButton');
const savedScripts = document.getElementById('savedScripts');
const appIcon = document.getElementById('appIcon');
const iconColor = document.getElementById('iconColor');
const iconSize = document.getElementById('iconSize');
const iconSizeValue = document.getElementById('iconSizeValue');
const rejoinServer = document.getElementById('rejoinServer');
const joinAnotherServer = document.getElementById('joinAnotherServer');
const joinLowPlayerServer = document.getElementById('joinLowPlayerServer');
const injectCurrentGame = document.getElementById('injectCurrentGame');

function logStatus(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'error' ? '[ERROR]' : type === 'success' ? '[OK]' : '[INFO]';
  statusLog.textContent += `\n${timestamp} ${prefix} ${message}`;
  statusLog.scrollTop = statusLog.scrollHeight;
}

function renderScriptList(filter = '') {
  scriptList.innerHTML = '';
  const search = filter.trim().toLowerCase();
  const filtered = scripts.filter(script => script.title.toLowerCase().includes(search) || script.description.toLowerCase().includes(search));

  if (filtered.length === 0) {
    scriptList.innerHTML = '<div class="script-card"><p>No scripts match your search.</p></div>';
    return;
  }

  filtered.forEach(script => {
    const card = document.createElement('div');
    card.className = 'script-card';
    card.innerHTML = `
      <h3>${script.title}</h3>
      <p>${script.description}</p>
      <div class="card-actions">
        <button class="secondary" data-action="save" data-id="${script.id}">Save</button>
        <button data-action="execute" data-id="${script.id}">Execute</button>
      </div>
    `;
    scriptList.appendChild(card);
  });
}

function simulateExecute(scriptName, content) {
  logStatus(`Executing script: ${scriptName}`, 'success');
  logStatus(`Script content:\n${content || '[no content provided]'}`);
}

function loadSavedScripts() {
  const stored = JSON.parse(localStorage.getItem('savedExecutorScripts') || '[]');
  savedScripts.innerHTML = '';

  if (stored.length === 0) {
    savedScripts.innerHTML = '<p>No saved scripts yet. Save one to execute later.</p>';
    return;
  }

  stored.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'saved-card';
    card.innerHTML = `
      <div>
        <h3>${entry.name}</h3>
        <p>${entry.content.slice(0, 120) || '[empty script]'}${entry.content.length > 120 ? '...' : ''}</p>
      </div>
      <div class="card-actions">
        <button data-action="run-saved" data-index="${index}">Execute</button>
        <button class="secondary" data-action="insert-saved" data-index="${index}">Load</button>
        <button class="danger" data-action="delete-saved" data-index="${index}">Delete</button>
      </div>
    `;
    savedScripts.appendChild(card);
  });
}

function saveScript() {
  const name = saveScriptName.value.trim();
  const content = saveScriptContent.value.trim();

  if (!name) {
    logStatus('Enter a name before saving.', 'error');
    return;
  }

  const stored = JSON.parse(localStorage.getItem('savedExecutorScripts') || '[]');
  stored.push({ name, content });
  localStorage.setItem('savedExecutorScripts', JSON.stringify(stored));
  saveScriptName.value = '';
  saveScriptContent.value = '';
  loadSavedScripts();
  logStatus(`Saved script: ${name}`, 'success');
}

function handleSavedAction(event) {
  const action = event.target.dataset.action;
  if (!action) return;
  const index = Number(event.target.dataset.index);
  const stored = JSON.parse(localStorage.getItem('savedExecutorScripts') || '[]');
  const entry = stored[index];

  if (!entry) {
    logStatus('Saved script not found.', 'error');
    return;
  }

  if (action === 'run-saved') {
    simulateExecute(entry.name, entry.content);
  } else if (action === 'insert-saved') {
    manualScript.value = entry.content;
    logStatus(`Loaded saved script into manual editor: ${entry.name}`, 'info');
  } else if (action === 'delete-saved') {
    stored.splice(index, 1);
    localStorage.setItem('savedExecutorScripts', JSON.stringify(stored));
    loadSavedScripts();
    logStatus(`Deleted saved script: ${entry.name}`, 'info');
  }
}

function handleLibraryClick(event) {
  const action = event.target.dataset.action;
  if (!action) return;
  const scriptId = Number(event.target.dataset.id);
  const script = scripts.find(item => item.id === scriptId);
  if (!script) return;

  if (action === 'execute') {
    simulateExecute(script.title, `-- ${script.title} content placeholder`);
  } else if (action === 'save') {
    saveScriptName.value = script.title;
    saveScriptContent.value = `-- ${script.title} script content placeholder`;
    logStatus(`Prepared script for saving: ${script.title}`, 'info');
  }
}

function joinServer(type) {
  const serverMessages = {
    rejoin: 'Rejoining the current server...',
    another: 'Joining another random server...',
    low: 'Searching for a low-player server...',
  };
  logStatus(serverMessages[type], 'info');
  setTimeout(() => {
    logStatus(`Server action complete: ${type === 'low' ? 'Low player server joined.' : type === 'another' ? 'Another server joined.' : 'Rejoined successfully.'}`, 'success');
  }, 1200);
}

function simulateGameInjection() {
  logStatus('Simulated injection started for joined game.', 'info');
  setTimeout(() => {
    logStatus('Simulation complete: script injected into joined game (mock).', 'success');
    logStatus('Reminder: real Roblox injection is not supported by this web interface.', 'info');
  }, 1400);
}

searchInput.addEventListener('input', () => renderScriptList(searchInput.value));
executeManual.addEventListener('click', () => simulateExecute('Manual script', manualScript.value));
clearManual.addEventListener('click', () => {
  manualScript.value = '';
  logStatus('Manual script cleared.', 'info');
});
saveScriptButton.addEventListener('click', saveScript);
savedScripts.addEventListener('click', handleSavedAction);
scriptList.addEventListener('click', handleLibraryClick);
iconColor.addEventListener('input', () => {
  appIcon.style.backgroundColor = iconColor.value;
});
iconSize.addEventListener('input', () => {
  const size = iconSize.value;
  appIcon.style.width = `${size}px`;
  appIcon.style.height = `${size}px`;
  iconSizeValue.textContent = `${size}px`;
});
rejoinServer.addEventListener('click', () => joinServer('rejoin'));
joinAnotherServer.addEventListener('click', () => joinServer('another'));
joinLowPlayerServer.addEventListener('click', () => joinServer('low'));
injectCurrentGame.addEventListener('click', simulateGameInjection);

window.addEventListener('DOMContentLoaded', () => {
  renderScriptList('');
  loadSavedScripts();
  iconSize.dispatchEvent(new Event('input'));
});
