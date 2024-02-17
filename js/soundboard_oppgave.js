import { sounds } from "../data/sounds.js";

const buttons = document.getElementById("buttons");
const output = document.getElementById("output");
const screen = document.querySelector(".screen");
const power = document.getElementById("power");

/* ========================================================================== */
/*                            CREATE      ELEMENTS                            */
/* ========================================================================== */
createButtons();
/* ------------------------------- Button Stop ------------------------------ */
const muteButton = createNode("button", {
  id: "stop",
});
muteButton.innerHTML = "<span>STOP</span>";
muteButton.addEventListener("click", () => {
  setPause();
});
const divStop = createNode("div", {
  class: "button-block flex center",
});
divStop.appendChild(muteButton);
buttons.appendChild(divStop);

/* ---------------------- PlaybackRate + Volume Buttons --------------------- */
const form = createNode("form", {
  class: "flex column",
});
/* ------------------------------ PlaybackRate */
const playbackRate = createNode("input", {
  id: "pbr",
  type: "range",
  value: 1,
  min: 0.25,
  max: 2,
  step: 0.25,
  disabled: "",
});
playbackRate.value = 1;
const currentPbr = createNode("span", {
  id: "currentPbr",
});
currentPbr.innerText = playbackRate.value;
const pbrText = createNode("p", {});

pbrText.innerHTML = "Playback rate: ";
pbrText.appendChild(currentPbr);
form.appendChild(playbackRate);
form.appendChild(pbrText);

/* --------------------------------- Volume */
const volume = createNode("input", {
  id: "volume",
  type: "range",
  value: 50,
  min: 0,
  max: 100,
  step: 25,
  disabled: "",
});
const currentVol = createNode("span", {
  id: "currentVol",
});
currentVol.innerText = volume.value;
const volText = createNode("p", {});

volText.innerHTML = "Volume: ";
volText.appendChild(currentVol);
form.appendChild(volume);
form.appendChild(volText);

const range = document.getElementById("range");
range.appendChild(form);

/* ========================================================================== */
/*                          EVENTLISTENER + FUNCTIONS                         */
/* ========================================================================== */
power.addEventListener("click", (event) => {
  if (power.classList.contains("off")) {
    document.addEventListener("keypress", playSound);
    buttons.addEventListener("click", playSound);
    screen.style.backgroundColor = "#7ce4f7";
    power.style.background = `url("../images/powerOn.png") no-repeat`;
    /* ------------ Changing CSS Pseudo-element Styles Via JavaScript ----------- */
    document.documentElement.style.setProperty(
      "--track-background",
      "url(../images/trackOn.png) 0 0/100% 100% no-repeat"
    );
  }

  if (power.classList.contains("on")) {
    setPause();
    document.removeEventListener("keypress", playSound);
    buttons.removeEventListener("click", playSound);
    playbackRate.disabled = true;
    volume.disabled = true;
    volume.value = 50;
    currentVol.innerText = "50";
    screen.style.backgroundColor = "rgb(96, 92, 83)";
    power.style.background = `url("../images/powerOff.png") no-repeat`;
    document.documentElement.style.setProperty(
      "--track-background",
      "url(../images/trackOff.png) 0 0/100% 100% no-repeat"
    );
  }
  power.classList.toggle("off");
  power.classList.toggle("on");
});

function createButtons() {
  sounds.forEach((value) => {
    const array = setButton(value.file);
    const divButton = createNode("div", {
      class: "button-block flex center",
    });
    array.button.appendChild(array.playFile);
    divButton.appendChild(array.button);
    buttons.appendChild(divButton);
  });
}

function setButton(item) {
  let playFile = "";
  let button = "";

  sounds.map((el) => {
    if (el.file === item) {
      button = createNode("button", {
        class: "button-square",
      });
      button.textContent = el.key;
      playFile = createNode("audio", {
        src: el.file,
        id: el.key,
      });
    }
  });
  return { button: button, playFile: playFile };
}

function playSound(event) {
  setPause();

  let id = "";
  if (event.type === "keypress") {
    id = event.key;
  } else if (event.type === "click") {
    if (event.target.classList.contains("button-square")) {
      id = event.target.lastElementChild.id;
    }
  }

  sounds.map((el) => {
    if (id === el.key) {
      //prepear file name to display
      const splitArr = el.file.split("/");
      let fileString = splitArr[splitArr.length - 1];
      const firstLetter = fileString.charAt(0).toUpperCase();
      fileString = firstLetter + fileString.slice(1);
      const symbol = /-/g;
      const file = symbol[Symbol.replace](fileString, " ");
      output.innerText = file;

      const playingNow = document.getElementById(id);

      volume.disabled = false;
      volume.addEventListener("input", () => {
        playingNow.volume = volume.value / 100;
        currentVol.innerText = volume.value;
      });
      playbackRate.disabled = false;
      playbackRate.addEventListener("input", () => {
        playingNow.playbackRate = playbackRate.value;
        currentPbr.innerText = playbackRate.value;
      });
      playingNow.play();
    }
  });
  /* ---- To Remove Focus From Target Button / Space Button Stops Sound Now --- */
  if (document.activeElement != document.body) {
    document.activeElement.blur();
  }
}

function setPause() {
  const audioElements = document.querySelectorAll("audio");
  audioElements.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.playbackRate = 1;
    const resetSpeed = document.getElementById("currentPbr");
    resetSpeed.innerText = 1;
    playbackRate.value = 1;
    output.innerText = "";
  });
}

function createNode(node, attributes) {
  const el = document.createElement(node);
  for (let key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  return el;
}
