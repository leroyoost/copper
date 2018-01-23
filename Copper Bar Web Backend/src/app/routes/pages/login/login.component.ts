import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { FacebookService, InitParams } from 'ngx-facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

declare var FB: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

    public alerts: any = [];
    public that:any = this

    constructor(
        public settings: SettingsService, 
        private builder: FormBuilder,
        private fb: FacebookService,
        private router: Router,
        private injector: Injector,
        public afAuth: AngularFireAuth)
        {
    }
    
    facebookLogin(){
        this.fb.login().then(loginRes=>{console.log(loginRes)},loginErr=>{console.log(loginErr)})
    }

    ngOnInit() {
        
        console.log(FB)
    }
            
}
