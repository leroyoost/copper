import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
  
})
export class AccountComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  constructor() { 
    this.bsConfig = Object.assign({}, {containerClass: "theme-blue", showWeekNumbers:false});
  }

  ngOnInit() {
  }

}
