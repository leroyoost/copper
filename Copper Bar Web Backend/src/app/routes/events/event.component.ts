import { Component, OnInit } from '@angular/core';
import { Event } from './event'
import { EventService } from './event.service';
import { SettingsService } from '../../core/settings/settings.service'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { EventDetailsComponent } from '../events/details/event-details.component'
import { AddEventComponent } from './add/add-event-modal.component'
import { AngularFireList } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  providers: [EventService]
})
export class EventComponent implements OnInit {

  public config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  }
  events: Event[]
  DetailsModalRef: BsModalRef;
  AddModalRef: BsModalRef;
  eventList: Observable<{}[]>;

  constructor(
    private eventService: EventService, 
    private modalService: BsModalService,
    private settings: SettingsService
  ) {
    this.eventList = this.eventService.getEvents();
  }

  public addEventModal(){
    this.AddModalRef = this.modalService.show(AddEventComponent,Object.assign({}, this.config, {class: 'modal-lg'}));
  }

  public eventDetailsModal(event:Event) {
      console.log('deatilsModal Launched')
      this.DetailsModalRef = this.modalService.show(EventDetailsComponent,Object.assign({}, this.config, {class: 'modal-lg'}));
      this.DetailsModalRef.content.event = event
  }

  ngOnInit(): void {
  }

}
