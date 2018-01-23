const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('underscore')
var https = require('https');
var querystring = require('querystring');


admin.initializeApp(functions.config().firebase);

exports.newUser = functions.auth.user().onCreate(event=>{
    var db = admin.firestore();
    const user = event.data
    console.log(user)
    return new Promise((resolve,reject) => {db.collection("vip").where("email", "==", user.email).get().then(
        querySnapshot=>{
            querySnapshot.forEach(function(record) {
                const vipRecord = record.data()
                return db.doc('users/' + user.uid).set({
                    name: vipRecord.name,
                    surname: vipRecord.surname,
                    email: vipRecord.email,
                    phone: "",
                    tickets: 6,
                    vip: true
                }).then(
                    response=>{
                        db.doc("vip/" + record.id).update({new:false}).then(
                            response=>{
                                console.log(response)
                                resolve(response)
                            },
                            err=>{
                                console.log(err)
                                reject(err)
                            }
                        )
                    },
                    err=>{
                        console.log(err)
                        reject(err)
                    }
                )
            })
        },
        err=>{
            console.log(err)
            reject(err)
        })
    })
})

exports.scanTicket = functions.https.onRequest((req,res)=>{
    var db = admin.firestore();
    if(req.query.ticketId){
        console.log("ticketId valid")
        db.doc('tickets/'+req.query.ticketId).update({status:"scanned"}).then(response=>{
            console.log("write successful")
            res.send(response)
        }, 
        err=>{
            res.send(err)
        })
    }
})

exports.createTicket = functions.firestore
.document('tickets/{ticketId}')
.onCreate(ticket => {
    var ticketData = ticket.data.data();
    var db = admin.firestore();
    
    return new Promise ((reject, resolve)=>{
        db.doc('tickets/' + ticket.data.id).update({
            shareUrl: "https://guestlist-3fe81.firebaseapp.com/share_ticket?ticket_ref=" + ticket.data.id,
            id: ticket.data.id
        }).then(response=>{
            resolve(response)
        },
        err=>{
            reject(err)
        })
    })
})

exports.createEvent = functions.firestore
.document('events_staging/{wildcard}')
.onCreate(event => {
    var eventData = event.data.data();
    var db = admin.firestore();
    var batch = db.batch();
    console.log("onCreate event fired, processing data...");

    var ticketOpen = null
    var ticketClose = null

    function calcTicketTypes(start,end){
        console.log("calculating ticket sales times...")
        var newTicketTypes = []
        _.map(eventData.ticketTypes,function(ticketType){
            console.log(ticketType)
            var startMarker = (ticketType.calc.start_marker === "Event Starts")? start : end
            var startOffset = ticketType.calc.start_unit * ticketType.calc.start_count
            var endMarker = (ticketType.calc.end_marker === "Event Starts")? start : end
            var endOffset = ticketType.calc.end_unit * ticketType.calc.end_count

            ticketType.sell_start = startMarker - startOffset
            ticketType.sell_end = endMarker - endOffset
            ticketType.eventId = eventData.id

            if(ticketOpen === null || ticketType.sell_start < ticketOpen){ticketOpen = ticketType.sell_start}
            if(ticketClose === null || ticketType.sell_end > ticketClose){ticketClose = ticketType.sell_end}
            
            newTicketTypes.push(ticketType);
        })
        return newTicketTypes
    };

    function recurringEvent (){
        console.log("recurring event, parsing start and end dates...")
        _.map(eventData.event_times,function(eventTimeObj){
            console.log(eventData.cover)
            var intStartTime = Date.parse(eventTimeObj.start_time);
            var intEndTime = Date.parse(eventTimeObj.end_time);

            var newEventObj = {
                "id": eventTimeObj.id,
                "name": eventData.name,
                "description": eventData.description,
                "img": eventData.cover.source,
                "start_time": intStartTime,
                "end_time": intEndTime,
                "ticketTypes": calcTicketTypes(intStartTime,intEndTime),
                "ticketOpen": ticketOpen,
                "ticketClose": ticketClose
                };

            var eventRef = db.collection('events').doc(eventTimeObj.id);
            batch.set(eventRef, newEventObj);
        })
    };

    function singleEvent (){
        console.log("one-off event, writing directly to db...")
        var intStartTime = Date.parse(eventData.start_time);
        var intEndTime = Date.parse(eventData.end_time);
        var newEventObj = {
            "name": eventData.name,
            "description": eventData.description,
            "img": eventData.cover.source,
            "start_time": intStartTime,
            "end_time": intEndTime,
            "ticketTypes": calcTicketTypes(intStartTime,intEndTime),
            "ticketOpen": ticketOpen,
            "ticketClose": ticketClose
        };
        var eventRef = db.collection('events').doc(eventData.id);
        batch.set(eventRef, newEventObj);

    };
    
    if(eventData.event_times && eventData.event_times.length > 0){recurringEvent()}
    else {singleEvent()}

    return new Promise ((resolve,reject)=>{
        batch.commit()
            .then(
                response=>{
                    console.log("successfull event write...")
                    console.log(response)
                    resolve(response)
                },
                err=>{
                    console.log("there was an error")
                    console.log(err)
                    reject(err)
                }  
            )
    })
})
