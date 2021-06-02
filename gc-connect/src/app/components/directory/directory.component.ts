import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  users: any | null = null;

  constructor(private SQLservice: GcConnectService) { }

  ngOnInit(): void {
    this.SQLservice.getAllUsers().subscribe(user => this.users = user );
  }

}
