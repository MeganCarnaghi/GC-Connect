import { Component, OnInit, Input } from '@angular/core';
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
  users: any | null = 'Paige';
  firstName: any | null = 'Paige';
  lastName: any | null = 'Blakesee';
  bootcamp: any | null = 'AHBC Front-End';
  bio: any | null = 'Tell us about yourself...';
  linkedin: any | null = 'https://www.linkedin.com/';
  github: any | null = 'https://www.github.com/';
  calendly: any | null = 'https://www.calendly.com/';

  @Input() user: any = '';

  constructor(
    private SQLservice: GcConnectService,
    public ngAuthService: NgAuthService
  ) {}

  ngOnInit(): void {
    // this.SQLservice.getUserByUid('uid').subscribe(
    //   (user) => (this.users = user)
    // );
  }

  async uploadFile() {
    const url = await FilestackClient.pick();
    console.log(url);
  }
}
