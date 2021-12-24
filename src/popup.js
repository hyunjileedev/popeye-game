'use strict';

export default class Popup {
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

  showWithMsg(result, stage) {
    let msg;
    switch (result) {
      case 'win':
        // playSound(winSound);
        msg = 'I GOT STRONG 💪';
        this._switchBtn(stage);
        break;
      case 'lose':
        // playSound(loseSound);
        msg = 'I am dead 👻';
        this._showReplayBtn();
        break;
      case 'replay':
        // playSound(replaySound);
        msg = 'Wanna replay?';
        this._showReplayBtn();
        break;
      default:
        throw new Error('not handled result');
    }
    this.msg.textContent = msg;
    this.popup.classList.remove('game__popup--hidden');
  }

  _switchBtn = stage => {
    stage === 1 || stage === 2 ? this._showNextBtn() : this._showReplayBtn();
  };

  _showNextBtn = () => {
    this.replayBtn.classList.add('popup__btn--hidden');
    this.nextBtn.classList.remove('popup__btn--hidden');
  };

  _showReplayBtn = () => {
    this.replayBtn.classList.remove('popup__btn--hidden');
    this.nextBtn.classList.add('popup__btn--hidden');
  };

  hide() {
    this.popup.classList.add('game__popup--hidden');
  }
}