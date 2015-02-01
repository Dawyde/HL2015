/**
	Module principale de gestion de la DataVisualisation pour ThePlaceToBio

*/

function DataStrophe(div){
	this.slides = [];
	//Div principal de la visualisation
	this.main_div = div;
	var self = this;
	//Ressources
	this.resources = new ResourceLoader();
	this.resources.onLoad = function(){ 
		if(self.onLoad) self.onLoad.call();
	};
	
	this.resources.load("test","/style/tapis.png",{width:300,height:150});
	this.resources.load("icon1","/style/sac.png");
	this.resources.load("icon2","/style/soda.png");
	this.resources.load("icon3","/style/pomme.png");
	this.resources.load("icon4","/style/pomme.png");
	//this.resources.load("icon4","/style/wine47.svg");
	this.resources.load("eddy","/style/malou.png");
	this.resources.load("jauge","/style/masque_jauge.png");
	this.resources.load("wheel","/style/wheel.png",{width:49,height:49});
	
	
	
	
	//Listeners
	var self = this;
	
}

DataStrophe.prototype = {
	width: function(){
		return $(window).width();
	},
	height: function(){
		return $(window).height();
	},
	res: function(res_id){
		return this.resources.get(res_id);
	}
	
};