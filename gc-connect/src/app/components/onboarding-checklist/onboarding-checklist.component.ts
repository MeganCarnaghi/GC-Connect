import { Component, OnInit, Input } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { NgAuthService } from '../../services/ng-auth.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-onboarding-checklist',
  templateUrl: './onboarding-checklist.component.html',
  styleUrls: ['./onboarding-checklist.component.css'],
})
export class OnboardingChecklistComponent implements OnInit {
  userStateId: any;
  slackCheckbox: boolean = false;
  tuitionCheckbox: boolean = false;
  surveyCheckbox: boolean = false;
  profileCheckbox: boolean = false;
  lmsCheckbox: boolean = false;
  zoomCheckbox: boolean = false;
  calendarCheckbox: boolean = false;
  csCheckbox: boolean = false;
  groupsCheckbox: boolean = false;
  @Input() user: any = '';
  tasks: any;

  constructor(
    private SQLservice: GcConnectService,
    public ngAuthService: NgAuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.userStateId) {
      this.userStateId = NgAuthService.userState.uid;
      console.log(this.userStateId);
    }
    this.SQLservice.getUserByUid(this.userStateId).subscribe(
      (user) => (this.user = user)
    );

    this.SQLservice.getOnboardingTasksById(this.userStateId).subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.slackCheckbox = tasks.setup_slack;
        this.tuitionCheckbox = tasks.pay_tuition;
        this.surveyCheckbox = tasks.gtky_survey;
        this.profileCheckbox = tasks.create_profile;
        this.lmsCheckbox = tasks.check_lms;
        this.zoomCheckbox = tasks.mark_zoom;
        this.calendarCheckbox = tasks.check_calendar;
        this.csCheckbox = tasks.career_services;
        this.groupsCheckbox = tasks.explore_groups;
      }
    );
  }

  //HENRY's MAGICAL ANSWER
  // updateCheckbox(box: any) {
  //   this[box]=!this[box]
  // }

  updateSlackCheckbox() {
    this.slackCheckbox = !this.slackCheckbox;
    let userChoice: Object = {
      setup_slack: this.slackCheckbox,
    };
    this.SQLservice.setupSlack(this.user.id, userChoice).subscribe((data) => {
      console.log(data);
    });
  }

  updateTuitionCheckbox() {
    this.tuitionCheckbox = !this.tuitionCheckbox;

    let userChoice: Object = {
      pay_tuition: this.tuitionCheckbox,
    };
    this.SQLservice.payTuition(this.user.id, userChoice).subscribe((data) => {
      console.log(data);
    });
  }

  updateSurveyCheckbox() {
    this.surveyCheckbox = !this.surveyCheckbox;

    let userChoice: Object = {
      gtky_survey: this.surveyCheckbox,
    };
    this.SQLservice.completeSurvey(this.user.id, userChoice).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }

  updateProfileCheckbox() {
    this.profileCheckbox = !this.profileCheckbox;

    let userChoice: Object = {
      create_profile: this.profileCheckbox,
    };
    this.SQLservice.completeProfile(this.user.id, userChoice).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }

  updateLmsCheckbox() {
    this.lmsCheckbox = !this.lmsCheckbox;

    let userChoice: Object = {
      check_lms: this.lmsCheckbox,
    };
    this.SQLservice.exploreLms(this.user.id, userChoice).subscribe((data) => {
      console.log(data);
    });
  }

  updateZoomCheckbox() {
    this.zoomCheckbox = !this.zoomCheckbox;

    let userChoice: Object = {
      mark_zoom: this.zoomCheckbox,
    };
    this.SQLservice.bookmarkZoom(this.user.id, userChoice).subscribe((data) => {
      console.log(data);
    });
  }

  updateCalendarCheckbox() {
    this.calendarCheckbox = !this.calendarCheckbox;

    let userChoice: Object = {
      check_calendar: this.calendarCheckbox,
    };
    this.SQLservice.checkCalendar(this.user.id, userChoice).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }

  updateCsCheckbox() {
    this.csCheckbox = !this.csCheckbox;

    let userChoice: Object = {
      career_services: this.csCheckbox,
    };
    this.SQLservice.checkCareerServices(this.user.id, userChoice).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }

  updateGroupsCheckbox() {
    this.groupsCheckbox = !this.groupsCheckbox;

    let userChoice: Object = {
      explore_groups: this.groupsCheckbox,
    };
    this.SQLservice.exploreGroups(this.user.id, userChoice).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }
}
