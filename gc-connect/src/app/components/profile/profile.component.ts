import { Component, OnInit, Input } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faEdit,
  faEye,
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
import { FormBuilder, FormsModule } from '@angular/forms';

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
  faEye = faEye;
  url: string = '';
  userStateId: string = '';
  sessionUid: any;
  displayDetails: boolean = true;
  displayLinkedIn: boolean = true;
  displayGithub: boolean = true;
  displayCalendly: boolean = true;
  userPhoto: any = null;
  isShown: boolean = true;

  @Input() user: any = '';

  constructor(
    private SQLservice: GcConnectService,
    public ngAuthService: NgAuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sessionUid = sessionStorage.getItem('key');
    // console.log(this.sessionUid);

    if (!this.userStateId) {
      this.userStateId = NgAuthService.userState.uid;
    }
    this.SQLservice.getUserByUid(this.userStateId).subscribe(
      (user) => (this.user = user)
    );

    this.displayLinkedIn = this.user.linked_in;
    this.displayGithub = this.user.github;
    this.displayCalendly = this.user.calendly;
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  onSubmit(
    userPhoto: any,
    userFirstName: any,
    userLastName: any,
    userBio: any,
    userBootcamp: any,
    userLinkedin: any,
    userGithub: any,
    userCalendly: any
  ) {
    let userTest: Object = {
      photo: userPhoto,
      first_name: userFirstName,
      last_name: userLastName,
      bio: userBio,
      bootcamp: userBootcamp,
      linked_in: userLinkedin,
      github: userGithub,
      calendly: userCalendly,
    };

    this.SQLservice.updateProfile(
      this.user.id,
      userPhoto,
      userFirstName,
      userLastName,
      userBio,
      userBootcamp,
      userLinkedin,
      userGithub,
      userCalendly
    );

    // this.SQLservice.getUserPhoto(this.user.id);

    console.log(userTest);
    // window.location.reload();
  }

  async uploadFile() {
    const url = await FilestackClient.pick();
    this.user.photo = url;
    console.log(url);
  }
}
