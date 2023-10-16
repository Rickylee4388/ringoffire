import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, onSnapshot, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  pickCurrentCard: string = '';
  game:any = Game;

  private firestore: Firestore = inject(Firestore);


  constructor(public dialog: MatDialog, private route: ActivatedRoute) {  }


  ngOnInit(): void {
  this.newCardGame();

  collection(this.firestore, 'games');
  }

  newCardGame(){
    this.game = new Game();
    
  }
  
  takeCard(){
    if(!this.pickCardAnimation){
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
      if(name){
        this.game.players.push(name);
      }
    });
  }

}
