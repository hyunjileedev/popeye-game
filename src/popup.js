'use strict';

import { Result } from './game.js';
import * as sound from './sound.js';

export const BtnType = Object.freeze({
  next: 'next',
  replay: 'replay',
  cancel: 'cancel',
});

export class Popup {
  constructor() {
    this.popup = document.querySelector('.game__popup');
    this.msg = document.querySelector('.popup__message');
    this.nextBtn = document.querySelector('.popup__next-btn');
    this.nextBtn.addEventListener('click', () => {
      this.onNextClick && this.onNextClick();
    });
    this.replayBtn = document.querySelector('.popup__replay-btn');
    this.replayBtn.addEventListener('click', () => {
      this.onReplayClick && this.onReplayClick();
    });
    this.cancelBtn = document.querySelector('.popup__cancel-btn');
    this.cancelBtn.addEventListener('click', () => {
      this.onCancelClick && this.onCancelClick();
    });
  }

  setNextClickListener(onNextClick) {
    this.onNextClick = onNextClick;
  }

  setReplayClickListener(onReplayClick) {
    this.onReplayClick = onReplayClick;
  }

  setCancelClickListener(onCancelClick) {
    this.onCancelClick = onCancelClick;
  }

  showWithMsg = (result, currentStage, totalStages) => {
    let msg;
    switch (result) {
      case Result.win:
        sound.playWin();
        msg = 'I GOT STRONG 💪';
        this.#switchBtn(currentStage, totalStages);
        break;
      case Result.lose:
        sound.playLose();
        msg = 'I am dead 👻';
        this.#showReplayBtn();
        break;
      case Result.replay:
        sound.playReplay();
        msg = 'Wanna replay?';
        this.#showReplayBtn();
        break;
      default:
        throw new Error('not handled result');
    }
    this.msg.textContent = msg;
    this.popup.classList.remove('game__popup--hidden');
  };

  #switchBtn = (currentStage, totalStages) => {
    currentStage === totalStages ? this.#showReplayBtn() : this.#showNextBtn();
  };

  #showNextBtn = () => {
    this.replayBtn.classList.add('popup__btn--hidden');
    this.nextBtn.classList.remove('popup__btn--hidden');
  };

  #showReplayBtn = () => {
    this.replayBtn.classList.remove('popup__btn--hidden');
    this.nextBtn.classList.add('popup__btn--hidden');
  };

  hide = () => {
    this.popup.classList.add('game__popup--hidden');
  };
}
