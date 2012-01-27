// DETERMINE LOCATION CENTERING
function centerFinder(obj) {
	obj.addEventListener('touchstart', function(e) {
		this.offset_x = e.x; this.offset_y = e.y;
		if (typeof this.origin == 'undefined') {
			this.origin = this.center;
		}
		this.zIndex = 50;
	});
	obj.addEventListener('touchmove', function(e) {
		this.center = {
				x:this.center.x + (e.x - this.offset_x), 
				y:this.center.y + (e.y - this.offset_y)
		};
		Ti.API.debug('Center: ' + this.center.x + ', ' + this.center.y ); 
	});
}