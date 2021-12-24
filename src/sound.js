'use strict';

const spinachSound = new Audio('sound/spinach.wav');
const winSound = new Audio('sound/win.wav');
const loseSound = new Audio('sound/lose.wav');
const replaySound = new Audio('sound/replay.wav');
const bgm = new Audio('sound/bgm.m4a');

export function playSpinach() {
  playSound(spinachSound);
}

export function playWin() {
  playSound(winSound);
}

export function playLose() {
  playSound(loseSound);
}

export function playReplay() {
  playSound(replaySound);
}

export function playBgm() {
  playSound(bgm);
}

export function pauseBgm() {
  pauseSound(bgm);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function pauseSound(sound) {
  sound.pause();
}
