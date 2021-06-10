import { Component, OnInit, EventEmitter,Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { GcConnectService } from 'src/app/services/gc-connect.service';
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

  constructor(private SQLservice: GcConnectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.displayLinkedIn = this.user.linked_in;
    this.displayGithub = this.user.github;
    this.displayCalendly = this.user.calendly;
  }

  closeWindow(){
    this.closed.emit(true);
  }

}
