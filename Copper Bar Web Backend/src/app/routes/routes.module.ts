import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuService } from '../core/menu/menu.service';
import { SharedModule } from '../shared/shared.module';

//Models
import { menu } from './menu';
import { routes } from './routes';

//Components
import { EventComponent } from './events/event.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddEventComponent } from './events/add/add-event-modal.component';
import { EventDetailsComponent } from './events/details/event-details.component';

//Pipes
import { GuestlistComponent } from './events/guestlist/guestlist.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        EventComponent, 
        AccountComponent,
        DashboardComponent,
        AddEventComponent,
        EventDetailsComponent,
        GuestlistComponent
    ],

    entryComponents: [
        EventDetailsComponent,
        AddEventComponent
    ],
    exports: [
        RouterModule
    ],
    providers:[
    ]
})

export class RoutesModule {
    constructor(public menuService: MenuService) {
        menuService.addMenu(menu);
    }
}
