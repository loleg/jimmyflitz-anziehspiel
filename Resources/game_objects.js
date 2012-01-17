// create root windows
var windows = [
	Titanium.UI.createWindow({  
	    title:'Welcome',
	    backgroundImage:'assets/bg/Landscape1.jpg',	    
	}),
	Titanium.UI.createWindow({  
	    title:'Game',
	    backgroundImage:'assets/bg/kleiderschrank1-open.jpg'
	}),
	Titanium.UI.createWindow({  
	    title:'Jury',
	    backgroundImage:'assets/bg/Landscape1.jpg'
	})
];
for (var u in windows) { windows[u].isPainted = false; }

// score
var labelResult = Titanium.UI.createLabel({
	backgroundColor: "#fff", color: "#000",
	font: {fontSize: "66px"},
	width: "auto", height: "auto",
	shadowColor: "#ccc", shadowOffset: {x:2, y:2},
	center: {y: 200}
})

// end game music
var soundClips = Titanium.Media.createSound({
	url: "sound/21-DAJANA-MASTERMIX_02.mp3" });

// welcome images
var imgIntro = Titanium.UI.createImageView({
	image:'assets/bg/jimmy-jump-intro.jpg',
	opacity:1, width:'100%', height:'auto', zIndex:10
});
var imgWindow = Titanium.UI.createImageView({
	image:'assets/bg/cabane.gif',
	opacity:1, width:'auto', height:'100%', zIndex:1
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
	height:'200px',
	center:{x:40, y:360},
	zIndex:15
});

// jimmy (intro) and friends
var imgFriends = [
	Titanium.UI.createImageView({
		image:'assets/jimmy/dancing.png',
		height:'200px', width:'200px', 
		center:{x:135, y:356}, zIndex:2
	}),
	Titanium.UI.createImageView({
		image:'assets/friends/fernanda.png',
		height:'150px', width:'150px',
		center:{x:255, y:178}, zIndex:3
	}),
	Titanium.UI.createImageView({
		image:'assets/friends/wulwul.png',
		height:'270px', width:'220px',
		center:{x:260, y:330}, zIndex:4
	}),
	Titanium.UI.createImageView({
		image:'assets/friends/culan.png',
		height:'200px', width:'200px',
		center:{x:28, y:414}, zIndex:5
	})
]

// jimmy's mirror
// var imgMirror = Titanium.UI.createImageView({
	// image:'assets/jimmy/mirror.png',
	// height:'140px', width:'80px',
	// center:{x:240, y:340}
// });

// door icons
var imgDoorClose = Titanium.UI.createImageView({
	image:'assets/ui/button_close.png',
	height:'90px', width:'90px',
	center:{x:25, y:400}, zIndex:99
});
var imgDoorExit = Titanium.UI.createImageView({
	image:'assets/ui/button_door.png',
	height:'90px', width:'90px',
	center:{x:300, y:400}, zIndex:99
});
var imgDoorEnter = Titanium.UI.createImageView({
	image:'assets/ui/button_door.png',
	height:'90px', width:'90px',
	center:{x:25, y:400}, zIndex:99
});

// some clothes
var clothes = ["jimmy_red", "jimmy_blue", "jimmy_yellow", "jimmy_jacket", "hat1", "socks_blue", "umbrella"];
var imgClothes = [];
var centerClothes = [ -37, 103 ];
var marginClothes = [ 85, 85 ];

// loads clothes data
{
	var col = 0, row = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		var img = Titanium.UI.createImageView({
			image:'assets/clothes/' + clothes[i] + '.png',
			height: 90, width: 90,
			center: {x:centerClothes[0] + marginClothes[0] * col,
				 	 y:centerClothes[1] + marginClothes[1] * row},
			jimmyID:clothes[i], zIndex:20
		});
		
		// center the umbrella on top
		switch (clothes[i]) {
		case "umbrella": 
			img.center = {x:'auto', y:47};
			img.height = 140; img.width = 140;
			//img.zIndex = 21;
			break;
				
		// make the jacket bigger
		case "jimmy_jacket": 
			img.height = 110; img.width = 110;
			break;
		}
		
		img.o_height = img.height;
		img.o_width = img.width;
		img.wearing = false;
		
		// add to stack
		imgClothes.push(img);
	}
}