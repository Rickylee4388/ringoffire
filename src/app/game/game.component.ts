import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { PlayerInfoComponent } from '../player-info/player-info.component'
import { docData, limit, query, orderBy, where, Firestore, collection, collectionData, onSnapshot, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
// import { collection } from 'firebase/firestore';
import { STRING_TYPE } from '@angular/compiler';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  /**
   * injects firestore
   */
  firestore: Firestore = inject(Firestore);

  unsubGame;
  gameId: string = '';
  game!: Game;
  gameOver = false;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    this.unsubGame = this.subGame();
  }

  /**
   * starts new game when initialized
   * loads game values
   */
  ngOnInit(): void {
    this.newCardGame();
    this.getGameValues();
  }

  /**
   * subscribes games collection from firebase backend
   */
  getGameValues() {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.getValues();
    });
  }

  /**
   * loads all values from games collection single document
   */
  async getValues() {
    let activeGame$ = this.getSingleDocRef('games', this.gameId);
    let docSnap: any = (await getDoc(activeGame$)).data();
    this.game.currentPlayer = docSnap['currentPlayer'] || 0;
    this.game.player_images = docSnap['player_images'],
      this.game.playedCard = docSnap['playedCard'];
    this.game.players = docSnap['players'];
    this.game.stack = docSnap['stack'];
    this.game.pickCurrentCard = docSnap['pickCurrentCard'];
    this.game.pickCardAnimation = docSnap['pickCardAnimation'];
  }

  /**
   * unsubmits when closed
   */
  ngonDestroy() {
    this.unsubGame();
  }

  /**
   * submits live update of collection
   * @returns 
   */
  subGame() {
    return onSnapshot(this.getGameRef(), (list: any) => {
      list.forEach((element: any) => {
        this.getGameValues();
      });
    });
  }

  /**
   * 
   * @returns values in collection
   */
  getGameRef() {
    return collection(this.firestore, 'games');
  }

  /**
   * 
   * @param colId collection id
   * @param docId document id
   * @returns values in documet
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * creates a new game from game.ts
   */
  newCardGame() {
    this.game = new Game();
  }

  /**
   * takes a card from stack 
   * starts animation
   * switches to next player
   * pushes card to playedcards
   */
  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
      this.game.pickCurrentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCard.push(this.game.pickCurrentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1500);
    }
  }

  /**
   * opens edit window for picked player 
   * makes changes of image 
   * can delete player
   * @param player information
   */
  editPlayer(player: number) {
    const dialogRef = this.dialog.open(PlayerInfoComponent);
    dialogRef.afterClosed().subscribe(change => {
      if (change) {
        if (change == 'DELETE') {
          this.game.player_images.splice(player, 1);
          this.game.players.splice(player, 1);
        } else {
          this.game.player_images[player] = change;
        }
        this.saveGame();
      }
    });
  }

  /**
   * opens window to create new player
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.game.players.push(name);
        this.game.player_images.push('profilePic.png');
        this.saveGame();
      }
    });
  }

  /**
   * saves actual changes on board to make live update possible
   */
  async saveGame() {
    let singleGameRef = this.getSingleDocRef('games', this.gameId);
    await updateDoc(singleGameRef, this.game.toJson()).catch(
      (err) => { console.log(err) }
    );
  }
}
