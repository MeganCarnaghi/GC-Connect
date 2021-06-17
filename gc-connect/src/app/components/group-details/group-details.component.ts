import { Component, Input, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { NgAuthService } from 'src/app/services/ng-auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css'],
})
export class GroupDetailsComponent implements OnInit {
  uid: any = null;
  userGroups: any | null;
  group: any | null = null;
  groupPosts: any | null = null;
  subscription: any;
  subscription2: any;
  currentUser: any | null = null;
  displayDetails: boolean = false;
  groupMember: any;
  faEdit = faEdit;
  faPlus = faPlus;
  faTrash = faTrash;
  commentForm = this.formbuilder.group({
    comment: '',
  });
  userStateId: string = '';
  isShown: boolean = false;

  @Input() user: any = '';

  constructor(
    private SQLservice: GcConnectService,
    private NgAuthService: NgAuthService,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit(): void {

    this.uid = NgAuthService.userState.uid;

    this.subscription = this.route.paramMap
      .pipe(switchMap((p) => this.SQLservice.getGroupById(p?.get('id'))))
      .subscribe((group) => (this.group = group));


    this.checkIfUserIsGroupMember();

    this.getComments();
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  getComments() {
    this.subscription2 = this.route.paramMap
      .pipe(switchMap((p) => this.SQLservice.getGroupPostsById(p?.get('id'))))
      .subscribe((posts) => (this.groupPosts = posts));

    return this.groupPosts;
  }

  checkIfUserIsGroupMember(){
 
    this.route.paramMap.pipe(switchMap(p => this.SQLservice.getCheckIfGroupMember(p?.get('id'), this.uid))).subscribe(data => this.groupMember = data);
    
  }

  getGroupsJoinedByUser(){
    let uid = NgAuthService.userState.uid;

    try{
      this.SQLservice.getGroupsJoinedByUID(uid).subscribe(data => this.userGroups = data);
    } catch{
      this.userGroups = [{}];
    }
  }


  joinLeaveGroup(groupId: any){

    if( this.groupMember === true ){
      this.leaveGroup(groupId);
    } else if ( this.groupMember === false ){
      this.joinGroup(groupId);
    }

  }

  joinGroup(groupId: any){
    this.SQLservice.addUserToGroup(this.uid, groupId).subscribe();
    this.groupMember = true;
  }

  leaveGroup(groupId: any){
    this.SQLservice.deleteUserFromGroup(this.uid, groupId).subscribe();
    this.groupMember = false;
  }


  postComment(comment: any){
    let uid = NgAuthService.userState.uid;
    let groupId = this.group.id;
    
    this.SQLservice.addPostToGroup(uid, groupId, comment).subscribe(posts => this.groupPosts = posts);

    this.commentForm.reset();
  }

  getUser() {
    // assign "user" to the logged in user

    if (!this.userStateId) {
      this.userStateId = NgAuthService.userState.uid;
    }
    this.SQLservice.getUserByUid(this.userStateId).subscribe(
      (user) => (this.user = user)
    );
    
    console.log(this.user);
    this.getDeleteButton();
  }

  onUserSelect(userId: any) {
    this.SQLservice.getUserById(userId).subscribe(user => this.currentUser = user);
    this.displayDetails = true;
  }

  onClose(event: any) {
    this.displayDetails = false;
  }


  getDeleteButton() {
    this.isShown = true;
  }

  deleteComment(i: any) {
    console.log('clicked!', this.groupPosts[i].id);
    let deletedComment = this.groupPosts[i].id;
    this.SQLservice.removePost(deletedComment);
    window.location.reload();
  }
}
