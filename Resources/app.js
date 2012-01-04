// background color of the master UIView
Titanium.UI.setBackgroundColor('#cdf');

// create root window
var win1 = Titanium.UI.createWindow({  
    title:'Anziehspiel',
    backgroundColor:'#fff',
    backgroundImage:'assets/kleiderschrank1-closed.jpg'
});

// test text label
var label1 = Titanium.UI.createLabel({
	color:'#f99',
	text:'Jimmy Flitz Anziehspiel!',
	font:{fontSize:30,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});
win1.add(label1);

// event handler
win1.addEventListener('click',function(e)
{
	win1.backgroundImage = 'assets/kleiderschrank1-open.jpg';
});

// open root window
win1.open();

