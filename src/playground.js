'use strict';

export default class Playground {
  constructor() {
    this.playground = document.querySelector('.game__playground');
    this.playground.addEventListener('click', e => {
      this.onPlaygroundClick && this.onPlaygroundClick(e);
    });
    this.plate = document.querySelector('.playground__plate');
    window.addEventListener('load', () => {
      this.plateRect = this.plate.getBoundingClientRect();
      this.playgroundRect = this.playground.getBoundingClientRect();
    });
  }

  setClickListener(onPlaygroundClick) {
    this.onPlaygroundClick = onPlaygroundClick;
  }

  init(spinachNum, poisonNum) {
    this._displayItems('spinach', spinachNum);
    this._displayItems('poison', poisonNum);
  }

  _displayItems(itemName, itemNum) {
    for (let i = 0; i < itemNum; i++) {
      const item = this._createItem(itemName);
      this.playground.appendChild(item);
    }
  }

  _createItem(itemName) {
    const x = random(
      this.plateRect.left - this.playgroundRect.left,
      this.plateRect.right - this.playgroundRect.left - 50
    );
    const y = random(
      this.plateRect.top - this.playgroundRect.top,
      this.plateRect.bottom - this.playgroundRect.top - 50
    );

    const item = document.createElement('img');
    item.setAttribute('src', `image/${itemName}.png`);
    item.setAttribute('class', `playground__item ${itemName}`);
    item.style.position = 'absolute';
    item.style.top = `${y}px`;
    item.style.left = `${x}px`;
    return item;
  }

  reset() {
    this.playground.innerHTML = `
    <img src="image/plate.png" alt="plate" class="playground__plate" />
    `;
  }
}

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}
