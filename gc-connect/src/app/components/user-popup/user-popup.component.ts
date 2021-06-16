import { Component, OnInit, EventEmitter,Input, Output } from '@angular/core';
import { faTimes, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent implements OnInit {
  faTimes=faTimes;
  faLinkedin = faLinkedin;
  faGithub = faGithub;
  faLink = faLink;
  displayDetails: boolean = false;
  displayLinkedIn: boolean = true;
  displayGithub: boolean = true;
  displayCalendly: boolean = true;

  @Input() user:any = '';
  @Output() closed = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    
  }

  closeWindow(){
    this.closed.emit(true);
  }

}
