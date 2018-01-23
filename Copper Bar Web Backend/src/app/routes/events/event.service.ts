import { Injectable, Component} from '@angular/core';
import { SettingsService } from '../../core/settings/settings.service'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { FacebookService, InitParams } from 'ngx-facebook';
import * as firebase from 'firebase/app';
import { Event } from "./event";
import * as _ from 'underscore';

@Injectable()
export class EventService {
    
    event: Event;
    tickets:any//Observable<any>

    constructor(
        public settings: SettingsService,
        public db: AngularFirestore, 
        private fb: FacebookService
    ){
        this.tickets = {
            "units":[
            {"name":"Weeks","value":60*1000*60*24*7},
            {"name":"Days","value":60*1000*60*24},
            {"name":"Hours","value":60*1000*60},
            {"name":"Minutes","value":60*1000}
            ],
            "types":[
                "VIP Early Bird",
                "Early Bird",
                "Standard",
                "VIP"
            ],
            "markers":[
                "Event Starts",
                "Event Ends"
            ]
        }
        //db.collection('constants').doc('tickets').valueChanges()
     }

    public getFb():Promise<Event[]>{
        return this.fb.getLoginStatus()
        .then(response=>{
            console.log(response)
        return this.fb.api('1612587585669573/events','get',{"fields":"cover,description,event_times,end_time,name,start_time"})
            .then(
                response=>{
                    if(response.data){
                        console.log(response.data)
                        return response.data
                    }
                },
                err=>{
                    console.log(err)
                    return err
                }
            )
        },err=>{
            console.log(err)
            return err
        })
    }

    public getEvents(){
        return this.db.collection('events').valueChanges()
    }
    
    getEventDetails(eid){
        return(this.db.collection('events').doc(eid).valueChanges())
    }

    getGuestlist(eid){
        console.log("getGustList fired: " + eid)
        var that = this
        return this.db.collection('tickets', ref => {
          let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          query = query.where('eventId', '==', eid);
          return query;
        }).valueChanges()
      }
    public createEvent(event) {
        event.status = 'Created'
        console.log(event)
        this.db.collection('events_staging').add(event)
            .then(response=>{
                console.log(response)
            },
                err=>{
                    console.log(err)
            })
    }
}
