import { Component, OnInit } from '@angular/core';
import {
  faCalendarAlt,
  faAddressBook,
} from '@fortawesome/free-regular-svg-icons';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  faCalendarAlt = faCalendarAlt;
  faUserFriends = faUserFriends;
  faAddressBook = faAddressBook;
  constructor() {}

  ngOnInit(): void {}
}