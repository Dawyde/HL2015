/*
    Gestionnaire de Chart1
*/


function Chart1(application, div, options){
    
    this.application = application;
    this.div = div;
    
    //Options
    this.options = $.extend({
        type: 'jauge',
        //Events
        onChange:null
        
    }, options);
    
    
    //On crée les éléments
    this.div_slider = document.createElement("div");
    this.div_chart = document.createElement("div");
    this.div.appendChild(this.div_chart);
    this.div.appendChild(this.div_slider);
    
    
    this.slider = new Slider(this.application, this.div_slider);
    if(this.options.type == 'jauge') this.chart = new Jauge(this.application, this.div_chart);
    else this.chart = new ImageScale(this.application, this.div_chart);
}

Chart1.prototype = {
    
}