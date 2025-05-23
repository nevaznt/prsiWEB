export default class AssetManager{
    constructor() {  
        this.cards = [];
        this.colors = ["red", "green", "yellow", "brown"];
        for(let i = 0; i < this.colors.length; i++) for(let j = 7; j <= 14; j++){
            this.cards.push(new Image());
            this.cards[this.cards.length-1].src = "./img/"+this.colors[i]+"/"+this.colors[i]+j+".png";
        }

        this.cards.push(new Image());
        this.cards[this.cards.length-1].src = "./img/otherside.png";
        this.card_scale = 0.25;
        this.cardDimensions = {w: this.cards[0].width*this.card_scale, h: this.cards[0].height*this.card_scale};

        this.card_index = {
            "red7": 0,"red8": 1,"red9": 2,"red10": 3,"red11": 4,"red12": 5,"red13": 6,"red14": 7,
            "green7": 8,"green8": 9,"green9": 10,"green10": 11,"green11": 12,"green12": 13,"green13": 14,"green14": 15,
            "yellow7": 16,"yellow8": 17,"yellow9": 18,"yellow10": 19,"yellow11": 20,"yellow12": 21,"yellow13": 22,"yellow14": 23,
            "brown7": 24,"brown8": 25,"brown9": 26,"brown10": 27,"brown11": 28,"brown12": 29,"brown13": 30,"brown14": 31
        };

        this.symbols = [];
        for(let i = 0; i < this.colors.length; i++){
            this.symbols.push(new Image);
            this.symbols[this.symbols.length-1].src = "./img/"+this.colors[i]+"/"+this.colors[i]+"symbol.png";
        }
        this.symbol_index = {
            "red": 0, "green": 1, "yellow": 2, "brown": 3
        }
        this.symbol_scale = 0.3;
        this.symbolDimensions = {w: this.symbols[0].width*this.symbol_scale, h: this.symbols[0].height*this.symbol_scale};
        
        this.stone = new Image();
        this.stone.src = "img/stone.png";
        this.stoneDimensions = {w: this.stone.width*0.25, h: this.stone.height*0.25};
    
        this.arrow = new Image();
        this.arrow.src = "img/arrow.png";
        this.arrowDimensions = {w: this.arrow.width*0.5, h: this.arrow.height*0.5};
    }

    getCard(card){
        if(card == "otherside") return this.cards[this.cards.length-1];
        else return this.cards[this.card_index[card]];
    }
    getSymbol(color){
        return this.symbols[this.symbol_index[color]];
    }
}