Ti.include('game_objects.js');
Ti.include('game_screens.js');

// create root windows
var container;
var windowsIx = { menu: 0, intro: 1, game: 2, outro: 3 };
var windows = [
	Titanium.UI.createWindow({ 
		backgroundColor:'#fff' }), 	// Menu
	Titanium.UI.createWindow({ }),	// title:'Intro'
	Titanium.UI.createWindow({ 		// title:'Cabinet', 
	    backgroundImage:'assets/bg/kleiderschrank1-open-left.jpg'
	}),
	Titanium.UI.createWindow({ })	// title:'Finale'
];

// define landscapes
var landscapes = ['spring', 'summer', 'autumn', 'winter'];
var theLandscape = 0;
var fairWeather = false;

// state tracking
var switchingScreen = false;
var currentScreen = -1;
var currentInventory = 0;

// game screen loader
function loadScreens(s) {
	// background color of the master UIView
	Ti.UI.setBackgroundColor('#cdf');
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
			//updateWearing();
			break;
		case windowsIx.game:
			slideDoors(true);
			imgJimmy.zIndex = 15;
			break;
		case windowsIx.outro:
			//updateWearing();
			updateResult();
			break;
	}
	windows[scr].open();
	switchingScreen = false;
}

//setLandscape(); // set random landscape
for (var s in windows) {
	loadScreens(s);	
}
gotoScreen(0); // start game