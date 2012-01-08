// create root window
var win1 = Titanium.UI.createWindow({  
    title:'Anziehspiel',
    backgroundColor:'#fff',
    backgroundImage:'assets/backgrounds/Landscape1.jpg'
});

// fade cabinet
var imgIntro = Titanium.UI.createImageView({
	image:'assets/kleiderschrank1-closed.png',
	opacity:1, zOrder:99, width:'100%', height:'auto'
});

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_striped_shirt_red.png',
	height:'180px',
	center:{x:50, y:350},
	zIndex:15
});

// jimmy's mirror
var imgMirror = Titanium.UI.createImageView({
	image:'assets/jimmy_mirror.png',
	height:'120px', width:'60px',
	center:{x:240, y:330}
});

// some clothes
var clothes = ["striped_shirt_red", "striped_shirt_blue", "striped_shirt_yellow", "scarf1", "hat1", "shoes1", "umbrella"];
var imgClothes = [];

// loads clothes data
{
	var col = 0, row = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		var img = Titanium.UI.createImageView({
			image:'assets/clothes/' + clothes[i] + '.png',
			height:'80px', width:'60px',
			center: {x:0 + 80 * col, y:120 + 100 * row},
			jimmyID:clothes[i], zIndex:20
		});
		
		// center the umbrella on top
		if (i >= clothes.length - 1) { 
			img.center = {x:'auto', y:63};
			img.height = '140px'; img.width = '140px';
			//img.zIndex = 21;
		// make the shoes bigger
		} else if (i == clothes.length - 2) { 
			img.height = '100px'; img.width = '90px';
		}
		
		// add to stack
		imgClothes.push(img);
	}
}