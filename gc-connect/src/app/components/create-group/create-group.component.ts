import { Component, OnInit } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faEdit,
  faEye,
  faLink,
  faLock,
  faSave,
  faSignOutAlt,
  faUpload,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { FilestackClient } from 'src/app/helpers.ts/filestack';
import { NgAuthService } from '../../services/ng-auth.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
})
export class CreateGroupComponent implements OnInit {
  faUser = faUser;
  faLock = faLock;
  faEdit = faEdit;
  faLinkedin = faLinkedin;
  faGithub = faGithub;
  faLink = faLink;
  faSave = faSave;
  faUpload = faUpload;
  faSignOutAlt = faSignOutAlt;
  faEye = faEye;
  url: any | null = null;
  userStateId: string = '';
  sessionUid: any;
  displayDetails: boolean = true;
  displayLinkedIn: boolean = true;
  displayGithub: boolean = true;
  displayCalendly: boolean = true;
  userPhoto: any = null;
  isShown: boolean = true;
  groups: any = '';

  constructor(
    private SQLservice: GcConnectService,
    public ngAuthService: NgAuthService
  ) {}

  ngOnInit(): void {}

  onSubmit(groupName: any, groupType: any, groupBio: any, groupPhoto: any) {
    console.log('clicked!');

    console.log(groupName);
    if (groupName === '' && groupBio === '') {
      alert('Please enter a group name and description.');
    } else if (groupName === '') {
      alert('Please enter a group name.');
    } else if (groupBio === '') {
      alert('Please enter a group description.');
    } else {
      this.SQLservice.createGroup(
        groupName,
        groupType,
        groupBio,
        groupPhoto
      ).subscribe((group) => (this.groups = group));
      alert('Group has been created!');
    }
  }

  async uploadFile() {
    const url = await FilestackClient.pick();
    this.url = url;
    console.log(url);
  }
}
