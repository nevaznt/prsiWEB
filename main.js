import Table from "./table.js";
import AssetManager from "./assetmanager.js";
import Player from "./player.js";
import Bot from "./bot.js";

class GamePanel{
    constructor(){
        this.canvas = document.getElementById("screen");
        this.screen = this.canvas.getContext("2d");
        
        this.keys = {u: false, d: false, l: false, r: false, act: false};
        this.noOfCardOnStart = 4;
        this.game = true;
        this.playerWinsCounter = 0;
        this.introAnm = false;
        this.anmStage = 0;
        this.anmPlayerHand = 0;
        this.anmBotHand = 0;
        this.anmDelay = 0;

        this.assetm = new AssetManager();

        this.set();
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
            if(this.keys.act) {
                this.set();
                this.keys.act = false;
            }
        }
        this.table.update(deltatime);
    }

    draw(){
        this.screen.imageSmoothingEnabled = true;

        for(let i = 0; i < 720; i += 32){
            for(let j = 0; j < 1280; j += 32){
                if(i % 64 == 0 && j % 64 == 0) this.screen.fillStyle = "#009200";
                else if(i % 64 == 0 && j % 64 != 0) this.screen.fillStyle = "#008800";
                else if(i % 64 != 0 && j % 64 != 0) this.screen.fillStyle = "#009200";
                else if(i % 64 != 0 && j % 64 == 0) this.screen.fillStyle = "#008800";
                this.screen.fillRect(j, i, 32, 32);
            }
        }

        this.player.draw();
        this.bot.draw();
        this.table.draw();

        this.screen.font = "bold 32px Arial";
        this.screen.fillStyle = "white";
        this.screen.fillText("Score: " + this.playerWinsCounter, 10, 30);
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

function loop(timestemp){
    const deltatime = timestemp - last_time;
    last_time = timestemp;
    
    gamepanel.update(deltatime);

    gamepanel.draw();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
