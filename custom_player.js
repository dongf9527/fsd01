// Customize Video Player using HTML5's Video API
// Author wpeter@cn.ibm.com

// Wait for the DOM to be loaded before initialising the player
document.addEventListener("DOMContentLoaded", function () { initialPlayer(); }, false);

// Variables to store handles to various required elements
var customVideoPlayer;
var playButton;
var playIcon;
var muteButton;
var muteIcon;
var progressBar;
var likeButton;
var unLikeButton;
var volume;


function initialPlayer() {
	// handle the player
	customVideoPlayer = document.getElementById('media-video');

	// handle each of the buttons and required elements
	playButton = document.getElementById('play_button');
	playIcon = document.getElementById('play-pause-icon');
	muteButton = document.getElementById('mute-button');
	muteIcon = document.getElementById('mute-icon');
	progressBar = document.getElementById('progress-bar');
	like = document.getElementById('video-like');
	unlike = document.getElementById('video-unlike');
	volume = document.getElementById('video-volume');

	// browser's default controls
	customVideoPlayer.controls = false;

	// listener for the timeupdate event so we can update the progress bar
	customVideoPlayer.addEventListener('timeupdate', updateProgressBar, false);

	// listener for the play and pause events so the buttons state can be updated
	customVideoPlayer.addEventListener('play', function () {
		// button to be a pause button
		changeButtonIcon(playIcon, 'fa-play-circle', 'fa-pause-circle');
	}, false);
	customVideoPlayer.addEventListener('pause', function () {
		// button to be a play button
		changeButtonIcon(playIcon, 'fa-pause-circle', 'fa-play-circle');
	}, false);

	// volumechange
	customVideoPlayer.addEventListener('volumechange', function (e) {
		// Update the button to be mute/unmute
		if (customVideoPlayer.muted) changeButtonIcon(muteIcon, 'fa-volume-up', 'fa-volume-mute');
		else changeButtonIcon(muteIcon, 'fa-volume-mute', 'fa-volume-up');
	}, false);
	customVideoPlayer.addEventListener('ended', function () { this.pause(); }, false);

	// initial web storage
	if ((localStorage.getItem('like') == undefined) && localStorage.getItem('unlike') == undefined) {
		localStorage.setItem('like', 0);
		localStorage.setItem('unlike', 0)
		like.innerText = localStorage.getItem('like');
		unlike.innerText = localStorage.getItem('unlike');
	} else {
		like.innerText = localStorage.getItem('like');
		unlike.innerText = localStorage.getItem('unlike');
	}
	volume.innerText = customVideoPlayer.volume * 10;
}


function togglePlayPause() {
	// check mediaPlayer is currently paused or has ended
	if (customVideoPlayer.paused || customVideoPlayer.ended) {
		// button to be a pause button
		changeButtonIcon(playIcon, 'fa-play-circle', 'fa-pause-circle');
		// Play media
		customVideoPlayer.play();
	}
	// Otherwise it must currently be playing
	else {
		// button to be a play button
		changeButtonIcon(playIcon, 'fa-pause-circle', 'fa-play-circle');
		// Pause media
		customVideoPlayer.pause();
	}
}

// Stop the current media from playing, and return it to the start
function stopPlayer() {
	customVideoPlayer.pause();
	customVideoPlayer.currentTime = 0;
}

// Changes the volume on the media player
function changeVolume(direction) {
	if (direction === '+') customVideoPlayer.volume += customVideoPlayer.volume == 1 ? 0 : 0.1;
	else customVideoPlayer.volume -= (customVideoPlayer.volume == 0 ? 0 : 0.1);
	customVideoPlayer.volume = parseFloat(customVideoPlayer.volume).toFixed(1);
	volume.innerText = customVideoPlayer.volume * 10;

}

// Toggles the media player's mute and unmute status
function toggleMute() {
	if (customVideoPlayer.muted) {
		// Change the cutton to be a mute button
		changeButtonIcon(muteIcon, 'fa-volume-up', 'fa-volume-mute');
		// Unmute the media player
		customVideoPlayer.muted = false;
	}
	else {
		// Change the button to be an unmute button
		changeButtonIcon(muteIcon, 'fa-volume-mute', 'fa-volume-up');
		// Mute the media player
		customVideoPlayer.muted = true;
	}
}

// Replays the media currently loaded in the player
function replayMedia() {
	resetPlayer();
	customVideoPlayer.play();
}

// Update the progress bar
function updateProgressBar() {
	// Work out how much of the media has played via the duration and currentTime parameters
	var percentage = Math.floor((100 / customVideoPlayer.duration) * customVideoPlayer.currentTime);
	// Update the progress bar's css width
	progressBar.setAttribute("style", "width: " + percentage + "%;");
	progressBar.setAttribute("aria-valuenow", percentage);
	// Update the progress bar's text (for browsers that don't support the progress element)
	progressBar.innerHTML = percentage + '%';
}

// Updates a button's title, innerHTML and CSS class to a certain value
function changeButtonIcon(btnIcon, oldIcon, newIcon) {
	btnIcon.classList.remove(oldIcon);
	btnIcon.classList.add(newIcon);
}

// Loads a video item into the vedio player
function loadVideo() {
	for (var i = 0; i < arguments.length; i++) {
		var file = arguments[i].split('.');
		var ext = file[file.length - 1];
		// Check if this media can be played
		if (canPlayVideo(ext)) {
			// Reset the player, change the source file and load it
			resetPlayer();
			customVideoPlayer.src = arguments[i];
			customVideoPlayer.load();
			changeButtonIcon(playIcon, 'fa-pause-circle', 'fa-play-circle');
			customVideoPlayer.play();
			break;
		}
	}
}

// Checks if the browser can play this particular type of file or not
function canPlayVideo(ext) {
	var ableToPlay = customVideoPlayer.canPlayType('video/' + ext);
	return (ableToPlay == '') ? false : true;
}

// Resets the media player
function resetPlayer() {
	progressBar.value = 0;
	customVideoPlayer.currentTime = 0;
	changeButtonIcon(playIcon, 'fa-play-circle', 'fa-pause-circle');
}

// function for like Button
function likeVideo() {
	var c_number = localStorage.getItem('like');
	localStorage.setItem('like', parseInt(c_number) + 1);
	like.innerText = localStorage.getItem('like');
}

// function for unlike Button
function unlikeVideo() {
	var c_number = localStorage.getItem('unlike');
	localStorage.setItem('unlike', parseInt(c_number) + 1)
	unlike.innerText = localStorage.getItem('unlike');

}