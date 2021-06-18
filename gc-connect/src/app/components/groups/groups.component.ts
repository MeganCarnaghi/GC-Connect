import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgAuthService } from 'src/app/services/ng-auth.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  groups: any | null = null;
  uid: any | null = null;
  userGroups: any | null = null;
  faPlus = faPlus;
  faSearch = faSearch;

  public searchFilter: any = '';
  query: any;

  constructor(private SQLservice: GcConnectService, private NgAuthService: NgAuthService, ) {}

  ngOnInit(): void {

    this.uid = NgAuthService.userState.uid;

    this.SQLservice.getAllGroupsWithUserJoinInfo(this.uid).subscribe((group) => {
      this.groups = group;
    });

  }

  joinGroup(groupId: any){

    this.SQLservice.addUserToGroupReturnGroups(this.uid, groupId).subscribe(data => this.groups = data);

  }

}
