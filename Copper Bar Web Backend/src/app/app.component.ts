import { Component, HostBinding, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import { SettingsService } from './core/settings/settings.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
declare var $: any;
declare var FB: any;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.layout.isFixed; };
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.layout.isCollapsed; };
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.layout.isBoxed; };
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.layout.useFullLayout; };
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.layout.hiddenFooter; };
    @HostBinding('class.layout-h') get horizontal() { return this.settings.layout.horizontal; };
    @HostBinding('class.aside-float') get isFloat() { return this.settings.layout.isFloat; };
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.layout.asideToggled; };
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.layout.isCollapsedText; };

    constructor(
        public settings: SettingsService,
        private fb: FacebookService,
        private afAuth: AngularFireAuth
    ) {
    }

    private isUserEqual(facebookAuthResponse, firebaseUser) {
        console.log("privateUserEqual fired")
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
                providerData[i].uid === facebookAuthResponse.userID) {
                // We don't need to re-auth the Firebase connection.
                return true;
            }
            }
        }
        return false;
    }

    ngOnInit() {
        $(document).on('click', '[href="#"]', e => e.preventDefault());
        const fbInitParams: InitParams = {
            appId : '2003757269856019',
            cookie: true,
            version: 'v2.10'
        };
        this.fb.init(fbInitParams);
        FB.Event.subscribe('auth.authResponseChange', event=>{
            console.log("checkClockigState fired")
            console.log(this.afAuth.authState)
            if (event && event.authResponse) {
                // User is signed-in Facebook.
                var unsubscribe = this.afAuth.auth.onAuthStateChanged(firebaseUser=> {
                    unsubscribe();
                    // Check if we are already signed-in Firebase with the correct user.
                    if (!this.isUserEqual(event.authResponse, firebaseUser)) {
                        // Build Firebase credential with the Facebook auth token.
                        var credential = firebase.auth.FacebookAuthProvider.credential(event.authResponse.accessToken);
                        this.afAuth.auth.signInWithCredential(credential)
                        .then(
                            cbFirbase=>{
                                //login successful
                                console.log(cbFirbase)
                            },
                            errFirebase=>{
                                console.log(errFirebase)
                            }
                        )
                    }else{
                        console.log("User already signed into Firebase with correct credentials")
                    }
                })
            }else {
                // User is signed-out of Facebook.
                
            }
        });
    }
}
