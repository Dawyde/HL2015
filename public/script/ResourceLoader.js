/**

*/

function ResourceLoader(){
	this.objects = {};
	this.total = 0;
	this.loaded = 0;
}

ResourceLoader.prototype = {
	load: function(name, url){
		this.total++;
		var img = new Image();
		var self = this;
		img.onload = function(){
			self.loaded++;
			if(self.loaded >= self.total && self.onLoad){
				self.onLoad.call(self);
			}
		}
		img.src = url;
		this.objects[name] = img;	
	},
	get: function(name){
		return this.objects[name];
	}
};