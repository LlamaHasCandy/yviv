// Add preloaded games here. Keep each game's HTML and assets inside its games/ folder.
const apps = [
  { name: "Local Box Music", image: "games/local.png", page: "games/local.html", description: "Local Box is a online & offline media player that works by storing uploaded songs into the browser via IndexDB. Please note that if you are running this site offline through an html file, the youtube functionality will not work." },
  { name: "Bitlife", image: "games/life.png", page: "games/o.html", description: "Life Simulation game" },
  { name: "Subway Surfers", image: "games/subway.png", page: "games/subway.html", description: "You run on train tracks away from the cops" },
  { name: "Friday Night Funkin' 0.8.1", image: "games/fnf.png", page: "games/fnfs/index.html", description: "It's that one rhythm game that isn't fully out yet. WARNING THIS RUNS VERY ASS ON BAD CHROMEBOOKS, IF YOU WANT BETTER PERFORMANCE USE THE OLDER 0.5.1 PORT." },
  { name: "Friday Night Funkin' 0.5.1", image: "games/fnfold.png", page: "games/fnf/index.html", description: "It's that one rhythm game that isn't fully out yet, except this version was when they didn't have 2 Million in donations." },
  { name: "Tomb of the Mask", image: "games/tomb.png", page: "games/tomb.htm", description: "Tomb of the Mask is a game where you run from water so you don't wash the dirt off of you." },
  { name: "Flappy Bird", image: "games/deadgame.png", page: "games/bird.html", description: "Dodge the tunnels and break your chromebook" },
  { name: "Fruit Ninja", image: "games/fruitninja.png", page: "games/fruitninja.html", description: "Slice Fruit" },
  { name: "Geometry Dash", image: "games/ggfuckingez.png", page: "games/geometrydashlite.html", description: "dodge spikes and rage" },
  { name: "Five Nights at Freddy's", image: "games/neggy.jpeg", page: "games/fnaf.html", description: "Watch some random robots for 6 hours" },
  { name: "Minecraft", image: "games/minor.png", page: "games/miner.html", description: "It's the block game everyone loves! Except your teachers" },
  { name: "1v1.lol", image: "games/diddyblud.png", page: "games/lol/index.html", description: "its like fortnite but its very scuffed" },
  { name: "Cookie Clicker", image: "games/unnamed.png", page: "games/cookie/cookies/index.html", description: "You click a cookie for some reason" },
  { name: "Crossy Road", image: "games/road.jpeg", page: "games/road.html", description: "Can the chicken cross the road?" },
  { name: "Chrome Dinosuar", image: "games/download.png", page: "games/dino/index.html", description: "Just don't get stabbed by cactus" },
  { name: "Pac-Man", image: "games/images.png", page: "games/man.html", description: "You eat food & ghosts like a big person" },
  { name: "Slither.io", image: "games/images.jpeg", page: "games/io/ios/index.html", description: "Its that snack game, but its lwk ass looking" },
];

const grid = document.getElementById("appGrid");
const emptyMessage = document.getElementById("emptyMessage");
const gameObjectUrls = [];

// Keep the shared pages consistently branded as The Hub without rewriting generic copy.
// Set page title
document.title = `${location.pathname.toLowerCase().includes("apps") ? "Games & Apps" : location.pathname.toLowerCase().includes("browser") ? "Browser" : location.pathname.toLowerCase().includes("settings") ? "Settings" : "Home"} | The Hub`;

const tabCloakStorageKey = "newsyHubTabAppearance";
const tabCloakForm = document.getElementById("tabCloakForm");
const tabCloakTitleInput = document.getElementById("tabCloakTitle");
const tabCloakIconInput = document.getElementById("tabCloakIcon");
const tabCloakIconUrlInput = document.getElementById("tabCloakIconUrl");
const tabCloakStatus = document.getElementById("tabCloakStatus");
const resetTabCloakButton = document.getElementById("resetTabCloak");
const defaultFavicon = document.querySelector('link[rel="icon"]');
const defaultFaviconHref = defaultFavicon?.getAttribute("href");

function getTabCloakSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(tabCloakStorageKey) || "{}");
    return {
      title: typeof saved.title === "string" ? saved.title : "",
      icon: typeof saved.icon === "string" ? saved.icon : "",
    };
  } catch {
    return { title: "", icon: "" };
  }
}

function applyTabCloak(settings) {
  if (settings.title) document.title = settings.title;

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon && settings.icon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  if (settings.icon) favicon.href = settings.icon;
}

const savedTabCloak = getTabCloakSettings();
applyTabCloak(savedTabCloak);
if (tabCloakTitleInput) tabCloakTitleInput.value = savedTabCloak.title;
if (tabCloakIconUrlInput && /^https?:\/\//i.test(savedTabCloak.icon)) {
  tabCloakIconUrlInput.value = savedTabCloak.icon;
}

if (tabCloakForm && tabCloakTitleInput && tabCloakIconInput) {
  tabCloakForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const iconFile = tabCloakIconInput.files?.[0];
    const iconUrl = tabCloakIconUrlInput?.value.trim() || "";
    const saveSettings = (icon = savedTabCloak.icon) => {
      const settings = { title: tabCloakTitleInput.value.trim(), icon };
      try {
        localStorage.setItem(tabCloakStorageKey, JSON.stringify(settings));
        savedTabCloak.title = settings.title;
        savedTabCloak.icon = settings.icon;
        applyTabCloak(settings);
        tabCloakIconInput.value = "";
        if (tabCloakIconUrlInput) {
          tabCloakIconUrlInput.value = /^https?:\/\//i.test(settings.icon) ? settings.icon : "";
        }
        if (tabCloakStatus) tabCloakStatus.textContent = "Tab appearance saved on this device.";
      } catch {
        if (tabCloakStatus) tabCloakStatus.textContent = "Could not save the tab appearance. Try a smaller icon file.";
      }
    };

    if (!iconFile) {
      if (iconUrl) {
        try {
          const parsedIconUrl = new URL(iconUrl);
          if ((parsedIconUrl.protocol !== "https:" && parsedIconUrl.protocol !== "http:") || parsedIconUrl.username || parsedIconUrl.password) {
            throw new Error("Unsupported icon URL");
          }
        } catch {
          if (tabCloakStatus) tabCloakStatus.textContent = "Enter a valid HTTP(S) favicon URL.";
          return;
        }
        saveSettings(iconUrl);
      } else {
        saveSettings();
      }
      return;
    }
    if (!iconFile.type.startsWith("image/")) {
      if (tabCloakStatus) tabCloakStatus.textContent = "Choose a valid image file for the tab icon.";
      return;
    }
    if (iconFile.size > 256 * 1024) {
      if (tabCloakStatus) tabCloakStatus.textContent = "Choose an icon smaller than 256 KB.";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => saveSettings(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => {
      if (tabCloakStatus) tabCloakStatus.textContent = "Could not read that icon file.";
    };
    reader.readAsDataURL(iconFile);
  });
}

if (resetTabCloakButton) {
  resetTabCloakButton.addEventListener("click", () => {
    try {
      localStorage.removeItem(tabCloakStorageKey);
      document.title = `${location.pathname.toLowerCase().includes("apps") ? "Games & Apps" : location.pathname.toLowerCase().includes("browser") ? "Browser" : location.pathname.toLowerCase().includes("settings") ? "Settings" : "Home"} | The Hub`;
      const favicon = document.querySelector('link[rel="icon"]');
      if (defaultFavicon) {
        defaultFavicon.href = defaultFaviconHref || "";
      } else if (favicon) {
        favicon.remove();
      }
      if (tabCloakTitleInput) tabCloakTitleInput.value = "";
      if (tabCloakIconInput) tabCloakIconInput.value = "";
      if (tabCloakIconUrlInput) tabCloakIconUrlInput.value = "";
      savedTabCloak.title = "";
      savedTabCloak.icon = "";
      if (tabCloakStatus) tabCloakStatus.textContent = "Using the default page title and icon.";
    } catch {
      if (tabCloakStatus) tabCloakStatus.textContent = "Could not reset the tab appearance in this browser.";
    }
  });
}

const killSwitchStorageKey = "newsyHubQuickRedirect";
const killSwitchForm = document.getElementById("killSwitchForm");
const killSwitchUrlInput = document.getElementById("killSwitchUrl");
const killSwitchStatus = document.getElementById("killSwitchStatus");
const killSwitchKeybindLabel = document.getElementById("killSwitchKeybindLabel");
const setKillSwitchKeybindButton = document.getElementById("setKillSwitchKeybind");
const defaultKillSwitchKeybind = { key: "k", ctrl: true, shift: true, alt: false, meta: false };
let capturingKillSwitchKeybind = false;

function getKillSwitchSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(killSwitchStorageKey) || "{}");
    const keybind = saved.keybind && typeof saved.keybind.key === "string"
      ? saved.keybind
      : defaultKillSwitchKeybind;
    return {
      destination: typeof saved.destination === "string" ? saved.destination : "",
      keybind: {
        key: keybind.key.toLowerCase(),
        ctrl: !!keybind.ctrl,
        shift: !!keybind.shift,
        alt: !!keybind.alt,
        meta: !!keybind.meta,
      },
    };
  } catch {
    return { destination: "", keybind: defaultKillSwitchKeybind };
  }
}

function saveKillSwitchSettings(settings) {
  try {
    localStorage.setItem(killSwitchStorageKey, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

function formatKillSwitchKeybind(keybind) {
  const parts = [];
  if (keybind.ctrl) parts.push("Ctrl");
  if (keybind.alt) parts.push("Alt");
  if (keybind.shift) parts.push("Shift");
  if (keybind.meta) parts.push("Meta");
  parts.push(keybind.key.length === 1 ? keybind.key.toUpperCase() : keybind.key);
  return parts.join("+");
}

let killSwitchSettings = getKillSwitchSettings();
if (killSwitchUrlInput) killSwitchUrlInput.value = killSwitchSettings.destination;
if (killSwitchKeybindLabel) {
  killSwitchKeybindLabel.textContent = `Shortcut: ${formatKillSwitchKeybind(killSwitchSettings.keybind)}`;
}

if (killSwitchForm && killSwitchUrlInput) {
  killSwitchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const destination = killSwitchUrlInput.value.trim();
    try {
      const parsed = new URL(destination);
      if ((parsed.protocol !== "https:" && parsed.protocol !== "http:") || parsed.username || parsed.password) {
        throw new Error("Unsupported destination");
      }
      killSwitchSettings = { ...killSwitchSettings, destination: parsed.href };
      if (saveKillSwitchSettings(killSwitchSettings)) {
        killSwitchUrlInput.value = parsed.href;
        if (killSwitchStatus) killSwitchStatus.textContent = "Redirect destination saved on this device.";
      } else if (killSwitchStatus) {
        killSwitchStatus.textContent = "Could not save the redirect destination in this browser.";
      }
    } catch {
      if (killSwitchStatus) killSwitchStatus.textContent = "Enter a valid HTTP(S) destination URL.";
      killSwitchUrlInput.focus();
    }
  });
}

if (setKillSwitchKeybindButton) {
  setKillSwitchKeybindButton.addEventListener("click", () => {
    capturingKillSwitchKeybind = true;
    setKillSwitchKeybindButton.textContent = "Press a shortcut… (Esc to cancel)";
    if (killSwitchStatus) killSwitchStatus.textContent = "Press the key combination you want to use.";
  });
}

document.addEventListener("keydown", (event) => {
  if (capturingKillSwitchKeybind) {
    event.preventDefault();
    event.stopPropagation();
    if (event.key === "Escape") {
      capturingKillSwitchKeybind = false;
      if (setKillSwitchKeybindButton) setKillSwitchKeybindButton.textContent = "Change shortcut";
      if (killSwitchStatus) killSwitchStatus.textContent = "Shortcut change canceled.";
      return;
    }
    if (["Control", "Shift", "Alt", "Meta"].includes(event.key)) return;

    const keybind = {
      key: event.key.toLowerCase(),
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
    };
    const updated = { ...killSwitchSettings, keybind };
    if (saveKillSwitchSettings(updated)) {
      killSwitchSettings = updated;
      if (killSwitchKeybindLabel) killSwitchKeybindLabel.textContent = `Shortcut: ${formatKillSwitchKeybind(keybind)}`;
      if (killSwitchStatus) killSwitchStatus.textContent = "Shortcut saved on this device.";
    } else if (killSwitchStatus) {
      killSwitchStatus.textContent = "Could not save the shortcut in this browser.";
    }
    capturingKillSwitchKeybind = false;
    if (setKillSwitchKeybindButton) setKillSwitchKeybindButton.textContent = "Change shortcut";
    return;
  }

  const keybind = killSwitchSettings.keybind;
  if (event.repeat || event.key.toLowerCase() !== keybind.key ||
      event.ctrlKey !== keybind.ctrl || event.shiftKey !== keybind.shift ||
      event.altKey !== keybind.alt || event.metaKey !== keybind.meta ||
      !killSwitchSettings.destination) return;

  try {
    const destination = new URL(killSwitchSettings.destination);
    if (destination.protocol !== "https:" && destination.protocol !== "http:") return;
    event.preventDefault();
    window.location.assign(destination.href);
  } catch {
    // Ignore invalid saved destinations.
  }
});

const gamePlayerDialog = document.getElementById("gamePlayerDialog");
const gamePlayerFrame = document.getElementById("gamePlayerFrame");
const gamePlayerTitle = document.getElementById("gamePlayerTitle");

function openGamePlayer(url, name) {
  if (!gamePlayerDialog || !gamePlayerFrame) {
    window.location.href = url;
    return;
  }
    gamePlayerTitle.textContent = name;
  gamePlayerFrame.allow = "gamepad *; fullscreen *";
  gamePlayerFrame.allowFullscreen = true;
  gamePlayerFrame.src = url;
  gamePlayerDialog.showModal();
}

function createAppCard(app) {
  const link = document.createElement("a");
  link.className = "app-card";
  link.href = app.href || app.page;
  link.setAttribute("aria-label", `Play ${app.name}`);
  link.addEventListener("click", (event) => {
    if (app.launchDirectly) return;
    event.preventDefault();
    openGamePlayer(app.href || app.page, app.name);
  });

  const icon = document.createElement("div");
  icon.className = "app-icon-wrap";
  if (app.image) {
    const image = document.createElement("img");
    image.className = "app-icon";
    image.src = app.image;
    image.alt = app.name;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      const placeholder = document.createElement("span");
      placeholder.className = "app-icon-placeholder";
      placeholder.textContent = app.name.charAt(0).toUpperCase();
      image.replaceWith(placeholder);
    }, { once: true });
    icon.appendChild(image);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "app-icon-placeholder";
    placeholder.textContent = app.name.charAt(0).toUpperCase();
    icon.appendChild(placeholder);
  }

  const playBadge = document.createElement("span");
  playBadge.className = "play-badge";
  playBadge.setAttribute("aria-hidden", "true");
  playBadge.textContent = "▶";
  icon.appendChild(playBadge);

  const info = document.createElement("div");
  info.className = "card-info";
  const title = document.createElement("h2");
  title.textContent = app.name;
  info.appendChild(title);

  if (app.description) {
    const description = document.createElement("p");
    description.textContent = app.description;
    info.appendChild(description);
  }

  link.append(icon, info);

  if (app.savedGameId) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-game-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete game";
    deleteButton.setAttribute("aria-label", `Delete ${app.name}`);
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      deleteSavedGame(app.savedGameId, app.name);
    });
    info.appendChild(deleteButton);
    grid.appendChild(link);
  } else {
    grid.appendChild(link);
  }
}

function renderAppCards(savedGames = []) {
  if (!grid || !emptyMessage) return;
  gameObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  gameObjectUrls.length = 0;
  grid.replaceChildren();
  emptyMessage.hidden = apps.length + savedGames.length > 0;
  apps.forEach(createAppCard);

  savedGames.forEach((game) => {
    const pageUrl = URL.createObjectURL(game.htmlBlob);
    gameObjectUrls.push(pageUrl);
    const imageUrl = game.iconBlob ? URL.createObjectURL(game.iconBlob) : "";
    if (imageUrl) gameObjectUrls.push(imageUrl);
    createAppCard({ name: game.name, description: "Click to play", href: pageUrl, image: imageUrl, savedGameId: game.id });
  });
}

renderAppCards();

const closeGameButton = document.getElementById("gameCloseButton");
const fullscreenGameButton = document.getElementById("gameFullscreenButton");
const gameAboutBlankButton = document.getElementById("gameAboutBlankButton");
if (closeGameButton && gamePlayerDialog) {
  closeGameButton.addEventListener("click", () => gamePlayerDialog.close());
  gamePlayerDialog.addEventListener("close", () => {
    if (gamePlayerFrame) gamePlayerFrame.src = "about:blank";
  });
}
if (fullscreenGameButton && gamePlayerDialog) {
  fullscreenGameButton.addEventListener("click", () => {
    const playerShell = gamePlayerDialog.querySelector(".game-shell");
    if (playerShell?.requestFullscreen) playerShell.requestFullscreen();
  });
}
if (gameAboutBlankButton && gamePlayerFrame) {
  gameAboutBlankButton.addEventListener("click", () => {
    const gameUrl = gamePlayerFrame.src;
    if (!gameUrl || gameUrl === "about:blank") return;

    const gameWindow = window.open("about:blank", "_blank");
    if (!gameWindow) return;

    const frame = gameWindow.document.createElement("iframe");
    frame.src = gameUrl;
    frame.title = gamePlayerTitle?.textContent || "Game";
    frame.allow = "gamepad *; fullscreen *";
    frame.allowFullscreen = true;
    Object.assign(gameWindow.document.documentElement.style, { height: "100%" });
    Object.assign(gameWindow.document.body.style, { margin: "0", height: "100vh", overflow: "hidden" });
    Object.assign(frame.style, { border: "0", display: "block", width: "100%", height: "100%" });
    gameWindow.document.body.replaceChildren(frame);
  });
}
const defaultBackground = "#0a0a0b";
const backgroundInput = document.getElementById("backgroundColor");
const backgroundImageInput = document.getElementById("backgroundImage");
const backgroundForm = document.getElementById("backgroundForm");
const backgroundStatus = document.getElementById("backgroundStatus");
const resetBackgroundButton = document.getElementById("resetBackground");
let backgroundImageUrl = "";

function openHubDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open("NewsyHub", 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("preferences")) {
        request.result.createObjectStore("preferences");
      }
      if (!request.result.objectStoreNames.contains("games")) {
        request.result.createObjectStore("games", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadSavedGames() {
  if (!grid || !emptyMessage) return;
  let database;
  try {
    database = await openHubDatabase();
    const games = await new Promise((resolve, reject) => {
      const transaction = database.transaction("games", "readonly");
      const request = transaction.objectStore("games").getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    renderAppCards(games);
  } catch {
    const uploadStatus = document.getElementById("gameUploadStatus");
    if (uploadStatus) uploadStatus.textContent = "Could not load saved games in this browser.";
  } finally {
    if (database) database.close();
  }
}

async function deleteSavedGame(gameId, gameName) {
  if (!window.confirm(`Delete the added game “${gameName}”? This cannot be undone.`)) return;

  let database;
  const status = document.getElementById("gameUploadStatus");
  try {
    database = await openHubDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("games", "readwrite");
      transaction.objectStore("games").delete(gameId);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    if (status) status.textContent = `${gameName} was deleted.`;
    await loadSavedGames();
  } catch {
    if (status) status.textContent = `Could not delete ${gameName}.`;
  } finally {
    if (database) database.close();
  }
}

const addGameForm = document.getElementById("addGameForm");
if (addGameForm) {
  addGameForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("gameUploadStatus");
    const htmlFile = document.getElementById("gameHtmlFile")?.files?.[0];
    const iconFile = document.getElementById("gameIconFile")?.files?.[0] || null;
    if (!htmlFile || !/\.html?$/i.test(htmlFile.name)) {
      if (status) status.textContent = "Choose an HTML (.html or .htm) game file.";
      return;
    }

    let database;
    try {
      database = await openHubDatabase();
      const game = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: htmlFile.name.replace(/\.html?$/i, "").replace(/[-_]+/g, " "),
        htmlBlob: htmlFile,
        iconBlob: iconFile,
      };
      await new Promise((resolve, reject) => {
        const transaction = database.transaction("games", "readwrite");
        transaction.objectStore("games").put(game);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
      addGameForm.reset();
      if (status) status.textContent = `${game.name} was added. Click its icon to play.`;
      await loadSavedGames();
    } catch {
      if (status) status.textContent = "Could not save this game in your browser.";
    } finally {
      if (database) database.close();
    }
  });
}

loadSavedGames();

function applyBackground(color, imageBlob) {
  const canvas = document.getElementById("space-canvas");
  if (typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color)) {
    if (canvas) canvas.style.background = color;
    if (backgroundInput) backgroundInput.value = color;
  }

  if (backgroundImageUrl) URL.revokeObjectURL(backgroundImageUrl);
  backgroundImageUrl = imageBlob instanceof Blob ? URL.createObjectURL(imageBlob) : "";

  const hasImage = !!backgroundImageUrl;
  document.documentElement.style.setProperty(
    "--hub-background-image",
    hasImage ? `url("${backgroundImageUrl}")` : "none"
  );
  document.body.classList.toggle("has-bg-image", hasImage);

  if (canvas) {
    if (hasImage) {
      canvas.style.background = `transparent url("${backgroundImageUrl}") center / cover no-repeat`;
    } else {
      canvas.style.background = color || "#0a0a0b";
    }
  }
}

async function loadBackground() {
  let database;
  try {
    database = await openHubDatabase();
    const values = await new Promise((resolve, reject) => {
      const transaction = database.transaction("preferences", "readonly");
      const store = transaction.objectStore("preferences");
      const colorRequest = store.get("backgroundColor");
      const imageRequest = store.get("backgroundImage");
      transaction.oncomplete = () => resolve({ color: colorRequest.result, image: imageRequest.result });
      transaction.onerror = () => reject(transaction.error);
    });
    const savedColor = typeof values.color === "string" && values.color.toLowerCase() === "#16452f"
      ? defaultBackground
      : values.color;
    applyBackground(savedColor || defaultBackground, values.image);
  } catch {
    if (backgroundStatus) backgroundStatus.textContent = "Could not load the saved background from IndexedDB.";
  } finally {
    if (database) database.close();
  }
}

async function saveBackground(color, imageBlob = null) {
  let database;
  try {
    database = await openHubDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("preferences", "readwrite");
      const store = transaction.objectStore("preferences");
      store.put(color, "backgroundColor");
      if (imageBlob) store.put(imageBlob, "backgroundImage");
      else store.delete("backgroundImage");
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    applyBackground(color, imageBlob);
    if (backgroundImageInput) backgroundImageInput.value = "";
    if (backgroundStatus) {
      backgroundStatus.textContent = imageBlob
        ? "Background image saved on this device."
        : "Background color saved on this device.";
    }
  } catch {
    if (backgroundStatus) backgroundStatus.textContent = "Could not save the background in IndexedDB.";
  } finally {
    if (database) database.close();
  }
}

loadBackground();

if (backgroundForm && backgroundInput) {
  backgroundForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const image = backgroundImageInput?.files?.[0];
    if (image && image.type.startsWith("image/")) {
      saveBackground(backgroundInput.value, image);
    } else {
      saveBackground(backgroundInput.value);
    }
  });
}

document.querySelectorAll(".color-swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => saveBackground(swatch.dataset.color));
});

if (resetBackgroundButton) {
  resetBackgroundButton.addEventListener("click", () => saveBackground(defaultBackground));
}

const browserModeStorageKey = "newsyHubBrowserSettings";
const browserSettingsForm = document.getElementById("browserSettingsForm");
const browserModeInput = document.getElementById("browserMode");
const proxyEndpointInput = document.getElementById("proxyEndpoint");
const browserSettingsStatus = document.getElementById("browserSettingsStatus");
const proxyNavigateForm = document.getElementById("proxyNavigateForm");
const proxyAddressInput = document.getElementById("proxyAddress");
const proxyStatus = document.getElementById("proxyStatus");
const proxyFrame = document.getElementById("proxyFrame");
const gustFrame = document.getElementById("gustFrame");
const azureProxyPanel = document.getElementById("azureProxyPanel");
const browserModeDescription = document.getElementById("browserModeDescription");
const switchBrowserModeButton = document.getElementById("switchBrowserMode");

function getBrowserSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(browserModeStorageKey) || "{}");
    return {
      mode: saved.mode === "azure" ? "azure" : "gust",
      endpoint: typeof saved.endpoint === "string" ? saved.endpoint : "",
    };
  } catch {
    return { mode: "gust", endpoint: "" };
  }
}

function saveBrowserSettings(settings) {
  try {
    localStorage.setItem(browserModeStorageKey, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

function validProxyEndpoint(endpoint) {
  if (!endpoint.includes("{url}")) return false;
  try {
    const parsed = new URL(endpoint.replace("{url}", encodeURIComponent("https://example.com")));
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

if (browserSettingsForm && browserModeInput && proxyEndpointInput) {
  const savedSettings = getBrowserSettings();
  browserModeInput.value = savedSettings.mode;
  proxyEndpointInput.value = savedSettings.endpoint;
  browserSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const settings = { mode: browserModeInput.value, endpoint: proxyEndpointInput.value.trim() };
    if (settings.mode === "azure" && !validProxyEndpoint(settings.endpoint)) {
      browserSettingsStatus.textContent = "For Azure proxy mode, enter a valid HTTP(S) proxy URL template containing {url}.";
      proxyEndpointInput.focus();
      return;
    }
    browserSettingsStatus.textContent = saveBrowserSettings(settings)
      ? "Browsing settings saved on this device."
      : "Could not save settings in this browser. Check its storage permissions.";
  });
}

function renderBrowserMode() {
  if (!gustFrame || !azureProxyPanel) return;
  const settings = getBrowserSettings();
  const useAzure = settings.mode === "azure";
  gustFrame.hidden = useAzure;
  azureProxyPanel.hidden = !useAzure;
  if (!useAzure && !gustFrame.getAttribute("src")) gustFrame.src = "GUST.html";
  if (browserModeDescription) {
    browserModeDescription.textContent = useAzure
      ? "Using your configured Azure proxy. GUST remains available in Settings."
      : "Using GUST, the browser and proxy app included with this project.";
  }
  if (switchBrowserModeButton) {
    switchBrowserModeButton.textContent = useAzure ? "Switch to GUST" : "Switch to Azure proxy";
  }
  if (useAzure && proxyStatus && !settings.endpoint) {
    proxyStatus.textContent = "Set an Azure proxy URL template in Settings before browsing.";
  }
}

if (switchBrowserModeButton) {
  switchBrowserModeButton.addEventListener("click", () => {
    const current = getBrowserSettings();
    const next = { ...current, mode: current.mode === "azure" ? "gust" : "azure" };
    if (!saveBrowserSettings(next)) {
      if (proxyStatus) proxyStatus.textContent = "Could not save this browser choice. Check this browser's storage permissions.";
      return;
    }
    renderBrowserMode();
  });
}

if (proxyNavigateForm && proxyAddressInput) {
  proxyNavigateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const settings = getBrowserSettings();
    if (!validProxyEndpoint(settings.endpoint)) {
      if (proxyStatus) proxyStatus.textContent = "Configure a valid proxy URL template containing {url} in Settings first.";
      return;
    }

    let destination = proxyAddressInput.value.trim();
    if (!destination) {
      if (proxyStatus) proxyStatus.textContent = "Enter a website address to continue.";
      return;
    }
    if (!/^https?:\/\//i.test(destination)) destination = `https://${destination}`;
    try {
      const parsedDestination = new URL(destination);
      if (parsedDestination.protocol !== "http:" && parsedDestination.protocol !== "https:") throw new Error("Unsupported protocol");
      const proxyUrl = settings.endpoint.replace("{url}", encodeURIComponent(parsedDestination.href));
      proxyFrame.src = proxyUrl;
      if (proxyStatus) proxyStatus.textContent = `Loading ${parsedDestination.hostname} through the configured proxy.`;
    } catch {
      if (proxyStatus) proxyStatus.textContent = "Enter a valid website address beginning with a domain name or http(s)://.";
    }
  });
}

renderBrowserMode();

/* ===== QUOTES (refreshes every 60 seconds) ===== */
const QUOTES_FALLBACK = [
    { "text": "But I don't know, I'm no mortal man. Maybe I'm just another nigga", "author": "Kendrick Lamar" },
    { "text": "Get off the games and do your work.", "author": "Your Teacher" },
    { "text": "Most of us hate fun", "author": "Adults" },
    { "text": "We like pedophiles", "author": "David Baszucki" },
    { "text": "Showering is for losers", "author": "Reddit Mod #8495" },
    { "text": "When life beats you up, you die.", "author": "Someone" },
    { "text": "I was smart, unlike you.", "author": "Albert Einstein Probably" },
    { "text": "How to sacrfice TCSMDARKBLUE in elden ring?", "author": "Newsy_Jailer5" },
    { "text": "Don't get a jo b when ur older. do ai dropwshioping insrtad", "author": "Bum #47297" },
    { "text": "Dad, I love you.", "author": "Chris Griffen" }
  ];

const quoteDisplay = document.getElementById("quoteDisplay");
let quotesCache = null;

function loadQuotes() {
  quotesCache = QUOTES_FALLBACK;
}

function updateQuote() {
  if (!quoteDisplay || !quotesCache) return;
  const idx = Math.floor(Date.now() / 60000) % quotesCache.length;
  const q = quotesCache[idx];
  quoteDisplay.classList.add("fading");
  setTimeout(() => {
    quoteDisplay.innerHTML = `“${q.text}”<br><span class="quote-author">— ${q.author}</span>`;
    quoteDisplay.classList.remove("fading");
  }, 150);
}

if (quoteDisplay) {
  loadQuotes();
  updateQuote();
  setInterval(updateQuote, 60000);
}

/* ===== INTERACTIVE SPACE BACKGROUND ===== */
(function initSpaceBackground() {
  const canvas = document.getElementById("space-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];
  let mouseX = 0.5;
  let mouseY = 0.5;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  /* Stars spawn evenly across the full screen area at a far Z distance.
     They fly straight toward the viewer (z decreases), growing bigger,
     and when they pass z=0 they wrap back to far Z at a random position. */
  function createStars(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * canvas.width * 1.8,
        y: (Math.random() - 0.5) * canvas.height * 1.8,
        z: Math.random() * 300,
        speed: Math.random() * 3 + 1.5,
        size: Math.random() * 2 + 0.8,
      });
    }
    return arr;
  }
  stars = createStars(180);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Mouse parallax: shift the entire canvas so it feels like
       you're dragging the view around. Max offset = ±30 px. */
    const panX = (mouseX - 0.5) * 60;
    const panY = (mouseY - 0.5) * 60;

    ctx.save();
    ctx.translate(panX, panY);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (const star of stars) {
      star.z -= star.speed;

      if (star.z <= 0) {
        star.x = (Math.random() - 0.5) * canvas.width * 1.8;
        star.y = (Math.random() - 0.5) * canvas.height * 1.8;
        star.z = 300;
        star.speed = Math.random() * 3 + 1.5;
        star.size = Math.random() * 2 + 0.8;
      }

      const scale = 200 / Math.max(star.z, 1);
      const sx = cx + star.x * scale;
      const sy = cy + star.y * scale;
      const r = star.size * scale;

      // Brightness & alpha ramp up as star approaches
      const progress = 1 - star.z / 300;
      const alpha = Math.min(1, progress * 0.9 + 0.1);
      const glow = Math.min(1, progress * 0.6);

      if (r > 0.2) {
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(r, 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Small glow on close stars
        if (glow > 0.3) {
          ctx.beginPath();
          ctx.arc(sx, sy, r * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 200, 255, ${glow * 0.08})`;
          ctx.fill();
        }
      }
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  function onMouseMove(e) {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  }

  window.addEventListener("resize", resize);
  document.addEventListener("mousemove", onMouseMove);
  draw();
})();