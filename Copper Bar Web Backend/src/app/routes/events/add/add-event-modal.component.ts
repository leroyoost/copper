import { Component, OnInit, ViewChild} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { EventService } from '../event.service';
import { SettingsService } from  '../../../core/settings/settings.service';
import { Event } from '../event';
import * as _ from 'underscore'
import { AngularFirestore } from 'angularfire2/firestore'

const swal = require('sweetalert');


  @Component({
      selector: 'add-event-modal',
      templateUrl: './add-event-modal.component.html',
      styleUrls: ['../event.component.scss'],
      providers: [
        EventService,
        SettingsService
      ]
  })

  export class AddEventComponent implements OnInit {

    event : any
    eventList: Event[]
    constants: any
    calc: any
    
    constructor(
      private eventService: EventService, 
      public bsModalRef: BsModalRef, 
      public settingsService: SettingsService,
    ) 
    
    {
      eventService.getFb().then(response=>{
        this.eventList = response
        this.event = this.eventList[0]
      }, err=>{
        console.log(err)
      })
      //eventService.tickets.subscribe(output=>{console.log(JSON.stringify(output))})
    }

    public addTicketClass(){
      if(!this.event.ticketTypes){
        this.event.ticketTypes = []
      }
      this.event.ticketTypes.push({
        class:null,
        price: null,
        quantity: null,
        calc: {
          start_count:0,
          end_count:0
        }
      })
    }

    increment(index:number,inc:number,counter){
      console.log(index)
      console.log(this.event.ticketTypes[index])
      this.event.ticketTypes[index].calc[counter] = +this.event.ticketTypes[index].calc[counter] + +inc
    }

    public removeTicketClass(index){
      console.log(index)
      this.event.ticketTypes.splice(index,1)
    }

    public classChanged(ticket){
      ticket.price = 0.00
    }

    public createEvent(){
        this.eventService.createEvent(this.event)
    }
    ngOnInit() {
      
  }
  }