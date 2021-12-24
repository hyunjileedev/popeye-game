'use strict';

import Instruction from './src/instruction.js';
import State from './src/state.js';

const TIME_LIMIT_IN_SEC = 10;
const MULTIPLE_FOR_ITEM_NUM = 5;

const infoBtn = document.querySelector('.info__btn');
const timerText = document.querySelector('.timer__text');
const timerValue = document.querySelector('.timer__value');
const playground = document.querySelector('.game__playground');
const plate = document.querySelector('.playground__plate');
const popup = document.querySelector('.game__popup');
const popupMsg = document.querySelector('.popup__message');
const nextBtn = document.querySelector('.popup__next-btn');
const replayBtn = document.querySelector('.popup__replay-btn');
const cancelBtn = document.querySelector('.popup__cancel-btn');

let stage = 1;
let spinachNum = stage * MULTIPLE_FOR_ITEM_NUM;
let poisonNum = stage * MULTIPLE_FOR_ITEM_NUM;

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

const gameInstruction = new Instruction();
const popeyeState = new State();

// To guarantee correct DOMRect
addEventListener('load', () => {
  plateRect = plate.getBoundingClientRect();
  playgroundRect = playground.getBoundingClientRect();

  infoBtn.addEventListener('click', () =>
    !isPlaying ? startGame(TIME_LIMIT_IN_SEC) : stopGame('replay')
  );
});

playground.addEventListener('click', onPlaygroundClick);

function startGame(timeLimitInSecs) {
  isPlaying = true;
  changeInfoBtn('stop');
  startTimer(timeLimitInSecs);
  initCounter();
  initPlayground();
  playSound(bgm);
}

function stopGame(result) {
  isPlaying = false;
  disableInfoBtn();
  stopTimer();
  popeyeState.update(result);
  showPopupWithMsg(result);
  pauseSound(bgm);
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
      playSound(winSound);
      msg = 'I GOT STRONG 💪';
      changePopupBtn();
      break;
    case 'lose':
      playSound(loseSound);
      msg = 'I am dead 👻';
      showReplayBtn();
      break;
    case 'replay':
      playSound(replaySound);
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

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function pauseSound(sound) {
  sound.pause();
}

function onPlaygroundClick(e) {
  if (!isPlaying) {
    return;
  }

  const target = e.target;
  if (!target.matches('.playground__item')) {
    return;
  }

  target.matches('.spinach') ? onSpinachClick(target) : stopGame('lose');
}

function onSpinachClick(target) {
  playSound(spinachSound);
  target.remove();
  counter--;
  popeyeState.scale(spinachNum, counter);
  if (counter === 0) {
    stopGame('win');
  }
}

nextBtn.addEventListener('click', () => {
  updateGameSetting();
  resetGame();
  startGame(TIME_LIMIT_IN_SEC);
});

replayBtn.addEventListener('click', () => {
  resetGameSetting();
  resetGame();
  startGame(TIME_LIMIT_IN_SEC);
});

cancelBtn.addEventListener('click', () => {
  resetGameSetting();
  resetGame();
  gameInstruction.show();
});

function updateGameSetting() {
  spinachNum = poisonNum = ++stage * MULTIPLE_FOR_ITEM_NUM;
}

function resetGameSetting() {
  stage = 1;
  spinachNum = poisonNum = stage * MULTIPLE_FOR_ITEM_NUM;
}

function resetGame() {
  resetInfoBtn();
  resetTimer();
  popeyeState.reset();
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

function resetPlayground() {
  playground.innerHTML = `
  <img src="image/plate.png" alt="plate" class="playground__plate" />
  `;
}

function hidePopup() {
  popup.classList.add('game__popup--hidden');
}
