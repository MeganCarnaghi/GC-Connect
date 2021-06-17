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
  userGroups: any | null = null;
  faPlus = faPlus;
  faSearch = faSearch;

  public searchFilter: any = '';
  query: any;

  constructor(private SQLservice: GcConnectService, private NgAuthService: NgAuthService, ) {}

  ngOnInit(): void {

    this.SQLservice.getAllGroups().subscribe((group) => (this.groups = group));

    this.getGroupsJoinedByUser();

  }

  getGroupsJoinedByUser(){
    let uid = NgAuthService.userState.uid;

    try{
      this.SQLservice.getGroupsJoinedByUID(uid).subscribe(data => this.userGroups = data);
    } catch{
      this.userGroups = [{}];
    }
    

  }

  checkIfGroupMember(groupId: any){
    let groupList = this.userGroups;
    
    for (let group of groupList){
        if (groupId === group.group_id){
          return true;
        }
    }

    return false;
  }

  joinGroup(groupId: any){
    let uid = NgAuthService.userState.uid;

    this.SQLservice.addUserToGroup(uid, groupId).subscribe(data => this.userGroups = data);
  }

}
