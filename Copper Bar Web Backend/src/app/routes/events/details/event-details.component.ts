import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EventService } from '../event.service';
import { SettingsService } from  '../../../core/settings/settings.service';
import { Event } from '../event';
import * as _ from 'underscore'
import { AngularFirestore } from 'angularfire2/firestore'

const swal = require('sweetalert');


  @Component({
      selector: 'event-details',
      templateUrl: './event-details.component.html',
      styleUrls: ['../event.component.scss'],
      providers: [
        EventService,
        SettingsService
      ]
  })
  
  export class EventDetailsComponent implements OnInit {
    event:any
    guestlist:any
    userFilter:any
    key: string = 'name'; //set default
    reverse: boolean = false;
    constructor(
      private route: ActivatedRoute,
      private eventService: EventService
    ) {}

    sort(key){
      this.key = key;
      this.reverse = !this.reverse;
      console.log(this.reverse)
    }
     
    ngOnInit() {
      this.userFilter = ""
     this.route.paramMap.subscribe((output:any)=>{
       if (output){
         console.log(output.params)
         var id = output.params.id
         this.eventService.getEventDetails(id)
          .subscribe((result:any)=>{
            this.event = result
            console.log(result.id)
          },
            err=>console.log(err)
          )
          this.guestlist = this.eventService.getGuestlist(id)
        }
      })
    }
  }