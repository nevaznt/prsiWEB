/*color: red
         green
         yellow
         brown
  number: 7, 8, 9, 10,
          11 - spodek, 12 - svršek, 13 - král, 14 - eso
*/
export default class Card{
    constructor(color, num){
        this.color = color;
        this.number = num;
        this.rofsx = 0;
        this.rofsy = 0;
        this.offsetAssingned = false;
    }

    assignOffset(){
        if(Math.random()>0.5) rofsx = Math.floor(Math.random()*8);
        else rofsx = -Math.floor(Math.random()*8);
        if(Math.random()>0.5) rofsy = Math.floor(Math.random()*8);
        else rofsy = -Math.floor(Math.random()*8);

        this.offsetAssingned = true;
    }

}