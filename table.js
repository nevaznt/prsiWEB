import Card from './card.js';

export default class Table{
    constructor(gp, assetmanager){
        this.midDeck = [];
        this.deck = [];
        this.playermove = true;
        this.howWon = "";
        this.gp = gp;
        this.assetm = assetmanager;
        this.esoActive = false
        this.sedmActive = 0;
        this.colorChange = "";

        const colors = ["red", "green", "yellow", "brown"];
        for(let i = 0; i < 4; i++) for(let j = 7; j <= 14; j++) this.deck.push(new Card(colors[i], j));
        
        this.shuffle(this.deck);
        
        this.midDeck.push(this.takeFromDeck(0));

    }

    shuffle(array){
        let currentIndex = array.length;
        
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }

    applyrules(c, compare=this.midDeck[this.midDeck.length-1]){ // returns true if the move is valid
        return !((this.esoActive && c.number != 14) || (this.sedmActive>0 && c.number != 7) || (this.colorChange == "" && compare.color != c.color || (this.colorChange != "" && c.color != this.colorChange)) && compare.number != c.number);
    }

    checkDeck(){
        return this.deck.length != 0 || this.midDeck.length > 1;
    }

    detectException(){
        if(this.midDeck[this.midDeck.length-1].number != 12) this.colorChange = "";
        if(this.midDeck[this.midDeck.length-1].number == 7) this.sedmActive++;
        else if(this.midDeck[this.midDeck.length-1].number == 14) this.esoActive = true;
    }

    takeFromDeck(index){
        if(this.midDeck.length > 1 && this.deck.length == 0){
            let midDeckSize = this.midDeck.length-1;
            for(let i = 0; i < midDeckSize; i++){
                this.deck.push(new Card(this.midDeck[0].color, this.midDeck[0].number));
                this.midDeck.splice(0, 1);
            }
        }

        let c = new Card(this.deck[index].color, this.deck[index].number);
        this.deck.splice(index, 1);
        return c;
    }

    update(deltatime){
        if(this.gp.player.onHold > 0) this.gp.player.onHold -= 0.1*deltatime;
        if(this.gp.bot.onHold > 0) this.gp.bot.onHold -= 0.1*deltatime;

        if(this.gp.player.hand == 0 && this.gp.game) {
            this.gp.playerWinsCounter++;
            this.gp.game = false;
            this.howWon = "player";
        }
        else if(this.gp.bot.hand == 0 && this.gp.game) {
            this.gp.game = false;
            this.howWon = "bot";
        }
    }

    draw(){
        this.gp.screen.font = "bold 96px WDXL Lubrifont TC";

        if(this.gp.anmStage < 2){
            for(let i = 0; i < this.deck.length; i++) {
                this.gp.screen.drawImage(this.assetm.getAsset("otherside"), this.gp.canvas.width-(this.assetm.cardDimensions.w*3.5), (this.gp.canvas.height/2-this.assetm.cardDimensions.h/2)-Math.floor(i/2), this.assetm.cardDimensions.w, this.assetm.cardDimensions.h);
            }
        }
        if(this.gp.anmStage == 0){
            this.gp.screen.drawImage(this.assetm.getAsset(this.midDeck[this.midDeck.length-1].color+this.midDeck[this.midDeck.length-1].number), this.gp.canvas.width/2-this.assetm.cardDimensions.w/2, this.gp.canvas.height/2-this.gp.assetm.cardDimensions.h/2, this.assetm.cardDimensions.w, this.assetm.cardDimensions.h);
        }

        let stone_y = 0;
        if(this.playermove) stone_y = this.gp.canvas.height/2+60;
        else stone_y = this.gp.canvas.height/2-120;
        this.gp.screen.drawImage(this.assetm.getAsset("stone"), this.gp.canvas.width/2 + 160, stone_y, this.assetm.stoneDimensions.w, this.assetm.stoneDimensions.h);
        if(this.colorChange != "") this.gp.screen.drawImage(this.assetm.getAsset(this.colorChange), this.gp.canvas.width/2 + 165, stone_y+4, this.assetm.symbolDimensions.w*0.8, this.assetm.symbolDimensions.h*0.8)
        
        if(this.howWon != "") {
            this.gp.screen.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.gp.screen.fillRect(0, 0, this.gp.canvas.width, this.gp.canvas.height);
            
            if(this.howWon == "player")  {
                this.gp.screen.fillStyle = "black";
                this.gp.screen.fillText("Vyhrál jsi!", 143, this.gp.canvas.height/2+3);
                this.gp.screen.fillStyle = "white";
                this.gp.screen.fillText("Vyhrál jsi!", 140, this.gp.canvas.height/2);
            } else if(this.howWon == "bot") {
                this.gp.screen.fillStyle = "black";
                this.gp.screen.fillText("Prohrál jsi.", 143, this.gp.canvas.height/2+3);
                this.gp.screen.fillStyle = "white";
                this.gp.screen.fillText("Prohrál jsi.", 140, this.gp.canvas.height/2);
            }    
        }
    }

}