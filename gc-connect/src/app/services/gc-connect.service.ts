import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GcConnectService {
  constructor(private client: HttpClient) {}

  // *** GET ROUTES ***

  // User Gets
  getAllUsers() {
    return this.client.get('http://localhost:3000/users');
  }

  getUserByUid(uid: any) {
    return this.client.get(`http://localhost:3000/users/${uid}`);
  }

  getUserById(id: any) {
    return this.client.get(`http://localhost:3000/users-id/${id}`);
  }

  // Group Gets
  getAllGroups() {
    return this.client.get('http://localhost:3000/groups');
  }

  getGroupById(id: any) {
    return this.client.get(`http://localhost:3000/groups/${id}`);
  }

  getAllGroupsWithUserJoinInfo(uid: any) {
    return this.client.get(`http://localhost:3000/groups-joined/${uid}`);
  }

  getGroupByIdAndUserJoin(groupId: any, uid: any) {
    return this.client.get(`http://localhost:3000/group-details/${groupId}?uid=${uid}`);
  }

  // Group Comments Get
  getGroupPostsById(id: any) {
    return this.client.get(`http://localhost:3000/group-posts/${id}`);

  }


  // *** POST ROUTES ***

  // User Posts
  
  addNewUser(user: any) {
     return this.client.post('http://localhost:3000/users', user);
  }


  createGroup(groupName: any, groupType: any, groupBio: any, groupPhoto: any) {
    console.log('received by service');
    let group: Object = {
      name: groupName,
      type: groupType,
      bio: groupBio,
      photo: groupPhoto,
    };
    return this.client.post(`http://localhost:3000/groups`, group);
  }


  addFirebaseUser(email: any, uid: any) {
    let newUser: Object = {
      firebase_uid: uid,
      email: email,
      authorized: false,
    };

    return this.client
      .post(`http://localhost:3000/users-uid`, newUser)
      .subscribe((data) => {
        console.log(data);
      });
  }

  // Group Comments Posts

  addPostToGroup(uid: any, groupId: any, comment: any) {
    let post: Object = {
      uid: uid,
      group_id: groupId,
      comment: comment,
    };

    return this.client.post(`http://localhost:3000/group-posts`, post);
  }

  // Group Member Posts
  addUserToGroupReturnGroups(uid: any, groupId: any) {
    let group: Object = {
      group_id: groupId,
    };

    return this.client.post(`http://localhost:3000/group-members/groups/${uid}`, group);

  }

  addUserToGroupReturnGroup(uid: any, groupId: any) {
    let group: Object = {
      group_id: groupId
    };

    return this.client.post(`http://localhost:3000/group-members/group/${uid}`, group);
  }


  //  *** PUT ROUTES ***

  // User Puts
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



  // *** DELETE ROUTES ***

  // Group Member Delete
  deleteUserFromGroup(uid: any, groupId: number) {
    return this.client.delete(`http://localhost:3000/group-members/${uid}?groupId=${groupId}`);
  }

  // Group Comment Delete
  removePost(id: any, groupId:any) {
    console.log('Deleted in service');
    return this.client
      .delete(`http://localhost:3000/group-comments/${id}?groupId=${groupId}`);
  }

  getOnboardingTasksById(uid: any): Observable<any> {
    return this.client.get(
      `http://localhost:3000/user-onboarding-tasks/${uid}`
    );
  }

  setupSlack(id: any, slackCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-slack/${id}`,
      slackCheckbox
    );
  }

  payTuition(id: any, tuitionCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-tuition/${id}`,
      tuitionCheckbox
    );
  }

  completeSurvey(id: any, surveyCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-survey/${id}`,
      surveyCheckbox
    );
  }

  completeProfile(id: any, profileCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-profile/${id}`,
      profileCheckbox
    );
  }

  exploreLms(id: any, lmsCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-lms/${id}`,
      lmsCheckbox
    );
  }

  bookmarkZoom(id: any, zoomCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-zoom/${id}`,
      zoomCheckbox
    );
  }

  checkCalendar(id: any, calendarCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-calendar/${id}`,
      calendarCheckbox
    );
  }

  checkCareerServices(id: any, csCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-cs/${id}`,
      csCheckbox
    );
  }

  exploreGroups(id: any, exploreCheckbox: any) {
    return this.client.put(
      `http://localhost:3000/users-onboarding-groups/${id}`,
      exploreCheckbox
    );
  }
}
