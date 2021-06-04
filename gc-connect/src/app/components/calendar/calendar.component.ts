import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';

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
      headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,dayGridWeek,dayGridDay,dayGridlist',
      },
      height: window.innerHeight - 60,
      plugins: [googleCalendarPlugin, dayGridPlugin, listPlugin],
      handleWindowResize: true,
      windowResize: function () {
        let calendarHeight = 0;
        if (window.innerWidth <= 768) {
          calendarHeight = window.innerHeight - 102;
        } else {
          calendarHeight = window.innerHeight - 60;
        }
        calendar.setOption('height', calendarHeight);
      },

      googleCalendarApiKey: 'AIzaSyCKRYZ_1cqytLIn4R8YlqrKo6Ha9hdUIv4',
      events: {
        googleCalendarId:
          'c_619crt1ebto70ujnpp3m8v6i2g@group.calendar.google.com',
      },
    });
    console.log(calendar);

    calendar.render();
  }
}
