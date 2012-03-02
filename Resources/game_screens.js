// menu screen
function showMenu() {
	// set language depending on locale
	Ti.API.debug('User locale: ' + Titanium.Platform.locale);
	var landscapeText = landscapes;
	var buttonText = 'Credits';
	switch(Titanium.Platform.locale) {
	case 'en':
		landscapeText = ['Spring', 'Summer', 'Autumn', 'Winter'];
		break;
	case 'de':
		landscapeText = ['Frühling', 'Sommer', 'Herbst', 'Winter'];
		buttonText = "Impressum";
		break;
	case 'fr':
		landscapeText = ['Printemps', "L'été", 'Automne', 'Hiver'];
		buttonText = "Edition";
		break;
	case 'it':
		landscapeText = ['Primavera', 'Estate', 'Autunno', 'Inverna']; 
		buttonText = "Edizione";
		break;
	}
	buttonCredits.title = buttonText;
	// draw all four seasons
	for(var l in landscapes) {
		var img = Titanium.UI.createImageView({
			image : 'assets/ui/window.png',
			landscapeIndex : l,
			backgroundImage : 'assets/bg/landscape-' + landscapes[l] + '.jpg',
			opacity : 1,
			zIndex : 11,
			width : rezX * 80,
			height : rezY * 113,
			top : (l < 2) ? '26%' : '54%',
			left : (l % 2 == 0) ? '15%' : '56%',
			borderColor:'white', borderWidth:2
		});
		var lbl = Titanium.UI.createLabel({
			text: landscapeText[l], zIndex: 12,
			font: { fontWeight:'bold' },
			size: {width: 110, height: 25},
			color: 'yellow', 
			top : (l < 2) ? '21%' : '49%',
			left : img.left + img.width / 2,
			shadowColor:'#444', shadowOffset:{x:1, y:1}
		});
		img.addEventListener('click', function(e) {
			gotoScreen(windowsIx.intro);
		});
		menuImg.push(img);
		container.add(img);
		container.add(lbl);
	}
	// add credits link
	container.add(buttonCredits);
	buttonCredits.addEventListener('click', function(e) {
		gotoScreen(windowsIx.credits);
	});
}

// initial screen with window
function showIntro() {
	container.add(imgWindow);
	container.add(imgJimmy);

	// set opacity to 1 to start with zoomed window
	container.opacity = 0;
	container.zIndex = 1;

	imgZoomWindow.zIndex = 14;
	imgZoomWindow.zoom();
	windows[windowsIx.intro].add(imgZoomWindow);
	
	// add weather effects
	windows[windowsIx.intro].add(imgWeather);
	windows[windowsIx.outro].add(imgWeather);

	// container.add(buttonRestart);
	// buttonRestart.addEventListener('click', function(e) {
		// gotoScreen(windowsIx.menu);
	// });

	// Click anywhere to continue
	imgWindow.addEventListener('click', function(e) {
		gotoScreen(windowsIx.game);
	});
}

function showGame() {
	container.add(imgCabLeft);
	container.add(imgCabRight);
	imgCabLeft.hide();
	imgCabRight.hide();
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
	imgDoor.opacity = 1;
	container.add(imgJimmy);
	container.add(imgDoor);
	container.add(imgIconWarning);
	// tap to return to cabinet or go to credits
	windows[windowsIx.outro].container.addEventListener('click', function(e) {
		if (currentScreen != windowsIx.outro) return;
		if (windows[windowsIx.outro].endgame) {
			container.animate({
		      left: 1000,
		      duration: 500,
		      curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_IN
		    }, function(e) {
		    	// What to do after animation finishes
		    	gotoScreen(windowsIx.credits);
			});
		} else { 
			gotoScreen(windowsIx.game);
		}
	});
}

function showFinale() {
	// animate Jimmy
	container.left = -500; // starting point
	container.animate({
      left: 0,
      duration: 500,
      curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT
    });
	Ti.Gesture.addEventListener('shake', function(e) {
      container.animate({
	      top: 0,
	      autoreverse: true,
	      duration: 500,
	      curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT
	    });
    });

	// play end game music
	if (!soundClips.mute) {
		soundClips.game.setLooping(false);
		soundClips.game.stop();
		soundClips.finale.play();
	}
}

function showCredits() {
	container.add(imgIconCD);
	container.add(imgIconBook);
	container.add(imgIconAudioBook);
	container.add(imgIconWebsite);
	// add labels
	var labelTexts = ['Music', 'Book', 'Audiobook'];
	switch(Titanium.Platform.locale) {
	case 'de':
		labelTexts = ['Musik', 'Buch', 'Hörbuch']; break;
	case 'fr':
		labelTexts = ['Musique', 'Livre', 'Livre audio']; break;
	case 'it':
		labelTexts = ['Musica', 'Libro', 'Audiolibro']; break;
	}
	for (var l in labelTexts) {
		var lbl = Titanium.UI.createLabel({
			text: labelTexts[l], zIndex: 12, height:30,
			font: { fontWeight:'bold', fontSize:'14pt' },
			color: 'white', top : '34%',
			left : (14+l*27) + '%',
			shadowColor:'#444', shadowOffset:{x:1, y:1}
		});
		container.add(lbl);
	}
	
	// return to menu
	windows[windowsIx.credits].container.addEventListener('click', function(e) {
		newGame();
	});
	// assign links
	imgIconCD.addEventListener('click', function(e) {
		Ti.Platform.openURL("http://itunes.apple.com/ch/album/hits-mit-jimmy-flitz-remastered/id493925667");
	});
	imgIconBook.addEventListener('click', function(e) {
		Ti.Platform.openURL("http://itunes.apple.com/ch/book/jimmy-flitz-die-schweizermaus/id464844865?mt=11#");
	});
	imgIconAudioBook.addEventListener('click', function(e) {
		Ti.Platform.openURL("http://itunes.apple.com/ch/album/honigmelonemond/id387316259");
	});
	imgIconWebsite.addEventListener('click', function(e) {
		Ti.Platform.openURL("http://www.jimmyflitz.ch");
	});
}

function setLandscape(index) {
	// choose a random landscape and conditions
	theLandscape = (typeof index !== 'undefined') ? index : Math.floor(Math.random() * 4);
	fairWeather = (Math.random() > 0.5);
	if (theLandscape == 3) fairWeather = true;
	Ti.API.debug('Landscape: ' + landscapes[theLandscape] + ', ' + (fairWeather) ? 'nice weather' : 'storm');
	// background asset
	var path = 'assets/bg/landscape-' + landscapes[theLandscape] + '.jpg';
	// set the UI background
	Titanium.UI.setBackgroundImage(path);
	// show or hide the weather 'fx'
	imgWeather.opacity = (fairWeather) ? 0 : 1;
}

// animate sliding doors
function slideDoors(isOpening) {
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
			if (typeof this.origin === 'undefined') {
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

function switchInventory(i) {
	if (typeof i != "undefined") currentInventory = i;
	Ti.API.debug('Updating inventory ' + currentInventory);
	windows[windowsIx.game].setBackgroundImage((currentInventory == 0) ? 
		'assets/bg/kleiderschrank1-open-left.jpg' : 
		'assets/bg/kleiderschrank1-open-right.jpg');
	for(var i in imgClothes) {
		if(!imgClothes[i].wearing) {
			imgClothes[i].opacity = 
				(i >= clothesPerSide * currentInventory 
				&& i < clothesPerSide * (currentInventory + 1)) ? 1 : 0;
		}
	}
}

// dress up Jimmy
function wearItem(obj) {
	obj.wearing = true;
	if (obj.info.z) {
		obj.zIndex = 50 + obj.info.z;
	} else {
		obj.zIndex = 51;
	}
	if (obj.info.id.indexOf('jimmy') == 0) {
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
		for (var i in imgClothes) {
			if (imgClothes[i].wearing && imgClothes[i].info.id != obj.info.id && 
				imgClothes[i].info.id.replace(/\d/, "") == baseName) {
				unwearItem(imgClothes[i]);
			}
		}
		// snap object to its defined center
		if (obj.info.x) {
			obj.center = {
				x : obj.info.x,
				y : obj.info.y
			};
		} else {
			Ti.API.debug('Item ' + obj.info.id + ' at: ' + obj.center.x + ', ' + obj.center.y);
		}
		// if a target scale is defined
		if (obj.info.scaleTo) {
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
	var count = 0, 
		typeTally = 0,
		sunTally = 0,
		rainTally = 0;
		
	// iterate through all worn clothing
	for(var i in imgClothes) {
		var item = imgClothes[i];
		if (item.wearing) {
			count++;
			// tally up item properties
			typeTally += item.info.type;
			sunTally += item.info.sunny;
			rainTally += item.info.rainy;
		}
	}
	
	// Win if the weather is nice & we're dressed lightly,
	// or the weather is heavy and we're dressed warm
	var typeOK = false, typeWarn = 'shirt';
	if (count > 0) {
		typeWarn = (fairWeather) ? 'sun' : 'cloud';
		switch (parseInt(theLandscape)) {
		case 0: // spring
		case 2: // autumn
			typeOK = (fairWeather && typeTally > 1 && typeTally < 5)	
			 	  || (!fairWeather && typeTally > 2 && typeTally < 7 && rainTally > 0);
			typeWarn = (typeTally < 2) ? 'snow' : typeWarn;
			typeWarn = (typeTally > 4) ? 'sun' : typeWarn;
			break;
		case 1: // summer
			typeOK = (fairWeather && typeTally > 0 && typeTally < 4 && sunTally > 0)
			      || (!fairWeather && typeTally > 0 && typeTally < 5 && rainTally > 0);
			typeWarn = (typeTally > 3) ? 'sun' : typeWarn;
			break;
		case 3: // winter
			typeOK = (typeTally > 5);
			typeWarn = 'snow';
			break;
		}
	}
	
	Ti.API.debug(typeOK + '! (' + typeWarn + ') Why? ' +
		' FairWeather: ' + fairWeather + ' Season: ' + theLandscape + ' ' + landscapes[theLandscape] +
		' Tally: ' + typeTally + ' Rain: ' + rainTally + 
		' Sun: ' + sunTally + ' Count: ' + count + 
		'');

	// show warning
	imgIconWarning.image = 'assets/ui/warn_' + typeWarn + '.png';
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
	windows[windowsIx.outro].endgame = typeOK;
	if(typeOK) {
		if (!soundClips.mute) {
			soundClips.jupi.play();
		}
		imgDoor.opacity = 0;
		showFinale();
	} else {
		if (!soundClips.mute) {
			soundClips.oops.play();
		}
		imgDoor.opacity = 1;
	}
}