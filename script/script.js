function $(el) {
  return document.querySelectorAll(el).length > 1
    ? document.querySelectorAll(el)
    : document.querySelector(el);
}
const video = $(".video"),
  player = $(".player"),
  line = $(".line"),
  lineBack = $(".line__back"),
  lineRed = $(".line__red"),
  lineWhi = $(".line__white"),
  pIicn = $(".p-icn"),
  icn = $(".icon"),
  volume = $(".volume"),
  volumeIcon = $(".volume__icon"),
  volumeLine = $(".volume__line"),
  volumeCont = $(".volume__cont"),
  time = $(".time"),
  timeProg = $(".time__prog"),
  timeResult = $(".time__result");

let lineFlag = false;
let lineWhite = false;
let volumeFlag = false;

line.addEventListener("mousedown", function (e) {
  lineFlag = true;
});
line.addEventListener("mouseenter", function (e) {
  lineWhite = true;
});
line.addEventListener("mouseleave", function (e) {
  lineWhite = false;
});
volumeLine.addEventListener("mousedown", function (e) {
  volumeFlag = true;
});

window.addEventListener("mousemove", function (e) {
  e.preventDefault();
  if (lineFlag) {
    const { offsetX, clientX } = e;
    const lineLeft = line.getBoundingClientRect().left;
    const lineWidth = line.clientWidth;
    const present = (100 * offsetX) / lineWidth;
    if (offsetX < lineWidth && clientX - lineLeft > 0) {
      video.currentTime = (video.duration * present) / 100;
    }
  } else if (lineWhite) {
    const { offsetX } = e;
    lineWhi.style.width = offsetX + "px";
  } else if (!lineWhite) {
    lineWhi.style.width = 0 + "px";
  }
  if (volumeFlag) {
    const { offsetX, clientX } = e;
    const volumWidth = volumeLine.clientWidth;
    const volumLeft = volumeLine.getBoundingClientRect().left;
    if (offsetX < volumWidth && clientX - volumLeft > 0) {
      if (clientX - volumLeft < volumWidth) {
        video.volume = Math.floor(clientX - volumLeft) / 100;
      }
    }
  }
});

window.addEventListener("mouseup", function (e) {
  lineFlag = false;
  volumeFlag = false;
});

// The time is shown
video.addEventListener("loadedmetadata", function (e) {
  console.dir(this);
  timeResult.innerHTML = timeDecoder(this.duration);
});
// The time is progressed
video.addEventListener("timeupdate", function (e) {
  timeProg.innerHTML = timeDecoder(this.currentTime);
  lineRed.style.width = (this.currentTime / this.duration) * 100 + "%";
});
// The play and pause icon
pIicn.addEventListener("click", function (e) {
  if (video.paused) {
    this.classList.remove("play");
    this.classList.add("pause");
    video.play();
  } else {
    this.classList.add("play");
    this.classList.remove("pause");
    video.pause();
  }
});
// width is changed when volume is chenged
video.addEventListener("volumechange", function (e) {
  const volumeChange = Math.floor(video.volume * 100);
  volumeCont.style.width = volumeChange + "%";
});
// control the video volume with help of scroll
icn.addEventListener("wheel", function (e) {
  e.preventDefault();
  const { deltaY } = e;
  if (deltaY > 0) {
    if (video.volume > 0.1001) {
      video.volume -= 0.1
    }else{
      video.volume = 0
    }
  }else{
    if (video.volume < 0.999) {
      video.volume += 0.1
    }
  }
});
// The time decoder
function timeDecoder(seconds) {
  let s = Math.floor(seconds % 60),
    m =
      Math.floor(seconds / 60) > 60
        ? Math.floor((seconds / 60) % 60)
        : Math.floor(seconds / 60),
    h = Math.floor(seconds / 60 / 60);
  s = s < 9 ? `0${s}` : s;
  m = m < 9 ? `0${m}` : m;
  const hms = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  return hms;
}
