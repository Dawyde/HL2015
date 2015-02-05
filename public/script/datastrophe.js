/**
	Module principale de gestion de la DataVisualisation pour ThePlaceToBio

*/

function DataStrophe(div){
	
	this.options = {
		arrowBg:"#D8C5B2",
		arrowBgHover:"#101010"
	};
	
	this.slide1 = {};
	this.current_slide = 1;
	
	this.fonts = [
		{selector:".visualisations .pc", pc:180},
		{selector:".vente_bio_non_bio .pc", pc:300}
	];
	
	//Div principal de la visualisation
	this.main_div = div;
	var self = this;
	//Ressources
	this.resources = new ResourceLoader();
	this.resources.onLoad = function(){ 
		self.init();
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
	this.resources.load("bio_masque","/style/bio_masque.png");
	this.resources.load("eddy","/style/malou.png");
	this.resources.load("wheel","/style/wheel.png",{width:49,height:49});
	this.resources.load("jaugebio","/style/bio_vide.png");
	this.resources.load("jaugefrance","/style/france_vide.png");
	
	
	
	this.resources.load("r_arrow", "/images/r_arrow.svg");
	this.resources.load("l_arrow", "/images/l_arrow.svg");
	this.resources.load("jauge_france", "/images/jauge_france.svg");
	
	
	//Listeners
	var self = this;
	
	$(window).resize(function(){self.resize();});
	
}

DataStrophe.prototype = {
	init: function(){
		//Initialisation des différents éléments de chaque slide
		var self = this;
		
		//Flèches tapis
		this.slide1.r_arrow_svg = Snap("#r_arrow");
		Snap.load(this.res("r_arrow").src, function(f){
			self.slide1.r_arrow_svg.append(f);
		});
		$("#r_arrow").hover(function(){
			self.slide1.r_arrow_svg.select("path").animate({fill:self.options.arrowBgHover},200);
		}, function(){
			self.slide1.r_arrow_svg.select("path").animate({fill:self.options.arrowBg},200);
		});
		$("#r_arrow").click(function(){ self.rightConveyor()});
		this.slide1.l_arrow_svg = Snap("#l_arrow");
		Snap.load(this.res("l_arrow").src, function(f){
			self.slide1.l_arrow_svg.append(f);
		});
		$("#l_arrow").hover(function(){
			self.slide1.l_arrow_svg.select("path").animate({fill:self.options.arrowBgHover},200);
		}, function(){
			self.slide1.l_arrow_svg.select("path").animate({fill:self.options.arrowBg},200);
		})
		$("#l_arrow").click(function(){ self.leftConveyor()});
		
		
		//On lance le tapis
		this.slide1.conveyorbelt = new ConveyorBelt(this, $("#coveyorbelt")[0]);
		
		//On lance fullpage
		$('#fullpage').fullpage({
		 anchors: ['homepage','visualisations'],
			onSlideLeft: function(){ self.leftConveyor()},
			onSlideRight: function(){ self.rightConveyor()},
			afterLoad: function(anchorLink, index){ self.slideChanged(index) },
			afterRender: function(){ self.slide1.conveyorbelt.resize(); }
		});
		
		
		new Slider(this, $("#slider1")[0]);
		new Slider(this, $("#slider2")[0]);
		new Slider(this, $("#slider3")[0]);
		
		this.france = new MJauge(this, "#jauge_france", {image:this.res("jauge_france")});
	/*	c.onStartMovement = function(id){
			console.log("Mouvement vers : "+id);
		}
		c.onStopMovement = function(id){
			console.log("Stop vers : "+id);
		}*/
		
		this.resize();
		$.fn.fullpage.reBuild();
	
	},
	resize: function(){
		var i;
		for(i in this.fonts){
			var font = this.fonts[i];
			if(font) $(font.selector).css("font-size", Math.round(font.pc*this.width()/1080)+"%");
		}
	},
	width: function(){
		return $(window).width();
	},
	height: function(){
		return $(window).height();
	},
	res: function(res_id){
		return this.resources.get(res_id);
	},
	slideChanged: function(id){
		console.log("Slide "+id)	
	},
	leftConveyor: function(){
		if(this.current_slide==1) this.slide1.conveyorbelt.moveLeft();
		console.log("LEFT")
	},
	rightConveyor: function(){
		if(this.current_slide==1) this.slide1.conveyorbelt.moveRight();
		console.log("RIGHT")
	},
	changeProduct: function(id){
		if(!this.current_slide == 1) this.slide1.conveyorbelt.changeTo(id);
		else this.slide1.conveyorbelt.moveTo(id);
	}
	
};


function MJauge(t, id, options){
	this.application = t;
	this.id = id;
	this.options = $.extend({
		image: null,
		min:0,
		max:1
	}, options);
	
	this.value = 50;
	
	this.svg = Snap(id);
	
	
	var self = this;
	Snap.load(this.options.image.src, function(f){
		self.rect = this.svg.rect(0,0,self.options.image.width,self.options.image.height);
		self.carte = self.svg.append(f.select("g"));
		self.resize();
	});
	
}

MJauge.prototype = {
	resize: function(){
		this.r = Math.min(this.application.width()/1920*2, this.application.height()/1080*2);
		console.log("=>"+this.r);
		$(this.id).css('width',(this.options.image.width*this.r)+'px');
		$(this.id).css('height',(this.options.image.height*this.r)+'px');
		
		this.update();
	},
	update: function(){
		this.carte.select("g").attr({transform:"scale("+this.r+")"});
		var height = (this.value/100);
		this.rect.animate({
			width:this.image.width*this.r,
			height:this.image.height*this.r
		});
		
	}
}