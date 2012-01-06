// create root window
var win1 = Titanium.UI.createWindow({  
    title:'Anziehspiel',
    backgroundColor:'#fff',
    backgroundImage:'assets/kleiderschrank1-open.jpg'
});

// fade cabinet
var imgIntro = Titanium.UI.createImageView({
	image:'assets/kleiderschrank1-closed.jpg',
	opacity:1, zOrder:99, width:'100%', height:'auto'
});

// test text label
var imgLogo = Titanium.UI.createImageView({
	image:'assets/logo.png',
	center:{x:-50, y:-250},
	opacity:1, zOrder:100
});

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_striped_shirt_red.png',
	height:'180px',
	center:{x:50, y:350}
});

// jimmy's mirror
var imgMirror = Titanium.UI.createImageView({
	image:'assets/jimmy_mirror.png',
	height:'120px', width:'60px',
	center:{x:240, y:330}
});

// some clothes
var clothes = ["striped_shirt_red", "striped_shirt_blue", "striped_shirt_yellow", "scarf1", "hat1"];
var imgClothes = [];

// loads clothes data
{
	var col = 0, row = 0;
	for (var i in clothes) {
		col++;
		if (col > 3) { col = 1; row++; }
		var img = Titanium.UI.createImageView({
			image:'assets/clothes/' + clothes[i] + '.png',
			height:'80px',
			width:'60px',
			center:{x:0 + 80 * col, y:120 + 100 * row},
			jimmyID:clothes[i]
		});
		imgClothes.push(img);
	}
}