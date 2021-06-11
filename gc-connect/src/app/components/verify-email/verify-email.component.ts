import { Component, OnInit, Input } from '@angular/core';
import { NgAuthService } from '../../services/ng-auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  constructor(public ngAuthService: NgAuthService) {}

  get staticUserState() {
    return NgAuthService.userState.email;
  }

  ngOnInit(): void {}
}
