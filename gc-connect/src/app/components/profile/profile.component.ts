import { Component, OnInit } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faEdit,
  faLink,
  faLock,
  faSave,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { FilestackClient } from 'src/app/helpers.ts/filestack';
import { NgAuthService } from '../../services/ng-auth.service';

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
  faSignOutAlt = faSignOutAlt;
  user: any | null = null;

  constructor(
    private SQLservice: GcConnectService,
    public ngAuthService: NgAuthService
  ) {}

  ngOnInit(): void {
    this.SQLservice.getUserByUid(this.ngAuthService.userState.uid).subscribe(
      (user) => (this.user = user)
    );
    console.log(this.ngAuthService.userState.uid);
  }

  async uploadFile() {
    const url = await FilestackClient.pick();
    console.log(url);
  }
}
