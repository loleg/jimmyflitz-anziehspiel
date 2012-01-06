Ti.include('game_objects.js');

// background color of the master UIView
Titanium.UI.setBackgroundColor('#cdf');

// add startup images
win1.add(imgIntro);
win1.add(imgLogo);

// draws Jimmy and all clothes
function drawCloset() {
	win1.add(imgJimmy);
win1.add(imgMirror);
	for (var i in imgClothes) {
		// imgClothes[i].addEventListener('click', function(e) {
			// imgJimmy.image = 'assets/jimmy/jimmy_' + this.jimmyID + '.png';
		// });
		imgClothes[i].origin_x = imgClothes[i].center.x;
		imgClothes[i].origin_y = imgClothes[i].center.y;
		imgClothes[i].addEventListener('touchstart', function(e) {
			this.offset_x = e.x;
			this.offset_y = e.y;
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
						x:this.origin_x,
						y:this.origin_y
					};
					this.hide();
				}
			} else {
				// put the item back on its shelf
				this.center = {
					x:this.origin_x,
					y:this.origin_y
				};
			}
		});
		win1.add(imgClothes[i]);
	}
}

// event handler
win1.addEventListener('click',function(e)
{
	drawCloset();
	// set up intro animations
	var introFade = logoFade = Titanium.UI.createAnimation({
        curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
        opacity:0,
        duration:1000 
    });
    introFade.addEventListener('complete', function() {
    	// finish the intro animation
    });
    imgLogo.animate(logoFade);
    imgIntro.animate(introFade);
});

// open root window
win1.open();

