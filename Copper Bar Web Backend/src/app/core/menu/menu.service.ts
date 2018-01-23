import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore'
import * as firebase from 'firebase'
import * as _ from 'underscore'

@Injectable()
export class MenuService {

    menuItems: Array<any>;
    Events: any;

    constructor(
        private afs: AngularFirestore
    ) {
        this.menuItems = [];
        this.Events = {
            text: 'Events',
            icon: 'icon-list',
            submenu: []
        };
        var that = this
        this.afs.collection('events').valueChanges()
            .subscribe(result=>{
                if(result){
                    var tracker = {}
                    _.map(result,function(event:any){
                        var entryExists = _.findIndex(that.Events.submenu, function(searchEvent:any){ return searchEvent.name = event.name});
                        if (entryExists == -1){
                            that.Events.submenu.push({
                                text: event.name,
                                icon: 'icon-social-facebook',
                                submenu: [
                                    {   text: event.start_time,
                                        link: "/events/details/" + event.id,
                                        icon: "icon-calendar"
                                    }
                                ]
                            })
                            console.log(entryExists)
                        }
                        else{
                            var eventPosition = _.findIndex(that.Events.submenu, function(searchEvent:any){ return searchEvent.name = event.name});
                            console.log("eventPosition: " + eventPosition + " | " + event.name)
                            var foundEvent = that.Events.submenu[eventPosition]
                            that.Events.submenu[eventPosition].submenu.push({
                                text: event.start_time,
                                link: "/events/details/" + event.id,
                                icon: "icon-calendar"
                            })
                        }
                    })
                    this.menuItems.push(that.Events)
                    console.log(that.Events)
                }
            },
            err=>console.log(err)
        )
        
    }

    addMenu(items: Array<{
        text: string,
        heading?: boolean,
        link?: string,     // internal route links
        elink?: string,    // used only for external links
        target?: string,   // anchor target="_blank|_self|_parent|_top|framename"
        icon?: string,
        alert?: string,
        submenu?: Array<any>
    }>) {
        items.forEach((item) => {
            this.menuItems.push(item);
        });
    }

    getMenu() {
        return this.menuItems;
    }

}
