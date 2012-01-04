// background color of the master UIView
Titanium.UI.setBackgroundColor('#cdf');

// create root window
var win1 = Titanium.UI.createWindow({  
    title:'Anziehspiel',
    backgroundColor:'#fff',
    backgroundImage:'assets/kleiderschrank1-closed.jpg'
});

// test text label
var imgLogo = Titanium.UI.createImageView({
	image:'assets/logo.png',
	center:{x:-50, y:-250}
});
win1.add(imgLogo);

// jimmy
var imgJimmy = Titanium.UI.createImageView({
	image:'assets/jimmy/jimmy_red.png',
	height:'180px',
	center:{x:50, y:300}
});

// some clothes
var clothes = ["red", "blue", "yellow"];
var imgClothes = [];

for (var i in clothes) {
	var img = Titanium.UI.createImageView({
		image:'assets/clothes/striped_shirt_' + clothes[i] + '.png',
		height:'80px',
		width:'60px',
		center:{x:80 + 80 * i, y:120},
		jimmyID:clothes[i]
	});
	imgClothes.push(img);
}

// event handler
win1.addEventListener('click',function(e)
{
	win1.backgroundImage = 'assets/kleiderschrank1-open.jpg';
	imgLogo.hide();
	
	win1.add(imgJimmy);
	for (var i in imgClothes) {
		win1.add(imgClothes[i]);
		imgClothes[i].addEventListener('click',function(e) {
			imgJimmy.image = 'assets/jimmy/jimmy_' + this.jimmyID + '.png';
		});
	}
});

// open root window
win1.open();

