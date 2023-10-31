export class Game{
    public players: string[] = [];
    public player_images: string[] = [];
    public stack: string[] = [];
    public playedCard: string[] = [];
    public currentPlayer: number = 0;
    public pickCardAnimation = false;
    public pickCurrentCard: any = '';

/**
 * load card stack to backend
 */
    constructor(){
        for (let i = 1; i < 14; i++) {
              this.stack.push('ace_' + i);
              this.stack.push('hearts_' + i);
              this.stack.push('clubs_' + i);
              this.stack.push('diamonds_' + i);
        }
        shuffle(this.stack);
    }
    /**
     * 
     * @returns variables for each game
     */
    public toJson(){
      return{
        players: this.players,
        player_images: this.player_images,
        stack: this.stack,
        playedCard: this.playedCard,
        currentPlayer: this.currentPlayer,
        pickCardAnimation: this.pickCardAnimation,
        pickCurrentCard: this.pickCurrentCard
      };

    }
}
/**
 * 
 * @param array eg stack of cards
 * @returns shuffeled values
 */
function shuffle(array: any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
