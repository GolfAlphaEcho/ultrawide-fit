const MODES = ["off", "zoom", "stretch"];
const BADGE = { off: "", zoom: "ZM", stretch: "ST" };

function updateBadge(mode) {
  chrome.action.setBadgeText({ text: BADGE[mode] || "" });
  chrome.action.setBadgeBackgroundColor({ color: mode === "stretch" ? "#d93025" : "#1a73e8" });
  chrome.action.setTitle({ title: `Ultrawide Fit: ${mode} (click to cycle)` });
}

async function cycleMode() {
  const { mode = "off" } = await chrome.storage.sync.get("mode");
  const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
  await chrome.storage.sync.set({ mode: next });
  updateBadge(next);
}

async function init() {
  const { mode = "off" } = await chrome.storage.sync.get("mode");
  updateBadge(mode);
}

chrome.action.onClicked.addListener(cycleMode);
chrome.commands.onCommand.addListener((cmd) => { if (cmd === "cycle-mode") cycleMode(); });
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);
