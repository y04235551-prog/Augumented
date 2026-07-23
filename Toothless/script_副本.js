const viewer = document.querySelector("#flightViewer");
const playButton = document.querySelector("#playButton");
const statusText = document.querySelector("#animationStatus");

const animationDurations = {};


async function prepareAnimations() {
  const animationNames = Object.keys(animationDurations);

  if (animationNames.length < 2) {
    return;
  }


  const mainAnimation = animationNames.reduce((longest, name) => {
    if (animationDurations[name] > animationDurations[longest]) {
      return name;
    }

    return longest;
  });

  const mainDuration = animationDurations[mainAnimation];

  viewer.pause();


  [...viewer.appendedAnimations].forEach((name) => {
    viewer.detachAnimation(name, {
      fade: false
    });
  });


  viewer.animationName = mainAnimation;

  await viewer.updateComplete;

  viewer.currentTime = 0;


  animationNames
    .filter((name) => name !== mainAnimation)
    .forEach((name) => {
      viewer.appendAnimation(name, {
        weight: 1,
        time: 0,
        fade: false,


        timeScale:
          animationDurations[name] / mainDuration
      });
    });
}


viewer.addEventListener("load", async () => {
  const animationNames = viewer.availableAnimations;

  if (animationNames.length < 2) {
    statusText.textContent =
      animationNames.length + " animation found";

    return;
  }


  for (const name of animationNames) {
    viewer.animationName = name;

    await viewer.updateComplete;

    animationDurations[name] = viewer.duration;
  }

  await prepareAnimations();

  playButton.disabled = false;
});


playButton.addEventListener("click", async () => {
  await prepareAnimations();

  viewer.play();
});


// 找到声音按钮和背景音乐。
const soundButton = document.querySelector("#soundButton");
const backgroundMusic = document.querySelector("#backgroundMusic");

// 0.35 表示 35% 音量，避免音乐一开始太响。
backgroundMusic.volume = 0.35;

// 点击按钮时直接播放音乐。
soundButton.addEventListener("click", () => {
  backgroundMusic.play();
  soundButton.textContent = "♪ SOUND ON";
  soundButton.classList.add("is-playing");
});
