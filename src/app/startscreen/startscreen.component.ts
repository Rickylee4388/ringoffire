import { Component, OnInit, inject } from '@angular/core';
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
  constructor(private router: Router) { }
  game: any = Game;
  ngOnInit(): void {
  }

  /**
   * creates a new game and sets single Ref  
   */
  newGame() {
    this.game = new Game();
    this.addCardGame(this.game.toJson());
  }

  /**
   * sets single game Ref
   * @param item game 
   */
  async addCardGame(item: Game) {
    await addDoc(this.getGameRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef: any) => { this.router.navigateByUrl('/game/' + docRef.id) });
  }

  /**
   * 
   * @returns loads information from games collection in firebase
   */
  getGameRef() {
    return collection(this.firestore, 'games');
  }

}
