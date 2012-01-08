Ti.include('game_objects.js');

// background color of the master UIView
Titanium.UI.setBackgroundColor('#cdf');

// draws Jimmy and all clothes
function drawOpenCloset() {	
	win1.add(imgJimmy);
	win1.add(imgMirror);
	win1.setBackgroundImage('assets/kleiderschrank1-open.jpg');
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
				if (this.jimmyID.indexOf('shirt') > 0) {
					// dress up Jimmy
					imgJimmy.image = 'assets/jimmy/jimmy_' + this.jimmyID + '.png';
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
				}
			} else {
				// put the item back on its shelf
				this.center = {
					x:this.origin.x,
					y:this.origin.y
				};
			}
		});
		// put to display
		win1.add(imgClothes[i]);
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
win1.open();
win1.add(imgIntro);
// imgIntro.hide();

// event handler
var gameStarted = false;
win1.addEventListener('click',function(e)
{
	if (!gameStarted) {
		gameStarted = true;
		startGame();
	}
});
