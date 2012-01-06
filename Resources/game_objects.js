// create root window
var win1 = Titanium.UI.createWindow({  
    title:'Anziehspiel',
    backgroundColor:'#fff',
    backgroundImage:'iphone/Default.png'
});

// fade cabinet
var imgIntro = Titanium.UI.createImageView({
	image:'assets/kleiderschrank1-closed.jpg',
	opacity:1, zOrder:99, width:'100%', height:'auto'
});

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_striped_shirt_red.png',
	height:'180px',
	center:{x:50, y:350},
	zIndex:5
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
			jimmyID:clothes[i], zIndex:10
		});
		// last two
		if (i >= clothes.length - 2) { 
			img.height = '100px'; img.width = '90px'; 
		} else {
			img.height = '80px';  img.width = '60px';
		}
		// center the umbrella on top
		if (i >= clothes.length - 1) { 
			img.center = {x:210, 		  y:67};
		} else {
			img.center = {x:0 + 80 * col, y:120 + 100 * row};
		}
		// add to stack
		imgClothes.push(img);
	}
}