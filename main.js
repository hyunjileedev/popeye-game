'use strict';

import Instruction from './src/instruction.js';
import State from './src/state.js';
import Popup from './src/popup.js';

const TIME_LIMIT_IN_SEC = 10;
const MULTIPLE_FOR_ITEM_NUM = 1;
const TOTAL_STAGES = 5;

const infoBtn = document.querySelector('.info__btn');
const timerText = document.querySelector('.timer__text');
const timerValue = document.querySelector('.timer__value');
const playground = document.querySelector('.game__playground');
const plate = document.querySelector('.playground__plate');

let currentStage = 1;
let spinachNum = currentStage * MULTIPLE_FOR_ITEM_NUM;
let poisonNum = currentStage * MULTIPLE_FOR_ITEM_NUM;

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
const gameStopPopup = new Popup();

gameStopPopup.setNextClickListener(() => {
  resetGame('next');
  startGame(TIME_LIMIT_IN_SEC);
});

gameStopPopup.setReplayClickListener(() => {
  resetGame('replay');
  startGame(TIME_LIMIT_IN_SEC);
});

gameStopPopup.setCancelClickListener(() => {
  resetGame('cancel');
  gameInstruction.show();
});

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
  gameStopPopup.showWithMsg(result, currentStage, TOTAL_STAGES);
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

function updateGameSetting(clickedBtn) {
  currentStage = clickedBtn === 'next' ? ++currentStage : 1;
  spinachNum = currentStage * MULTIPLE_FOR_ITEM_NUM;
  poisonNum = currentStage * MULTIPLE_FOR_ITEM_NUM;
}

function resetGame(clickedBtn) {
  updateGameSetting(clickedBtn);
  resetInfoBtn();
  resetTimer();
  popeyeState.reset();
  resetPlayground();
  gameStopPopup.hide();
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
