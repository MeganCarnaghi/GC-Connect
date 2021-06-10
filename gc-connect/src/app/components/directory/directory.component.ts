import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  users: any | null = null;
  currentUser: any | null = null;
  faSearch = faSearch;
  faArrowRight = faArrowRight;
  displayDetails: boolean = false;

  constructor(private SQLservice: GcConnectService) { }

  ngOnInit(): void {
    this.SQLservice.getAllUsers().subscribe(user => this.users = user );
  }

  onUserSelect(user: any){
    this.currentUser = user;
    this.displayDetails = true;
  }

  onClose(event: any){
    this.displayDetails = false;

  }

}
