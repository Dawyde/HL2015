/*
    Gestionnaire de Jauge
*/


function Jauge(application, div, options){
    
    this.application = application;
    this.div = div;
    
    this.options = $.extend({
        counter: null,
        animation: Math.easeOutCubic,
		image: null,
		min:0.02,
		max:0.981
	}, options);
	
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.div.appendChild(this.canvas);
	this.resize();
    
    this.value = 0;
    this.start_value = 0;
    this.end_value = 0;
    this.animation = false;
    
    //On crée la structure
    if(this.options.counter){
        this.div_counter = this.options.counter;
    }
    this.resize();
	
	var self = this;
	$(window).resize(function(){self.resize()});
}

Jauge.prototype = {
    setValue: function(value){
        if(value > 100) value = 100;
        if(value < 0) value = 0;
        this.start_value = this.value;
        this.end_value = value;
        this.startAnimation();
    },
    startAnimation: function(){
        if(this.animation != false && this.animation.timeout){
            clearTimeout(this.animation.timeout);
        }
        this.animation = {pc:0};
       this.animate();
        $(this.div_value).css({'margin-top': (-this.end_value)+"px"});
    },
    animate:function(){
        this.animation.pc++;
        
        //Avancement avec la formule
        var a = this.options.animation(this.animation.pc, 0, 1, 100);
        this.value = this.start_value + (this.end_value-this.start_value)*a;
        
        if(this.animation.pc >= 100){
            this.value = this.end_value;
			this.update();
              if(this.options.counter) $(this.div_counter).html(Math.round(this.value)+"%");
             this.animation = false;
        }
        else{
              if(this.options.counter) $(this.div_counter).html(Math.round(this.value)+"%");
            var self = this;
			this.update();
            this.animation.timeout = setTimeout(function(){self.animate();},20);
        } 
    },
	resize: function(){
		var taille =  Math.min($(this.div).width(),this.application.height()*0.4);
		console.log(taille);
		
		if(taille > 400) taille = 400;
		this.margin = ($(this.div).width()-taille)/2;
		this.taille = taille;
		this.height = this.options.image.height/this.options.image.width*taille;
		this.canvas.width = $(this.div).width();
		this.canvas.height = this.height;
		this.update();
	},
	update: function(){
		this.ctx.clearRect(this.margin,0,this.taille, this.canvas.height);
		this.ctx.fillStyle="green";
		this.ctx.fillRect(this.margin+5,this.height*(this.options.min + (this.options.max-this.options.min)*(1 - (this.value/100))), this.taille-10, this.height*(this.options.min + (this.options.max-this.options.min)*(this.value/100)));
		this.ctx.drawImage(this.options.image, this.margin, 0, this.taille, this.height);
	}
};