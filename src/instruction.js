'use strict';

export default class Instruction {
  constructor() {
    this.instruction = document.querySelector('.instruction');
    this.instruction.addEventListener('click', this.hide);
  }

  show() {
    this.instruction.classList.remove('instruction--hidden');
  }

  hide = () => {
    this.instruction.classList.add('instruction--hidden');
  };
}
