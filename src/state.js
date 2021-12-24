'use strict';

export default class State {
  constructor() {
    this.popeye = document.querySelector('.state__popeye');
  }

  scale(spinachNum, counter) {
    this.popeye.style.transform = `scale(calc(1 + (${spinachNum} - ${counter}) / ${spinachNum}))`;
  }

  update(state) {
    if (state === 'replay') {
      return;
    }
    this.popeye.setAttribute('src', `image/${state}.png`);
    this.popeye.setAttribute('alt', `Popeye ${state}`);
    this.popeye.classList.remove('state__default');
    this.popeye.style.transform = 'none';
  }

  reset() {
    this.popeye.setAttribute('src', 'image/default.png');
    this.popeye.setAttribute('alt', 'Popeye default');
    this.popeye.classList.add('state__default');
    this.popeye.style.transform = 'none';
  }
}
