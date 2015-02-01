/*
	Gestionnaire d'ImageScale
*/

function ImageScale(application, div, options){
	this.application = application;
	this.div = div;
	
	this.options = $.extend({
		images: [application.res("icon1"), application.res("icon1"),  application.res("icon1")],
		min:10,
		margin:5,
		
		animation:Math.easeOutCubic
		
	},options);
	
	this.main_div = document.createElement("div");
	this.div.appendChild(this.main_div);
	$(this.main_div).addClass("imagescale_bloc")
	
	this.animation = false;
	this.start_value = false;
	this.end_value = false;
	
	this.elements = [];
    var self = this;
	$(window).resize(function(){self.resize();});
	this.rebuild();
	this.resize();
}

ImageScale.prototype = {
	setValue: function(value){
		if(!$.isArray(value) || value.length != this.value.length) return;
		//On enregistre la valeur de départ
		this.start_value = this.value.slice();
		this.end_value = value.slice();
		this.startAnimation();
	},
	resize: function(){
		$(this.main_div).css("height", $(this.div).height());
	},
	startAnimation:function(){
		if(this.animation != false && this.animation.timeout){
			clearTimeout(this.animation.timeout);
		}
		this.animation = {pc:0};
		this.animate();
	},
	animate:function(){
		this.animation.pc+=2;
		
		if(this.animation.pc >= 100){
            this.value = this.end_value.slice();
            this.update();
            this.animation = false;
		}
		else{
	        var a = this.options.animation(this.animation.pc, 0, 1, 100);
	        this.value = []
	        for(var i=0;i<this.start_value.length;i++){
	        	this.value[i] = this.start_value[i] + (this.end_value[i]-this.start_value[i])*a;
	        }
			this.update();
			var self = this;
			this.animation.timeout = setTimeout(function(){self.animate();},20);
		}
	},
	rebuild: function(){
		//On supprime tous les éléments
		while(this.main_div.firstChild){
			this.main_div.removeChild(this.main_div.firstChild);
		}
		//On crée nos éléments
		this.elements = [];
		this.value = [];
		var i;
		for(i=0;i<this.options.images.length;i++){
			var element = document.createElement("img");
			element.src = this.options.images[i].src;
			$(element).css('margin-left',(this.options.margin/2)+"%");
			$(element).css('margin-right',(this.options.margin/2)+"%");
			this.main_div.appendChild(element);
			this.elements[i] = element;
			this.value[i] = 100/this.options.images.length;
		}
		this.update();
	},
	update: function(){
		var sum = 0;
		for(var i=0;i<this.value.length;i++) sum += this.value[i];
		var usable = 98-(this.value.length * (this.options.min + this.options.margin));
		for(var i=0;i<this.value.length;i++){
			var pc = this.options.min + this.value[i]/sum*usable;
			$(this.elements[i]).css("width",pc+"%");
		}
		
	}
	
};