// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'L9ro1KjkJMg',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: {
      // 'autoplay': 1,
      'enablejsapi': 1,
      'controls': 0,
      'disablekb': 1,
      'modestBranding': 1,
      'iv_load_policy': 3,
      'rel': 0,
      'showInfo': 0
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  progressBarLoop();
  // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  console.log(event.data);
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo(){
  player.stopVideo();
}
function playVideo(){
  player.playVideo();
}
function pauseVideo(){
  player.pauseVideo();
}
function seekTo(seconds){
  player.seekTo(seconds);
}

function onVideoChange(videoId){
  player.loadVideoById(videoId);
  console.log(videoId);
}
