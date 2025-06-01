import Table from "./table.js";
import AssetManager from "./assetmanager.js";
import Player from "./player.js";
import Bot from "./bot.js";

// TODO: menu -> making start option instead of starting automatically, some text and stuff, settings 

class GamePanel{
    constructor(){
        this.canvas = document.getElementById("screen");
        this.screen = this.canvas.getContext("2d");
        
        this.mousex = 0;
        this.mousey = 0;
        this.keys = {u: false, d: false, l: false, r: false, act: false, mouse_click: false};
        this.noOfCardOnStart = 4;
        this.game = false;
        this.playerWinsCounter = 0;
        this.introAnm = false;
        this.anmStage = 0;
        this.anmPlayerHand = 0;
        this.anmBotHand = 0;
        this.anmDelay = 0;

        this.player = null;
        this.bot = null;
        this.table = null;

        this.assetm = new AssetManager(this);
    }

    getMousePos(e){
        const rect = this.canvas.getBoundingClientRect();
        this.mousex = (e.clientX - rect.left) * this.canvas.width / rect.width;;
        this.mousey = (e.clientY - rect.top) * this.canvas.height / rect.height;
    }

    set(){
        this.table = new Table(this, this.assetm);
        
        this.player = new Player(this);
        this.bot = new Bot(this);
        for(let i = 0; i < this.noOfCardOnStart; i++){
            this.player.hand.push(this.table.takeFromDeck(0));
            this.bot.hand.push(this.table.takeFromDeck(0));
        }
        this.anmStage = 4;
        this.anmPlayerHand = this.noOfCardOnStart;
        this.anmBotHand = this.noOfCardOnStart;
        this.introAnm = true;
        this.game = true;
    }

    update(deltatime){
        if(!this.assetm.isLoaded) return;

        if(this.anmDelay > 0){
            this.anmDelay -= 0.04*deltatime;
            return;
        }

        if(this.introAnm){
            if(this.anmStage == 4) this.anmPlayerHand--;
            else if(this.anmStage == 3) this.anmBotHand--;

            if(this.anmStage==4 && this.anmPlayerHand == 0) this.anmStage = 3;
            else if(this.anmStage==3 && this.anmBotHand == 0) this.anmStage = 2;
            else if(this.anmStage==2) this.anmStage = 1;
            else if(this.anmStage==1) this.anmStage = 0;

            if(this.anmStage==0) this.introAnm = false;
            else this.anmDelay = 5;
            return;
        }

        if(this.game){
            if(this.table.playermove) { if(this.player.update(deltatime)) this.table.playermove = !this.table.playermove; }
            else if(this.bot.update(deltatime)) this.table.playermove = !this.table.playermove; 
        }else {
            if(this.keys.act || this.keys.mouse_click) {
                this.set();
                this.keys.act = false;
            }
        }
        this.table.update(deltatime);
    }

    draw(){
        this.screen.imageSmoothingEnabled = true;

        let tilesize = 64;
        for(let i = 0; i < this.canvas.height; i += tilesize){
            for(let j = 0; j < this.canvas.width; j += tilesize){
                if(i % (tilesize*2) == 0 && j %( tilesize*2) == 0) this.screen.fillStyle = "#009200";
                else if(i % (tilesize*2) == 0 && j % (tilesize*2) != 0) this.screen.fillStyle = "#008800";
                else if(i % (tilesize*2) != 0 && j % (tilesize*2) != 0) this.screen.fillStyle = "#009200";
                else if(i % (tilesize*2) != 0 && j % (tilesize*2) == 0) this.screen.fillStyle = "#008800";
                this.screen.fillRect(j, i, tilesize, tilesize);
            }
        }

        if(!this.assetm.isLoaded){
            this.screen.font = "bold 72px WDXL Lubrifont TC";
            this.screen.fillStyle = "black";
            this.screen.fillText("Loading", this.canvas.width/2-100+3, this.canvas.height/2+3);
            this.screen.fillStyle = "white";
            this.screen.fillText("Loading", this.canvas.width/2-100, this.canvas.height/2);
            return;
        }

        this.player.draw();
        this.bot.draw();
        this.table.draw();

        this.screen.font = "bold 72px WDXL Lubrifont TC";
        this.screen.fillStyle = "black";
        this.screen.fillText("Score: " + this.playerWinsCounter, 13, 63);
        this.screen.fillStyle = "white";
        this.screen.fillText("Score: " + this.playerWinsCounter, 10, 60);
        
        //this.screen.strokeStyle="white";
        //this.screen.beginPath();
        //this.screen.arc(this.mousex, this.mousey, 20, 0, 2 * Math.PI);
        //this.screen.stroke();
    }
}

let last_time = 0;

const gamepanel = new GamePanel();

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener("keydown", event => {
    if (event.key == "w" || event.key == "W" || event.key == "ArrowUp") gamepanel.keys.u = true;
    else if (event.key == "s" || event.key == "S" || event.key == "ArrowDown") gamepanel.keys.d = true;
    else if (event.key == "a" || event.key == "A" || event.key == "ArrowLeft") gamepanel.keys.l = true;
    else if (event.key == "d" || event.key == "D" || event.key == "ArrowRight") gamepanel.keys.r = true;
    else if (event.key == "Enter" || event.key == " ") gamepanel.keys.act = true;
});

document.addEventListener("keyup", event => {
    if (event.key == "w" || event.key == "W" || event.key == "ArrowUp") gamepanel.keys.u = false;
    else if (event.key == "s" || event.key == "S" || event.key == "ArrowDown") gamepanel.keys.d = false;
    else if (event.key == "a" || event.key == "A" || event.key == "ArrowLeft") gamepanel.keys.l = false;
    else if (event.key == "d" || event.key == "D" || event.key == "ArrowRight") gamepanel.keys.r = false;
    else if (event.key == "Enter" || event.key == " ") gamepanel.keys.act = false;
});

gamepanel.canvas.addEventListener("mousemove", (e) => {
    gamepanel.getMousePos(e);
});
gamepanel.canvas.addEventListener("mousedown", (e) => {
    gamepanel.keys.mouse_click = true;
});
gamepanel.canvas.addEventListener("mouseup", (e) => {
    gamepanel.keys.mouse_click = false;
});

function loadFont(fontname){
    var canvas = document.createElement("canvas");

    canvas.width = 16;
    canvas.height = 16;
    var ctx = canvas.getContext("2d");

    ctx.font = "4px "+fontname;
    ctx.fillText("text", 0, 8);
}

loadFont("WDXL Lubrifont TC");

function loop(timestemp){
    const deltatime = timestemp - last_time;
    last_time = timestemp;
    
    gamepanel.update(deltatime);

    gamepanel.draw();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
