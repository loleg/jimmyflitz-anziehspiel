// menu screen
function showMenu() {
	var menuImg = [];
	for(var l in landscapes) {
		var img = Titanium.UI.createImageView({
			image : 'assets/ui/window.png',
			landscapeIndex : l,
			backgroundImage : 'assets/bg/landscape-' + landscapes[l] + '.jpg',
			opacity : 1,
			zIndex : 11,
			width : rezX * 100,
			height : rezY * 141,
			top : (l < 2) ? '20%' : '55%',
			left : (l % 2 == 0) ? '15%' : '55%',
		});
		img.addEventListener('click', function(e) {
			setLandscape(this.landscapeIndex);
			gotoScreen(windowsIx.intro);
		});
		menuImg.push(img);
		container.add(img);
	}

}

// initial screen with window
function showIntro() {
	//container.add(imgIntro);
	container.add(imgWindow);
	container.add(imgJimmy);
	imgJimmy.touchEnabled = false;

	// set opacity to 1 to start with zoomed window
	container.opacity = 0;
	container.zIndex = 1;

	imgZoomWindow.zIndex = 14;
	imgZoomWindow.zoom();
	windows[windowsIx.intro].add(imgZoomWindow);
	
	windows[windowsIx.intro].add(imgWeather);
	windows[windowsIx.outro].add(imgWeather);

	container.add(buttonRestart);
	buttonRestart.addEventListener('click', function(e) {
		gotoScreen(windowsIx.menu);
	});

	imgIntro.addEventListener('click', function(e) {
		this.hide();
	});
	imgWindow.addEventListener('click', function(e) {
		gotoScreen(windowsIx.game);
	});
}

function showGame() {
	container.add(imgCabLeft);
	container.add(imgCabRight);
	// add Jimmy and set up game
	container.add(imgJimmy);
	drawInventory();
	imgNavButtonLeft.addEventListener('click', function(e) {
		if(currentInventory == 0) {
			gotoScreen(windowsIx.intro);
		} else {
			currentInventory = 0;
			switchInventory();
		}
	});
	container.add(imgNavButtonLeft);
	imgNavButtonRight.addEventListener('click', function(e) {
		if(currentInventory == 1) {
			// close doors and go to end game
			//slideDoors(false, windowsIx.outro);
			gotoScreen(windowsIx.outro);
		} else {
			currentInventory = 1;
			switchInventory();
		}
	});
	container.add(imgNavButtonRight);
}

function showOutro() {
	imgDoor.right = 0;
	container.add(imgJimmy);
	container.add(imgDoor);
	container.add(imgIconWarning);
	// tap to return to game
	windows[windowsIx.outro].addEventListener('click', function(e) {
		gotoScreen(windowsIx.game);
	});
}

function setLandscape(index) {
	// choose a random landscape and conditions
	theLandscape = ( typeof index != 'undefined') ? index : Math.floor(Math.random() * 4);
	fairWeather = (Math.random() > 0.5);
	Ti.API.debug('Landscape: ' + landscapes[theLandscape] + ', ' + (fairWeather) ? 'nice weather' : 'storm');
	// background asset
	var path = 'assets/bg/landscape-' + landscapes[theLandscape] + '.jpg';
	// set the UI background
	Titanium.UI.setBackgroundImage(path);
	// show or hide the weather 'fx'
	imgWeather.opacity = (fairWeather) ? 0 : 1;
}

// animate sliding doors
function slideDoors(isOpening, targetWindow) {
	imgCabLeft.show();
	imgCabRight.show();
	imgCabLeft.left = (isOpening) ? imgCabLeft.showX : imgCabLeft.hideX;
	imgCabLeft.animate({
		left : (isOpening) ? imgCabLeft.hideX : imgCabLeft.showX,
		duration : 1500
	}, function() {
		imgCabLeft.hide();
	});
	imgCabRight.left = (isOpening) ? imgCabRight.showX : imgCabRight.hideX;
	imgCabRight.animate({
		left : (isOpening) ? imgCabRight.hideX : imgCabRight.showX,
		duration : 2100
	}, function() {
		imgCabRight.hide();
		// jump to end game after completing animation
		if( typeof targetWindow != 'undefined') {
			gotoScreen(targetWindow);
		}
	});
}

// draws all clothes
function drawInventory() {
	for(var i in imgClothes) {
		// imgClothes[i].addEventListener('click', function(e) {
		// if (currentScreen != 1) return;
		// if (this.wearing) {
		// wearItem(this);
		// } else {
		// unwearItem(this);
		// }
		// });
		imgClothes[i].addEventListener('touchstart', function(e) {
			this.offset_x = e.x;
			this.offset_y = e.y;
			if( typeof this.origin == 'undefined') {
				this.origin = this.center;
			}
			this.zIndex = 90;
		});
		imgClothes[i].addEventListener('touchmove', function(e) {
			// only in edit mode
			if(currentScreen != windowsIx.game)
				return;
			// move the item
			this.center = {
				x : this.center.x + (e.x - this.offset_x),
				y : this.center.y + (e.y - this.offset_y)
			};
		});
		imgClothes[i].addEventListener('touchend', function(e) {
			if(this.center.y > imgJimmy.center.y - imgJimmy.height / 2) {
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
	switchInventory();
}

function switchInventory() {
	Ti.API.debug('Updating inventory ' + currentInventory);
	windows[windowsIx.game].setBackgroundImage((currentInventory == 0) ? 'assets/bg/kleiderschrank1-open-left.jpg' : 'assets/bg/kleiderschrank1-open-right.jpg');
	for(var i in imgClothes) {
		if(!imgClothes[i].wearing) {
			imgClothes[i].opacity = (i >= clothesPerSide * currentInventory && i < clothesPerSide * (currentInventory + 1)) ? 1 : 0;
		}
	}
}

// dress up Jimmy
function wearItem(obj) {
	obj.wearing = true;
	if( typeof obj.info.z != 'undefined') {
		obj.zIndex = 50 + obj.info.z;
	} else {
		obj.zIndex = 51;
	}
	if(obj.info.id.indexOf('jimmy') == 0) {
		imgJimmy.image = 'assets/jimmy/' + obj.info.id + '.png';
		// unhide other Jimmy clothes
		for(var i in imgClothes) {
			if(imgClothes[i].info.id != obj.info.id && imgClothes[i].info.id.indexOf('jimmy') == 0) {
				imgClothes[i].wearing = false;
			}
		}
		obj.center = {
			x : obj.origin.x,
			y : obj.origin.y
		};
		// don't "wear" the costume
		obj.opacity = 0;
		// redraw the inventory to restore other shirts
		switchInventory();
	} else {
		// check item swaps
		var baseName = obj.info.id.replace(/\d/, "");
		for(var i in imgClothes) {
			if(imgClothes[i].wearing && imgClothes[i].info.id != obj.info.id && imgClothes[i].info.id.replace(/\d/, "") == baseName) {
				unwearItem(imgClothes[i]);
			}
		}
		// snap object to its defined center
		if( typeof obj.info.x != 'undefined') {
			obj.center = {
				x : obj.info.x,
				y : obj.info.y
			};
		} else {
			Ti.API.debug('Item ' + obj.info.id + ' at: ' + obj.center.x + ', ' + obj.center.y);
		}
		// if a target scale is defined
		if( typeof obj.info.scaleTo != 'undefined') {
			obj.height = obj.o_height * obj.info.scaleTo;
			obj.width = obj.o_width * obj.info.scaleTo;
		}
		// swap to worn asset
		obj.image = 'assets/jimmy/' + obj.info.id + '.png';
	}
}

// put the item back on its shelf
function unwearItem(obj) {
	// put the item back on its shelf
	obj.center = {
		x : obj.origin.x,
		y : obj.origin.y
	};
	// Restore size from pop-in
	obj.height = obj.o_height;
	obj.width = obj.o_width;
	// Restore to shelf image
	obj.image = 'assets/clothes/' + obj.info.id + '.png';
	obj.wearing = false;
	// Check shown inventory
	switchInventory();
}

// var showClothes = [];
function updateWearing() {
	// iterate through all worn clothing
	for(var i in imgClothes) {
		var item = imgClothes[i];
		if (item.wearing) {
			Ti.API.debug('Wearing ' + item.info.id);
			container.add(item);
		} else {
			container.remove(item);
		}
	}
}

function updateResult() {
	// calculate the items worn
	var count = 0, typeTally = 0, hazRainThing = false;
	// iterate through all worn clothing
	for(var i in imgClothes) {
		var item = imgClothes[i];
		if(item.wearing) {
			count++;
			// tally up item properties
			typeTally += item.info.type;
			hazRainThing = (item.info.id == 'umbrella');
		}
	}
	
	// Win if the weather is nice & we're dressed lightly,
	// or the weather is heavy and we're dressed warm
	var typeOK = (theLandscape < 2 && fairWeather && typeTally < 3 && count > 0) 
			  || (theLandscape < 2 && !fairWeather && typeTally > 2 && hazRainThing) 
			  || (theLandscape > 1 && fairWeather && typeTally >= theLandscape) 
			  || (theLandscape > 1 && !fairWeather && typeTally >= theLandscape + 2);

	// switch (theLandscape) {
	// case 0: // spring
	// case 1: // summer
	// case 2: // autumn
	// case 3: // winter
	// }
	
	Ti.API.debug(typeOK + '! Tally: ' + typeTally + ' Count: ' + count + 
		' / Sun: ' + fairWeather + ' Season: ' + theLandscape + ' ' + landscapes[theLandscape]);

	// show warning
	imgIconWarning.image = (fairWeather) ? 'assets/ui/warn_shirt.png' : 'assets/ui/warn_cloud.png';
	imgIconWarning.opacity = (typeOK) ? 0 : 1;

	// animate warning
	if(!typeOK) {
		imgIconWarning.top = rezY * 10;
		imgIconWarning.animate({
			top : rezY * 240,
			duration : 500
		});
	}

	// check if Jimmy goes out
	if(typeOK) {
		// play end game music
		soundClips.play();
		imgDoor.opacity = 0;
		imgDoor.hide();
	} else {
		imgDoor.opacity = 1;
		imgDoor.show();
	}
}