export class EventTime{
    id: string;
    start_time: string;
    end_time: string;
}
export class Calc{
    start_count?:number;
    start_unit?:number;
    start_marker?:string;
    end_count?:number;
    end_unit?:number;
    end_marker?:string;
}
export class TicketType{
    price:number;
    class:string;
    quantity:number;
    calc: Calc
}
export class Event {
    cover: {
        offset_x: number;
        offset_y: number;
        source: string;
        id: string;
    };
    description: string;
    event_times?: EventTime[];
    end_time: string;
    name: string;
    start_time: string;
    id: string;
    ticketTypes?:TicketType[]
}