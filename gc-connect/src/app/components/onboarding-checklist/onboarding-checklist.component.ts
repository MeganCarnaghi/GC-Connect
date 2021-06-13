import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding-checklist',
  templateUrl: './onboarding-checklist.component.html',
  styleUrls: ['./onboarding-checklist.component.css'],
})
export class OnboardingChecklistComponent implements OnInit {
  slackCheckbox: boolean = false;
  tuitionCheckbox: boolean = false;
  surveyCheckbox: boolean = false;
  profileCheckbox: boolean = false;
  lmsCheckbox: boolean = false;
  zoomCheckbox: boolean = false;
  calendarCheckbox: boolean = false;
  csCheckbox: boolean = false;
  groupsCheckbox: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  updateSlackCheckbox() {
    this.slackCheckbox = !this.slackCheckbox;
  }

  updateTuitionCheckbox() {
    this.tuitionCheckbox = !this.tuitionCheckbox;
  }

  updateSurveyCheckbox() {
    this.surveyCheckbox = !this.surveyCheckbox;
  }

  updateProfileCheckbox() {
    this.profileCheckbox = !this.profileCheckbox;
  }

  updateLmsCheckbox() {
    this.lmsCheckbox = !this.lmsCheckbox;
  }

  updateZoomCheckbox() {
    this.zoomCheckbox = !this.zoomCheckbox;
  }

  updateCalendarCheckbox() {
    this.calendarCheckbox = !this.calendarCheckbox;
  }

  updateCsCheckbox() {
    this.csCheckbox = !this.csCheckbox;
  }

  updateGroupsCheckbox() {
    this.groupsCheckbox = !this.groupsCheckbox;
  }
}
