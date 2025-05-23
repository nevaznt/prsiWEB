import Card from "./card.js";

export default class Player{
    constructor(gp){
        this.cursor = 0;
        this.hand = [];
        this.gp = gp;
        this.choosing_color = false;
        this.onHold = 0;
    }

    takeFromHand(index){
        const c = new Card(this.hand[index].color, this.hand[index].number);
        this.hand.splice(index, 1);
        return c;
    }

    update(deltatime){
        if(this.onHold > 0) {
            if(this.onHold < 1) {
                this.onHold = 0;
                return true;
            }
            return false;
        }

        if(this.choosing_color){
            if(this.gp.keys.l && this.cursor > 0){
                this.gp.keys.l = false;
                this.cursor--;
            }else if(this.gp.keys.r && this.cursor < 3) {
                this.gp.keys.r = false;
                this.cursor++;
            }

            if(this.gp.keys.act){
                this.gp.table.colorChange = this.gp.assetm.colors[this.cursor];
                this.cursor = 0;
                this.gp.keys.act = false;
                this.choosing_color = false;
                return true;
            }
        
            return false;
        }

        if(this.gp.keys.l && this.cursor > 0){
            this.gp.keys.l = false;
            this.cursor--;
        }else if(this.gp.keys.r && this.cursor < this.hand.length) {
            this.gp.keys.r = false;
            this.cursor++;
        }else if(this.gp.keys.u && this.cursor < this.hand.length){
            this.gp.keys.u = false;
            this.cursor = this.hand.length;
        }else if(this.gp.keys.d && this.cursor == this.hand.length){
            this.gp.keys.d = false;
            this.cursor = this.hand.length-1;
        }

        if(this.gp.keys.act && this.cursor < this.hand.length){
            if(this.gp.table.applyrules(this.hand[this.cursor]) && this.hand[this.cursor].number != 12){
                this.gp.table.midDeck.push(this.takeFromHand(this.cursor));
                this.gp.table.detectException();
                this.gp.keys.act = false;
                this.cursor = 0;
                return true;
            }else if((this.hand[this.cursor].number == 12 && this.gp.table.sedmActive == 0 && !this.gp.table.esoActive)){
                this.choosing_color = true;
                this.gp.table.midDeck.push(this.takeFromHand(this.cursor));
                this.gp.table.detectException();
                this.gp.keys.act = false;
                this.cursor = 0;
            }
        }else if(this.gp.keys.act && !this.gp.table.esoActive && this.cursor == this.hand.length){
            if(this.gp.table.sedmActive > 0) {
                for(let i = 0; i < 2*this.gp.table.sedmActive; i++) if(this.gp.table.checkDeck()) this.hand.push(this.gp.table.takeFromDeck(0));
                this.gp.table.sedmActive = 0;
            }else if(this.gp.table.checkDeck()) this.hand.push(this.gp.table.takeFromDeck(0));
            this.cursor = 0;
            this.gp.keys.act = false;
            return true;
        }
        else if(this.gp.table.esoActive){
            for(let i = 0; i < this.hand.length; i++){
                if(this.hand[i].number == 14) return false;
                else if(i == this.hand.length-1) {
                    this.gp.table.esoActive = false;
                    this.onHold = 180;
                    return false;
                }
            }
        }

        return false;
    }

    draw(){
        this.gp.screen.font = "bold 64px Arial";
        
        let spacing = 0;
        if(this.hand.length*this.gp.assetm.cardDimensions.w > (this.gp.canvas.width)) spacing = (((this.gp.canvas.width-(this.gp.assetm.cardDimensions.w*2))-(this.hand.length*this.gp.assetm.cardDimensions.w))/this.hand.length);
    
        for(let i = 0; i < this.hand.length-this.gp.anmPlayerHand; i++){
            let x = (this.gp.canvas.width/2)-((this.hand.length*this.gp.assetm.cardDimensions.w+this.hand.length*spacing)/2)+(i*(this.gp.assetm.cardDimensions.w+spacing))+(spacing/2);
            this.gp.screen.drawImage(this.gp.assetm.getCard(this.hand[i].color+this.hand[i].number), x, 520, this.gp.assetm.cardDimensions.w, this.gp.assetm.cardDimensions.h);

            if(i == this.cursor && !this.choosing_color && this.gp.table.playermove && this.gp.game && this.onHold == 0) {
                //this.gp.screen.fillStyle = "#FFFFFF";
                //this.gp.screen.fillRect(x+(this.gp.assetm.cardDimensions.w)/2-8, 680, 16, 16);
                this.gp.screen.drawImage(this.gp.assetm.arrow, x+(this.gp.assetm.cardDimensions.w)/2-16, 680, this.gp.assetm.arrowDimensions.w, this.gp.assetm.arrowDimensions.h);
            }
        }
        if(this.cursor == this.hand.length && !this.choosing_color && this.gp.table.playermove && this.gp.game && this.onHold == 0){
            // this.gp.screen.fillStyle = "#FFFFFF";
            // this.gp.screen.fillRect(this.gp.canvas.width-(this.gp.assetm.cardDimensions.w*5)+(this.gp.assetm.cardDimensions.w)/2-8, 450, 16, 16);
            this.gp.screen.drawImage(this.gp.assetm.arrow, this.gp.canvas.width-(this.gp.assetm.cardDimensions.w*5)+(this.gp.assetm.cardDimensions.w)/2-16, 440, this.gp.assetm.arrowDimensions.w, this.gp.assetm.arrowDimensions.h);
        }

        if(this.choosing_color && this.gp.game){
            let symbols_x = this.gp.canvas.width/2-this.gp.assetm.symbolDimensions.w*6;
            let symbols_y = this.gp.canvas.height/2-this.gp.assetm.symbolDimensions.h/2;
            for(let i = 0; i < this.gp.assetm.colors.length; i++) {
                this.gp.screen.drawImage(this.gp.assetm.getSymbol(this.gp.assetm.colors[i]), symbols_x+this.gp.assetm.symbolDimensions.w*i, symbols_y, this.gp.assetm.symbolDimensions.w, this.gp.assetm.symbolDimensions.h);
                if(this.cursor==i){
                    // this.gp.screen.fillStyle = "#FFFFFF";
                    // this.gp.screen.fillRect(symbols_x+this.gp.assetm.symbolDimensions.w*i+14, symbols_y+50, 16, 16);
                    this.gp.screen.drawImage(this.gp.assetm.arrow, symbols_x+this.gp.assetm.symbolDimensions.w*i+6, symbols_y+50, this.gp.assetm.arrowDimensions.w, this.gp.assetm.arrowDimensions.h);
                }
            }
        }

        if(this.onHold > 0 && this.gp.game){
            this.gp.screen.fillStyle = "white";
            this.gp.screen.fillText("Stojíš", 200, this.gp.canvas.height/2);
        }
    }
}