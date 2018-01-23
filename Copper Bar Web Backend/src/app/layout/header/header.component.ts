import { Component, OnInit, ViewChild } from '@angular/core';
const screenfull = require('screenfull');
const browser = require('jquery.browser');
declare var $: any;

import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    navCollapsed = true; // for horizontal layout
    menuItems = []; // for horizontal layout

    @ViewChild('fsbutton') fsbutton;  // the fullscreen button

    constructor(
        public menu: MenuService, 
        public settings: SettingsService
    ) {

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0,4); // for horizontal layout

    }

    ngOnInit() {
        if (browser.msie) { // Not supported under IE
            this.fsbutton.nativeElement.style.display = 'none';
        }
    }

    toggleCollapsedSideabar() {
        this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
    }

    isCollapsedText() {
        return this.settings.layout.isCollapsedText;
    }

    toggleFullScreen(event) {

        if (screenfull.enabled) {
            screenfull.toggle();
        }
        // Switch icon indicator
        let el = $(this.fsbutton.nativeElement);
        if (screenfull.isFullscreen) {
            el.children('em').removeClass('fa-expand').addClass('fa-compress');
        }
        else {
            el.children('em').removeClass('fa-compress').addClass('fa-expand');
        }
    }
}
