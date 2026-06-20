"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
const VACUUM_PLAYER_FILE_SRC = new URL("assets/vacuum_player.png", window.location.href).href;
const VACUUM_PLAYER_SRC = window.VACUUM_PLAYER_DATA_URI || VACUUM_PLAYER_FILE_SRC;
const vacuumPlayerPreload = document.getElementById("vacuumPreload");
const vacuumPlayerImage = new Image();
let vacuumPlayerImageLoaded = false;
vacuumPlayerImage.decoding = "sync";
vacuumPlayerImage.onload = () => {
  vacuumPlayerImageLoaded = true;
};
vacuumPlayerImage.onerror = () => {
  console.warn("Не удалось загрузить изображение пылесоса.");
  if (vacuumPlayerImage.src !== VACUUM_PLAYER_FILE_SRC) {
    vacuumPlayerImage.src = VACUUM_PLAYER_FILE_SRC;
  }
};
vacuumPlayerImage.src = VACUUM_PLAYER_SRC;
vacuumPlayerImage.decode?.().then(() => {
  vacuumPlayerImageLoaded = true;
}).catch(() => {});

if (vacuumPlayerPreload && !vacuumPlayerPreload.src) {
  vacuumPlayerPreload.src = VACUUM_PLAYER_SRC;
}

function isVacuumBitmapReady() {
  return vacuumPlayerImageLoaded && vacuumPlayerImage.complete && vacuumPlayerImage.naturalWidth > 0;
}

if (
  (vacuumPlayerImage.complete && vacuumPlayerImage.naturalWidth > 0) ||
  (vacuumPlayerPreload?.complete && vacuumPlayerPreload.naturalWidth > 0)
) {
  vacuumPlayerImageLoaded = true;
}

const screens = {
  menu: document.getElementById("menuScreen"),
  upgrades: document.getElementById("upgradesScreen"),
  game: document.getElementById("gameScreen"),
  gameOver: document.getElementById("gameOverScreen")
};

const ui = {
  menuBestScore: document.getElementById("menuBestScore"),
  starsCount: document.getElementById("starsCount"),
  upgradesList: document.getElementById("upgradesList"),
  boostersList: document.getElementById("boostersList"),
  skinsList: document.getElementById("skinsList"),
  dailyRewardText: document.getElementById("dailyRewardText"),
  dailyRewardButton: document.getElementById("dailyRewardButton"),
  dailyTasksList: document.getElementById("dailyTasksList"),
  tasksBonusText: document.getElementById("tasksBonusText"),
  hudScore: document.getElementById("hudScore"),
  hudLives: document.getElementById("hudLives"),
  hudCombo: document.getElementById("hudCombo"),
  bonusPill: document.getElementById("bonusPill"),
  finalScore: document.getElementById("finalScore"),
  finalBestScore: document.getElementById("finalBestScore"),
  earnedStars: document.getElementById("earnedStars"),
  reviveAdButton: document.getElementById("reviveAdButton"),
  doubleStarsAdButton: document.getElementById("doubleStarsAdButton"),
  gameMenuButton: document.getElementById("gameMenuButton"),
  soundToggleButton: document.getElementById("soundToggleButton")
};

const STORAGE_KEY = "thoughtVacuumProgress.v1";
const GOOD_EMOJIS = ["🌈", "💡", "🎵", "🌸", "✨", "🍀", "😊", "🧁"];
const BAD_EMOJIS = ["⚡", "💢", "🌀", "😵", "☁️", "🔥"];
const GOLD_EMOJIS = ["⭐", "🌟", "💛"];
const DAILY_REWARD_STARS = 3;
const DAILY_TASK_REWARD = 2;
const DAILY_ALL_TASKS_REWARD = 3;
const MAX_BOOSTERS = 3;
const RU_LANGUAGE_CODES = new Set(["ru", "be", "kk", "uk", "uz"]);
const TRANSLATIONS = {
  ru: {
    pageTitle: "Пылесос Пыслей",
    canvasLabel: "Игровое поле",
    menuEyebrow: "милая canvas-игра",
    menuTitle: "Пылесос Пыслей",
    menuLead: "Управляй милым пылесосом с магической аурой: собирай хорошие мысли, избегай вредных и лови золотые бонусы.",
    bestResult: "Лучший результат:",
    dailyRewardTitle: "Ежедневный бонус",
    dailyRewardReady: "Забери подарок за вход",
    dailyRewardClaimed: "Бонус уже получен",
    play: "Играть",
    upgrades: "Улучшения",
    workshop: "мастерская",
    boosters: "Бустеры",
    boostersLimit: "До 3 штук каждого",
    skins: "Скины",
    skinsNote: "Только внешний вид",
    dailyTasks: "Задания дня",
    allTasksBonus: "Бонус за все: ★ {value}",
    allTasksClaimed: "Бонус за все получен",
    back: "Назад",
    score: "Очки",
    lives: "Жизни",
    combo: "Комбо",
    menu: "Меню",
    bonus: "Бонус",
    gameOverEyebrow: "поток очищен",
    gameOver: "Игра окончена",
    best: "Лучший",
    stars: "Звезды",
    reviveAd: "Смотреть рекламу: +1 жизнь",
    doubleStarsAd: "Смотреть рекламу: x2 звезды",
    restart: "Играть снова",
    max: "Макс.",
    ownedCount: "Есть: {count}/{max}",
    ownedForever: "Куплен навсегда",
    price: "Цена ★ {cost}",
    selected: "Выбран",
    select: "Выбрать",
    reward: "награда ★ {value}",
    done: "Готово",
    claim: "Забрать",
    soundOn: "Отключить звук",
    soundOff: "Включить звук",
    smartMagnet: "умный магнит",
    slow: "замедление",
    shield: "щит"
  },
  en: {
    pageTitle: "Thought Vacuum",
    canvasLabel: "Game field",
    menuEyebrow: "cute canvas game",
    menuTitle: "Thought Vacuum",
    menuLead: "Guide a cute vacuum with a magic aura: collect good thoughts, avoid harmful ones, and catch golden bonuses.",
    bestResult: "Best score:",
    dailyRewardTitle: "Daily bonus",
    dailyRewardReady: "Claim your login gift",
    dailyRewardClaimed: "Bonus already claimed",
    play: "Play",
    upgrades: "Upgrades",
    workshop: "workshop",
    boosters: "Boosters",
    boostersLimit: "Up to 3 of each",
    skins: "Skins",
    skinsNote: "Visual only",
    dailyTasks: "Daily tasks",
    allTasksBonus: "Bonus for all: ★ {value}",
    allTasksClaimed: "All-tasks bonus claimed",
    back: "Back",
    score: "Score",
    lives: "Lives",
    combo: "Combo",
    menu: "Menu",
    bonus: "Bonus",
    gameOverEyebrow: "stream cleared",
    gameOver: "Game over",
    best: "Best",
    stars: "Stars",
    reviveAd: "Watch ad: +1 life",
    doubleStarsAd: "Watch ad: x2 stars",
    restart: "Play again",
    max: "Max",
    ownedCount: "Owned: {count}/{max}",
    ownedForever: "Owned forever",
    price: "Price ★ {cost}",
    selected: "Selected",
    select: "Select",
    reward: "reward ★ {value}",
    done: "Done",
    claim: "Claim",
    soundOn: "Mute sound",
    soundOff: "Enable sound",
    smartMagnet: "smart magnet",
    slow: "slow",
    shield: "shield"
  }
};

const boosterInfo = {
  magnetStart: {
    title: "Умный магнит",
    titleEn: "Smart magnet",
    text: "6 секунд притягивает хорошие и золотые мысли, а вредные отталкивает.",
    textEn: "For 6 seconds, attracts good and golden thoughts while pushing harmful ones away.",
    cost: 3
  },
  shield: {
    title: "Щит от плохой мысли",
    titleEn: "Bad thought shield",
    text: "Один раз за раунд блокирует вредную мысль.",
    textEn: "Blocks one harmful thought during the next round.",
    cost: 4
  },
  doubleStart: {
    title: "Звездный старт",
    titleEn: "Star start",
    text: "Следующий раунд начнется с x2 очками на 8 секунд.",
    textEn: "The next round starts with x2 score for 8 seconds.",
    cost: 5
  }
};

const skinInfo = {
  blue: {
    title: "Голубая аура",
    titleEn: "Blue aura",
    cost: 0,
    aura: "rgba(31, 191, 163, 0.5)",
    auraFill: "rgba(255, 255, 255, 0.65)",
    sparkle: "#b9fff3",
    robe: ["#ffffff", "#8ae9ff", "#79a8ff"],
    core: "#58d6ff"
  },
  pink: {
    title: "Розовая аура",
    titleEn: "Pink aura",
    cost: 8,
    aura: "rgba(255, 111, 145, 0.55)",
    auraFill: "rgba(255, 231, 239, 0.72)",
    sparkle: "#ffd1df",
    robe: ["#ffffff", "#ff9dc2", "#cf8cff"],
    core: "#ff7fb1"
  },
  gold: {
    title: "Золотая аура",
    titleEn: "Golden aura",
    cost: 12,
    aura: "rgba(255, 184, 0, 0.58)",
    auraFill: "rgba(255, 246, 190, 0.72)",
    sparkle: "#ffe071",
    robe: ["#ffffff", "#ffd75d", "#ffac4d"],
    core: "#ffc83d"
  },
  cosmic: {
    title: "Космическая аура",
    titleEn: "Cosmic aura",
    cost: 15,
    aura: "rgba(118, 109, 255, 0.56)",
    auraFill: "rgba(230, 230, 255, 0.72)",
    sparkle: "#c5bfff",
    robe: ["#ffffff", "#9ca7ff", "#7a5cff"],
    core: "#8878ff"
  }
};

const upgradeInfo = {
  radius: {
    title: "Радиус втягивания",
    titleEn: "Pull radius",
    text: "Аура достает мысли чуть дальше.",
    textEn: "The aura reaches thoughts a little farther away.",
    max: 5,
    costs: [2, 3, 4, 5, 6]
  },
  bonus: {
    title: "Длительность бонусов",
    titleEn: "Bonus duration",
    text: "Магнит, замедление и двойные очки живут дольше.",
    textEn: "Magnet, slow, and double score last longer.",
    max: 5,
    costs: [2, 3, 4, 5, 6]
  },
  life: {
    title: "Запасное сердце",
    titleEn: "Spare heart",
    text: "Одна дополнительная жизнь в начале игры.",
    textEn: "One extra life at the start of a round.",
    max: 1,
    costs: [5]
  }
};

const taskDefinitions = {
  goodThoughts: { title: "Собери 20 хороших мыслей", titleEn: "Collect 20 good thoughts", target: 20 },
  goldThoughts: { title: "Поймай 2 золотые мысли", titleEn: "Catch 2 golden thoughts", target: 2 },
  combo: { title: "Набери комбо x4", titleEn: "Reach combo x4", target: 4 },
  score: { title: "Заработай 300 очков за раунд", titleEn: "Score 300 points in one round", target: 300 },
  rounds: { title: "Сыграй 3 раунда", titleEn: "Play 3 rounds", target: 3 }
};

let yaSdk = null;
let audioContext = null;
let vacuumLoop = null;
const VACUUM_START_DURATION = 3.2;
let dpr = 1;
let width = 0;
let height = 0;
let lastTime = 0;
let currentScreen = "menu";
let gameplayMarkedActive = false;

let currentLang = resolveLanguage(new URLSearchParams(window.location.search).get("lang") || navigator.language);
let progress = loadProgress();
ensureDailyState();
let game = null;
let backgroundBubbles = [];

applyLanguage();
initYandexSdk();
resizeCanvas();
bindEvents();
renderUpgrades();
updateMenu();
switchScreen("menu");
requestAnimationFrame(loop);

function resolveLanguage(lang) {
  const code = String(lang || "ru").toLowerCase().split("-")[0];
  return RU_LANGUAGE_CODES.has(code) ? "ru" : "en";
}

function setLanguage(lang) {
  const nextLang = resolveLanguage(lang);
  if (currentLang === nextLang) return;
  currentLang = nextLang;
  applyLanguage();
  renderUpgrades();
  updateMenu();
  updateSoundControls();
  if (game) updateHud();
}

function tr(key, values = {}) {
  const dictionary = TRANSLATIONS[currentLang] || TRANSLATIONS.ru;
  let value = dictionary[key] || TRANSLATIONS.ru[key] || key;
  Object.entries(values).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, replacement);
  });
  return value;
}

function infoTitle(info) {
  return currentLang === "en" && info.titleEn ? info.titleEn : info.title;
}

function infoText(info) {
  return currentLang === "en" && info.textEn ? info.textEn : info.text;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.title = tr("pageTitle");
  canvas.setAttribute("aria-label", tr("canvasLabel"));

  setText("#menuScreen .eyebrow", tr("menuEyebrow"));
  setText("#menuScreen h1", tr("menuTitle"));
  setText("#menuScreen .lead", tr("menuLead"));
  const bestRow = document.querySelector(".best-row");
  if (bestRow) bestRow.innerHTML = `${tr("bestResult")} <strong id="menuBestScore">${progress.bestScore}</strong>`;
  ui.menuBestScore = document.getElementById("menuBestScore");
  setText("#dailyRewardCard strong", tr("dailyRewardTitle"));
  setText("#playButton", tr("play"));
  setText("#upgradesButton", tr("upgrades"));

  setText("#upgradesScreen .eyebrow", tr("workshop"));
  setText("#upgradesScreen h2", tr("upgrades"));
  setText("#boostersTitle", tr("boosters"));
  setText("#boostersNote", tr("boostersLimit"));
  setText("#skinsTitle", tr("skins"));
  setText("#skinsNote", tr("skinsNote"));
  setText(".tasks-panel .tasks-head h3", tr("dailyTasks"));
  setText("#backFromUpgradesButton", tr("back"));

  setText(".hud-item:nth-child(1) span", tr("score"));
  setText(".hud-item:nth-child(2) span", tr("lives"));
  setText(".hud-item:nth-child(3) span", tr("combo"));
  setText("#gameMenuButton", tr("menu"));
  setText("#bonusPill", tr("bonus"));

  setText("#gameOverScreen .eyebrow", tr("gameOverEyebrow"));
  setText("#gameOverScreen h2", tr("gameOver"));
  setText(".result-grid div:nth-child(1) span", tr("score"));
  setText(".result-grid div:nth-child(2) span", tr("best"));
  setText(".result-grid div:nth-child(3) span", tr("stars"));
  setText("#reviveAdButton", tr("reviveAd"));
  setText("#doubleStarsAdButton", tr("doubleStarsAd"));
  setText("#restartButton", tr("restart"));
  setText("#menuButton", tr("menu"));
  updateSoundControls();
}
function markLoadingReady() {
  try {
    yaSdk?.features?.LoadingAPI?.ready();
  } catch (error) {
    console.warn("Не удалось отправить LoadingAPI.ready:", error);
  }
}

function markGameplayStart() {
  if (gameplayMarkedActive) return;
  gameplayMarkedActive = true;
  startVacuumLoop();
  try {
    yaSdk?.features?.GameplayAPI?.start();
  } catch (error) {
    console.warn("Не удалось отправить GameplayAPI.start:", error);
  }
}

function markGameplayStop() {
  if (!gameplayMarkedActive) return;
  gameplayMarkedActive = false;
  stopVacuumLoop();
  try {
    yaSdk?.features?.GameplayAPI?.stop();
  } catch (error) {
    console.warn("Не удалось отправить GameplayAPI.stop:", error);
  }
}

function pauseActiveGame(reason) {
  if (!game || !game.running) return;
  game.running = false;
  game.pausedBySystem = reason;
  stopVacuumLoop(true);
  markGameplayStop();
  if (audioContext && audioContext.state === "running") {
    audioContext.suspend().catch(() => {});
  }
}

function resumeSystemPausedGame(reason) {
  if (!game || game.running || game.pausedBySystem !== reason || currentScreen !== "game") return;
  game.pausedBySystem = "";
  game.running = true;
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  markGameplayStart();
}

function handleVisibilityChange() {
  if (document.hidden) {
    pauseActiveGame("visibility");
  } else {
    resumeSystemPausedGame("visibility");
  }
}

function initYandexSdk() {
  if (window.YaGames && typeof window.YaGames.init === "function") {
    window.YaGames.init()
      .then((sdk) => {
        yaSdk = sdk;
        setLanguage(yaSdk?.environment?.i18n?.lang);
        markLoadingReady();
        if (typeof yaSdk.on === "function") {
          yaSdk.on("game_api_pause", () => pauseActiveGame("sdk"));
          yaSdk.on("game_api_resume", () => resumeSystemPausedGame("sdk"));
        }
      })
      .catch(() => {
        yaSdk = null;
      });
  }
}

function showFullscreenAd(onClose) {
  const wasRunning = Boolean(game?.running);
  const audioWasRunning = audioContext && audioContext.state === "running";
  let closed = false;

  if (game) game.running = false;
  if (wasRunning) markGameplayStop();
  if (audioWasRunning) audioContext.suspend().catch(() => {});

  const finish = () => {
    if (closed) return;
    closed = true;
    if (audioWasRunning) audioContext.resume().catch(() => {});
    if (wasRunning && game) {
      game.running = true;
      markGameplayStart();
    }
    if (typeof onClose === "function") onClose();
  };

  if (!yaSdk || !yaSdk.adv || typeof yaSdk.adv.showFullscreenAdv !== "function") {
    finish();
    return;
  }

  try {
    yaSdk.adv.showFullscreenAdv({
      callbacks: {
        onOpen: () => {},
        onClose: finish,
        onError: finish
      }
    });
  } catch (error) {
    console.warn("Ошибка полноэкранной рекламы:", error);
    finish();
  }
}

function showRewardedAd({ onReward, onClose, onError }) {
  const wasRunning = Boolean(game?.running);
  const audioWasRunning = audioContext && audioContext.state === "running";
  let rewarded = false;
  let closed = false;

  if (game) game.running = false;
  if (wasRunning) markGameplayStop();
  if (audioWasRunning) audioContext.suspend().catch(() => {});

  const close = () => {
    if (closed) return;
    closed = true;
    if (audioWasRunning) audioContext.resume().catch(() => {});
    if (wasRunning && game) {
      game.running = true;
      markGameplayStart();
    }
    if (typeof onClose === "function") onClose(rewarded);
  };

  const reward = () => {
    if (rewarded) return;
    rewarded = true;
    if (typeof onReward === "function") onReward();
  };

  if (!yaSdk || !yaSdk.adv || typeof yaSdk.adv.showRewardedVideo !== "function") {
    reward();
    close();
    return;
  }

  try {
    yaSdk.adv.showRewardedVideo({
      callbacks: {
        onOpen: () => {},
        onRewarded: reward,
        onClose: close,
        onError: (error) => {
          console.warn("Ошибка rewarded-рекламы:", error);
          if (typeof onError === "function") onError(error);
          close();
        }
      }
    });
  } catch (error) {
    console.warn("Ошибка rewarded-рекламы:", error);
    if (typeof onError === "function") onError(error);
    close();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Не удалось сохранить прогресс:", error);
  }

  // Здесь позже можно подключить сохранение player data из Yandex Games SDK.
}

function loadProgress() {
  const today = getTodayKey();
  const fallback = {
    bestScore: 0,
    stars: 0,
    roundsSinceInterstitial: 0,
    boosters: { magnetStart: 0, shield: 0, doubleStart: 0 },
    ownedSkins: ["blue"],
    activeSkin: "blue",
    dailyRewardDate: "",
    dailyTasksDate: today,
    dailyTasks: createDailyTasks(today),
    dailyTasksCompletedBonusClaimed: false,
    soundMuted: false,
    upgrades: { radius: 0, bonus: 0, life: 0 }
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);

    return {
      bestScore: Math.max(0, Number(parsed.bestScore) || 0),
      stars: Math.max(0, Number(parsed.stars) || 0),
      roundsSinceInterstitial: Math.max(0, Number(parsed.roundsSinceInterstitial) || 0),
      boosters: normalizeBoosters(parsed.boosters),
      ownedSkins: normalizeOwnedSkins(parsed.ownedSkins),
      activeSkin: normalizeActiveSkin(parsed.activeSkin, parsed.ownedSkins),
      dailyRewardDate: typeof parsed.dailyRewardDate === "string" ? parsed.dailyRewardDate : "",
      dailyTasksDate: typeof parsed.dailyTasksDate === "string" ? parsed.dailyTasksDate : "",
      dailyTasks: Array.isArray(parsed.dailyTasks) ? parsed.dailyTasks : [],
      dailyTasksCompletedBonusClaimed: Boolean(parsed.dailyTasksCompletedBonusClaimed),
      soundMuted: Boolean(parsed.soundMuted),
      upgrades: {
        radius: clamp(Number(parsed.upgrades?.radius) || 0, 0, upgradeInfo.radius.max),
        bonus: clamp(Number(parsed.upgrades?.bonus) || 0, 0, upgradeInfo.bonus.max),
        life: clamp(Number(parsed.upgrades?.life) || 0, 0, upgradeInfo.life.max)
      }
    };
  } catch (error) {
    console.warn("Не удалось загрузить прогресс:", error);
    return fallback;
  }
}

function bindEvents() {
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("blur", () => pauseActiveGame("window"));
  window.addEventListener("focus", () => resumeSystemPausedGame("window"));
  document.addEventListener("contextmenu", suppressBrowserGesture);
  document.addEventListener("selectstart", suppressBrowserGesture);
  document.addEventListener("dragstart", suppressBrowserGesture);
  document.addEventListener("touchmove", suppressGameplayTouchMove, { passive: false });
  window.addEventListener("pointermove", handlePointerMove, { passive: false });
  window.addEventListener("pointerdown", (event) => {
    suppressGameplayPointerEvent(event);
    unlockAudio();
    updatePointer(event);
  }, { passive: false });

  document.getElementById("playButton").addEventListener("click", () => startGame());
  ui.dailyRewardButton.addEventListener("click", () => claimDailyReward());
  document.getElementById("restartButton").addEventListener("click", () => restartGameWithOptionalAd());
  ui.reviveAdButton.addEventListener("click", () => reviveWithAd());
  ui.doubleStarsAdButton.addEventListener("click", () => doubleStarsWithAd());
  ui.gameMenuButton.addEventListener("click", () => returnToMenuFromGame());
  ui.soundToggleButton.addEventListener("click", () => toggleSound());
  updateSoundControls();
  document.getElementById("menuButton").addEventListener("click", () => {
    switchScreen("menu");
    updateMenu();
  });
  document.getElementById("upgradesButton").addEventListener("click", () => {
    renderUpgrades();
    switchScreen("upgrades");
  });
  document.getElementById("backFromUpgradesButton").addEventListener("click", () => {
    updateMenu();
    switchScreen("menu");
  });
}

function suppressBrowserGesture(event) {
  if (event.cancelable) event.preventDefault();
  return false;
}

function suppressGameplayTouchMove(event) {
  if (currentScreen === "game" && event.cancelable) event.preventDefault();
}

function suppressGameplayPointerEvent(event) {
  if (!game || !game.running || !event.cancelable) return;
  event.preventDefault();
}

function handlePointerMove(event) {
  suppressGameplayPointerEvent(event);
  updatePointer(event);
}

function resizeCanvas() {
  dpr = Math.min(2, window.devicePixelRatio || 1);
  width = Math.max(1, window.innerWidth);
  height = Math.max(1, window.innerHeight);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (!backgroundBubbles.length) {
    backgroundBubbles = Array.from({ length: 24 }, createBackgroundBubble);
  }
}

function switchScreen(name) {
  currentScreen = name;
  Object.entries(screens).forEach(([screenName, element]) => {
    element.classList.toggle("screen-active", screenName === name);
  });
}

function startGame() {
  if (vacuumPlayerImage.complete && vacuumPlayerImage.naturalWidth > 0) {
    vacuumPlayerImageLoaded = true;
  }

  ensureDailyState();
  unlockAudio();
  const extraLife = progress.upgrades.life > 0 ? 1 : 0;
  const startX = width * 0.5;
  const startY = height * 0.58;

  game = {
    running: true,
    score: 0,
    lives: 3 + extraLife,
    maxLives: 3 + extraLife,
    combo: 1,
    streak: 0,
    spawnTimer: 0.4,
    elapsed: 0,
    shake: 0,
    slowTimer: 0,
    magnetTimer: 0,
    doubleTimer: 0,
    vacuumStartTimer: VACUUM_START_DURATION,
    shieldActive: false,
    revivedOnce: false,
    starsAwarded: false,
    starsDoubled: false,
    earnedStarsThisRun: 0,
    rewardedStarsBonus: 0,
    interstitialCounted: false,
    maxComboThisRun: 1,
    player: {
      x: startX,
      y: startY,
      tx: startX,
      ty: startY,
      radius: 36,
      suckRadius: 86 + progress.upgrades.radius * 13
    },
    thoughts: [],
    particles: []
  };

  applyStartingBoosters();
  ui.bonusPill.classList.add("hidden");
  updateHud();
  switchScreen("game");
  markGameplayStart();
}

function returnToMenuFromGame() {
  markGameplayStop();
  if (game) game.running = false;
  ui.bonusPill.classList.add("hidden");
  updateMenu();
  switchScreen("menu");
}
function restartGameWithOptionalAd() {
  if (progress.roundsSinceInterstitial >= 3) {
    progress.roundsSinceInterstitial = 0;
    saveProgress();
    showFullscreenAd(() => startGame());
    return;
  }

  startGame();
}

function endGame() {
  if (!game || !game.running) return;
  markGameplayStop();
  game.running = false;

  if (!game.interstitialCounted) {
    progress.roundsSinceInterstitial += 1;
    addTaskProgress("rounds", 1);
    game.interstitialCounted = true;
  }

  addTaskProgress("score", game.score);
  addTaskProgress("combo", game.maxComboThisRun);

  const totalEarned = Math.floor(game.score / 100);
  const earned = Math.max(0, totalEarned - game.earnedStarsThisRun);
  game.earnedStarsThisRun += earned;
  game.starsAwarded = true;
  progress.stars += earned;
  progress.bestScore = Math.max(progress.bestScore, game.score);
  saveProgress();

  // Здесь позже можно отправить score в лидерборд Yandex Games SDK.

  ui.finalScore.textContent = game.score;
  ui.finalBestScore.textContent = progress.bestScore;
  ui.earnedStars.textContent = getResultStarsTotal();
  updateRewardButtons();
  updateMenu();
  renderUpgrades();
  switchScreen("gameOver");
  playSound("over");
}

function reviveWithAd() {
  if (!game || game.running || game.revivedOnce) return;

  let rewardGranted = false;
  ui.reviveAdButton.disabled = true;
  showRewardedAd({
    onReward: () => {
      rewardGranted = true;
    },
    onClose: () => {
      if (!rewardGranted) {
        updateRewardButtons();
        return;
      }

      game.revivedOnce = true;
      game.running = true;
      game.pausedBySystem = "";
      markGameplayStart();
      game.lives = 1;
      game.combo = 1;
      game.streak = 0;
      game.shake = 0;
      game.vacuumStartTimer = VACUUM_START_DURATION;
      game.thoughts = [];
      game.particles = [];
      updateHud();
      updateRewardButtons();
      switchScreen("game");
      playSound("buy");
    },
    onError: () => updateRewardButtons()
  });
}

function doubleStarsWithAd() {
  if (!game || game.running || game.starsDoubled || game.earnedStarsThisRun <= 0) return;

  let rewardGranted = false;
  ui.doubleStarsAdButton.disabled = true;
  showRewardedAd({
    onReward: () => {
      rewardGranted = true;
    },
    onClose: () => {
      if (!rewardGranted) {
        updateRewardButtons();
        return;
      }

      const bonusStars = game.earnedStarsThisRun;
      game.starsDoubled = true;
      game.rewardedStarsBonus += bonusStars;
      progress.stars += bonusStars;
      saveProgress();
      ui.earnedStars.textContent = getResultStarsTotal();
      updateRewardButtons();
      updateMenu();
      renderUpgrades();
      playSound("gold");
    },
    onError: () => updateRewardButtons()
  });
}

function updateRewardButtons() {
  if (!game || game.running) {
    ui.reviveAdButton.classList.add("hidden");
    ui.doubleStarsAdButton.classList.add("hidden");
    return;
  }

  ui.reviveAdButton.classList.toggle("hidden", game.revivedOnce);
  ui.reviveAdButton.disabled = game.revivedOnce;

  const canDoubleStars = game.earnedStarsThisRun > 0 && !game.starsDoubled;
  ui.doubleStarsAdButton.classList.toggle("hidden", !canDoubleStars);
  ui.doubleStarsAdButton.disabled = !canDoubleStars;
}

function getResultStarsTotal() {
  if (!game) return 0;
  return game.earnedStarsThisRun + (game.rewardedStarsBonus || 0);
}

function updatePointer(event) {
  if (!game || !game.running) return;
  game.player.tx = clamp(event.clientX, 20, width - 20);
  game.player.ty = clamp(event.clientY, 20, height - 20);
}

function loop(time) {
  const dt = Math.min(0.033, (time - lastTime) / 1000 || 0.016);
  lastTime = time;

  updateBackground(dt);
  if (game && game.running) updateGame(dt);
  draw();

  requestAnimationFrame(loop);
}

function updateGame(dt) {
  game.elapsed += dt;
  game.shake = Math.max(0, game.shake - dt * 18);
  game.slowTimer = Math.max(0, game.slowTimer - dt);
  game.magnetTimer = Math.max(0, game.magnetTimer - dt);
  game.doubleTimer = Math.max(0, game.doubleTimer - dt);
  game.vacuumStartTimer = Math.max(0, game.vacuumStartTimer - dt);

  const player = game.player;
  const follow = 1 - Math.pow(0.0009, dt);
  player.x += (player.tx - player.x) * follow;
  player.y += (player.ty - player.y) * follow;

  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0) {
    spawnThought();
    const pace = Math.max(0.38, 0.95 - game.elapsed * 0.012);
    game.spawnTimer = random(pace * 0.55, pace * 1.1);
  }

  for (let i = game.thoughts.length - 1; i >= 0; i -= 1) {
    const thought = game.thoughts[i];
    const speedScale = game.slowTimer > 0 && thought.type !== "gold" ? 0.48 : 1;

    thought.x += thought.vx * dt * speedScale;
    thought.y += thought.vy * dt * speedScale;
    thought.spin += thought.spinSpeed * dt;
    thought.pulse += dt * 5;

    const dx = player.x - thought.x;
    const dy = player.y - thought.y;
    const dist = Math.hypot(dx, dy) || 1;
    const pullRadius = player.suckRadius + (game.magnetTimer > 0 ? 95 : 0);

    if (dist < pullRadius) {
      const influence = 1 - dist / pullRadius;
      if (thought.type === "bad" && game.magnetTimer > 0) {
        const repel = influence * 940;
        thought.vx -= (dx / dist) * repel * dt;
        thought.vy -= (dy / dist) * repel * dt;
      } else if (thought.type !== "bad") {
        const pull = influence * (game.magnetTimer > 0 ? 860 : 500);
        thought.vx += (dx / dist) * pull * dt;
        thought.vy += (dy / dist) * pull * dt;
      }
    }

    if (dist < player.radius + thought.radius * 0.65) {
      collectThought(thought);
      game.thoughts.splice(i, 1);
      continue;
    }

    if (thought.x < -100 || thought.x > width + 100 || thought.y < -100 || thought.y > height + 100) {
      game.thoughts.splice(i, 1);
    }
  }

  updateParticles(dt);
  updateHud();
}

function spawnThought() {
  const side = Math.floor(random(0, 4));
  const padding = 54;
  let x = 0;
  let y = 0;

  if (side === 0) {
    x = random(-padding, 0);
    y = random(40, height - 40);
  } else if (side === 1) {
    x = random(width, width + padding);
    y = random(40, height - 40);
  } else if (side === 2) {
    x = random(40, width - 40);
    y = random(-padding, 0);
  } else {
    x = random(40, width - 40);
    y = random(height, height + padding);
  }

  const targetX = random(width * 0.16, width * 0.84);
  const targetY = random(height * 0.16, height * 0.84);
  const angle = Math.atan2(targetY - y, targetX - x) + random(-0.65, 0.65);
  const speed = random(60, 128) + Math.min(70, game.elapsed * 2);
  const roll = Math.random();
  const type = roll < 0.14 ? "bad" : roll > 0.92 ? "gold" : "good";
  const emojis = type === "bad" ? BAD_EMOJIS : type === "gold" ? GOLD_EMOJIS : GOOD_EMOJIS;

  game.thoughts.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: type === "gold" ? 25 : 22,
    type,
    emoji: pick(emojis),
    spin: random(0, Math.PI * 2),
    spinSpeed: random(-1.2, 1.2),
    pulse: random(0, Math.PI * 2)
  });
}

function collectThought(thought) {
  if (thought.type === "bad") {
    if (game.shieldActive) {
      game.shieldActive = false;
      game.combo = 1;
      game.streak = 0;
      game.shake = 0.45;
      burst(thought.x, thought.y, "#b9fff3", 22);
      playSound("gold");
      return;
    }

    game.lives -= 1;
    game.combo = 1;
    game.streak = 0;
    game.shake = 1;
    burst(thought.x, thought.y, "#ff5b6e", 18);
    playSound("bad");
    if (game.lives <= 0) endGame();
    return;
  }

  let points = thought.type === "gold" ? 50 : 10;
  if (game.doubleTimer > 0) points *= 2;
  points *= game.combo;
  game.score += points;

  if (thought.type === "good") {
    addTaskProgress("goodThoughts", 1);
    game.streak += 1;
    if (game.streak % 5 === 0) {
      game.combo = Math.min(5, game.combo + 1);
      game.maxComboThisRun = Math.max(game.maxComboThisRun, game.combo);
      addTaskProgress("combo", game.combo);
      playSound("combo");
    } else {
      playSound("good");
    }
    burst(thought.x, thought.y, "#7ee7c8", 14);
  } else {
    addTaskProgress("goldThoughts", 1);
    applyRandomBonus();
    burst(thought.x, thought.y, "#ffd34f", 24);
    playSound("gold");
  }
}

function applyRandomBonus() {
  const bonusDuration = 6 + progress.upgrades.bonus * 1.2;
  const bonus = pick(["magnet", "slow", "double"]);

  if (bonus === "magnet") game.magnetTimer = bonusDuration;
  if (bonus === "slow") game.slowTimer = bonusDuration;
  if (bonus === "double") game.doubleTimer = bonusDuration;
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = random(0, Math.PI * 2);
    const speed = random(50, 230);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: random(0.35, 0.8),
      maxLife: 0.8,
      size: random(3, 8),
      color
    });
  }
}

function updateParticles(dt) {
  for (let i = game.particles.length - 1; i >= 0; i -= 1) {
    const particle = game.particles[i];
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 120 * dt;
    particle.vx *= 0.985;
    if (particle.life <= 0) game.particles.splice(i, 1);
  }
}

function updateBackground(dt) {
  for (const bubble of backgroundBubbles) {
    bubble.x += bubble.vx * dt;
    bubble.y += bubble.vy * dt;
    bubble.wobble += dt;
    if (bubble.x < -80) bubble.x = width + 80;
    if (bubble.x > width + 80) bubble.x = -80;
    if (bubble.y < -80) bubble.y = height + 80;
    if (bubble.y > height + 80) bubble.y = -80;
  }
}

function updateHud() {
  if (!game) return;
  ui.hudScore.textContent = game.score;
  ui.hudLives.textContent = "♥".repeat(Math.max(0, game.lives));
  ui.hudCombo.textContent = `x${game.combo}`;

  const activeBonus = getActiveBonusText();
  ui.bonusPill.textContent = activeBonus;
  ui.bonusPill.classList.toggle("hidden", !activeBonus);
}

function getActiveBonusText() {
  if (!game) return "";
  const active = [];
  if (game.magnetTimer > 0) active.push(`${tr("smartMagnet")} ${Math.ceil(game.magnetTimer)}s`);
  if (game.slowTimer > 0) active.push(`${tr("slow")} ${Math.ceil(game.slowTimer)}s`);
  if (game.doubleTimer > 0) active.push(`x2 ${Math.ceil(game.doubleTimer)}s`);
  if (game.shieldActive) active.push(tr("shield"));
  return active.join(" · ");
}

function updateMenu() {
  ensureDailyState();
  ui.menuBestScore.textContent = progress.bestScore;
  renderDailyReward();
}

function renderUpgrades() {
  ensureDailyState();
  ui.starsCount.textContent = progress.stars;
  ui.upgradesList.innerHTML = "";
  ui.boostersList.innerHTML = "";
  ui.skinsList.innerHTML = "";
  ui.dailyTasksList.innerHTML = "";

  Object.entries(upgradeInfo).forEach(([key, info]) => {
    const level = progress.upgrades[key];
    const cost = info.costs[level] || 0;
    const isMax = level >= info.max;
    const card = document.createElement("article");
    card.className = "upgrade-card";

    const text = document.createElement("div");
    text.innerHTML = `<h3>${infoTitle(info)} ${level}/${info.max}</h3><p>${infoText(info)}</p>`;

    const button = document.createElement("button");
    button.textContent = isMax ? tr("max") : `★ ${cost}`;
    button.disabled = isMax || progress.stars < cost;
    button.addEventListener("click", () => buyUpgrade(key));

    card.append(text, button);
    ui.upgradesList.append(card);
  });

  Object.entries(boosterInfo).forEach(([key, info]) => {
    const count = progress.boosters[key] || 0;
    const card = document.createElement("article");
    card.className = "store-card";

    const preview = document.createElement("div");
    preview.className = "store-preview";
    preview.style.background = key === "magnetStart" ? "#c8fff2" : key === "shield" ? "#b9d7ff" : "#fff1a8";

    const text = document.createElement("div");
    text.innerHTML = `<strong>${infoTitle(info)}</strong><span>${infoText(info)} ${tr("ownedCount", { count, max: MAX_BOOSTERS })}</span>`;

    const button = document.createElement("button");
    button.textContent = count >= MAX_BOOSTERS ? tr("max") : `★ ${info.cost}`;
    button.disabled = count >= MAX_BOOSTERS || progress.stars < info.cost;
    button.addEventListener("click", () => buyBooster(key));

    card.append(preview, text, button);
    ui.boostersList.append(card);
  });

  Object.entries(skinInfo).forEach(([key, info]) => {
    const owned = progress.ownedSkins.includes(key);
    const selected = progress.activeSkin === key;
    const card = document.createElement("article");
    card.className = "store-card";

    const preview = document.createElement("div");
    preview.className = "store-preview";
    preview.style.background = `linear-gradient(135deg, ${info.robe[1]}, ${info.robe[2]})`;

    const text = document.createElement("div");
    text.innerHTML = `<strong>${infoTitle(info)}</strong><span>${owned ? tr("ownedForever") : tr("price", { cost: info.cost })}</span>`;

    const button = document.createElement("button");
    button.textContent = selected ? tr("selected") : owned ? tr("select") : `★ ${info.cost}`;
    button.disabled = selected || (!owned && progress.stars < info.cost);
    button.addEventListener("click", () => buyOrSelectSkin(key));

    card.append(preview, text, button);
    ui.skinsList.append(card);
  });

  progress.dailyTasks.forEach((task) => {
    const info = taskDefinitions[task.id];
    if (!info) return;

    const current = Math.min(task.progress, info.target);
    const isDone = current >= info.target;
    const card = document.createElement("article");
    card.className = "task-card";

    const text = document.createElement("div");
    text.innerHTML = `<strong>${infoTitle(info)}</strong><span>${current}/${info.target} · ${tr("reward", { value: DAILY_TASK_REWARD })}</span>`;

    const button = document.createElement("button");
    button.textContent = task.claimed ? tr("done") : isDone ? tr("claim") : `${current}/${info.target}`;
    button.disabled = task.claimed || !isDone;
    button.addEventListener("click", () => claimTaskReward(task.id));

    card.append(text, button);
    ui.dailyTasksList.append(card);
  });

  const allClaimed = progress.dailyTasks.length > 0 && progress.dailyTasks.every((task) => task.claimed);
  if (allClaimed && !progress.dailyTasksCompletedBonusClaimed) {
    progress.stars += DAILY_ALL_TASKS_REWARD;
    progress.dailyTasksCompletedBonusClaimed = true;
    saveProgress();
    ui.starsCount.textContent = progress.stars;
    playSound("gold");
  }

  ui.tasksBonusText.textContent = progress.dailyTasksCompletedBonusClaimed ? tr("allTasksClaimed") : tr("allTasksBonus", { value: DAILY_ALL_TASKS_REWARD });
}

function buyBooster(key) {
  const info = boosterInfo[key];
  if (!info) return;

  const count = progress.boosters[key] || 0;
  if (count >= MAX_BOOSTERS || progress.stars < info.cost) return;

  progress.stars -= info.cost;
  progress.boosters[key] = count + 1;
  saveProgress();
  renderUpgrades();
  playSound("buy");
}

function buyOrSelectSkin(key) {
  const info = skinInfo[key];
  if (!info) return;

  if (progress.ownedSkins.includes(key)) {
    progress.activeSkin = key;
    saveProgress();
    renderUpgrades();
    playSound("buy");
    return;
  }

  if (progress.stars < info.cost) return;

  progress.stars -= info.cost;
  progress.ownedSkins.push(key);
  progress.activeSkin = key;
  saveProgress();
  renderUpgrades();
  playSound("gold");
}

function applyStartingBoosters() {
  let changed = false;

  if (progress.boosters.magnetStart > 0) {
    progress.boosters.magnetStart -= 1;
    game.magnetTimer = Math.max(game.magnetTimer, 6);
    changed = true;
  }

  if (progress.boosters.doubleStart > 0) {
    progress.boosters.doubleStart -= 1;
    game.doubleTimer = Math.max(game.doubleTimer, 8);
    changed = true;
  }

  if (progress.boosters.shield > 0) {
    progress.boosters.shield -= 1;
    game.shieldActive = true;
    changed = true;
  }

  if (changed) saveProgress();
}

function buyUpgrade(key) {
  const info = upgradeInfo[key];
  const level = progress.upgrades[key];
  const cost = info.costs[level] || 0;

  if (level >= info.max || progress.stars < cost) return;

  progress.stars -= cost;
  progress.upgrades[key] += 1;
  saveProgress();
  renderUpgrades();
  playSound("buy");
}

function renderDailyReward() {
  const today = getTodayKey();
  const isClaimed = progress.dailyRewardDate === today;

  ui.dailyRewardText.textContent = isClaimed ? tr("dailyRewardClaimed") : tr("dailyRewardReady");
  ui.dailyRewardButton.textContent = isClaimed ? tr("done") : `★ ${DAILY_REWARD_STARS}`;
  ui.dailyRewardButton.disabled = isClaimed;
}

function claimDailyReward() {
  ensureDailyState();
  const today = getTodayKey();
  if (progress.dailyRewardDate === today) return;

  progress.dailyRewardDate = today;
  progress.stars += DAILY_REWARD_STARS;
  saveProgress();
  renderDailyReward();
  renderUpgrades();
  playSound("gold");
}

function claimTaskReward(taskId) {
  ensureDailyState();
  const task = progress.dailyTasks.find((item) => item.id === taskId);
  const info = taskDefinitions[taskId];
  if (!task || !info || task.claimed || task.progress < info.target) return;

  task.claimed = true;
  progress.stars += DAILY_TASK_REWARD;
  saveProgress();
  renderUpgrades();
  playSound("buy");
}

function addTaskProgress(taskId, amount) {
  ensureDailyState();
  const task = progress.dailyTasks.find((item) => item.id === taskId);
  const info = taskDefinitions[taskId];
  if (!task || !info || task.claimed) return;

  if (taskId === "score" || taskId === "combo") {
    task.progress = Math.max(task.progress, amount);
  } else {
    task.progress += amount;
  }

  task.progress = Math.min(task.progress, info.target);
  saveProgress();
}

function normalizeBoosters(boosters) {
  return {
    magnetStart: clamp(Number(boosters?.magnetStart) || 0, 0, MAX_BOOSTERS),
    shield: clamp(Number(boosters?.shield) || 0, 0, MAX_BOOSTERS),
    doubleStart: clamp(Number(boosters?.doubleStart) || 0, 0, MAX_BOOSTERS)
  };
}

function normalizeOwnedSkins(ownedSkins) {
  const owned = Array.isArray(ownedSkins) ? ownedSkins.filter((key) => skinInfo[key]) : [];
  if (!owned.includes("blue")) owned.unshift("blue");
  return [...new Set(owned)];
}

function normalizeActiveSkin(activeSkin, ownedSkins) {
  const owned = normalizeOwnedSkins(ownedSkins);
  return owned.includes(activeSkin) ? activeSkin : "blue";
}

function getActiveSkin() {
  return skinInfo[progress.activeSkin] || skinInfo.blue;
}

function ensureDailyState() {
  const today = getTodayKey();
  const validTasks = Array.isArray(progress.dailyTasks) && progress.dailyTasks.every((task) => taskDefinitions[task.id]);

  if (progress.dailyTasksDate !== today || !validTasks || progress.dailyTasks.length !== 3) {
    progress.dailyTasksDate = today;
    progress.dailyTasks = createDailyTasks(today);
    progress.dailyTasksCompletedBonusClaimed = false;
    saveProgress();
    return;
  }

  progress.dailyTasks = progress.dailyTasks.map((task) => {
    const info = taskDefinitions[task.id];
    return {
      id: task.id,
      progress: clamp(Number(task.progress) || 0, 0, info.target),
      claimed: Boolean(task.claimed)
    };
  });
}

function createDailyTasks(dateKey) {
  const ids = Object.keys(taskDefinitions);
  const seed = dateKey.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const shifted = ids.map((id, index) => ids[(index + seed) % ids.length]);

  return shifted.slice(0, 3).map((id) => ({
    id,
    progress: 0,
    claimed: false
  }));
}

function getTodayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function draw() {
  drawBackground();

  if (!game || !game.running) {
    return;
  }

  ctx.save();
  if (game.shake > 0) {
    ctx.translate(random(-8, 8) * game.shake, random(-8, 8) * game.shake);
  }

  drawSuctionField();
  game.thoughts.forEach(drawThought);
  game.particles.forEach(drawParticle);
  drawPlayer(game.player.x, game.player.y);
  ctx.restore();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#b6f3ff");
  gradient.addColorStop(0.48, "#f9f0ff");
  gradient.addColorStop(1, "#ffe8a8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  backgroundBubbles.forEach((bubble) => {
    ctx.beginPath();
    ctx.arc(bubble.x + Math.sin(bubble.wobble) * 8, bubble.y, bubble.r, 0, Math.PI * 2);
    ctx.fillStyle = bubble.color;
    ctx.fill();
  });
}

function drawSuctionField() {
  const player = game.player;
  const radius = player.suckRadius + (game.magnetTimer > 0 ? 95 : 0);
  const alpha = game.magnetTimer > 0 ? 0.2 : 0.1;

  ctx.beginPath();
  ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.fill();
  ctx.strokeStyle = game.magnetTimer > 0 ? "rgba(255, 202, 62, 0.72)" : "rgba(255, 255, 255, 0.38)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 10]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawThought(thought) {
  const bob = Math.sin(thought.pulse) * 3;
  ctx.save();
  ctx.translate(thought.x, thought.y + bob);
  ctx.rotate(thought.spin * 0.12);

  const style = {
    good: {
      gradient: ["#ffffff", "#b9f7df"],
      stroke: "#1fbf7f",
      glow: "rgba(31, 191, 127, 0.22)",
      badge: "+",
      badgeFill: "#1fbf7f"
    },
    bad: {
      gradient: ["#fff1f4", "#ff8fa3"],
      stroke: "#f03e63",
      glow: "rgba(240, 62, 99, 0.26)",
      badge: "!",
      badgeFill: "#f03e63"
    },
    gold: {
      gradient: ["#fff9c9", "#ffc83d"],
      stroke: "#ffae00",
      glow: "rgba(255, 200, 61, 0.34)",
      badge: "★",
      badgeFill: "#ffae00"
    }
  }[thought.type];

  ctx.beginPath();
  ctx.arc(0, 0, thought.radius + 8, 0, Math.PI * 2);
  ctx.fillStyle = style.glow;
  ctx.fill();

  const gradient = ctx.createRadialGradient(-8, -10, 4, 0, 0, thought.radius + 10);
  gradient.addColorStop(0, style.gradient[0]);
  gradient.addColorStop(1, style.gradient[1]);

  ctx.beginPath();
  ctx.arc(0, 0, thought.radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = style.stroke;
  ctx.stroke();

  ctx.font = `${thought.radius + 3}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(thought.emoji, 0, 1);

  ctx.beginPath();
  ctx.arc(thought.radius * 0.63, -thought.radius * 0.62, 9, 0, Math.PI * 2);
  ctx.fillStyle = style.badgeFill;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = thought.type === "gold" ? "700 12px Arial" : "900 15px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(style.badge, thought.radius * 0.63, -thought.radius * 0.62 + 0.5);

  ctx.restore();
}

function drawParticle(particle) {
  const alpha = Math.max(0, particle.life / particle.maxLife);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawPlayer(x, y) {
  ctx.save();
  ctx.translate(x, y);

  const auraPulse = game && game.running ? 1 + Math.sin(game.elapsed * 4) * 0.06 : 1;
  const skin = getActiveSkin();
  const startProgress = game ? clamp(game.vacuumStartTimer / VACUUM_START_DURATION, 0, 1) : 0;
  const startShake = startProgress > 0 ? Math.sin(game.elapsed * 72) * startProgress * 1.8 : 0;
  const bob = game && game.running ? Math.sin(game.elapsed * 8) * 1.4 + startShake : 0;
  const startupGlow = startProgress > 0 ? 0.16 + Math.sin(game.elapsed * 18) * 0.06 : 0;

  // Soft magical suction aura around the vacuum.
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.arc(2, -1, 47 * auraPulse, 0, Math.PI * 2);
  ctx.fillStyle = skin.auraFill;
  ctx.fill();
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 3;
  ctx.strokeStyle = skin.aura;
  ctx.setLineDash([7, 9]);
  ctx.beginPath();
  ctx.arc(2, -1, 56 * auraPulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  drawSparkle(-45, -28, 6, "#ffd75d");
  drawSparkle(38, -34, 5, "#ffffff");
  drawSparkle(43, 22, 6, "#b9fff3");

  ctx.translate(0, bob);
  if (startProgress > 0) {
    ctx.rotate(Math.sin(game.elapsed * 58) * startProgress * 0.025);
  }
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  if (isVacuumBitmapReady()) {
    drawVacuumBitmap(startProgress, startupGlow);
  } else {
    drawVacuumFallback(startProgress, startupGlow);
  }
  ctx.restore();
  return;
}

function drawVacuumBitmap(startProgress, startupGlow) {
  const scale = 0.4;
  const drawWidth = vacuumPlayerImage.naturalWidth * scale;
  const drawHeight = vacuumPlayerImage.naturalHeight * scale;
  const bodyCenterX = 255 * scale;
  const bodyCenterY = 260 * scale;

  ctx.save();
  ctx.shadowColor = "rgba(23, 36, 61, 0.22)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;
  ctx.drawImage(vacuumPlayerImage, -bodyCenterX, -bodyCenterY, drawWidth, drawHeight);
  ctx.restore();

  if (startupGlow > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = startupGlow;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, -2, 45, 31, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (startProgress > 0) {
    drawStartupSuction(startProgress);
  }
}

function drawVacuumFallback(startProgress, startupGlow) {
  ctx.save();
  ctx.scale(0.84, 0.84);

  ctx.shadowColor = "rgba(23, 36, 61, 0.24)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 7;

  const hoseGradient = ctx.createLinearGradient(-28, -86, 58, -62);
  hoseGradient.addColorStop(0, "#17233a");
  hoseGradient.addColorStop(0.45, "#64758e");
  hoseGradient.addColorStop(1, "#222d45");

  ctx.lineWidth = 14;
  ctx.strokeStyle = hoseGradient;
  ctx.beginPath();
  ctx.moveTo(-16, -57);
  ctx.bezierCurveTo(-8, -104, 62, -108, 76, -54);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.26)";
  for (let i = 0; i < 8; i += 1) {
    const x = -6 + i * 11;
    ctx.beginPath();
    ctx.moveTo(x, -86 + Math.sin(i) * 5);
    ctx.lineTo(x + 5, -71 + Math.cos(i) * 4);
    ctx.stroke();
  }

  ctx.lineWidth = 11;
  ctx.strokeStyle = "#e8f4ff";
  ctx.beginPath();
  ctx.moveTo(-76, 32);
  ctx.lineTo(-42, -44);
  ctx.stroke();
  ctx.lineWidth = 15;
  ctx.strokeStyle = "#202b42";
  ctx.beginPath();
  ctx.moveTo(-44, -45);
  ctx.lineTo(-32, -53);
  ctx.stroke();

  ctx.fillStyle = "#1f2a42";
  roundRectPath(ctx, -112, 47, 72, 28, 6);
  ctx.fill();
  const nozzleGradient = ctx.createLinearGradient(-109, 48, -43, 72);
  nozzleGradient.addColorStop(0, "#f8fcff");
  nozzleGradient.addColorStop(0.6, "#e5f1f8");
  nozzleGradient.addColorStop(1, "#9aacbd");
  ctx.fillStyle = nozzleGradient;
  roundRectPath(ctx, -107, 42, 78, 21, 5);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#14213a";
  ctx.stroke();

  const bodyGradient = ctx.createLinearGradient(-48, -36, 78, 72);
  bodyGradient.addColorStop(0, "#4fefff");
  bodyGradient.addColorStop(0.55, "#18bbe4");
  bodyGradient.addColorStop(1, "#1177bd");
  ctx.fillStyle = bodyGradient;
  roundRectPath(ctx, -54, -45, 126, 93, 38);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#16243d";
  ctx.stroke();

  const sideGradient = ctx.createLinearGradient(47, -31, 93, 30);
  sideGradient.addColorStop(0, "#ffe29b");
  sideGradient.addColorStop(1, "#ff9f18");
  ctx.fillStyle = sideGradient;
  roundRectPath(ctx, 50, -26, 39, 63, 12);
  ctx.fill();
  ctx.strokeStyle = "#14213a";
  ctx.stroke();

  ctx.fillStyle = "#26334c";
  roundRectPath(ctx, -50, 30, 139, 27, 11);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.24)";
  roundRectPath(ctx, -39, 33, 65, 6, 3);
  ctx.fill();

  ctx.fillStyle = "#1d2941";
  ctx.beginPath();
  ctx.arc(73, 49, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#52647d";
  ctx.beginPath();
  ctx.arc(73, 49, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a9c6e9";
  ctx.beginPath();
  ctx.arc(73, 49, 10, 0, Math.PI * 2);
  ctx.fill();

  drawVacuumFallbackEye(-21, -7);
  drawVacuumFallbackEye(25, -7);
  ctx.strokeStyle = "#101a2d";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(2, 13, 15, 0.18 * Math.PI, 0.82 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = "#ff7890";
  ctx.globalAlpha = 0.82;
  ctx.beginPath();
  ctx.ellipse(-45, 16, 10, 7, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(47, 16, 10, 7, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.beginPath();
  ctx.ellipse(13, -32, 26, 10, 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  if (startupGlow > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = startupGlow * 0.75;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, -2, 45, 31, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (startProgress > 0) {
    drawStartupSuction(startProgress);
  }
}

function drawVacuumFallbackEye(x, y) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(x, y, 15, 20, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#081225";
  ctx.beginPath();
  ctx.ellipse(x + 2, y + 2, 9, 13, -0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x - 3, y - 6, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function roundRectPath(context, x, y, widthValue, heightValue, radius) {
  const r = Math.min(radius, widthValue / 2, heightValue / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + widthValue - r, y);
  context.quadraticCurveTo(x + widthValue, y, x + widthValue, y + r);
  context.lineTo(x + widthValue, y + heightValue - r);
  context.quadraticCurveTo(x + widthValue, y + heightValue, x + widthValue - r, y + heightValue);
  context.lineTo(x + r, y + heightValue);
  context.quadraticCurveTo(x, y + heightValue, x, y + heightValue - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function drawStartupSuction(strength) {
  ctx.save();
  const alpha = Math.min(0.9, 0.25 + strength * 0.65);
  const t = game?.elapsed || 0;

  ctx.globalAlpha = alpha * 0.28;
  const cone = ctx.createLinearGradient(-138, 20, -66, 40);
  cone.addColorStop(0, "rgba(31, 191, 163, 0)");
  cone.addColorStop(0.55, "rgba(126, 231, 200, 0.65)");
  cone.addColorStop(1, "rgba(255, 255, 255, 0.95)");
  ctx.beginPath();
  ctx.moveTo(-145, 8);
  ctx.quadraticCurveTo(-102, 27, -68, 34);
  ctx.quadraticCurveTo(-103, 56, -145, 64);
  ctx.closePath();
  ctx.fillStyle = cone;
  ctx.fill();

  const colors = ["#ffffff", "#7ee7c8", "#ffd75d", "#ff8fb0"];
  for (let i = 0; i < 9; i += 1) {
    const phase = (t * 115 + i * 19) % 58;
    const x = -142 + phase;
    const y = 12 + i * 6 + Math.sin(t * 8 + i) * 4;
    ctx.globalAlpha = alpha * (0.55 + (i % 3) * 0.12);
    ctx.lineWidth = 2.4 + (i % 3) * 0.8;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 23, y - 13, -103, 43 + Math.sin(i) * 8, -70, 37 + Math.cos(i) * 5);
    ctx.stroke();
  }

  for (let i = 0; i < 14; i += 1) {
    const phase = (t * 125 + i * 23) % 74;
    const size = 2 + (i % 4) * 0.7;
    ctx.globalAlpha = alpha * (0.5 + (phase / 74) * 0.35);
    ctx.fillStyle = colors[(i + 1) % colors.length];
    ctx.beginPath();
    ctx.arc(-145 + phase, 15 + (i % 7) * 7 + Math.sin(t * 9 + i) * 4, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = alpha;
  for (let i = 0; i < 4; i += 1) {
    drawSparkle(-130 + ((t * 80 + i * 28) % 58), 20 + i * 10, 3.2, colors[(i + 2) % colors.length]);
  }

  ctx.restore();
}

function drawSparkle(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.32, -size * 0.32);
  ctx.lineTo(size, 0);
  ctx.lineTo(size * 0.32, size * 0.32);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.32, size * 0.32);
  ctx.lineTo(-size, 0);
  ctx.lineTo(-size * 0.32, -size * 0.32);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.stroke();
  ctx.restore();
}
function createBackgroundBubble() {
  return {
    x: random(0, Math.max(width, 320)),
    y: random(0, Math.max(height, 420)),
    r: random(18, 74),
    vx: random(-10, 10),
    vy: random(-8, 8),
    wobble: random(0, 10),
    color: pick([
      "rgba(255,255,255,0.22)",
      "rgba(255,111,145,0.10)",
      "rgba(31,191,163,0.10)",
      "rgba(255,200,61,0.12)"
    ])
  };
}

function unlockAudio() {
  if (progress.soundMuted) return;
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
}

function getSoundVolume() {
  return progress.soundMuted ? 0 : 0.72;
}

function startVacuumLoop() {
  if (progress.soundMuted || !audioContext || !game || !game.running || vacuumLoop) return;

  const now = audioContext.currentTime;
  const duration = VACUUM_START_DURATION;
  game.vacuumStartTimer = Math.max(game.vacuumStartTimer || 0, duration);
  const volume = getSoundVolume();
  const hum = audioContext.createOscillator();
  const humGain = audioContext.createGain();
  const rumble = audioContext.createOscillator();
  const rumbleGain = audioContext.createGain();
  const noise = audioContext.createBufferSource();
  const noiseLowFilter = audioContext.createBiquadFilter();
  const noiseAirFilter = audioContext.createBiquadFilter();
  const noiseGain = audioContext.createGain();
  const masterGain = audioContext.createGain();
  const bufferSize = Math.max(1, Math.floor(audioContext.sampleRate * 0.55));
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    const grain = Math.random() * 2 - 1;
    const flutter = Math.sin(i * 0.045) * 0.18;
    data[i] = (grain + flutter) * 0.5;
  }

  hum.type = "sawtooth";
  hum.frequency.setValueAtTime(42, now);
  hum.frequency.exponentialRampToValueAtTime(118, now + 0.55);
  hum.frequency.setTargetAtTime(106, now + 0.7, 0.7);
  humGain.gain.setValueAtTime(0.36, now);

  rumble.type = "triangle";
  rumble.frequency.setValueAtTime(27, now);
  rumble.frequency.exponentialRampToValueAtTime(54, now + 0.45);
  rumbleGain.gain.setValueAtTime(0.2, now);

  noise.buffer = buffer;
  noise.loop = true;
  noiseLowFilter.type = "lowpass";
  noiseLowFilter.frequency.setValueAtTime(650, now);
  noiseLowFilter.frequency.exponentialRampToValueAtTime(1850, now + 0.65);
  noiseLowFilter.Q.setValueAtTime(0.45, now);
  noiseAirFilter.type = "bandpass";
  noiseAirFilter.frequency.setValueAtTime(850, now);
  noiseAirFilter.frequency.exponentialRampToValueAtTime(1450, now + 0.5);
  noiseAirFilter.Q.setValueAtTime(0.9, now);
  noiseGain.gain.setValueAtTime(0.64, now);

  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.13), now + 0.18);
  masterGain.gain.setTargetAtTime(Math.max(0.001, volume * 0.095), now + 0.6, 0.55);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  hum.connect(humGain);
  humGain.connect(masterGain);
  rumble.connect(rumbleGain);
  rumbleGain.connect(masterGain);
  noise.connect(noiseLowFilter);
  noiseLowFilter.connect(noiseAirFilter);
  noiseAirFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  masterGain.connect(audioContext.destination);

  hum.start(now);
  rumble.start(now);
  noise.start(now);
  hum.stop(now + duration + 0.03);
  rumble.stop(now + duration + 0.03);
  noise.stop(now + duration + 0.03);
  vacuumLoop = { hum, rumble, noise, masterGain, endTime: now + duration };
  window.setTimeout(() => {
    if (vacuumLoop?.hum === hum) vacuumLoop = null;
  }, Math.ceil((duration + 0.08) * 1000));
}

function stopVacuumLoop(immediate = false) {
  if (!vacuumLoop || !audioContext) {
    vacuumLoop = null;
    return;
  }

  const loop = vacuumLoop;
  const now = audioContext.currentTime;
  const fade = immediate ? 0.01 : 0.22;
  vacuumLoop = null;

  try {
    loop.masterGain.gain.cancelScheduledValues(now);
    loop.masterGain.gain.setValueAtTime(Math.max(0.001, loop.masterGain.gain.value), now);
    loop.masterGain.gain.exponentialRampToValueAtTime(0.001, now + fade);
    loop.hum.stop(now + fade + 0.02);
    loop.rumble?.stop(now + fade + 0.02);
    loop.noise.stop(now + fade + 0.02);
  } catch (error) {
    console.warn("Не удалось остановить звук пылесоса:", error);
  }
}

function playSound(type) {
  if (progress.soundMuted || !audioContext) return;

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  const oscillator = audioContext.createOscillator();
  const settings = {
    good: [520, 0.05, "sine", 0.05],
    combo: [760, 0.09, "triangle", 0.07],
    gold: [920, 0.12, "sine", 0.09],
    bad: [140, 0.16, "sawtooth", 0.08],
    buy: [660, 0.08, "square", 0.04],
    over: [180, 0.28, "triangle", 0.06]
  }[type] || [440, 0.06, "sine", 0.04];

  oscillator.type = settings[2];
  oscillator.frequency.setValueAtTime(settings[0], now);
  if (type === "bad" || type === "over") {
    oscillator.frequency.exponentialRampToValueAtTime(80, now + settings[1]);
  } else {
    oscillator.frequency.exponentialRampToValueAtTime(settings[0] * 1.5, now + settings[1]);
  }

  gain.gain.setValueAtTime(Math.max(0.001, settings[3] * getSoundVolume()), now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + settings[1]);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + settings[1] + 0.02);
}

function toggleSound() {
  progress.soundMuted = !progress.soundMuted;
  if (progress.soundMuted && audioContext && audioContext.state === "running") {
    stopVacuumLoop(true);
    audioContext.suspend().catch(() => {});
  } else if (!progress.soundMuted) {
    unlockAudio();
    startVacuumLoop();
    playSound("buy");
  }
  saveProgress();
  updateSoundControls();
}

function updateSoundControls() {
  if (!ui.soundToggleButton) return;
  ui.soundToggleButton.textContent = progress.soundMuted ? "🔇" : "🔊";
  ui.soundToggleButton.setAttribute("aria-label", progress.soundMuted ? tr("soundOff") : tr("soundOn"));
  ui.soundToggleButton.title = progress.soundMuted ? tr("soundOff") : tr("soundOn");
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

