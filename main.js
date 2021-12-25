'use strict';

import Instruction from './src/instruction.js';
import GameBuilder from './src/game.js';
import Popup from './src/popup.js';

const gameInstruction = new Instruction();
const popeyeGame = new GameBuilder()
  .withTotalStages(3)
  .withMultipleForItemNum(2)
  .withTimeLimitInSecs(5)
  .build();
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
