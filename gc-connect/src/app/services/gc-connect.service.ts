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

    return this.client.get(`http://localhost:3000/user/${uid}`);
  };

  getGroupById(group: any){
    let id = group.id;

    return this.client.get(`http://localhost:3000/group/${id}`);
  };

  getGroupPostsById(group: any){
    let id = group.id;

    return this.client.get(`http://localhost:3000/group-posts/${id}`);
  };

}