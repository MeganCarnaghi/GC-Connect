import { Component, OnInit, Input } from '@angular/core';
import {
  faCalendarAlt,
  faAddressBook,
} from '@fortawesome/free-regular-svg-icons';
import { faUserFriends,faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { NgAuthService } from 'src/app/services/ng-auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  faCalendarAlt = faCalendarAlt;
  faUserFriends = faUserFriends;
  faAddressBook = faAddressBook;
  faBriefcase = faBriefcase;
  userStateId: string = '';

  @Input() user: any = '';
  constructor(
    private SQLservice: GcConnectService,
    public ngAuthService: NgAuthService
  ) {}

  ngOnInit(): void {
    if (!this.userStateId) {
      this.userStateId = NgAuthService.userState.uid;
    }
    this.SQLservice.getUserByUid(this.userStateId).subscribe(
      (user) => (this.user = user)
    );
  }
}
