let slider = document.getElementById("slider");
let audio = document.querySelector("audio");
let sliderVal = document.getElementById("range-val");
let playBtn = document.getElementById("play-btn");

slider.onchange = async (e) => {
  let { value } = e.target;
  sliderVal.textContent = value;
  audio.currentTime = value;
};

audio.ontimeupdate = (e) => {
  let value = audio.currentTime;
  sliderVal.textContent = value;
  slider.value = value;
  //audio.currentTime = value
};

const playPause = () => {
  if (audio.paused)
    audio
      .play()
      .then((r) => {
        console.log("Playing");
      })
      .catch((err) => {
        console.log(err);
      });
  else audio.pause();
};

audio.onplaying = ()=>{
  playBtn.textContent = "Pause"
}
audio.onpause = ()=>{
  playBtn.textContent = "Play"
}
audio.onwaiting = ()=>{
  playBtn.textContent = "Buffering"
}














async function fetchUrl() {
  let url = `https://res.cloudinary.com/sketchi/raw/authenticated/s--kvxjuqtk--/v1684991105/TunedBass/Tonics/audio/TB_Raw%20808%20tut-by-Tonics-1684991101477-74536342.mp3`;

  let xhr = new XMLHttpRequest();
  let audio = document.querySelector("audio");
  xhr.open("GET", url, true);

  //xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = "text";
  xhr.onload = function (evt) {
    var blob = new Blob([xhr.response], { type: "audio/mp3" });
    var objectUrl = URL.createObjectURL(blob);
    //audio.src = objectUrl;
    // Release resource when it's loaded
    audio.onload = function (evt) {
      URL.revokeObjectURL(objectUrl);
    };
    audio.play();
  };
  xhr.send();
  var data = JSON.stringify({ text: "yourTextToSynthesize" });
  //xhr.send(data);
}

async function fetchUrl2() {
  let audio = document.querySelector("audio");
  let p = document.querySelector("#url");
  let jwturl =
    "eyJhbGciOiJIUzI1NiJ9.aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vc2tldGNoaS92aWRlby91cGxvYWQvdjE2ODQ4Mjc5NzQvVHVuZWRCYXNzL2NhbmR5bWFuL2F1ZGlvL1RCX1lhbm8tYnktY2FuZHltYW4tMTY4NDgyNzk3MDQ4OS0yNDE2NDc5NjYubXAz.iRmYBQsZaIRVrZGyjiHySOq0oBdKZVyQTQuQgX9Tfdw";
  let jwtUrl2 =
    "eyJhbGciOiJIUzI1NiJ9.aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vc2tldGNoaS92aWRlby91cGxvYWQvdjE2ODQ4MjA5NTAvVHVuZWRCYXNzL1Rvbmljcy9hdWRpby9UQl9UaGUlMjB0ZW1wbGUtYnktVG9uaWNzLTE2ODQ4MjA5MjI3MTgtNzc3NzIyOTA3Lm1wMw.VDmUTz-B3l3nJiW3ZfJ7MgTQl0kssFdXFMwtd_76Muk";
  let uri = "/video?url=" + jwtUrl2;
  //let blob = await fetch(uri).then(r => r.text())
  //const ourl = URL.createObjectURL(blob)
  p.textContent = uri;
  audio.src = uri; // "/tracks/url?url=" + jwturl
  audio
    .play()
    .then((_) => {
      //URL.revokeObjectURL(ourl)
    })
    .catch((e) => {
      console.log(e);
    });
  return;

  audio.src = ourl;
  audio.play().catch((e) => {
    console.log("err");
  });
}
