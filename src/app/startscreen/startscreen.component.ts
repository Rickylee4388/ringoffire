import { Component, OnInit, inject} from '@angular/core';
import { Router } from '@angular/router';
import { collection, addDoc, Firestore } from '@angular/fire/firestore';
import { Game } from 'src/models/game';


@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
constructor(private router: Router) {  }
game: any = Game;
ngOnInit(): void {

}

newGame(){
  //start new game
  this.game = new Game();
  // Then muss Definiert werden klappt noch nicht
  this.addCardGame(this.game.toJson());
  // ;
}

async addCardGame(item: Game){
  await addDoc(this.getGameRef(),item).catch(
    (err)=>{console.error(err)}).then(
    (docRef:any)=>{this.router.navigateByUrl('/game/'+ docRef.id)});
}

getGameRef() {
  return collection(this.firestore, 'games');
}

}
