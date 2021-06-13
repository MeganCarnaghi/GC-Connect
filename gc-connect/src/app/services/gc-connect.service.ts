import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GcConnectService {
  constructor(private client: HttpClient) {}

  getAllUsers(){
    return this.client.get('http://localhost:3000/users');
  };

  getAllGroups(){
    return this.client.get('http://localhost:3000/groups');
  };

  getUserByUid(uid: any){
    return this.client.get(`http://localhost:3000/users/${uid}`);
  };

  getGroupById(id: any){
    return this.client.get(`http://localhost:3000/groups/${id}`);
  };

  getGroupPostsById(id: any){
    return this.client.get(`http://localhost:3000/group-posts/${id}`);
  };

  addPostToGroup(uid: any, groupId: any, comment: any){
    let post: Object = {
      uid: uid,
      group_id: groupId,
      comment: comment
    }

    return this.client.post(`http://localhost:3000/group-posts`, post).subscribe(data => {console.log(data)});

  }
  
  addFirebaseUser(email:any, uid:any){
    let newUser: Object = {
      firebase_uid: uid,
      email: email,
      authorized: false
    }

    return this.client.post(`http://localhost:3000/users`, newUser).subscribe(data => {console.log(data)});
  }

  updateUserUID(email: any, uid: any){
    
    let firebase_uid: Object = {
      firebase_uid: uid
    };

    return this.client.put(`http://localhost:3000/users/${email}`, firebase_uid ).subscribe(data => data);
  }

}