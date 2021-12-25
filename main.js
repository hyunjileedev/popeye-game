'use strict';

import Instruction from './src/instruction.js';
import Game from './src/game.js';
import Popup from './src/popup.js';

const TOTAL_STAGES = 5;
const MULTIPLE_FOR_ITEM_NUM = 1;
const TIME_LIMIT_IN_SEC = 10;

const gameInstruction = new Instruction();
const popeyeGame = new Game(
  TOTAL_STAGES,
  MULTIPLE_FOR_ITEM_NUM,
  TIME_LIMIT_IN_SEC
);
const gameStopPopup = new Popup();

popeyeGame.setStopListener(gameStopPopup.showWithMsg);

gameStopPopup.setNextClickListener(() => {
  popeyeGame.reset('next');
  popeyeGame.start();
});

gameStopPopup.setReplayClickListener(() => {
  popeyeGame.reset('replay');
  popeyeGame.start();
});

gameStopPopup.setCancelClickListener(() => {
  popeyeGame.reset('cancel');
  gameInstruction.show();
});

popeyeGame.setResetListener(gameStopPopup.hide);
