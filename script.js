var width = screen.width / 1920;
var height = screen.height / 1080;

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var vod;
var chat;
function onYouTubeIframeAPIReady() {
    var vodHeight = 720 * height;
    var vodWidth = 1280 * width;
    vod = new YT.Player('vod', {
        height: vodHeight.toString(),
        width: vodWidth.toString(),
        videoId: 'pZeLkHXvIEA',
        playerVars: {
        'playsinline': 1
        },
        events: {
        'onReady': onPlayerReadyVod,
        'onStateChange': onPlayerStateChangeVod
        }
    });
    var chatHeight = 720 * height;
    var chatWidth = 420 * width; 
    chat = new YT.Player('chat', {
        height: chatHeight.toString(),
        width: chatWidth.toString(),
        videoId: 'Wa6mmT3Ja_Y',
        playerVars: {
        'playsinline': 1
        },
        events: {
        'onReady': onPlayerReadyChat,
        'onStateChange': onPlayerStateChangeChat
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReadyVod(event) {
    event.target.pauseVideo();
}
function onPlayerReadyChat(event) {
    event.target.pauseVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var doneVod = false;
function onPlayerStateChangeVod(event) {
    if (event.data == YT.PlayerState.PLAYING && !doneVod) {
        // setTimeout(stopVideo, 6000);
        doneVod = true;
    }
}
var doneChat = false;
function onPlayerStateChangeChat(event) {
    if (event.data == YT.PlayerState.PLAYING && !doneChat) {
    // setTimeout(stopVideo, 6000);
        doneChat = true;
    }
}

function pauseVideo() {
    vod.pauseVideo();
    chat.pauseVideo();
}
function playVideo() {
    vod.playVideo();
    chat.playVideo();
}

function resync() {
    console.log(vod.getCurrentTime())
    console.log(chat.getCurrentTime())

    pauseVideo();

    var vodTime = vod.getCurrentTime();
    var chatTime = chat.getCurrentTime();

    if (vodTime > chatTime){
        chat.seekTo(vodTime);
    }
    else{
        vod.seekTo(chatTime);
    }
}

function checkPlayers() {
    function matchYoutubeUrl(url) {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(url.match(p)){
            return url.match(p)[1];
        }
        return false;
    }
    function getVideoId(url) {
        let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
        return regex.exec(url)[3];
    }

    var vodURL = document.getElementById("vod-url").value;
    var chatURL = document.getElementById("chat-url").value;

    if (!matchYoutubeUrl(vodURL)){
        alert("VOD URL is not valid.");
    }
    else if (!matchYoutubeUrl(chatURL)){
        alert("Chat URL is not valid.");
    }
    else{
        document.getElementById("content").style.display = "inline";
        vod.loadVideoById(getVideoId(vodURL));
        chat.loadVideoById(getVideoId(chatURL));

        document.getElementById("get-players").style.display = "none";
    }
}

console.log(screen.width);
console.log(screen.height);