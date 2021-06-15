import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  groups: any | null = null;
  faPlus = faPlus;
  faSearch = faSearch;

  public searchFilter: any = '';
  query: any;

  constructor(private SQLservice: GcConnectService) {}

  ngOnInit(): void {
    this.SQLservice.getAllGroups().subscribe((group) => (this.groups = group));
  }
}
