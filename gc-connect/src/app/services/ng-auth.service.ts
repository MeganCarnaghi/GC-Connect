import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { GcConnectService } from './gc-connect.service';

@Injectable({
  providedIn: 'root',
})
export class NgAuthService {
  static userState: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private SQLservice: GcConnectService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        NgAuthService.userState = user;
        localStorage.setItem('user', JSON.stringify(NgAuthService.userState));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  static loadUserState() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.userState = JSON.parse(stored);
    }
  }

  SignIn(email: any, password: any) {
    this.afAuth
      .setPersistence('session')
      .then(() => {
        this.afAuth
          .signInWithEmailAndPassword(email, password)
          .then((result) => {
            this.ngZone.run(() => {
              this.router.navigate(['profile']);
            });
            this.SetUserData(result.user);
            // this.SQLservice.updateUserUID(result.user?.email, result.user?.uid);
            console.log(result.user);
          });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SignUp(email: any, password: any) {
    // check against users table if email exists, if not alert "not authorized, please contact your admin"
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData(result.user);
        // when create a way to add approved emails/users then turn on these comments
        // this.SQLservice.updateUserUID(result.user?.email, result.user?.uid);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['email-verification']);
      });
  }

  ForgotPassword(passwordResetEmail: any) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'Password reset email has been sent. Please check your inbox.'
        );
        this.router.navigate(['sign-in']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  get isLoggedIn(): any {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      return user !== null && user.emailVerified !== false ? true : false;
    }
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userState: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userState, {
      merge: true,
    });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
