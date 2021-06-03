import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements AfterViewInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
  };

  @ViewChild('calendar') calendar: any;

  constructor() {}

  ngAfterViewInit(): void {
    if (!this.calendar) {
      return;
    }
    console.log(this.calendar);

    let calendar = new Calendar(this.calendar.element.nativeElement, {
      plugins: [googleCalendarPlugin],
      googleCalendarApiKey: '',
      events: {
        googleCalendarId: '',
      },
    });
    console.log(calendar);

    calendar.render();
  }
}
