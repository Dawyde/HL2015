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
	
	this.dataset = {
		1:{
			name:"MIEL",
			le_saviez_vous:"TEXTE",
			distribution:{
				annees:[2010,2011,2013],
				values:[
					[5,6,8,9],
					[1,2.6,3,4.1],
					[1,2,3,5]
				]
			},
			importation:{
				annees:[2010,2011],
				values:[80,30]
			},
			bio:{
				annees:[2010,2011],
				values:[80,30]
			}
			
		},
		2:{
			name:"POMME",
			le_saviez_vous:"TEXTE",
			distribution:{
				annees:[2010,2011,2013],
				values:[
					[5,6,8,9],
					[1,2,3,4],
					[1,2,3,5]
				]
			},
			importation:{
				annees:[2011,2012],
				values:[50,17]
			},
			bio:{
				annees:[2010,2011,2013],
				values:[80,30,30]
			}
		},
		0:{
			name:"Vin",
			le_saviez_vous:"TEXTE",
			distribution:{
				annees:[2010,2011,2013],
				values:[
					[5,6,8,9],
					[1,2,3,4],
					[1,2,3,5]
				]
			},
			importation:{
				annees:[2010,2011],
				values:[10,30]
			},
			bio:{
				annees:[2010,2011],
				values:[80,30]
			}
		}
	};
	
	this.selected = 1;
	
	this.fonts = [
		{selector:".visualisations .pc", pc:150},
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
	
	
	
	this.resources.load("r_arrow", "/images/r_arrow.svg");
	this.resources.load("l_arrow", "/images/l_arrow.svg");
	this.resources.load("jauge_france", "/images/jauge_france.svg");
	this.resources.load("jauge_bio", "/images/jauge_bio.svg");
	
	
	//Listeners
	var self = this;
	
	$(window).resize(function(){self.resize();});
	this.resize();
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
		this.fullpage = $('#fullpage').fullpage({
		 anchors: ['homepage','visualisations'],
			onSlideLeft: function(){ self.leftConveyor()},
			onSlideRight: function(){ self.rightConveyor()},
			afterLoad: function(anchorLink, index){
				self.slideChanged(index);
			},
			afterRender: function(){ self.slide1.conveyorbelt.resize(); },
			onLeave: function(index, nextIndex, direction){
				self.changeIcon(nextIndex)
				self.slideChanged(nextIndex);
			}
		});
		
		
		this.slide1.slider_distrib = new Slider(this, $("#slider1")[0], {onChange: function(id){ self.updateDistrib(id) }});
		this.slide1.slider_import = new Slider(this, $("#slider2")[0], {onChange: function(id){ self.updateImport(id)}});
		this.slide1.slider_bio = new Slider(this, $("#slider3")[0], {onChange: function(id){ self.updateBIO(id)}});
		this.slide1.distrib = [
			new Counter2(this, $("#pc_supermarche")[0], {suffix:"%"}),
			new Counter2(this, $("#pc_artisan")[0], {suffix:"%"}),
			new Counter2(this, $("#pc_magasin")[0], {suffix:"%"}),
			new Counter2(this, $("#pc_vente")[0], {suffix:"%"})
		]
		this.slide1.france = new Jauge(this, $("#jauge_france")[0], {image:this.res("jauge_france")});
		this.slide1.france_counter = new Counter2(this, $("#counter_france")[0], {suffix:"%"});
		
		this.slide1.bio = new Jauge(this, $("#jauge_bio")[0], {image:this.res("jauge_bio")});
		this.slide1.bio_counter = new Counter2(this, $("#counter_bio")[0], {suffix:"%"});
		
		
		
		this.slide1.conveyorbelt.onStartMovement = function(id){
			self.selected = id;
			self.updateDataSet();
		}
		
		/*
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
	changeSlide: function(id){
		$.fn.fullpage.moveTo(id);
	},
	changeIcon: function(id){
		$("#menu div").removeClass("active");
		$("#menu"+id).addClass("active");
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
		this.current_slide = id;
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
		if(this.current_slide != 1){
			this.slide1.conveyorbelt.changeTo(id);
			this.selected = this.slide1.conveyorbelt.getId(id);
			this.updateDataSet();
		}
		else this.slide1.conveyorbelt.moveTo(id);
	},
	
	
	updateDataSet: function(){
		var data = this.dataset[this.selected];
		
		console.log(this.selected);
		console.log(data)
		
		$("#title").fadeOut(500,function(){ $(this).html(data.name); $(this).fadeIn(data.name); });
		
		this.slide1.slider_distrib.setValues(data.distribution.annees);
		this.slide1.slider_distrib.setValue(data.distribution.annees.length-1);
		this.updateDistrib(data.distribution.annees.length-1);
		
		this.slide1.slider_import.setValues(data.importation.annees);
		this.slide1.slider_import.setValue(data.importation.annees.length-1);
		this.updateImport(data.importation.annees.length-1);
		
		this.slide1.slider_bio.setValues(data.bio.annees);
		this.slide1.slider_bio.setValue(data.bio.annees.length-1);
		this.updateBIO(data.bio.annees.length-1);
		
	},
	updateDistrib: function(id){
		var data = this.dataset[this.selected];
		for(var i=0;i<4;i++) this.slide1.distrib[i].setValue(data.distribution.values[id][i]);
	},
	updateImport: function(id){
		var data = this.dataset[this.selected];
		this.slide1.france.setValue(data.importation.values[id]);
		this.slide1.france_counter.setValue(data.importation.values[id]);
	},
	updateBIO: function(id){
		var data = this.dataset[this.selected];
		this.slide1.bio.setValue(data.bio.values[id]);
		this.slide1.bio_counter.setValue(data.bio.values[id]);
	}
	
	
};