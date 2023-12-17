var modal = document.getElementById("modal");
var closeButton = document.getElementById("close");

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
    var vodVideoId = 'pZeLkHXvIEA';
    var chatVideoId = 'Wa6mmT3Ja_Y';
    if ("vodVideoId" in localStorage && "chatVideoId" in localStorage){
        console.log(vodVideoId);
        console.log(chatVideoId);
        vodVideoId = localStorage.getItem("vodVideoId");
        chatVideoId = localStorage.getItem("chatVideoId");
    }
    console.log(vodVideoId);

    vod = new YT.Player('vod', {
        height: vodHeight.toString(),
        width: vodWidth.toString(),
        videoId: vodVideoId,
        playerVars: {
        'playsinline': 1,
        'fs': 0
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
        videoId: chatVideoId,
        playerVars: {
        'playsinline': 1,
        'fs': 0
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

// Pauses both the VOD and Chat, and then sets the time of the
// Chat to be the same as the VOD.
function resync() {
    pauseVideo();

    var vodTime = vod.getCurrentTime();
    //var chatTime = chat.getCurrentTime();

    chat.seekTo(vodTime);
    /*
    if (vodTime > chatTime){
        chat.seekTo(vodTime);
    }
    else{
        vod.seekTo(chatTime);
    }*/
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

    var vodURL = document.getElementById("vod-url").value;
    var chatURL = document.getElementById("chat-url").value;

    if (!matchYoutubeUrl(vodURL)){
        alert("VOD URL is not valid.");
    }
    else if (!matchYoutubeUrl(chatURL)){
        alert("Chat URL is not valid.");
    }
    else{
        var vodVideoId = getVideoId(vodURL);
        var chatVideoId = getVideoId(chatURL);
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