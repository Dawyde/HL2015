/**
	Gestion du tapis roulant
	
	On utilise un canvas
	/!\ bien notifier des redimensionnements /!\
*/

function BeltItem(res, options){
	this.res = res;
	this.x = 0;
	//Points de rotation
	this.rotation = 0;
	this.pr1 = (options && options.pr1)?options.pr1:{x:10,y:120};
	this.pr2 = (options && options.pr2)?options.pr2:{x:58,y:120};
	this.att = (options && options.att)?options.att:1;
	this.width = (options && options.width)?options.width:this.res.width;
	this.height = (options && options.height)?options.height:this.res.height;
	/*this.pr1 = {x:34,y:120};
	this.pr2 = {x:34,y:120};*/
	this.movement = 0;
	this.pc =0;
}

BeltItem.prototype = {
	ressource:function(){
		return this.res;
	},
	draw: function(ctx, x,y, scale){
		if(this.rotation != 0){
			ctx.save();
			ctx.translate(x+((this.rotation<0?this.pr1.x:this.pr2.x)-this.width/2)*scale,y+((this.rotation<0?this.pr1.y:this.pr2.y)-this.height)*scale);
			ctx.rotate(this.rotation/180*Math.PI);
			ctx.drawImage(this.res, -(this.rotation<0?this.pr1.x:this.pr2.x)*scale, -(this.rotation<0?this.pr1.y:this.pr2.y)*scale,this.width*scale,this.height*scale);
			ctx.restore();
		}
		else ctx.drawImage(this.res, x-(this.width/2*scale),y-this.height*scale,this.width*scale,this.height*scale);
	},
	setMovement:function(type){
		this.pc = 0;
		this.type = type;
	},
	inMovement: function(){
		return this.type != 0;
	},
	update: function(){
		if(this.type == 0) return;
		this.pc+=2;
		if(this.pc >= 100){
			this.pc = 0;
			this.type = 0;
			this.rotation=0;
		}
		if(this.type == 1){
			var c = Math.easeOutQuad(this.pc, 0, 6, 100);
			this.rotation = Math.sin(c*2)*(6-c)*this.att;
			//console.log(this.rotation);
		}
		else if(this.type == -1){
			var c = Math.easeOutCubic(this.pc, 0, 6, 100);
			this.rotation = -Math.sin(c*2)*(6-c)*this.att;
			//console.log(this.rotation);
		}
	}
};

function ConveyorBelt(application, div){
	//On place le div principal
	this.div = div;
	this.application = application;
	
	//On crée le canvas
	this.canvas = document.createElement("canvas");
	this.div.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");
	
	//On met en place les valeurs de fonctionnement
	this.selected_item = 0;//Item sélectionné
	this.movement = false;//Aucun mouvement actuellement
	this.items = [new BeltItem(this.application.res("icon1"),{pr1:{x:3,y:119},pr2:{x:90,y:120}, att:0.5}),
	new BeltItem(this.application.res("icon2"),{pr1:{x:3,y:120},pr2:{x:37,y:120}, att:0.8}),
	new BeltItem(this.application.res("icon3"),{pr1:{x:45,y:120},pr2:{x:55,y:120}}),
	new BeltItem(this.application.res("eddy"),{pr1:{x:35,y:100},pr2:{x:40,y:100},width:75,height:100, att:3}),
	new BeltItem(this.application.res("icon4"),{pr1:{x:3,y:120},pr2:{x:46,y:120},width:48,height:120})];
	this.positions = [-0.3,0.1,0.5,0.9,1.3];
	this.moving = false;
	this.target = null;
	
	this.width = 0;
	this.height = 0;
	this.dx = 0;
	this.scale = 1.5;
	//Listeners
	var self = this;
	$(window).resize(function(){self.resize();});
	
	
	this.back = this.application.res("test");
	this.resize();
}

ConveyorBelt.prototype = {
	animation: function(){
		var moving = false;
		if(this.movement != false){
			this.movement.pc+=2;
			if(this.movement.pc == 100){
				//On garde le dx du tapis
				this.dx = -this.back.width + (this.movement.pc*this.width/100*0.4*this.movement.direction + this.dx)%this.back.width;
				this.selected_item = (this.selected_item-this.movement.direction)%this.items.length;
				if(this.selected_item < 0) this.selected_item += this.items.length;
				
				//On vérifie si on a bien fini le mouvement ou s'il faut continuer
				if(this.target == null || this.selected_item == this.target){
					//On met un petit mouvment
					for(var i=0;i<5;i++)this.getItem(this.selected_item-2+i).setMovement(this.movement.direction);
					this.movement = false;
					this.target = null;
					if(this.onStopMovement) this.onStopMovement.call(this, this.selected_item);
				}
				else{
					this.movement.pc = 0;
				}
			}
			moving = true;
		}
		for(var i=0;i<5;i++){
			this.getItem(this.selected_item-2+i).update();
			if(this.getItem(this.selected_item-2+i).inMovement()) moving = true;
		}
		
		if(moving){
			var self = this;
			setTimeout(function(){ self.animation(); },20);
		}
		else this.moving = false;
		this.draw();
	},
	resize: function(){
		this.width = this.application.width();
		this.height = Math.floor(this.application.height()/3);
		if(this.height > 300) this.height = 300;
		this.scale = this.height/250
		this.canvas.width = this.width;
		this.dx = 0;
		this.canvas.height = this.height;
		this.draw();
	},
	getItem: function(index){
		if(this.items.length == 0) return null;
		while(index < 0){
			index += this.items.length;
		}
		return this.items[index%this.items.length];
	},
	moveLeft: function(){
		this.move(1);
	},
	moveRight: function(){
		this.move(-1);
	},
	move: function(d){
		if(this.movement != false) return;
		this.movement = {direction:d, pc: 0};
		for(var i=0;i<5;i++)this.getItem(this.selected_item-2+i).setMovement(-d);
		if(!this.moving){
			this.moving = true;
			this.animation();
		}
		//On lance l'événement ?
		if(this.onStartMovement) this.onStartMovement.call(this, this.target==null?((this.selected_item-d)<0?(this.selected_item+this.items.length-d):((this.selected_item-d)%this.items.length)):this.target);
	},
	moveTo: function(id){
		if(id < 0 || id >= this.items.length || this.selected_item == id) return;
		var d1 = id-this.selected_item;
		var d2 = this.selected_item-id;
		if(d1 < 0) d1 += this.items.length;
		if(d2 < 0) d2 += this.items.length;
		this.target = id;
		if(d1 > d2) this.move(1);
		else this.move(-1);
	},
	draw: function(){
		var dx = 0;
		if(this.movement != false){
			dx = this.movement.pc*this.width/100*0.4*this.movement.direction;
			//dx = Math.easeInQuad(this.movement.pc, 0, 0.4*this.width, 100)*this.movement.direction;
		}
		this.ctx.clearRect(0,0,this.width, this.canvas.height);
		var cx = -this.back.width+(dx%this.back.width) + this.dx;
		while(cx < this.width){
			this.ctx.drawImage(this.application.res("test"), cx,this.height-this.back.height);
			cx += this.back.width;
		}
		for(var i=0;i<5;i++){
			this.getItem(this.selected_item-2+i).draw(this.ctx, this.width*this.positions[i]+dx,this.height-this.back.height, this.scale)//i==2 && this.movement == false?1.5*this.scale:this.scale);
		}
	},
	
	
};