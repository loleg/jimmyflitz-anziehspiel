// create root window
var win1 = Titanium.UI.createWindow({  
    title:'Anziehspiel',
    backgroundColor:'#fff',
    backgroundImage:'assets/bg/Landscape1.jpg'
});

// fade cabinet
var imgIntro = Titanium.UI.createImageView({
	image:'assets/bg/kleiderschrank1-closed.png',
	opacity:1, zOrder:99, width:'100%', height:'auto'
});

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_red.png',
	height:'200px',
	center:{x:40, y:360},
	zIndex:15
});

// jimmy's mirror
var imgMirror = Titanium.UI.createImageView({
	image:'assets/jimmy/mirror.png',
	height:'140px', width:'80px',
	center:{x:240, y:340}
});

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

// some clothes
var clothes = ["jimmy_red", "jimmy_blue", "jimmy_yellow", "scarf1", "hat1", "shoes1", "umbrella"];
var imgClothes = [];

// loads clothes data
{
	var col = 0, row = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		var img = Titanium.UI.createImageView({
			image:'assets/clothes/' + clothes[i] + '.png',
			height: 90, width: 90,
			center: {x:-20 + 90 * col, y:130 + 90 * row},
			jimmyID:clothes[i], zIndex:20
		});
		
		// center the umbrella on top
		if (i >= clothes.length - 1) { 
			img.center = {x:'auto', y:57};
			img.height = 140; img.width = 140;
			//img.zIndex = 21;
			
		// make the shoes bigger
		} else if (i == clothes.length - 2) { 
			img.height = 110; img.width = 110;
		}
		
		img.o_height = img.height;
		img.o_width = img.width;
		
		// add to stack
		imgClothes.push(img);
	}
}