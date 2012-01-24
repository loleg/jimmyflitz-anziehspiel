Ti.include('game_objects.js');

// background color of the master UIView
Ti.UI.setBackgroundColor('#cdf');

// open root window
var container;
var currentScreen = -1;
setLandscape();
gotoScreen(0);

// initial screen with window
function showIntro() {
	//container.add(imgIntro);
	container.add(imgWindow);
	container.add(imgJimmy);
	container.opacity = 1;
	imgJimmy.touchEnabled = false;
	imgButtonWindow.addEventListener('click', function(e) {
		container.opacity = (container.opacity) ? 0 : 1;
		if (typeof this.o_center == "undefined") {
			this.o_center = this.center;
			this.o_height = this.height;
			this.o_width = this.width;
		}
		this.center = (container.opacity) ? {
			x:this.o_center.x,
			y:this.o_center.y
		} : {}; // screen center
		this.width = (container.opacity) ? this.o_width : 
			Ti.Platform.displayCaps.getPlatformWidth();
		this.height = (container.opacity) ? this.o_height : 
			Ti.Platform.displayCaps.getPlatformHeight();
	});
	windows[0].add(imgButtonWindow);
	/*
	for (var i in imgFriends) {
		imgFriends[i].touchEnabled = false;
		// CENTERING CODE
		// imgFriends[i].addEventListener('touchstart', function(e) {
			// this.offset_x = e.x; this.offset_y = e.y;
			// if (typeof this.origin == 'undefined') {
				// this.origin = this.center;
			// }
			// this.zIndex = 50;
		// });
		// imgFriends[i].addEventListener('touchmove', function(e) {
			// this.center = {
					// x:this.center.x + (e.x - this.offset_x), 
					// y:this.center.y + (e.y - this.offset_y)
			// };
			// Ti.API.debug('Center: ' + this.center.x + ', ' + this.center.y ); 
		// });
		container.add(imgFriends[i]);
	}
	*/
}

function setLandscape() {
	// choose a random landscape and conditions
	var theLandscape = Math.floor(Math.random() * 4);
	var fairWeather = (Math.random() > 0.5);
	Ti.API.debug('Landscape: ' + landscapes[theLandscape] + ', ' 
				+ (fairWeather) ? 'nice weather' : 'storm');
	var path = 'assets/bg/landscape-' + 
				landscapes[theLandscape] + '.jpg';
	windows[0].setBackgroundImage(path);
	windows[2].setBackgroundImage(path);
}

// draws Jimmy and all clothes
function startGame() {
	container.add(imgCabLeft);
	container.add(imgCabRight);
	container.add(imgJimmy);
	// container.add(imgMirror);
	for (var i in imgClothes) {
		imgClothes[i].addEventListener('singletap', function(e) {
			// make Jimmy wear the item or take if off
			if (this.wearing) {
				wearItem(this);
			} else {
				unwearItem(this);
			}
		});
		imgClothes[i].addEventListener('touchstart', function(e) {
			this.offset_x = e.x;
			this.offset_y = e.y;
			if (typeof this.origin == 'undefined') {
				this.origin = this.center;
			}
			this.zIndex = 50;
		});
		imgClothes[i].addEventListener('touchmove', function(e) {
			// Ti.API.debug('Our event tells us the center is ' + e.x + ', ' + e.y ); 
			this.center = {
					x:this.center.x + (e.x - this.offset_x), 
					y:this.center.y + (e.y - this.offset_y)
			};
			// this.opacity = 0.8;
		});
		imgClothes[i].addEventListener('touchend', function(e) {
			this.zIndex = 20;
			// this.opacity = 1;
			if (this.center.y > imgJimmy.center.y - imgJimmy.height/2) {
				// make Jimmy wear the item
				wearItem(this);
			} else {
				// make Jimmy take it off
				unwearItem(this);
			}
		});
		// put to display
		container.add(imgClothes[i]);
	}
	// but hide the first
	// imgClothes[0].opacity = 0;
	// animate sliding doors
	imgCabLeft.animate({
        left: -900,
        duration: 1500
    }, function() {
    	container.remove(imgCabLeft);
    });
    imgCabRight.animate({
        left: 1200,
        duration: 2100
    }, function() {
    	container.remove(imgCabRight);
    });
}

// dress up Jimmy
function wearItem(obj) {
	if (obj.info.id.indexOf('jimmy') == 0) {
		imgJimmy.image = 'assets/jimmy/' + obj.info.id + '.png';
		// unhide other clothes
		for (var i in imgClothes) {
			if (imgClothes[i].info.id != obj.info.id 
				&& imgClothes[i].info.id.indexOf('jimmy') == 0) {
					imgClothes[i].opacity = 1;
			}
		}
		obj.center = {
			x:obj.origin.x,
			y:obj.origin.y
		};
		// don't "wear" the costume
		obj.opacity = 0;		
	} else {
		// Scale images for a pop-in effect
		// this.width = this.o_width * 0.8;
		// this.height = this.o_height * 0.8;
		obj.wearing = true;
	}
	Ti.API.debug('Item placed: ' + obj.center.x + ', ' + obj.center.y );
} 

// put the item back on its shelf
function unwearItem(obj) {
	// put the item back on its shelf
	obj.center = {
		x:obj.origin.x,
		y:obj.origin.y
	};
	// Restore size from pop-in
	// obj.width = obj.o_width;
	// obj.height = obj.o_height;
	obj.wearing = false;
}

var showClothes = [];
function updateResult() {
	for (var u in showClothes) {
		container.remove(showClothes[u])
	}
	showClothes = [];
	var typeTally = 0;
	// iterate through all worn clothing
	for (var i in imgClothes) {
		var item = imgClothes[i];
		if (item.wearing) {
			Ti.API.debug('Wearing ' + item.info.id);
			typeTally += item.info.type;
		//	item.touchEnabled = false;
			showClothes.push(item);
			container.add(item);
		}
	}
	// Win if the weather is nice & we're dressed lightly,
	// or the weather is heavy and we're dressed warm
	var typeOK = 
		(theLandscape < 2 && fairWeather && typeTally < 3) ||
		(theLandscape > 1 && typeTally > 2);
	// switch (theLandscape) {
	// case 0: // spring
	// case 1: // summer
	// case 2: // autumn
	// case 3: // winter
	// }
	Ti.API.debug('Result score: ' + typeTally + ' weather: ' + fairWeather + ' season: ' + landscapes[theLandscape]);
	labelResult.text = typeOK ? 'Go!' : 'No..';
}

// event handler
function gotoScreen(s) {
	Ti.API.debug('Opening screen ' + s);
	// Create contents of the window
	if (!windows[s].isPainted) {
		container = windows[s].container = Ti.UI.createView({
			width:'100%', height:'100%', top:0, left:0,
			borderRadius:0 // fix clipping issues
		});
		windows[s].isPainted = true;
		switch(s) {
		case 0:
			showIntro();
			imgIntro.addEventListener('click',function(e) {
				this.hide();
			});
			imgWindow.addEventListener('click',function(e) {
				gotoScreen(1);
			});
			break;
		case 1:
			startGame();
			imgDoorClose.addEventListener('click',function(e) {
				gotoScreen(0);
			});
			container.add(imgDoorClose);
			imgDoorExit.addEventListener('click',function(e) {
				gotoScreen(2);
			});
			container.add(imgDoorExit);
			break;
		case 2:
			container.add(imgJimmy);
			container.add(labelResult);
			// play end game music
			soundClips.play(); 
			imgDoorEnter.addEventListener('click',function(e) {
				gotoScreen(1);
			});
			container.add(imgDoorEnter);
			break;
		}
		windows[s].add(container);
	} else {
		container = windows[s].container;
	}
	
	// Close the currently open window
	if (currentScreen != -1) {
		windows[currentScreen].close();
	}
	currentScreen = s;
	
	// Refresh end screen
	switch (s) {
	case 0:
		imgJimmy.zIndex = 30;
	case 1:
		imgJimmy.zIndex = 15;
		// Re-enable clothes
		for (var i in imgClothes) {
			//imgClothes[i].touchEnabled = true;
		}
	case 2:
		// End game result
		updateResult();
	}
	windows[s].open();
}