import { Component, OnInit } from '@angular/core';
import { NgAuthService } from '../../services/ng-auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  constructor(
    public ngAuthService: NgAuthService,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  signInWithGoogle() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(googleAuthProvider);
  }
}
