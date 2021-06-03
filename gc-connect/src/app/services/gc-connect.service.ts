import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';

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

  getUserByUid(user: User){
    let uid = user.uid;

    return this.client.get(`http://localhost:3000/users/${uid}`);
  };

  getGroupById(group: any){
    let id = group.id;

    return this.client.get(`http://localhost:3000/groups/${id}`);
  };

  getGroupPostsById(group: any){
    let id = group.id;

    return this.client.get(`http://localhost:3000/group-posts/${id}`);
  };

  addNewUser(user: any){
    return this.client.post('http://localhost:3000/users',user);
  }

  updateUserUID(email: any, uid: any){
    
    let firebase_uid: Object = {
      firebase_uid: uid
    };

    return this.client.put(`http://localhost:3000/users/${email}`, firebase_uid ).subscribe(data => {console.log(data)});
  }

}