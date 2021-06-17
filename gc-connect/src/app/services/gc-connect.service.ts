import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GcConnectService {
  constructor(private client: HttpClient) {}

  getAllUsers() {
    return this.client.get('http://localhost:3000/users');
  }

  getAllGroups() {
    return this.client.get('http://localhost:3000/groups');
  }

  getUserByUid(uid: any) {
    return this.client.get(`http://localhost:3000/users/${uid}`);
  }

  getGroupById(id: any) {
    return this.client.get(`http://localhost:3000/groups/${id}`);
  }

  getGroupPostsById(id: any) {
    return this.client.get(`http://localhost:3000/group-posts/${id}`);
  }

  addNewUser(user: any) {
    return this.client.post('http://localhost:3000/users', user);
  }
  addPostToGroup(uid: any, groupId: any, comment: any) {
    let post: Object = {
      uid: uid,
      group_id: groupId,
      comment: comment,
    };

    return this.client
      .post(`http://localhost:3000/group-posts`, post)
      .subscribe((data) => {
        console.log(data);
      });
  }

  addFirebaseUser(email: any, uid: any) {
    let newUser: Object = {
      firebase_uid: uid,
      email: email,
      authorized: false,
    };

    return this.client
      .post(`http://localhost:3000/users`, newUser)
      .subscribe((data) => {
        console.log(data);
      });
  }

  updateUserUID(email: any, uid: any) {
    let firebase_uid: Object = {
      firebase_uid: uid,
    };

    return this.client
      .put(`http://localhost:3000/users/${email}`, firebase_uid)
      .subscribe((data) => {
        console.log(data);
      });
  }

  updateProfile(
    id: any,
    userPhoto: any,
    userFirstName: any,
    userLastName: any,
    userBio: any,
    userBootcamp: any,
    userLinkedin: any,
    userGithub: any,
    userCalendly: any
  ) {
    let targetedUser: Object = {
      photo: userPhoto,
      first_name: userFirstName,
      last_name: userLastName,
      bio: userBio,
      bootcamp: userBootcamp,
      linked_in: userLinkedin,
      github: userGithub,
      calendly: userCalendly,
    };
    console.log(targetedUser);
    return this.client
      .put(`http://localhost:3000/users-profile/${id}`, targetedUser)
      .subscribe((data) => {
        console.log(data);
      });
  }

  removePost(id: any) {
    console.log('Deleted in service');
    return this.client
      .delete(`http://localhost:3000/group-comments/${id}`)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
