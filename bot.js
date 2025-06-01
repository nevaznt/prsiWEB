import Card from "./card.js";

export default class Bot {
    constructor(gp){
        this.hand = [];
        this.gp = gp;
        this.thinkingTime = 0;
        this.onHold = 0;
    }

    takeFromHand(index){
        const c = new Card(this.hand[index].color, this.hand[index].number);
        this.hand.splice(index, 1);
        return c;
    }

    update(deltatime){
        if(this.thinkingTime == 0) this.thinkingTime = Math.floor(((Math.random())+0.25)*(60+deltatime));
        if(this.thinkingTime > 0) this.thinkingTime--;
        if(this.thinkingTime != 0) return false;

        let canUse = [];
        let twelves = [];

        for(let i = 0; i < this.hand.length; i++) {
            if(this.gp.table.applyrules(this.hand[i]) && this.hand[i].number != 12) canUse.push(i);
            else if(!this.gp.table.esoActive && this.gp.table.sedmActive == 0 && this.hand[i].number == 12) twelves.push(i);
        }

        if(canUse.length == 1) {
            this.gp.table.midDeck.push(this.takeFromHand(canUse[0]));
            this.gp.table.detectException();
            return true;
        }
        else if(canUse.length == 0 && twelves.length != 0){
            this.gp.table.midDeck.push(this.takeFromHand(twelves[0]));
            this.gp.table.detectException();

            let colorCount = [0, 0, 0, 0];
            for(let i = 0; i < this.hand.length; i++){
                if(this.hand[i].color == "red") colorCount[0]++;
                else if(this.hand[i].color == "green") colorCount[1]++;
                else if(this.hand[i].color == "yellow") colorCount[2]++;
                else if(this.hand[i].color == "brown") colorCount[3]++;
            }

            let c = "";
            if(this.max(colorCount) == 0) c = "red";
            else if(this.max(colorCount) == 1) c = "green";
            else if(this.max(colorCount) == 2) c = "yellow";
            else if(this.max(colorCount) == 3) c = "brown";
            this.gp.table.colorChange = c;
            return true;
        }
        else if(canUse.length > 1){
            let score = [];
            for(let i = 0; i < canUse.length; i++){
                for(let j = 0; j < this.hand.length; j++){
                    if(this.hand[j] == this.hand[canUse[i]]) continue;
                    if(this.hand[canUse[i]].color == this.hand[j].color && this.hand[j].number != 12) score[i]++;
                    else if(this.hand[canUse[i]].number == this.hand[j].number) score[i]++;
                }
            }

            this.gp.table.midDeck.push(this.takeFromHand(canUse[this.max(score)]));
            this.gp.table.detectException();
            return true;
        }
        else if(this.gp.table.sedmActive>0) {
            for(let i = 0; i < this.gp.table.sedmActive*2; i++) if(this.gp.table.checkDeck()) this.hand.push(this.gp.table.takeFromDeck(0));
            this.gp.table.sedmActive = 0;
            return true;
        }
        else if(canUse.length == 0 && twelves.length == 0 && !this.gp.table.esoActive) {
            if(this.gp.table.checkDeck()) this.hand.push(this.gp.table.takeFromDeck(0));
            return true;
        }else if(canUse.length == 0 && twelves.length == 0 && this.gp.table.esoActive) {
            this.gp.table.esoActive = false;
            this.onHold = 180;
            return true;
        }
        
        return false;
    }

    max(arr){
        let max = 0;

        for(let i = 0; i < arr.length; i++){
            if(arr[i] > arr[max]) max = i;
        }

        return max;
    }

    draw(){
        this.gp.screen.font = "bold 96px WDXL Lubrifont TC";

        let spacing = 0;
        if(this.hand.length*this.gp.assetm.cardDimensions.w > (this.gp.canvas.width)) spacing = (((this.gp.canvas.width-(this.gp.assetm.cardDimensions.w*2))-(this.hand.length*this.gp.assetm.cardDimensions.w))/this.hand.length);
    
        for(let i = 0; i < this.hand.length-this.gp.anmBotHand; i++){
            let x = (this.gp.canvas.width/2)-((this.hand.length*this.gp.assetm.cardDimensions.w+this.hand.length*spacing)/2)+(i*(this.gp.assetm.cardDimensions.w+spacing))+(spacing/2);
            this.gp.screen.drawImage(this.gp.assetm.getAsset("otherside"), x, 30, this.gp.assetm.cardDimensions.w, this.gp.assetm.cardDimensions.h);
            // this.gp.screen.drawImage(this.gp.assetm.getAsset(this.hand[i].color+this.hand[i].number), x, 60, this.gp.assetm.cardDimensions.w, this.gp.assetm.cardDimensions.h);
        }

        if(this.onHold > 0 && this.gp.game){
            this.gp.screen.fillStyle = "black";
            this.gp.screen.fillText("Stojím", 203, this.gp.canvas.height/2+3);
            this.gp.screen.fillStyle = "white";
            this.gp.screen.fillText("Stojím", 200, this.gp.canvas.height/2);
        }
    }
}