// create positioning helper
var rezX = Ti.Platform.displayCaps.getPlatformWidth()  / 320;
var rezY = Ti.Platform.displayCaps.getPlatformHeight() / 480;

// create root windows
var windows = [
	Titanium.UI.createWindow({  
	    title:'Welcome'	    
	}),
	Titanium.UI.createWindow({  
	    title:'Game',
	    backgroundImage:'assets/bg/kleiderschrank1-open.jpg'
	}),
	Titanium.UI.createWindow({  
	    title:'Jury'
	})
];
for (var u in windows) { windows[u].isPainted = false; }

// seasons and weather fx
var landscapes = ['spring', 'summer', 'autumn', 'winter'];
var theLandscape = 0;
var fairWeather = false;
var imgWeather = Titanium.UI.createImageView({
	image:'assets/ui/rain.png', 
//	width:Ti.Platform.displayCaps.getPlatformWidth(), 
	height: '100%', width: '100%', 
	zIndex: 0, touchEnabled:false
});

// score
var labelResult = Titanium.UI.createLabel({
	backgroundColor: "#fff", color: "#000",
	font: {fontSize: "72px"},
	width: "auto", height: "auto",
	shadowColor: "#ddd", shadowOffset: {x:2, y:2},
	center: {y: rezY* 180}
});
var buttonRestart = Titanium.UI.createButton({
	title: 'Start', zIndex: 55,
	size: {width: 80, height: 20},
	center: {x: rezX * 30, y: rezY* 340}
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
var imgButtonWindow = Titanium.UI.createImageView({
	image:'assets/ui/window.png',
	opacity:1, zIndex:11
});
var imgDoor = Titanium.UI.createImageView({
	image:'assets/ui/cabane_door.png',
	opacity:1, top:0, height:Ti.Platform.displayCaps.getPlatformHeight(), zIndex:2
});

// sliding animation
var imgCabLeft = Titanium.UI.createImageView({
	image:'assets/bg/kleiderschrank1-closed-LEFT.jpg',
	left:-Ti.Platform.displayCaps.getPlatformWidth()/2, 
	height:'100%', zIndex:55
});
var imgCabRight = Titanium.UI.createImageView({
	image:'assets/bg/kleiderschrank1-closed-RIGHT.jpg',
	left:'50%',	height:'100%', zIndex:55
});

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_white.png',
	height:rezY* 200,
	center:{y:rezY* 360},
	zIndex:15
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

// jimmy's mirror
// var imgMirror = Titanium.UI.createImageView({
	// image:'assets/jimmy/mirror.png',
	// height:'140px', width:'80px',
	// center:{x:240, y:340}
// });

// door icons
var imgDoorClose = Titanium.UI.createImageView({
	image:'assets/ui/button_close.png',
	height:rezY* 90, width:rezX* 90,
	center:{x:rezX* 25, y:rezY* 400}, zIndex:99
});
var imgDoorExit = Titanium.UI.createImageView({
	image:'assets/ui/button_door.png',
	height:rezY* 90, width:rezX* 90,
	center:{x:rezX* 300, y:rezY* 400}, zIndex:99
});
var imgDoorEnter = Titanium.UI.createImageView({
	image:'assets/ui/button_door.png',
	height:rezY* 90, width:rezX* 90,
	center:{x:rezX* 25, y:rezY* 400}, zIndex:99
});

// some clothes 
// type = score quotient - 0 (default): spring/summer, 1: winter, 2: weather
// scale = size scaling - 1.0 is default
// center = new position (x, y) - null is default
var clothes = [
	{ id: "jimmy_red" },
	{ id: "jimmy_blue" }, 
	// { id: "jimmy_yellow" }, 
	{ id: "jimmy_jacket", type: 1, scale: 1.2 },
	{ id: "jimmy_parka", type: 2, scale: 1.2 }, 
	{ id: "hat1", type: 2 }, 
	{ id: "scarf1", type: 2 },
	{ id: "socks_blue" },
	{ id: "boots", type: 2 },   
	{ id: "umbrella", type: 1, scale: 1.5, center: {x:'auto', y:rezY* 47} }
	];
var imgClothes = [];
var centerClothes = [ rezX* -37, rezY* 103 ];
var marginClothes = [ rezX* 85, rezY* 85 ];

// loads clothes data
{
	var col = 0, row = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		
		// define the image object
		var img = Titanium.UI.createImageView({
			info:		clothes[i],
			image:  	'assets/clothes/' + clothes[i].id + '.png',
			height: 	rezY* 90, width: rezX* 90, zIndex: 20,
			center: 	{x:centerClothes[0] + marginClothes[0] * col,
				 	 	 y:centerClothes[1] + marginClothes[1] * row}
		});
		
		// update scale and position if specified
		if (typeof clothes[i].scale != 'undefined') {
			img.height *= clothes[i].scale; 
			img.width  *= clothes[i].scale;
		}
		if (typeof clothes[i].center != 'undefined') {
			img.center = clothes[i].center;
		}
		
		img.o_height = img.height;
		img.o_width = img.width;
		img.wearing = false;
		
		// add to stack
		imgClothes.push(img);
	}
}