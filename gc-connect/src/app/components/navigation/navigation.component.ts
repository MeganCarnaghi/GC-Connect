import { Component, OnInit, Input } from '@angular/core';
import {
  faCalendarAlt,
  faAddressBook,
} from '@fortawesome/free-regular-svg-icons';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { GcConnectService } from 'src/app/services/gc-connect.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  faCalendarAlt = faCalendarAlt;
  faUserFriends = faUserFriends;
  faAddressBook = faAddressBook;

  @Input() user: any = '';
  constructor(private SQLservice: GcConnectService) {}

  ngOnInit(): void {}
}
