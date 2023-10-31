import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit{

allProfilePics =['profile.png','profilePic.png']

  constructor(public dialogRef: MatDialogRef<PlayerInfoComponent>) { }

  ngOnInit(): void {

  }

  /**
   * close dialog window
   */
  onNoClick(){
    this.dialogRef.close();
  }
}
