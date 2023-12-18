let modal = document.getElementById("modal");
let closeButton = document.getElementById("close");

// Shows the modal when openSettings() is opened by fa-bars onclick.
function openSettings() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    console.log("CLICKED");
}

// Closes modal after close button is clicked.
closeButton.onclick = function() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
}

let width = screen.width / 1920;
let height = screen.height / 1080;

let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let vod;
let chat;
function onYouTubeIframeAPIReady() {
    let vodHeight = 720 * height;
    let vodWidth = 1280 * width;
    let vodVideoId = 'pZeLkHXvIEA';
    let chatVideoId = 'Wa6mmT3Ja_Y';
    let vodTime = 0;
    let chatTime = 0;
    if ("vodVideoId" in localStorage && "chatVideoId" in localStorage){
        vodVideoId = localStorage.getItem("vodVideoId");
        chatVideoId = localStorage.getItem("chatVideoId");
        if ("vodTime" in localStorage && "chatTime" in localStorage){
            vodTime = parseInt(localStorage.getItem("vodTime"));
            chatTime = parseInt(localStorage.getItem("chatTime"));
        }
    }

    vod = new YT.Player('vod', {
        height: vodHeight.toString(),
        width: vodWidth.toString(),
        videoId: vodVideoId,
        playerVars: {
        'playsinline': 1,
        'fs': 0,
        'start': vodTime
        },
        events: {
        'onReady': onPlayerReadyVod,
        'onStateChange': onPlayerStateChangeVod
        }
    });
    let chatHeight = 720 * height;
    let chatWidth = 420 * width; 
    chat = new YT.Player('chat', {
        height: chatHeight.toString(),
        width: chatWidth.toString(),
        videoId: chatVideoId,
        playerVars: {
        'playsinline': 1,
        'fs': 0,
        'start': chatTime
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
function onPlayerStateChangeVod(event) {
    if (event.data != YT.PlayerState.PLAYING) {
        localStorage.setItem("vodTime", vod.getCurrentTime())
    }

    console.log(event.data);
    let icon = document.getElementById("play-icon");
    if (event.data == YT.PlayerState.PLAYING) {
        icon.className = 'fa-solid fa-pause';
    }
    if (event.data == YT.PlayerState.PAUSED) {
        icon.className = 'fa-solid fa-play';
    }
}
function onPlayerStateChangeChat(event) {
    if (event.data != YT.PlayerState.PLAYING) {
        localStorage.setItem("chatTime", chat.getCurrentTime())
    }
}

function playOrPause()
{
    let icon = document.getElementById("play-icon");
    // 1 == Playing
    // 2 == Paused
    // 5 == cued
    if (vod.getPlayerState() == 1)
    {
        vod.pauseVideo();
        chat.pauseVideo();

        icon.className = 'fa-solid fa-play';
    }
    else if (vod.getPlayerState() == 2 || vod.getPlayerState() == 5)
    {
        vod.playVideo();
        chat.playVideo();

        icon.className = 'fa-solid fa-pause';
    }
}

// Pauses both the VOD and Chat, and then sets the time of the
// Chat to be the same as the VOD.
function resync() {
    vod.pauseVideo();
    chat.pauseVideo();

    let vodTime = vod.getCurrentTime();
    chat.seekTo(vodTime);
}

function rewind()
{
    vod.seekTo(vod.getCurrentTime() - 5);
    chat.seekTo(vod.getCurrentTime() - 5);
}

function forward()
{
    vod.seekTo(vod.getCurrentTime() + 5);
    chat.seekTo(vod.getCurrentTime() + 5);
}

// Checks the YouTube URL in the text box. If there is any error in the
// URLs then an alert is displayed. If no errors then the YouTubeIframe 
// loads the videos, saves the videos using localStorage, and closes modal.
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

    let vodURL = document.getElementById("vod-url").value;
    let chatURL = document.getElementById("chat-url").value;

    if (!matchYoutubeUrl(vodURL)){
        alert("VOD URL is not valid.");
    }
    else if (!matchYoutubeUrl(chatURL)){
        alert("Chat URL is not valid.");
    }
    else{
        let vodVideoId = getVideoId(vodURL);
        let chatVideoId = getVideoId(chatURL);
        vod.loadVideoById(vodVideoId);
        chat.loadVideoById(chatVideoId);

        // Save video ID's to localStorage
        localStorage.setItem("vodVideoId", vodVideoId);
        localStorage.setItem("chatVideoId", chatVideoId);
        
        // Closes modal
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
    }
}