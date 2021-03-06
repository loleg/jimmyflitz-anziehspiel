Ti.include('game_objects.js');
Ti.include('game_screens.js');

// state tracking
var currentScreen = -1;
var currentInventory = 0;
var switchingScreen = false;

function setUp() {
	// background of the master UIView
	Ti.UI.setBackgroundColor('#fff');
	Ti.UI.setBackgroundImage('assets/bg/loading.jpg');
	
	// what to do when the app is exited
	// Ti.App.addEventListener('pause', function() {
		// newGame();
		// Titanium.App.restart();
		
		// Remove all clothes objects
		// for (var i in imgClothes) {
			// windows[windowsIx.game].container.remove(imgClothes[i]);
		// }
		// // Add them back in
		// for (var i in imgClothes) {
			// windows[windowsIx.game].container.add(imgClothes[i]);
		// }
	// });
}

function newGame() {
	Ti.API.debug("Resetting game");
	// return to menu
	stopMusic();
	gotoScreen(windowsIx.menu);
	// reset game state
	for (var i in imgClothes) { 
		resetItem(imgClothes[i]); 
	}
	windows[windowsIx.outro].endgame = false;
	// reset weather
	Titanium.UI.setBackgroundImage(null);
	// reload 
	imgDoor.right = 0;
	imgDoor.opacity = 1;
	imgNavButtonJump.opacity = 0;
	imgNavButtonJump.opacity = 0;
	imgNavButtonRight2.opacity = 0; // hide button for a few seconds
	windows[windowsIx.outro].container.top = 0;
	windows[windowsIx.outro].container.left = 0;
}

function startGame() {
	showEaster(parseInt(theLandscape) == 0);
	gotoScreen(windowsIx.intro);	
}

function stopMusic() {
	soundClips.game.setLooping(false);
	soundClips.game.stop();
	soundClips.jupi.stop();
	soundClips.oops.stop();
	soundClips.finale.stop();
	soundClips.play = false;
}

function startMusic() {
	if (!soundClips.mute && !soundClips.play) {
		soundClips.game.setLooping(true);
		soundClips.game.play();
		soundClips.play = true;
	}
}

// game screen loader
function loadScreens(s) {
	//for (var s in windows) { 
		if (windows[s].container) {
			windows[s].remove(windows[s].container);
		}
		container = windows[s].container = 
			Ti.UI.createView({
				width : '100%',
				height : '100%',
				top : 0,
				left : 0,
				borderRadius : 0 // fix clipping issues
			});
		switch(s) {
			case windowsIx.menu:
				showMenu();
				break;
			case windowsIx.intro:
				showIntro();
				break;
			case windowsIx.game:
				showGame();
				break;
			case windowsIx.outro:
				showOutro();
				break;
			case windowsIx.credits:
				showCredits();
				break;
		}
		windows[s].add(container);
	//}
}

// event handler
function gotoScreen(scr) {
	// Manage contention on window switch
	if(switchingScreen)
		return;
	switchingScreen = true;
	
	Ti.API.debug('Opening screen ' + scr);
	
	container = windows[scr].container;
	var prevScreen = currentScreen;
	currentScreen = scr;

	// Refresh end screen
	switch (scr) {
		case windowsIx.intro:
			updateWearing();
			switchInventory(0);
			break;
		case windowsIx.game:
			startMusic();
			break;
		case windowsIx.outro:
			updateWearing();
			updateResult();
			break;
	}
	
	// Send analytics event
	Ti.Analytics.navEvent(prevScreen.toString(), scr.toString(), "Goto", null);
	
	// Close the currently open window
	if (prevScreen != -1) {
		windows[prevScreen].close();
	}
	windows[scr].open();
	
	// Run animations here
	if (scr == windowsIx.game) {
		slideDoors(true);
	}
	
	Ti.API.debug('Screen open: ' + currentScreen + ' inv: ' + currentInventory);
	switchingScreen = false;
}

setUp(); // application settings

// the following can't be a loop.. don't ask why!
loadScreens(0);
loadScreens(1);
loadScreens(2);
loadScreens(3);
loadScreens(4);

gotoScreen(0); // start game