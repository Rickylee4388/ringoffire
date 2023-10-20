import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { limit, query, orderBy, where, Firestore, collectionData, onSnapshot, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { collection } from 'firebase/firestore';
import { STRING_TYPE } from '@angular/compiler';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  pickCurrentCard: string = '';
  game: any = Game;


  firestore: Firestore = inject(Firestore);
  // normalTest:any = [];
  unsubGame;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) { 

    this.unsubGame = onSnapshot(this.getGameRef(), (list:any) => {
      // this.normalTest = [];
      list.forEach((element: any) => {
        // this.normalTest.push(this.setTestObject(element.data(), element.id));
        console.log(element.data());
      });
    });


  }

  ngonDestroy() {
    this.unsubGame();
  }


  // setTestObject(obj: any, id: string) {
  //   return {
  //     id: id || "",
  //     type: obj.type || "game",
  //     title: obj.title || "",
  //     content: obj.content || "",
  //     marked: obj.marked || false,
  //   }
  // }

  ngOnInit(): void {
    this.newCardGame();

    this.route.params.subscribe((params) => {
      console.log(params['id']);
    })
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  getSingleDocRef(colId:string, docId:string ){
    return doc(collection(this.firestore, colId), docId);
  }


  newCardGame() {
    this.game = new Game();

  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.pickCurrentCard = this.game.stack.pop();
      console.log(this.pickCurrentCard);
      this.pickCardAnimation = true;
      console.log(this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    }


    setTimeout(() => {
      this.game.playedCard.push(this.pickCurrentCard);
      this.pickCardAnimation = false;
    }, 1500);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.game.players.push(name);
      }
    });
  }

}
