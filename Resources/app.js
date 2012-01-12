Ti.include('game_objects.js');

// background color of the master UIView
Ti.UI.setBackgroundColor('#cdf');

// open root window
var container, currentScreen = -1;
gotoScreen(0);

// draws Jimmy and all clothes
function drawOpenCloset() {	
	container.add(imgJimmy);
	container.add(imgMirror);
	for (var i in imgClothes) {
		// imgClothes[i].addEventListener('click', function(e) {
			// imgJimmy.image = 'assets/jimmy/jimmy_' + this.jimmyID + '.png';
		// });
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
		});
		imgClothes[i].addEventListener('touchend', function(e) {
			this.zIndex = 20;
			if (this.center.y > imgJimmy.center.y - imgJimmy.height/2) {
				if (this.jimmyID.indexOf('jimmy') == 0) {
					// dress up Jimmy
					imgJimmy.image = 'assets/jimmy/' + this.jimmyID + '.png';
					// unhide other clothes
					for (var i in imgClothes) {
						if (imgClothes[i].jimmyID != this.jimmyID 
							&& imgClothes[i].jimmyID.indexOf('jimmy') == 0) {
								imgClothes[i].opacity = 1;
						}
					}
					this.center = {
						x:this.origin.x,
						y:this.origin.y
					};
					// don't "wear" the costume
					this.opacity = 0;
				} else {
					this.width = this.o_width * 0.8;
					this.height = this.o_height * 0.8;
					this.wearing = true;
				}
			} else {
				// put the item back on its shelf
				this.center = {
					x:this.origin.x,
					y:this.origin.y
				};
				this.width = this.o_width;
				this.height = this.o_height;
				this.wearing = false;
			}
		});
		// put to display
		container.add(imgClothes[i]);
	}
	// but hide the first
	imgClothes[0].opacity = 0;
}

function startGame() {
	drawOpenCloset();
	// set up intro animations
	var introFade = Titanium.UI.createAnimation({
        //curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
        opacity:0,
        duration:1000 
    });
    introFade.addEventListener('complete', function() {
    	// finish the intro animation
    });
    imgIntro.animate(introFade);
}

function showResult() {
	container.add(imgJimmy);
}

var showClothes = [];
function updateResult() {
	for (var u in showClothes) {
		windows[currentScreen].remove(showClothes[u])
	}
	showClothes = [];
	for (var i in imgClothes) {
		if (imgClothes[i].wearing) {
			showClothes.push(imgClothes[i]);
			windows[currentScreen].add(showClothes[showClothes.length-1]);				
		}
	}
}

// event handler
function gotoScreen(s) {
	Ti.API.debug('Opening screen ' + s);
	if (!windows[s].isPainted) {
		windows[s].isPainted = true;
		container = Ti.UI.createView({
			width:'100%', height:'100%', top:0, left:0
		});
		switch(s) {
		case 0:
			container.add(imgIntro);
			imgIntro.addEventListener('click',function(e) {
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
			showResult();
			imgDoorEnter.addEventListener('click',function(e) {
				gotoScreen(1);
			});
			container.add(imgDoorEnter);
			break;
		}
		windows[s].add(container);
	}
	if (currentScreen != -1) {
		windows[currentScreen].close();
	}
	// refresh end screen
	if (s == 2) {
		updateResult();
	}
	windows[s].open();
	currentScreen = s;
}