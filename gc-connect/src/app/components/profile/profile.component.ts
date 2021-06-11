import { Component, OnInit, Input } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faEdit,
  faLink,
  faLock,
  faPencilAlt,
  faSave,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { FilestackClient } from 'src/app/helpers.ts/filestack';
import { NgAuthService } from '../../services/ng-auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  faUser = faUser;
  faLock = faLock;
  faEdit = faEdit;
  faLinkedin = faLinkedin;
  faGithub = faGithub;
  faLink = faLink;
  faSave = faSave;
  faPencilAlt = faPencilAlt;
  faSignOutAlt = faSignOutAlt;
  url: string = '';
  userStateId: string = '';
  sessionUid: any;
  displayDetails: boolean = false;
  displayLinkedIn: boolean = true;
  displayGithub: boolean = true;
  displayCalendly: boolean = true;

  @Input() user: any = '';

  constructor(
    private SQLservice: GcConnectService,
    public ngAuthService: NgAuthService
  ) {}

  ngOnInit(): void {
    this.sessionUid = sessionStorage.getItem('key');
    console.log(this.sessionUid);

    if (!this.userStateId) {
      this.userStateId = NgAuthService.userState.uid;
    }
    this.SQLservice.getUserByUid(this.userStateId).subscribe(
      (user) => (this.user = user)
    );

    this.displayLinkedIn = this.user.linked_in;
    this.displayGithub = this.user.github;
    this.displayCalendly = this.user.calendly;

    // console.log(this.ngAuthService.userState.uid);
    // console.log(this.user.first_name);
  }

  async uploadFile() {
    const url = await FilestackClient.pick();
    this.url = url;
    console.log(url);
  }
}
