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
const replayBtn = document.querySelector('.popup__replay-btn');
const cancelBtn = document.querySelector('.popup__cancel-btn');

let isPlaying = false;
const spinachNum = 3;
let timer;
let counter = spinachNum;
let playgroundRect;
let plateRect;

// To guarantee correct DOMRect
addEventListener('load', () => {
  plateRect = plate.getBoundingClientRect();
  playgroundRect = playground.getBoundingClientRect();

  infoBtn.addEventListener('click', () =>
    !isPlaying ? startGame(10, 3, 10) : stopGame('replay')
  );
});

function startGame(timeLimitInSecs, spinachNum, poisonNum) {
  isPlaying = true;
  changeInfoBtn('stop');
  startTimer(timeLimitInSecs);
  initCounter();
  initPlayground(spinachNum, poisonNum);
}

function stopGame(result) {
  isPlaying = false;
  disableInfoBtn();
  stopTimer();
  updateStateImg(result);
  showPopupWithMsg(result);
}

function changeInfoBtn(type) {
  infoBtn.innerHTML = `<i class="fas fa-${type}"></i> ${type}`;
}

function disableInfoBtn() {
  infoBtn.setAttribute('disabled', '');
}

function startTimer(timeLimitInSecs) {
  let remainingSecs = timeLimitInSecs;
  timerText.textContent = formatTime(remainingSecs);
  timerValue.style.width = `calc(${remainingSecs} / ${timeLimitInSecs} * 100%)`;

  timer = setInterval(() => {
    timerText.textContent = formatTime(--remainingSecs);
    timerValue.style.width = `calc(${remainingSecs} / ${timeLimitInSecs} * 100%)`;
    if (remainingSecs === 0) {
      clearTimeout(timer);
      if (counter !== 0) {
        stopGame('lose');
      }
    }
  }, 1000);
}

function formatTime(timeInSecs) {
  const mins = parseInt(timeInSecs / 60);
  const secs = timeInSecs % 60;
  const formatedMins = mins < 10 ? `0${mins}` : mins;
  const formatedSecs = secs < 10 ? `0${secs}` : secs;
  return `${formatedMins}:${formatedSecs}`;
}

function stopTimer() {
  clearTimeout(timer);
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

function initPlayground(spinachNum, poisonNum) {
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
      msg = 'I GOT STRONG 💪';
      break;
    case 'lose':
      msg = 'I am dead 👻';
      break;
    case 'replay':
      msg = 'Wanna replay?';
      break;
    default:
      throw new Error('not handled result');
  }
  popupMsg.textContent = msg;
  popup.classList.remove('game__popup--hidden');
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
  target.remove();
  counter--;
  statePopeye.style.transform = `scale(calc(1 + (${spinachNum} - ${counter}) / ${spinachNum}))`;
  if (counter === 0) {
    stopGame('win');
  }
}

replayBtn.addEventListener('click', () => {
  resetGame();
  startGame(10, 3, 10);
});

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

cancelBtn.addEventListener('click', () => {
  resetGame();
});
