Ti.include('game_objects.js');

// background color of the master UIView
Ti.UI.setBackgroundColor('#cdf');
var container = Ti.UI.createView();
win1.add(container);

// draws Jimmy and all clothes
function drawOpenCloset() {	
	container.add(imgJimmy);
	container.add(imgMirror);
	container.setBackgroundImage('assets/bg/kleiderschrank1-open.jpg');
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
		});
		imgClothes[i].addEventListener('touchmove', function(e) {
			// Ti.API.debug('Our event tells us the center is ' + e.x + ', ' + e.y ); 
			this.center = {
					x:this.center.x + (e.x - this.offset_x), 
					y:this.center.y + (e.y - this.offset_y)
			};
		});
		imgClothes[i].addEventListener('touchend', function(e) {
			if (this.center.y > imgJimmy.center.y - imgJimmy.height/2) {
				if (this.jimmyID.indexOf('jimmy') == 0) {
					// dress up Jimmy
					imgJimmy.image = 'assets/jimmy/' + this.jimmyID + '.png';
					// unhide other clothes
					for (var i in imgClothes) {
						if (!imgClothes[i].visible) {
							imgClothes[i].show();				
						}
					}
					this.center = {
						x:this.origin.x,
						y:this.origin.y
					};
					this.hide();
				} else {
					this.width = this.o_width * 0.8;
					this.height = this.o_height * 0.8;
				}
			} else {
				// put the item back on its shelf
				this.center = {
					x:this.origin.x,
					y:this.origin.y
				};
				this.width = this.o_width;
				this.height = this.o_height;
			}
		});
		// put to display
		container.add(imgClothes[i]);
	}
}

function startGame() {
	drawOpenCloset();
	// set up intro animations
	var introFade = Titanium.UI.createAnimation({
        curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
        opacity:0,
        duration:1000 
    });
    introFade.addEventListener('complete', function() {
    	// finish the intro animation
    });
    imgIntro.animate(introFade);
}

// open root window
gotoScreen(0);
win1.open();

// event handler
var currentScreen = 0;
function gotoScreen(s) {
	Ti.API.debug('Opening screen ' + s);
	win1.remove(container);
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
		container.add(imgDoorExit);
		break;
	}
	win1.add(container);
	currentScreen = s;
}


