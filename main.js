'use strict';

const infoBtn = document.querySelector('.info__btn');
const timerText = document.querySelector('.timer__text');
const timerValue = document.querySelector('.timer__value');
const playground = document.querySelector('.game__playground');
const playgroundRect = playground.getBoundingClientRect();
const plate = document.querySelector('.playground__plate');
const plateRect = plate.getBoundingClientRect();
const stateImg = document.querySelector('.state__img');
const stateDefault = document.querySelector('.state__default');

const spinachNum = 3;
let counter = spinachNum;

infoBtn.addEventListener('click', () => {
  startGame(10, 3, 10);
});

function startGame(timeLimitInSecs, spinachNum, poisonNum) {
  changeInfoBtn();
  startTimer(timeLimitInSecs);
  setCounter(spinachNum);
  setPlayground(spinachNum, poisonNum);
}

function changeInfoBtn() {
  infoBtn.innerHTML = `<i class="fas fa-stop"></i> Stop`;
}

function startTimer(timeLimitInSecs) {
  let remainingSecs = timeLimitInSecs;
  timerText.textContent = formatTime(remainingSecs);
  timerValue.style.width = `calc(${remainingSecs} / ${timeLimitInSecs} * 100%)`;

  const timer = setInterval(() => {
    timerText.textContent = formatTime(--remainingSecs);
    timerValue.style.width = `calc(${remainingSecs} / ${timeLimitInSecs} * 100%)`;
    if (remainingSecs === 0) {
      clearTimeout(timer);
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

function setCounter(spinachNum) {
  counter = spinachNum;
}

function setPlayground(spinachNum, poisonNum) {
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

playground.addEventListener('click', e => {
  const target = e.target;
  if (!target.matches('.playground__item')) {
    return;
  }
  if (target.matches('.spinach')) {
    onSpinachClick(target);
  } else {
    onPoisonClick();
  }
});

function onSpinachClick(target) {
  target.remove();
  counter--;
  stateDefault.style.transform = `scale(calc(1 + (${spinachNum} - ${counter}) / ${spinachNum}))`;
  if (counter === 0) {
    console.log('I am FULL!!!');
    changeStateImg('win');
  }
}

function onPoisonClick() {
  console.log('I am deadX(');
  changeStateImg('lose');
}

function changeStateImg(state) {
  stateImg.innerHTML = `<img src="image/${state}.png" alt="Popeye ${state}" class="state__popeye" />`;
}
