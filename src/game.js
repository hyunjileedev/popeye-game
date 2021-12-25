'use strict';

import { Playground, ItemType } from './playground.js';
import State from './state.js';
import { Result, BtnType } from './popup.js';
import * as sound from './sound.js';

export default class GameBuilder {
  withTotalStages(stages) {
    this.totalStages = stages;
    return this;
  }

  withMultipleForItemNum(multiple) {
    this.multipleForItemNum = multiple;
    return this;
  }

  withTimeLimitInSecs(timeLimit) {
    this.timeLimitInSecs = timeLimit;
    return this;
  }

  build() {
    return new Game(
      this.totalStages, //
      this.multipleForItemNum,
      this.timeLimitInSecs
    );
  }
}

const MainBtnType = Object.freeze({
  play: 'play',
  stop: 'stop',
});

class Game {
  constructor(totalStages, multipleForItemNum, timeLimitInSec) {
    this.totalStages = totalStages;
    this.multipleForItemNum = multipleForItemNum;
    this.timeLimitInSec = timeLimitInSec;

    this.mainBtn = document.querySelector('.info__btn');
    this.mainBtn.addEventListener('click', this.onMainBtnClick);
    this.timerText = document.querySelector('.timer__text');
    this.timerValue = document.querySelector('.timer__value');
    this.playground = new Playground();
    this.playground.setItemClickListener(this.onItemClick);
    this.popeyeState = new State();

    this.currentStage = 1;
    this.spinachNum = this.currentStage * this.multipleForItemNum;
    this.poisonNum = this.currentStage * this.multipleForItemNum;

    this.isPlaying = false;
    this.timer;
    this.counter;
  }

  setStopListener(onStop) {
    this.onStop = onStop;
  }

  setResetListener(onReset) {
    this.onReset = onReset;
  }

  onMainBtnClick = () => {
    !this.isPlaying ? this.start() : this.stop(Result.replay);
  };

  start() {
    this.isPlaying = true;
    this.switchMainBtn(MainBtnType.stop);
    this.startTimer(this.timeLimitInSec);
    this.initCounter();
    this.playground.init(this.spinachNum, this.poisonNum);
    sound.playBgm();
  }

  stop(result) {
    this.isPlaying = false;
    this.disableMainBtn();
    this.stopTimer();
    this.popeyeState.update(result);
    this.onStop && this.onStop(result, this.currentStage, this.totalStages);
    sound.pauseBgm();
  }

  reset(clickedBtn) {
    this.updateGameSetting(clickedBtn);
    this.resetMainBtn();
    this.resetTimer();
    this.popeyeState.reset();
    this.playground.reset();
    this.onReset && this.onReset();
  }

  switchMainBtn(type) {
    this.mainBtn.innerHTML = `<i class="fas fa-${type}"></i> ${type}`;
  }

  disableMainBtn() {
    this.mainBtn.setAttribute('disabled', '');
  }

  startTimer(timeLimitInSecs) {
    let remainingSecs = timeLimitInSecs;
    this.updateTimerText(remainingSecs);
    this.updateTimerBar(remainingSecs, timeLimitInSecs);

    this.timer = setInterval(() => {
      this.updateTimerText(--remainingSecs);
      this.updateTimerBar(remainingSecs, timeLimitInSecs);
      if (remainingSecs <= 0) {
        this.stopTimer();
        if (this.counter <= 0) {
          return;
        }
        this.stop(Result.lose);
      }
    }, 1000);
  }

  updateTimerText(remainingSecs) {
    this.timerText.textContent = formatTime(remainingSecs);
  }

  updateTimerBar(remainingSecs, timeLimitInSecs) {
    this.timerValue.style.width = `calc(${remainingSecs} / ${timeLimitInSecs} * 100%)`;
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  initCounter() {
    this.counter = this.spinachNum;
  }

  onItemClick = (itemName, target) => {
    if (!this.isPlaying) {
      return;
    }
    itemName === ItemType.spinach
      ? this.onSpinachClick(target)
      : this.stop(Result.lose);
  };

  onSpinachClick(target) {
    sound.playSpinach();
    target.remove();
    this.counter--;
    this.popeyeState.scale(this.spinachNum, this.counter);
    if (this.counter <= 0) {
      this.stop(Result.win);
    }
  }

  updateGameSetting(clickedBtn) {
    this.currentStage = clickedBtn === BtnType.next ? ++this.currentStage : 1;
    this.spinachNum = this.currentStage * this.multipleForItemNum;
    this.poisonNum = this.currentStage * this.multipleForItemNum;
  }

  resetMainBtn() {
    this.mainBtn.removeAttribute('disabled');
    this.switchMainBtn(MainBtnType.play);
  }

  resetTimer() {
    this.timerText.textContent = '00:00';
    this.timerValue.style.width = '0';
  }
}

function formatTime(timeInSecs) {
  const mins = parseInt(timeInSecs / 60);
  const secs = timeInSecs % 60;
  const formatedMins = mins < 10 ? `0${mins}` : mins;
  const formatedSecs = secs < 10 ? `0${secs}` : secs;
  return `${formatedMins}:${formatedSecs}`;
}
