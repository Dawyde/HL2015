/*
    Gestionnaire de Jauge
*/


function Jauge(application, div, options, datas){
    
    this.application = application;
    this.div = div;
    
    this.options = $.extend({
        image: application.res("jauge"),
        animation: Math.easeOutCubic
    }, options);
    
    this.value = 0;
    this.start_value = 0;
    this.end_value = 0;
    this.animation = false;
    
    //On crée la structure
    this.div_container = document.createElement("div");
    this.div_container.className = "jauge_container";
    this.mask_img = document.createElement("img");
    this.mask_img.src = this.options.image.src;
    this.mask_img.className = "image";
    this.div_value = document.createElement("div");
    this.div_value.className = "value";
    this.div_container.appendChild(this.mask_img);
    this.div_container.appendChild(this.div_value);
    this.div.appendChild(this.div_container);
    
}

Jauge.prototype = {
    setValue: function(value){
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
    },
    animate:function(){
        this.animation.pc+=2;
        
        //Avancement avec la formule
        var a = this.options.animation(this.animation.pc, 0, 1, 100);
        this.value = this.start_value + (this.end_value-this.start_value)*a;
        
        if(this.animation.pc >= 100){
            this.value = this.end_value;
             $(this.div_value).css("margin-top",(-this.value)+'%');
             this.animation = false;
        }
        else{
            $(this.div_value).css("margin-top",(-this.value)+'%');
            var self = this;
            this.animation.timeout = setTimeout(function(){self.animate();},20);
        } 
    }
};