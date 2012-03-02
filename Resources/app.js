Ti.include('game_objects.js');
Ti.include('game_screens.js');

/*
 * Art:
 * TODO: * original logo, no subtext on menu and credits
 * TODO: * credits all texts together, smaller at bottom
 * TODO: * improve appicon and splash screen
 * TODO: names of seasons underneath
 * TODO: handwritten 'Impressum'
 * TODO: warning icon all B&W
 * TODO: draw a zipper on jacket
 * TODO: white border around nav buttons
 * TODO: 'Loading' screen, original mouse
 * TODO: turn feet in the other direction
 *  
 * Code:
 * TODO: * fix new game bug
 * TODO: * sound effects: place clothes, rain, etc.
 * TODO: dancing animation in finale
 * TODO: moving backgrounds in finale?
 * TODO: ([m]) mute sound
 * TODO: tap to wear?
 * TODO: ([o]) take a photo in finale
 * TODO: speech bubble intro
 * TODO: ([i]) button for instructions
 * TODO: closet opens with Jimmy in front
 * TODO: add coathanger to intro
 * TODO: improved navigation (swipe), layout
 * TODO: friends picture frame intro
 * TODO: friends in distance finale
 */

// state tracking
var currentScreen = -1;
var currentInventory = 0;
var switchingScreen = false;

function setUp() {
	// background color of the master UIView
	Ti.UI.setBackgroundColor('#cdf');
	
	// quit the game when returning home
	Ti.App.addEventListener('pause', function() {
		newGame();
	})
}

function newGame() {
	// reset Jimmy
	for(var i in imgClothes) {
		if (imgClothes[i].wearing) {
			unwearItem(imgClothes[i]);
		}
	}
	imgJimmy.image = 'assets/jimmy/jimmy_white.png';
	windows[windowsIx.outro].endgame = false;
	// reset inventory
	switchInventory(0);
	loadScreens(windowsIx.outro);
	// stop music effects
	stopMusic();
	// return to menu
	gotoScreen(0);
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
			imgJimmy.zIndex = 30;
			updateWearing();
			startMusic();
			break;
		case windowsIx.game:
			imgJimmy.zIndex = 15;
			break;
		case windowsIx.outro:
			updateWearing();
			updateResult();
			break;
	}
	
	// Close the currently open window
	if(prevScreen != -1) {
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

//setLandscape(); // set random landscape

// the following can't be a loop.. don't ask why!
loadScreens(0);
loadScreens(1);
loadScreens(2);
loadScreens(3);
loadScreens(4);

gotoScreen(0); // start game