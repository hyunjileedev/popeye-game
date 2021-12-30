'use strict';

import Instruction from './src/instruction.js';
import { GameBuilder } from './src/game.js';
import { Popup, BtnType } from './src/popup.js';

const gameInstruction = new Instruction();
const popeyeGame = new GameBuilder()
  .withTotalStages(3)
  .withMultipleForItemNum(5)
  .withTimeLimitInSecs(10)
  .build();
const gameStopPopup = new Popup();

popeyeGame.setStopListener(gameStopPopup.showWithMsg);

gameStopPopup.setNextClickListener(() => {
  popeyeGame.reset(BtnType.next);
  popeyeGame.start();
});

gameStopPopup.setReplayClickListener(() => {
  popeyeGame.reset(BtnType.stop);
  popeyeGame.start();
});

gameStopPopup.setCancelClickListener(() => {
  popeyeGame.reset(BtnType.cancel);
  gameInstruction.show();
});

popeyeGame.setResetListener(gameStopPopup.hide);
