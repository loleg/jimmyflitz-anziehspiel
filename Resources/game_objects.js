// create positioning helper
var rezX = Ti.Platform.displayCaps.getPlatformWidth()  / 320;
var rezY = Ti.Platform.displayCaps.getPlatformHeight() / 480;

// create root windows
var container;
var windowsIx = { menu: 0, intro: 1, game: 2, outro: 3, credits: 4 };
var windows = [
	Titanium.UI.createWindow({ 
		backgroundColor:'#fff' }), 	// Menu
	Titanium.UI.createWindow({ }),// title:'Intro'
	Titanium.UI.createWindow({ 		// title:'Cabinet'
	    backgroundImage:'assets/bg/kleiderschrank1-open-left.jpg'
	}),
	Titanium.UI.createWindow({ }),// title:'Outro'
	Titanium.UI.createWindow({ 		// title:'Credits'
	    backgroundImage:'assets/bg/credits.jpg'
	}),
];

// define landscapes
var landscapes = ['spring', 'summer', 'autumn', 'winter'];
var theLandscape = 0;
var fairWeather = false;

// seasons and weather fx
var imgWeather = Titanium.UI.createImageView({
	image:'assets/ui/rain.png',
	height: '100%', width: '100%',
	zIndex: 0, opacity: 0, touchEnabled:false
});

// end game music
var soundClips = Titanium.Media.createSound({
	url: "sound/21-DAJANA-MASTERMIX_02.mp3" });

// welcome images
var imgIntro = Titanium.UI.createImageView({
	image:'assets/bg/jimmy-jump-intro.jpg',
	opacity:1, top:0, width:'100%', zIndex:10
});
var imgWindow = Titanium.UI.createImageView({
	image:'assets/bg/cabane.gif',
	opacity:1, top:0, height:'100%', zIndex:2
});
var imgDoor = Titanium.UI.createImageView({
	backgroundImage:'assets/ui/cabane_door.gif', zIndex:2,
	opacity:1, top:0, height:'100%', width:'100%'
});

// zoom window
var imgZoomWindow = Titanium.UI.createImageView({
	backgroundImage:'assets/ui/window.png',
	opacity:1, zIndex:11, width:640, height:903
});
imgZoomWindow.zoom = function(e) {
	container.opacity = (container.opacity) ? 0 : 1;
	this.center = (container.opacity) ? 
	  {x: rezX * 104, y: rezY * 201} : {};
	this.width = (container.opacity) ? rezX * 112 : 
		Ti.Platform.displayCaps.getPlatformWidth();
	this.height = (container.opacity) ? rezY * 162 : 
		Ti.Platform.displayCaps.getPlatformHeight();
};
imgZoomWindow.addEventListener('click', imgZoomWindow.zoom);

// sliding animation
var imgCabLeft = Titanium.UI.createImageView({
	image:'assets/bg/kleiderschrank1-closed-LEFT.jpg',
	showX:-Ti.Platform.displayCaps.getPlatformWidth()/2, hideX:-900,
	height:'100%', zIndex:55
});
var imgCabRight = Titanium.UI.createImageView({
	image:'assets/bg/kleiderschrank1-closed-RIGHT.jpg',
	showX:'50%',	hideX:1200,
	height:'100%', zIndex:55
});

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_white.png',
	height:rezY* 200,
	center:{y:rezY* 365},
	zIndex:50
});

// jimmy (intro) and friends
/*
var imgFriends = [
	Titanium.UI.createImageView({
		image:'assets/jimmy/dancing.png',
		height:rezY* 200, width:rezX* 200, 
		center:{x:rezX* 135, y:rezY* 356}, zIndex:2
	}),
	Titanium.UI.createImageView({
		image:'assets/friends/fernanda.png',
		height:rezY* 150, width:rezX* 150,
		center:{x:rezX* 255, y:rezY* 178}, zIndex:3
	}),
	Titanium.UI.createImageView({
		image:'assets/friends/wulwul.png',
		height:rezY* 270, width:rezX* 220,
		center:{x:rezX* 260, y:rezY* 330}, zIndex:4
	}),
	Titanium.UI.createImageView({
		image:'assets/friends/culan.png',
		height:rezY* 200, width:rezX* 200,
		center:{x:rezX* 28, y:rezY* 414}, zIndex:5
	})
]*/

// UI elements
// var buttonRestart = Titanium.UI.createButton({
	// title: 'Start', zIndex: 55,
	// size: {width: 80, height: 20},
	// center: {x: rezX * 30, y: rezY* 340}
// });
var imgNavButtonLeft = Titanium.UI.createImageView({
	image:'assets/ui/mousefeet.png',
	height:rezY* 90, width:rezX* 90, 
	center:{x:rezX* 0, y:rezY* 355}, zIndex:99
});
var imgNavButtonRight = Titanium.UI.createImageView({
	image:'assets/ui/mousefeet.png',
	height:rezY* 90, width:rezX* 90, 
	center:{x:rezX* 320, y:rezY* 355}, zIndex:99
});

/* various icons */
var imgIconWarning = Titanium.UI.createImageView({
	image:'assets/ui/warn_cloud.png',
	height:rezY* 60,
	center:{y:rezY* 240},
	zIndex:90, opacity:0
});
var imgIconCD = Titanium.UI.createImageView({
	image:'assets/ui/icon_disc.png',
	height:rezY* 90, width:rezY* 90,
	center:{x:rezX* 60, y:rezY* 280}
});
var imgIconBook = Titanium.UI.createImageView({
	image:'assets/ui/icon_book.png',
	height:rezY* 90, width:rezY* 90,
	center:{y:rezY* 280}
});
var imgIconAudioBook = Titanium.UI.createImageView({
	image:'assets/ui/icon_audiobook.png',
	height:rezY* 90, width:rezY* 90,
	center:{x:rezX* 160, y:rezY* 280}
});

// some clothes 
// type = score quotient - 0 (default): spring/summer, 1: winter, 2: weather
// scale = size scaling - 1.0 is default
// center = new position (x, y) - null is default
var clothesPerSide = 8;
var clothes = [
	{ id: "jimmy_red", type: 0 },
	{ id: "jimmy_blue", type: 0 }, 
	{ id: "jimmy_yellow", type: 0 }, 
	{ id: "hat1", type: 1, scale: 1, x: 173, y: 293, z: 3 }, 
	{ id: "hat2", type: 1, scale: 0.7, scaleTo: 1.2, x: 170, y: 297 }, 
	{ id: "hat3", type: 1, scale: 0.8, scaleTo: 1.1, x: 163, y: 289 }, 
	{ id: "shades1", type: 0, scale: 0.8, x: 171, y: 305, center: {x:rezX* 136, y:rezY* 170} },
	{ id: "shades2", type: 0, scale: 0.8, x: 170, y: 310, center: {x:rezX* 230, y:rezY* 170} }, 
	
	{ id: "scarf1", type: 2, x: 176, y: 352, z: 3 },
	{ id: "jacket2", type: 2, scale: 1.2, x: 181, y: 353, z: 2, scaleTo: 1.4 }, 
	{ id: "jacket1", type: 1, scale: 1.1, scaleTo: 0.9, x: 178, y: 365, z: 1 },
	{ id: "mittens1", type: 1, x: 183, y: 392, z: 3 },
	{ id: "mittens2", type: 1, x: 184, y: 394, z: 3, scaleTo: 1.1 },
	{ id: "socks_blue", type: 0, x: 190, y: 445, z: 1 },
	{ id: "boots", type: 2, x: 185, y: 431, z: 3 },
	   
	{ id: "umbrella", type: 1, scale: 1.4, x: 231, y: 339, z: -40, center: {x:rezX* 277, y:rezY* 100} }
	];
	
var imgClothes = [];
var centerClothes = [ rezX* -37, rezY* 108 ];
var marginClothes = [ rezX* 85, rezY* 100 ];

// loads clothes data
{
	var col = 0, row = 0, rowClothes = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		// scoot the clothes over to fit cabinet
		var paddingLeft = (i < clothesPerSide) ? 58 : 0;
		var paddingTop = (i < clothesPerSide) ? 0 : -14;
		// define the image object
		var img = Titanium.UI.createImageView({
			info:		clothes[i],
			image:  	'assets/clothes/' + clothes[i].id + '.png',
			height: 	rezY* 90, width: rezX* 90, zIndex: 20,
			center: 	{x:centerClothes[0] + (marginClothes[0] * col) + paddingLeft,
				 	 	 y:centerClothes[1] + (marginClothes[1] * row) + paddingTop}
		});
		
		// update scale and position if specified
		if (typeof img.info.scale != 'undefined') {
			img.height *= img.info.scale; 
			img.width  *= img.info.scale;
		} else {
			img.info.scale = 1;
		}
		if (typeof img.info.center != 'undefined') {
			img.center = img.info.center;
		}

		rowClothes++;
		if (rowClothes == clothesPerSide) {
			rowClothes = col = row = 0;
		}
		
		img.o_height = img.height;
		img.o_width = img.width;
		img.wearing = false;
		
		// add to stack
		imgClothes.push(img);
	}
}
