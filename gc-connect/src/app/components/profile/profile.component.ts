import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { FilestackClient } from 'src/app/helpers.ts/filestack';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private SQLservice: GcConnectService) {}

  ngOnInit() {}

  async uploadFile() {
    const url = await FilestackClient.pick();
    console.log(url);
  }
}
