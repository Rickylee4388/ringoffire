import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { docData, limit, query, orderBy, where, Firestore,collection, collectionData, onSnapshot, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
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

  game: any = Game;


  firestore: Firestore = inject(Firestore);
  // normalGame:any = [];
  unsubGame:any;
  gameId:any;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {   }

  ngOnInit(): void {
    
    this.newCardGame();  
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];
       
      let activeGame$ = docData(this.getSingleDocRef(this.gameId));
      activeGame$.subscribe((game: any) => {
        
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.currentCard = game.currentCard;
        this.game.pickCardAnimation = game.pickCardAnimation;
      })
    })
  }

  ngonDestroy() {
    this.unsubGame();
  }

  subGame(){
    return onSnapshot(this.getGameRef(), (list:any) => {
      list.forEach((element: any) => {
        console.log("Game Update",element.data());
      });
    });
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  getSingleDocRef(docId:string ){
    return doc(collection(this.firestore, 'games'), docId);
  }


  newCardGame() {
    this.game = new Game();
  
  }

  // async addCardGame(item: Game){
  //   await addDoc(this.getGameRef(),item).catch(
  //     (err)=>{console.error(err)}).then(
  //     (docRef)=>{console.log("DOC written by ID:",docRef)});
  // }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.pickCurrentCard = this.game.stack.pop();
      this.saveGame();
      console.log(this.game.pickCurrentCard);
      this.game.pickCardAnimation = true;
      console.log(this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    }


    setTimeout(() => {
      this.game.playedCard.push(this.game.pickCurrentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
    }, 1500);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame(){
    let singleGameRef = this.getSingleDocRef(this.gameId);
    await updateDoc(singleGameRef,this.game.toJson()).catch(
        (err) => { console.log(err) }
      );
  }

}
