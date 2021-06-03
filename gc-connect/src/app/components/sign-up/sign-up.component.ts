import { Component, OnInit } from '@angular/core';
import { NgAuthService } from '../../services/ng-auth.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  emailPlaceholder: string = 'EMAIL';

  queryParams: Params | undefined;

  constructor(
    public ngAuthService: NgAuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.getQueryParams();
  }

  ngOnInit(): void {}

  // Store query parameter values on URL changes
  getQueryParams() {
    // Query parameters
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
  }
}
