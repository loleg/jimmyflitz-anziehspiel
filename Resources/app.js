Ti.include('game_objects.js');

// background color of the master UIView
Ti.UI.setBackgroundColor('#cdf');

// open root window
var container;
var currentScreen = -1;
var currentInventory = 0;

setLandscape();
gotoScreen(0);

// initial screen with window
function showIntro() {
	//container.add(imgIntro);
	container.add(imgWindow);
	container.add(imgJimmy);
	imgJimmy.touchEnabled = false;	
	
	// set to 1 to start with zoomed window
	container.opacity = 0;
	imgButtonWindow.zoom();
	windows[windowsIx.intro].add(imgButtonWindow);
	
	// container.add(buttonRestart);
	// buttonRestart.addEventListener('click', function(e) {
		// Titanium.App.exit();
	// });
	
	imgIntro.addEventListener('click',function(e) {
		this.hide();
	});
	imgWindow.addEventListener('click',function(e) {
		gotoScreen(1);
	});
}

function setLandscape() {
	// choose a random landscape and conditions
	theLandscape = Math.floor(Math.random() * 4);
	fairWeather = (Math.random() > 0.5);
	Ti.API.debug('Landscape: ' + landscapes[theLandscape] + ', ' 
				+ (fairWeather) ? 'nice weather' : 'storm');
	// background asset
	var path = 'assets/bg/landscape-' + 
				landscapes[theLandscape] + '.jpg';
	// set the UI background
	Titanium.UI.setBackgroundImage(path);
	if (!fairWeather) {
		windows[windowsIx.intro].add(imgWeather);
		windows[windowsIx.outro].add(imgWeather);
	}
}

// animate sliding doors
function slideDoors(isOpening, targetWindow) {
  container.add(imgCabLeft);
  container.add(imgCabRight);
  imgCabLeft.left = (isOpening) ? 
    imgCabLeft.showX : imgCabLeft.hideX;
  imgCabLeft.animate({
      left: (isOpening) ? imgCabLeft.hideX : imgCabLeft.showX,
      duration: 1500
  }, function() {
	  container.remove(imgCabLeft);
  });
  imgCabRight.left = (isOpening) ? 
    imgCabRight.showX : imgCabRight.hideX;
  imgCabRight.animate({
      left: (isOpening) ? imgCabRight.hideX : imgCabRight.showX,
      duration: 2100
  }, function() {
	  container.remove(imgCabRight);
	  // jump to end game after completing animation
	  if (typeof targetWindow != 'undefined') {
      gotoScreen(targetWindow);
    }
  });
}

// draws all clothes
function drawInventory() {
	for (var i in imgClothes) {
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
			if (typeof this.origin == 'undefined') {
				this.origin = this.center;
			}
			this.zIndex = 90;
		});
		imgClothes[i].addEventListener('touchmove', function(e) {
			// only in edit mode
			if (currentScreen != 1) return;
			// move the item
			this.center = {
					x:this.center.x + (e.x - this.offset_x), 
					y:this.center.y + (e.y - this.offset_y)
			};
		});
		imgClothes[i].addEventListener('touchend', function(e) {
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
	switchInventory();
}

function switchInventory() {
	Ti.API.debug('Updating inventory ' + currentInventory);
	for (var i in imgClothes) {
		if (!imgClothes[i].wearing) {
			imgClothes[i].opacity = 
				(i >= clothesPerSide * currentInventory &&
				 i < clothesPerSide * (currentInventory + 1)) ? 1 : 0;
		}
	}
	windows[windowsIx.game].setBackgroundImage(
		(currentInventory == 0) ?
			'assets/bg/kleiderschrank1-open-left.jpg' :
			'assets/bg/kleiderschrank1-open-right.jpg');
}

// dress up Jimmy
function wearItem(obj) {
  if (typeof obj.info.z != 'undefined') {
	  obj.zIndex = 50 + obj.info.z;
  } else {
    obj.zIndex = 20;
  }
	if (obj.info.id.indexOf('jimmy') == 0) {
		imgJimmy.image = 'assets/jimmy/' + obj.info.id + '.png';
		// unhide other clothes
		for (var i in imgClothes) {
			if (imgClothes[i].info.id != obj.info.id 
				&& imgClothes[i].info.id.indexOf('jimmy') == 0) {
					obj.wearing = false;
			}
		}
		obj.center = {
			x:obj.origin.x,
			y:obj.origin.y
		};
		// don't "wear" the costume
		obj.opacity = 0;
		// redraw the inventory to restore other shirts
		switchInventory();
	} else {
		if (typeof obj.info.x != 'undefined') {
			obj.center = {
				x:obj.info.x,
				y:obj.info.y
			};
		} else {
			Ti.API.debug('Item placed: ' + obj.center.x + ', ' + obj.center.y );
		}
		// if a target scale is defined
		if (typeof obj.info.scaleTo != 'undefined') {
			obj.height = obj.o_height * obj.info.scaleTo; 
			obj.width  = obj.o_width * obj.info.scaleTo;
		}
		// swap to worn asset
		obj.image = 'assets/jimmy/' + obj.info.id + '.png';
	}
	obj.wearing = true;
} 

// put the item back on its shelf
function unwearItem(obj) {
	// put the item back on its shelf
	obj.center = {
		x:obj.origin.x,
		y:obj.origin.y
	};
	// Restore size from pop-in
	if (typeof obj.info.scaleTo != 'undefined') {
		obj.height = obj.o_height * obj.info.scale; 
		obj.width  = obj.o_width * obj.info.scale;
	}
	// Restore to shelf image
	obj.image = 'assets/clothes/' + obj.info.id + '.png';
	obj.wearing = false;
	// Check shown inventory
	switchInventory();
}

// var showClothes = [];
function updateWearing() {
	// for (var u in showClothes) {
		// container.remove(showClothes[u])
	// }
	// showClothes = [];
	// iterate through all worn clothing
	for (var i in imgClothes) {
		var item = imgClothes[i];
		if (item.wearing) {
			Ti.API.debug('Wearing ' + item.info.id);
			// add to shown clothes
			// showClothes.push(item);
			container.add(item);
		} else {
			container.remove(item);
		}
	}	
}

function updateResult() {
	var count = 0, typeTally = 0, hazRainThing = false;
	// iterate through all worn clothing
	for (var i in imgClothes) {
		var item = imgClothes[i];
		if (item.wearing) {
			count++;
			// tally up item properties
			typeTally += item.info.type;
			hazRainThing = (item.info.id == 'umbrella');
		}
	}
	// Win if the weather is nice & we're dressed lightly,
	// or the weather is heavy and we're dressed warm
	var typeOK = 
		(theLandscape < 2 && fairWeather && typeTally < 3 && count > 0) ||
		(theLandscape < 2 && !fairWeather && typeTally > 2 && hazRainThing) ||
		(theLandscape > 1 && fairWeather && typeTally >= theLandscape) ||
		(theLandscape > 1 && !fairWeather && typeTally >= theLandscape + 2);
		
	// switch (theLandscape) {
	// case 0: // spring
	// case 1: // summer
	// case 2: // autumn
	// case 3: // winter
	// }
	Ti.API.debug(typeOK + '! Tally: ' + typeTally + ' Count: ' + count + ' / Sun: ' + fairWeather + 
				 ' Season: ' + theLandscape + ' ' + landscapes[theLandscape]);
	
	// check if Jimmy goes out
	if (typeOK) {
		// play end game music
		soundClips.play();
		imgDoor.opacity = 0;
		imgDoor.hide();
		// container.add(buttonRestart);
	}
}

function startGame() {
  container.add(imgJimmy);
  drawInventory();
  imgNavButtonLeft.addEventListener('click',function(e) {
	  if (currentInventory == 0) {
		  gotoScreen(windowsIx.intro);
	  } else {
		  currentInventory = 0;
		  switchInventory();
	  }
  });
  container.add(imgNavButtonLeft);
  imgNavButtonRight.addEventListener('click',function(e) {
	  if (currentInventory == 1) {
      // open doors and go to end game
		  slideDoors(false, windowsIx.outro);
	  } else {
		  currentInventory = 1;
		  switchInventory();
	  }
  });
  container.add(imgNavButtonRight);
}

function endGame() {
	imgDoor.right = 0;
	container.add(imgJimmy);
	container.add(imgDoor);
	// tap to return to game
	windows[s].addEventListener('click',function(e) {
		gotoScreen(windowsIx.game);
	});
}

// event handler
var switchingScreen = false;
function gotoScreen(s) {
  // Manage contention on window switch
  if (switchingScreen) return;
  switchingScreen = true;
	Ti.API.debug('Opening screen ' + s);
	// Create contents of the window
	if (!windows[s].isPainted) {
		container = windows[s].container = Ti.UI.createView({
			width:'100%', height:'100%', top:0, left:0,
			borderRadius:0 // fix clipping issues
		});
		windows[s].isPainted = true;
		switch(s) {
		case windowsIx.menu:
		  showMenu();
		  break;
		case windowsIx.intro:
			showIntro();
			break;
		case windowsIx.game:
			startGame();
			break;
		case windowsIx.outro:
			endGame(); 
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
	var prevScreen = currentScreen;
	currentScreen = s;
	
	// Refresh end screen
	switch (s) {
	case windowsIx.intro:
		imgJimmy.zIndex = 30;
		updateWearing();
		break;
	case windowsIx.game:
 	  slideDoors(true);
		imgJimmy.zIndex = 15;
		break;
	case windowsIx.outro:
		// End game result
		updateWearing();
		updateResult();
		break;
	}
	windows[s].open();
	switchingScreen = false;
}
