// create positioning helper
var rezX = Ti.Platform.displayCaps.getPlatformWidth()  / 320;
var rezY = Ti.Platform.displayCaps.getPlatformHeight() / 480;

// create root windows
var container;
var windowsIx = { menu: 0, intro: 1, game: 2, outro: 3, credits: 4 };
var windows = [
	Titanium.UI.createWindow({ // Menu
		backgroundImage:'assets/bg/menu.jpg' 
	}), 
	Titanium.UI.createWindow({ }), // title:'Intro'
	Titanium.UI.createWindow({ // title:'Cabinet'
	    backgroundImage:'assets/bg/kleiderschrank1-open-left.jpg'
	}),
	Titanium.UI.createWindow({ }), // title:'Outro'
	Titanium.UI.createWindow({ // title:'Credits'
		backgroundColor:'#2e6872' })
];

// define landscapes
var landscapes = ['spring', 'summer', 'autumn', 'winter'];
var menuImg = []; // container for season buttons
var theLandscape = 0;
var fairWeather = false;

// seasons and weather fx
var imgWeather = Titanium.UI.createImageView({
	image:'assets/ui/rain.png',
	height: '100%', width: '100%',
	zIndex: 0, opacity: 0, touchEnabled:false
});

// end game music
var soundClips = {
	mute:  	false,
	play:	false,
	game: 	Titanium.Media.createSound({
			url: "sound/ChaesliedPlayb.mp3" }),
	jupi: 	Titanium.Media.createSound({
			url: "sound/Jimmy_Jubell_Laute.m4a" }),
	oops:	Titanium.Media.createSound({
			url: "sound/JimmyOo_Upps_Dajana.m4a" }),
	finale: Titanium.Media.createSound({
			url: "sound/SchwyzerFlitzerZoss.mp3" })
	};

// welcome images
var imgWindow = Titanium.UI.createImageView({
	image:'assets/bg/cabane.gif',
	opacity:1, top:0, height:'100%', zIndex:2
});
var imgDoor = Titanium.UI.createImageView({
	backgroundImage:'assets/ui/cabane_door.gif', zIndex:2,
	opacity:1, top:0, height:'100%', width:'100%'
});

// zoom window
var imgSmallWindow = Titanium.UI.createImageView({
	backgroundImage:'assets/ui/window.gif',
	opacity:1, zIndex:11, 
	width:rezX * 112, height:rezY * 162,
	center:{x: rezX * 104, y: rezY * 201}
});
var imgZoomWindow = Titanium.UI.createImageView({
	backgroundImage:'assets/ui/window.gif',
	opacity:1, zIndex:99, 
	width:Ti.Platform.displayCaps.getPlatformWidth(), 
	height:Ti.Platform.displayCaps.getPlatformHeight()
});

// sliding animation
var imgCabLeft = Titanium.UI.createImageView({
	image:'assets/bg/kleiderschrank1-closed-LEFT.jpg',
	showX:-Ti.Platform.displayCaps.getPlatformWidth()/2, hideX:-900,
	height:'100%', zIndex:95
});
var imgCabRight = Titanium.UI.createImageView({
	image:'assets/bg/kleiderschrank1-closed-RIGHT.jpg',
	showX:'50%',	hideX:1200,
	height:'100%', zIndex:95
});

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_white.png',
	height:rezY* 222,
	center:{y:rezY* 365},
	zIndex:50, touchEnabled:false
});

// UI elements
var imgNavButtonLeft = Titanium.UI.createImageView({
	image:'assets/ui/mousefeet.png',
	height:rezY* 90, width:rezX* 90, 
	center:{x:rezX* 0, y:rezY* 355}, zIndex:99
});
var imgNavButtonLeft2 = Titanium.UI.createImageView({
	image:'assets/ui/mousearrows.png',
	height:rezY* 90, width:rezX* 90, 
	center:{x:rezX* -5, y:rezY* 270}, zIndex:99
});
var imgNavButtonRight = Titanium.UI.createImageView({
	image:'assets/ui/mousefeet.png',
	height:rezY* 90, width:rezX* 90, 
	center:{x:rezX* 320, y:rezY* 355}, zIndex:99
});
var imgNavButtonRight2 = Titanium.UI.createImageView({
	image:'assets/ui/mousefeet.png',
	height:rezY* 90, width:rezX* 90, 
	center:{x:rezX* 320, y:rezY* 355}, zIndex:99
});
var imgNavButtonJump = Titanium.UI.createImageView({
	image:'assets/ui/mousejump.png',
	height:rezY* 70, width:rezX* 70, 
	center:{y:rezY* 70}, zIndex:99
});

/* various icons */
var imgIconWarning = Titanium.UI.createImageView({
	image:'assets/ui/warn_cloud.png',
	height:rezY* 80,
	center:{y:rezY* 235},
	zIndex:90, opacity:0
});
var imgIconCD = Titanium.UI.createImageView({
	image:'assets/ui/icon_disc.png',
	height:rezY* 60, width:rezY* 60,
	center:{x:'20%', y:rezY* 150}
});
var imgIconBook = Titanium.UI.createImageView({
	image:'assets/ui/icon_book.png',
	height:rezY* 80, width:rezY* 80,
	center:{y:rezY* 150}
});
var imgIconAudioBook = Titanium.UI.createImageView({
	image:'assets/ui/icon_audiobook.png',
	height:rezY* 80, width:rezY* 80,
	center:{x:'80%', y:rezY* 150}
});
var imgIconWebsite = Titanium.UI.createImageView({
	height:rezY* 110, bottom:'1%'
});
var imgCredits = Titanium.UI.createImageView({
	backgroundImage:'assets/bg/credits.png', zIndex:0,
	opacity:1, top:0, height:'100%', width:'100%'
});
var buttonCredits = Titanium.UI.createLabel({
	text: 'Impressum', size: {width: 150, height: 57}, 
	right:'15%', bottom:'1%',
	color: '#631a05', font: { fontFamily:'American Typewriter', fontSize:16 }, 
	textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER
});

// Easter eggs
var imgExBasket = Titanium.UI.createImageView({
	backgroundImage:'assets/ui/ex-basket.png', zIndex:44,
	width:129, height:100, top:'65%', left:'10%'
});
var imgExEgg = Titanium.UI.createImageView({
	backgroundImage:'assets/ui/ex-egg1.png', zIndex:41,
	width:16, height:20
});
imgExEgg.addEventListener('click', function(e) {
	this.zIndex = (this.zIndex > 43) ? 41 : this.zIndex+1;
	this.setBackgroundImage('assets/ui/ex-egg' + (this.zIndex - 40) + '.png');
}); imgExEgg.randomItem = 0;

// some clothes 
// type = score quotient - 0 (default): spring/summer, 1: winter, 2: weather
// scale = size scaling - 1.0 is default
// x / y = position when being worn (required except for replacement items)
// center = new position (x, y) in cabinet - null is default
// z = ordering delta - 20: in cabinet, 50: Jimmy, 51: default, 50 + z
var clothesPerSide = 8;
var clothes = [
	{ id: "shirt1", type: 1, w: 232, h: 233, scale: 0.4, x: 182, y: 364 },
	{ id: "shirt2", type: 1, w: 232, h: 233, scale: 0.4, x: 182, y: 364 }, 
	{ id: "shirt3", type: 1, w: 232, h: 233, scale: 0.4, x: 182, y: 364,
		center: {x:rezX* 270, y:rezY* 106} }, 
	{ id: "shades1", type: 0, sunny:2, rainy:-2, w: 325, h: 213, scale: 0.25, scaleTo: 1.5,
		x: 171, y: 299 },
	{ id: "hat3", type: 1, sunny:1, w: 333, h: 333, scale: 0.25, 
		x: 162, y: 281 }, 
	{ id: "shades2", type: 0, sunny:1, w: 330, h: 218, scale: 0.2, scaleTo: 1.3,
		x: 175, y: 303 }, 
	{ id: "hat2", type: 1, sunny:1, w: 310, h: 278, scale: 0.18, scaleTo: 1.7,
		x: 172, y: 289, center: {x:rezX* 136, y:rezY* 167} }, 
	{ id: "hat1", type: 1, sunny:1, w: 224, h: 184, scale: 0.25, scaleTo: 1.8,
		x: 170, y: 289, z: 3, center: {x:rezX* 233, y:rezY* 165} }, 
	
	{ id: "scarf1", type: 2, z: 4, w: 333, h: 333, scale: 0.25, x: 177, y: 349 },
	{ id: "jacket2", type: 3, z: 3, w: 333, h: 333, scale: 0.4, scaleTo: 1.32, x: 185, y: 352 }, 
	{ id: "jacket1", type: 2, z: 2, w: 333, h: 333, scale: 0.3, scaleTo: 0.9, x: 180, y: 365 },
	{ id: "mittens1", type: 2, z: 4, w: 296, h: 234, scale: 0.25, scaleTo: 1.54,
		x: 192, y: 405, center: {x:rezX* 52, y:rezY* 206} },
	{ id: "mittens2", type: 2, z: 4, w: 292, h: 241, scale: 0.25, scaleTo: 1.5,
		x: 184, y: 396, center: {x:rezX* 136, y:rezY* 207} },
	{ id: "socks_blue", type: 1, z: 1, w: 333, h: 333, scale: 0.25, scaleTo: 1.1,
		x: 192, y: 453, center: {x:rezX* 218, y:rezY* 208} },
	{ id: "boots", type: 1, sunny:-1, rainy:1, z: 2, w: 295, h: 313, 
		x: 189, y: 437, scale: 0.25, scaleTo: 1.25 },
	   
	{ id: "umbrella", type: 0, sunny:-5, rainy:2, w: 333, h: 333, scale: 0.4,
	  	x: 233, y: 387, z: -40, center: {x:rezX* 308, y:rezY* 85} }
	];
	
var imgClothes = [];
var centerClothes = [ rezX* -37, rezY* 108 ];
var marginClothes = [ rezX* 83, rezY* 100 ];

// loads clothes data
{
	var col = 0, row = 0, rowClothes = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		// scoot the clothes over to fit cabinet
		var paddingLeft = (i < clothesPerSide) ? 58 : 0;
		var paddingTop = (i < clothesPerSide) ? 0 : -14;
		var myCenter = clothes[i].center ? clothes[i].center : 
					{x:centerClothes[0] + (marginClothes[0] * col) + paddingLeft,
				 	 y:centerClothes[1] + (marginClothes[1] * row) + paddingTop};
		// define the image object
		var img = Titanium.UI.createImageView({
			info:	{
						id: clothes[i].id,
						type: clothes[i].type ? clothes[i].type : 0,
						sunny: clothes[i].sunny ? clothes[i].sunny : 0,
						rainy: clothes[i].rainy ? clothes[i].rainy : 0,
						scale: clothes[i].scale ? clothes[i].scale : 1,
						scaleTo: clothes[i].scaleTo ? clothes[i].scaleTo : false,
						x: clothes[i].x ? clothes[i].x : false,
						y: clothes[i].y ? clothes[i].y : false,
						z: clothes[i].z ? clothes[i].z : false,
						center: myCenter,
						wearing: false
					},
			image:  'assets/clothes/' + clothes[i].id + '.png',
			height: rezY* clothes[i].h, width: rezX* clothes[i].w,
			center: myCenter
		});
		
		// update scale and position if specified
		if (img.info.scale) {
			img.height *= img.info.scale; 
			img.width  *= img.info.scale;
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
