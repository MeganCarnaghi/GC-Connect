import { Component, OnInit } from '@angular/core';
import { GcConnectService } from 'src/app/services/gc-connect.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  group: any | null = null;
  subscription: any;

  constructor(private SQLservice: GcConnectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(switchMap(p => this.SQLservice.getGroupById(p?.get('id')))).subscribe(group => this.group = group);
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

}
