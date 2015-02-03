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
	this.resources.load("bouteille1","/style/bouteille1.png",{width:36,height:130});
	this.resources.load("bouteille2","/style/bouteille2.png",{width:36,height:130});
	this.resources.load("bouteille3","/style/bouteille3.png",{width:36,height:130});
	this.resources.load("sceptre","/style/sceptre.png",{width:41,height:135});
	this.resources.load("miel","/style/miel.png",{width:107,height:108});
	this.resources.load("pomme1","/style/pomme1.png",{width:107,height:100});
	this.resources.load("pomme2","/style/pomme2.png",{width:95,height:100});
	this.resources.load("pomme3","/style/pomme3.png",{width:81,height:100});
	this.resources.load("bio_mask","/style/bio_mask.png");
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