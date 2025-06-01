export default class AssetManager{
    constructor(gp) {
        this.isLoaded = false;
        this.gp = gp;

        this.card_scale = 0.5;
        this.cardDimensions = {w: 360*this.card_scale, h: 570*this.card_scale};

        this.symbol_scale = 0.6;
        this.symbolDimensions = {w: 150*this.symbol_scale, h: 150*this.symbol_scale};

        this.stone_scale = 0.45;
        this.stoneDimensions = {w: 180*this.stone_scale, h: 200*this.stone_scale};
    
        this.arrow_scale = 0.75;
        this.arrowDimensions = {w: 64*this.arrow_scale, h: 64*this.arrow_scale};

        this.asset_index = {
            "red7": 0,"red8": 1,"red9": 2,"red10": 3,"red11": 4,"red12": 5,"red13": 6,"red14": 7,
            "green7": 8,"green8": 9,"green9": 10,"green10": 11,"green11": 12,"green12": 13,"green13": 14,"green14": 15,
            "yellow7": 16,"yellow8": 17,"yellow9": 18,"yellow10": 19,"yellow11": 20,"yellow12": 21,"yellow13": 22,"yellow14": 23,
            "brown7": 24,"brown8": 25,"brown9": 26,"brown10": 27,"brown11": 28,"brown12": 29,"brown13": 30,"brown14": 31,
            "otherside": 32,
            "red": 33,"green": 34,"yellow": 35,"brown": 36,
            "stone": 37,"arrow": 38
        };

        const imagePaths = [
            "img/brown/brown7.png", "img/brown/brown8.png", "img/brown/brown9.png", "img/brown/brown10.png", "img/brown/brown11.png", "img/brown/brown12.png", "img/brown/brown13.png", "img/brown/brown14.png",
            "img/green/green7.png", "img/green/green8.png", "img/green/green9.png", "img/green/green10.png", "img/green/green11.png", "img/green/green12.png", "img/green/green13.png", "img/green/green14.png",
            "img/yellow/yellow7.png", "img/yellow/yellow8.png", "img/yellow/yellow9.png", "img/yellow/yellow10.png", "img/yellow/yellow11.png", "img/yellow/yellow12.png", "img/yellow/yellow13.png", "img/yellow/yellow14.png",
            "img/red/red7.png", "img/red/red8.png", "img/red/red9.png", "img/red/red10.png", "img/red/red11.png", "img/red/red12.png", "img/red/red13.png", "img/red/red14.png",
            "img/otherside.png",
            "img/brown/brownsymbol.png", "img/green/greensymbol.png", "img/yellow/yellowsymbol.png", "img/red/redsymbol.png",
            "img/stone.png", "img/arrow.png"
        ];
        
        this.assets = [];
        let loadedCount = 0;        

        imagePaths.forEach((path) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === imagePaths.length) {
                    this.isLoaded = true;
                    this.gp.set();
                }
            };
            img.src = path;
            this.assets.push(img);
        });

    }

    getAsset(index){
        return this.assets[this.asset_index[index]];
    }
}