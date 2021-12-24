'use strict';

import Instruction from './src/instruction.js';
import State from './src/state.js';
import Popup from './src/popup.js';
import Playground from './src/playground.js';

const TIME_LIMIT_IN_SEC = 10;
const MULTIPLE_FOR_ITEM_NUM = 1;
const TOTAL_STAGES = 5;

const infoBtn = document.querySelector('.info__btn');
const timerText = document.querySelector('.timer__text');
const timerValue = document.querySelector('.timer__value');

let currentStage = 1;
let spinachNum = currentStage * MULTIPLE_FOR_ITEM_NUM;
let poisonNum = currentStage * MULTIPLE_FOR_ITEM_NUM;

let isPlaying = false;
let timer;
let counter = spinachNum;

const spinachSound = new Audio('sound/spinach.wav');
const winSound = new Audio('sound/win.wav');
const loseSound = new Audio('sound/lose.wav');
const replaySound = new Audio('sound/replay.wav');
const bgm = new Audio('sound/bgm.m4a');

const gameInstruction = new Instruction();
const popeyeState = new State();
const gameStopPopup = new Popup();
const gamePlayground = new Playground();

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

gamePlayground.setClickListener(onGamePlaygroundClick);

// To guarantee correct DOMRect
addEventListener('load', () => {
  infoBtn.addEventListener('click', () =>
    !isPlaying ? startGame(TIME_LIMIT_IN_SEC) : stopGame('replay')
  );
});

function startGame(timeLimitInSecs) {
  isPlaying = true;
  changeInfoBtn('stop');
  startTimer(timeLimitInSecs);
  initCounter();
  gamePlayground.init(spinachNum, poisonNum);
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

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function pauseSound(sound) {
  sound.pause();
}

function onGamePlaygroundClick(e) {
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
  gamePlayground.reset();
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
