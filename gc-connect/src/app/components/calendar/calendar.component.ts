import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { environment } from '../../../environments/environment';
import bootstrapPlugin from '@fullcalendar/bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements AfterViewInit {
  calendarHeight = 0;

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
        end: 'dayGridMonth,dayGridWeek,dayGridDay',
      },
      height:
        window.innerWidth <= 768
          ? (this.calendarHeight = window.innerHeight - 140)
          : (this.calendarHeight = window.innerHeight - 60),
      plugins: [
        googleCalendarPlugin,
        dayGridPlugin,
        listPlugin,
        bootstrapPlugin,
      ],
      handleWindowResize: true,
      windowResize: function () {
        let calendarHeight = 0;
        if (window.innerWidth <= 768) {
          calendarHeight = window.innerHeight - 140;
        } else {
          calendarHeight = window.innerHeight - 60;
        }
        calendar.setOption('height', calendarHeight);
      },

      googleCalendarApiKey: 'AIzaSyCKRYZ_1cqytLIn4R8YlqrKo6Ha9hdUIv4',
      eventSources: [
        {
          googleCalendarId:
            'c_619crt1ebto70ujnpp3m8v6i2g@group.calendar.google.com',
          className: 'gc-connect-master',
          color: '#e0693d',
        },
        {
          googleCalendarId:
            'c_lg99su7t0ag5673nm4o76624j0@group.calendar.google.com',
          className: 'after-hours-front-end',
          color: '#7a324a',
        },
        {
          googleCalendarId:
            'c_04i292nr3gd4vran0ho1ush71c@group.calendar.google.com',
          className: 'career-services',
          color: '#05d0cd',
        },
        {
          googleCalendarId:
            'c_ekacd1flhrlsm6pimnkop984jc@group.calendar.google.com',
          className: 'after-hours-full-stack-c#-net',
          color: '#8E24AA',
        },
        {
          googleCalendarId:
            'c_seuh6h8gpbn134dvbi2kdufv20@group.calendar.google.com',
          className: 'after-hours-full-stack-javascript',
          color: '#B39EDB',
        },
        {
          googleCalendarId:
            'c_42rkph0dq3jvd8vhg9k4ivk634@group.calendar.google.com',
          className: 'full-stack-c#-net',
          color: '#3F50B5',
        },
        {
          googleCalendarId:
            'c_jmiuucoiar8lb6ghbr8e1c1q2s@group.calendar.google.com',
          className: 'full-stack-javascript',
          color: '#4285F4',
        },
        {
          googleCalendarId:
            'c_bf16562pc9clsip4ddmfuhas1o@group.calendar.google.com',
          className: 'lgbtq-group',
          color: '#0B8043',
        },
      ],
    });
    console.log(calendar);

    calendar.render();
  }
}
