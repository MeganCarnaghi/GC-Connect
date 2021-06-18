import { Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-career-services',
  templateUrl: './career-services.component.html',
  styleUrls: ['./career-services.component.css'],
})
export class CareerServicesComponent implements OnInit {
  faEnvelope = faEnvelope;
  faCalendarAlt = faCalendarAlt;

  constructor() {}

  ngOnInit(): void {}
}
