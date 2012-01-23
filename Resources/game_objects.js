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

var landscapes = ['spring', 'summer', 'autumn', 'winter'];
var fairWeather = true;
var theLandscape = 0;

// score
var labelResult = Titanium.UI.createLabel({
	backgroundColor: "#fff", color: "#000",
	font: {fontSize: "72px"},
	width: "auto", height: "auto",
	shadowColor: "#ddd", shadowOffset: {x:2, y:2},
	center: {y: rezY* 180}
})

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
	opacity:1, top:0, height:'100%', zIndex:1
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
	image:'assets/jimmy/jimmy_red.png',
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
var clothes = ["jimmy_red", "jimmy_blue", "jimmy_yellow", "jimmy_jacket", "hat1", "socks_blue", "umbrella"];
var imgClothes = [];
var centerClothes = [ rezX* -37, rezY* 103 ];
var marginClothes = [ rezX* 85, rezY* 85 ];

// loads clothes data
{
	var col = 0, row = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		var img = Titanium.UI.createImageView({
			image:'assets/clothes/' + clothes[i] + '.png',
			height: rezY* 90, width: rezX* 90,
			center: {x:centerClothes[0] + marginClothes[0] * col,
				 	 y:centerClothes[1] + marginClothes[1] * row},
			jimmyID:clothes[i], zIndex:20
		});
		
		// center the umbrella on top
		switch (clothes[i]) {
		case "umbrella": 
			img.center = {x:'auto', y:rezY* 47};
			img.height = rezY* 140; img.width = rezX* 140;
			//img.zIndex = 21;
			break;
				
		// make the jacket bigger
		case "jimmy_jacket": 
			img.height = rezY* 110; img.width = rezX* 110;
			break;
		}
		
		img.o_height = img.height;
		img.o_width = img.width;
		img.wearing = false;
		
		// add to stack
		imgClothes.push(img);
	}
}