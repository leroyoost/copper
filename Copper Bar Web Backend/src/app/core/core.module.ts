import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { MenuService } from './menu/menu.service';
import { SharedModule } from '../shared/shared.module';

import { throwIfAlreadyLoaded } from './module-import-guard';


@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        SettingsService,
        ThemesService,
        MenuService,
    ],
    declarations: [
    ],
    exports: [
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
