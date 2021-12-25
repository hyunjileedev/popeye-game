'use strict';

const infoBtn = document.querySelector('.info__btn');
const timerText = document.querySelector('.timer__text');
const timerValue = document.querySelector('.timer__value');
const playground = document.querySelector('.game__playground');
const plate = document.querySelector('.playground__plate');
const stateImg = document.querySelector('.state__img');
const statePopeye = document.querySelector('.state__popeye');
const popup = document.querySelector('.game__popup');
const popupMsg = document.querySelector('.popup__message');
const nextBtn = document.querySelector('.popup__next-btn');
const replayBtn = document.querySelector('.popup__replay-btn');
const cancelBtn = document.querySelector('.popup__cancel-btn');
const instruction = document.querySelector('.instruction');

const timeLimit = 10;
const multiple = 5;
let stage = 1;
let spinachNum = stage * multiple;
let poisonNum = stage * multiple;

let isPlaying = false;
let timer;
let counter = spinachNum;
let playgroundRect;
let plateRect;

const spinachSound = new Audio('sound/spinach.wav');
const winSound = new Audio('sound/win.wav');
const loseSound = new Audio('sound/lose.wav');
const replaySound = new Audio('sound/replay.wav');
const bgm = new Audio('sound/bgm.m4a');

// To guarantee correct DOMRect
addEventListener('load', () => {
  plateRect = plate.getBoundingClientRect();
  playgroundRect = playground.getBoundingClientRect();

  infoBtn.addEventListener('click', () =>
    !isPlaying ? startGame(timeLimit) : stopGame('replay')
  );
});

function startGame(timeLimitInSecs) {
  isPlaying = true;
  changeInfoBtn('stop');
  startTimer(timeLimitInSecs);
  initCounter();
  initPlayground();
  bgm.play();
}

function stopGame(result) {
  isPlaying = false;
  disableInfoBtn();
  stopTimer();
  updateStateImg(result);
  showPopupWithMsg(result);
  bgm.pause();
}

function changeInfoBtn(type) {
  infoBtn.innerHTML = `<i class="fas fa-${type}"></i> ${type}`;
}

function disableInfoBtn() {
  infoBtn.setAttribute('disabled', '');
}

function startTimer(timeLimitInSecs) {
  let remainingSecs = timeLimitInSecs;
  updateTimerText(remainingSecs);
  updateTimerBar(remainingSecs, timeLimitInSecs);

  timer = setInterval(() => {
    updateTimerText(--remainingSecs);
    updateTimerBar(remainingSecs, timeLimitInSecs);
    if (remainingSecs <= 0) {
      clearInterval(timer);
      if (counter !== 0) {
        stopGame('lose');
      }
    }
  }, 1000);
}

function updateTimerText(remainingSecs) {
  timerText.textContent = formatTime(remainingSecs);
}

function updateTimerBar(remainingSecs, timeLimitInSecs) {
  timerValue.style.width = `calc(${remainingSecs} / ${timeLimitInSecs} * 100%)`;
}

function formatTime(timeInSecs) {
  const mins = parseInt(timeInSecs / 60);
  const secs = timeInSecs % 60;
  const formatedMins = mins < 10 ? `0${mins}` : mins;
  const formatedSecs = secs < 10 ? `0${secs}` : secs;
  return `${formatedMins}:${formatedSecs}`;
}

function stopTimer() {
  clearInterval(timer);
}

function initCounter() {
  counter = spinachNum;
}

function updateStateImg(state) {
  if (state === 'replay') {
    return;
  }
  statePopeye.setAttribute('src', `image/${state}.png`);
  statePopeye.setAttribute('alt', `Popeye ${state}`);
  statePopeye.classList.remove('state__default');
  statePopeye.removeAttribute('style');
}

function initPlayground() {
  displayItems('spinach', spinachNum);
  displayItems('poison', poisonNum);
}

function displayItems(itemName, itemNum) {
  for (let i = 0; i < itemNum; i++) {
    const item = createItem(itemName);
    playground.appendChild(item);
  }
}

function createItem(itemName) {
  const x = random(
    plateRect.left - playgroundRect.left,
    plateRect.right - playgroundRect.left - 50
  );
  const y = random(
    plateRect.top - playgroundRect.top,
    plateRect.bottom - playgroundRect.top - 50
  );

  const item = document.createElement('img');
  item.setAttribute('src', `image/${itemName}.png`);
  item.setAttribute('class', `playground__item ${itemName}`);
  item.style.position = 'absolute';
  item.style.top = `${y}px`;
  item.style.left = `${x}px`;
  return item;
}

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function showPopupWithMsg(result) {
  let msg;
  switch (result) {
    case 'win':
      winSound.play();
      msg = 'I GOT STRONG 💪';
      changePopupBtn();
      break;
    case 'lose':
      loseSound.play();
      msg = 'I am dead 👻';
      showReplayBtn();
      break;
    case 'replay':
      replaySound.play();
      msg = 'Wanna replay?';
      showReplayBtn();
      break;
    default:
      throw new Error('not handled result');
  }
  popupMsg.textContent = msg;
  popup.classList.remove('game__popup--hidden');
}

function changePopupBtn() {
  stage === 1 || stage === 2 ? showNextBtn() : showReplayBtn();
}

function showNextBtn() {
  replayBtn.classList.add('popup__btn--hidden');
  nextBtn.classList.remove('popup__btn--hidden');
}

function showReplayBtn() {
  replayBtn.classList.remove('popup__btn--hidden');
  nextBtn.classList.add('popup__btn--hidden');
}

playground.addEventListener('click', e => {
  if (!isPlaying) {
    return;
  }

  const target = e.target;
  if (!target.matches('.playground__item')) {
    return;
  }

  target.matches('.spinach') ? onSpinachClick(target) : stopGame('lose');
});

function onSpinachClick(target) {
  spinachSound.currentTime = 0;
  spinachSound.play();
  target.remove();
  counter--;
  statePopeye.style.transform = `scale(calc(1 + (${spinachNum} - ${counter}) / ${spinachNum}))`;
  if (counter === 0) {
    stopGame('win');
  }
}

nextBtn.addEventListener('click', () => {
  updateGameSetting();
  resetGame();
  startGame(timeLimit);
});

replayBtn.addEventListener('click', () => {
  resetGameSetting();
  resetGame();
  startGame(timeLimit);
});

cancelBtn.addEventListener('click', () => {
  resetGameSetting();
  resetGame();
  showInstruction();
});

function updateGameSetting() {
  spinachNum = poisonNum = ++stage * multiple;
}

function resetGameSetting() {
  stage = 1;
  spinachNum = poisonNum = stage * multiple;
}

function resetGame() {
  resetInfoBtn();
  resetTimer();
  resetStateImg();
  resetPlayground();
  hidePopup();
}

function resetInfoBtn() {
  infoBtn.removeAttribute('disabled');
  changeInfoBtn('play');
}

function resetTimer() {
  timerText.textContent = '00:00';
  timerValue.style.width = '0';
}

function resetStateImg() {
  statePopeye.setAttribute('src', 'image/default.png');
  statePopeye.setAttribute('alt', 'Popeye default');
  statePopeye.classList.add('state__default');
}

function resetPlayground() {
  playground.innerHTML = `
  <img src="image/plate.png" alt="plate" class="playground__plate" />
  `;
}

function hidePopup() {
  popup.classList.add('game__popup--hidden');
}

instruction.addEventListener('click', () => {
  hideInstruction();
});

function showInstruction() {
  instruction.classList.remove('instruction--hidden');
}

function hideInstruction() {
  instruction.classList.add('instruction--hidden');
}
