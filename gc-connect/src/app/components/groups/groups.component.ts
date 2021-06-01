import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: any | null = null;

  constructor(private SQLservice: GcConnectService) { }

  ngOnInit(): void {
    this.SQLservice.getAllGroups().subscribe(group => this.groups = group );
  }

}
