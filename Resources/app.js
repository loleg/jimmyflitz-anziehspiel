Ti.include('game_objects.js');
Ti.include('game_screens.js');

// state tracking
var currentScreen = -1;
var currentInventory = 0;
var switchingScreen = false;

function setUp() {
	// background color of the master UIView
	Ti.UI.setBackgroundColor('#cdf');
	
	// quit the game when returning home
	Ti.App.addEventListener('pause', function() {
		gotoScreen(0);
	})
}

// game screen loader
function loadScreens(s) {
	//for (var s in windows) { 
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
	
	//loadScreens(scr);
	container = windows[scr].container;
	
	Ti.API.debug('Opening screen ' + scr);

	// Close the currently open window
	if(currentScreen != -1) {
		windows[currentScreen].close();
	}
	var prevScreen = currentScreen;
	currentScreen = scr;

	// Refresh end screen
	switch (scr) {
		case windowsIx.intro:
			imgJimmy.zIndex = 30;
			updateWearing();
			break;
		case windowsIx.game:
			slideDoors(true);
			imgJimmy.zIndex = 15;
			break;
		case windowsIx.outro:
			updateWearing();
			updateResult();
			break;
	}
	windows[scr].open();
	switchingScreen = false;
}

setUp(); // application settings
//setLandscape(); // set random landscape

// the following can't be a loop.. don't ask why!
loadScreens(0);
loadScreens(1);
loadScreens(2);
loadScreens(3);

gotoScreen(0); // start game