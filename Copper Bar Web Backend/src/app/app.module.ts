import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { PagesModule } from './routes/pages/pages.module'

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firebase, 'GuestList'),
        AngularFirestoreModule,
        AngularFireDatabaseModule,
        HttpModule,
        BrowserAnimationsModule, // required for ng2-tag-input
        CoreModule,
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        PagesModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
