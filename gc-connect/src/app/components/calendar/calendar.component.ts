import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

// let calendar = new Calendar(calendarEl, {
//   plugins: [googleCalendarPlugin],
//   googleCalendarApiKey: '',
//   events: {
//     googleCalendarId: '',
//   },
// });

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
  };

  constructor() {}

  ngOnInit(): void {}
}
