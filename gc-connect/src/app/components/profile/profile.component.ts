import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { GcConnectService } from 'src/app/services/gc-connect.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  faUser = faUser;

  constructor(private SQLservice: GcConnectService) {}

  ngOnInit(): void {}
}
