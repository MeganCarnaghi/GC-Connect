import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  group: any | null = null;
  groupPosts: any | null = null;
  subscription: any;
  subscription2: any;
  faEdit = faEdit;
  faPlus = faPlus;

  constructor(private SQLservice: GcConnectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(switchMap(p => this.SQLservice.getGroupById(p?.get('id')))).subscribe(group => this.group = group);

    this.subscription2 = this.route.paramMap.pipe(switchMap(p => this.SQLservice.getGroupPostsById(p?.get('id')))).subscribe(posts => this.groupPosts = posts);
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
