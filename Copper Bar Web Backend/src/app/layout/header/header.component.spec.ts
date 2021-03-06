/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';

describe('Component: Header', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MenuService, SettingsService]
        }).compileComponents();
    });

    it('should create an instance', async(inject([MenuService, SettingsService], (menuService, settingsService) => {
        let component = new HeaderComponent(menuService, settingsService);
        expect(component).toBeTruthy();
    })));
});
