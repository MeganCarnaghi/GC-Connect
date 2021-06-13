import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { NgAuthService } from 'src/app/services/ng-auth.service';
import { FormBuilder } from '@angular/forms';

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
  commentForm = this.formbuilder.group({
    comment: ''
  });

  constructor(
    private SQLservice: GcConnectService, 
    private NgAuthService: NgAuthService, 
    private route: ActivatedRoute,
    private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(switchMap(p => this.SQLservice.getGroupById(p?.get('id')))).subscribe(group => this.group = group);

    this.getComments();
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  getComments(){
    this.subscription2 = this.route.paramMap.pipe(switchMap(p => this.SQLservice.getGroupPostsById(p?.get('id')))).subscribe(posts => this.groupPosts = posts);
  }

  postComment(comment: any){
    let uid = NgAuthService.userState.uid;
    let groupId = this.group.id;
    
    this.SQLservice.addPostToGroup(uid, groupId, comment);
    
    this.getComments();
    window.location.reload();

    this.commentForm.reset();
  }


}
