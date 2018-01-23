import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { FacebookModule } from 'ngx-facebook';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FlotDirective } from './directives/flot/flot.directive';
import { SparklineDirective } from './directives/sparkline/sparkline.directive';
import { EasypiechartDirective } from './directives/easypiechart/easypiechart.directive';
import { ColorsService } from './colors/colors.service';
import { CheckallDirective } from './directives/checkall/checkall.directive';
import { VectormapDirective } from './directives/vectormap/vectormap.directive';
import { NowDirective } from './directives/now/now.directive';
import { ScrollableDirective } from './directives/scrollable/scrollable.directive';
import { JqcloudDirective } from './directives/jqcloud/jqcloud.directive';

//Pipes
import { OrderPipe } from '../shared/pipes/orderBy.pipe';
import { Ng2SearchPipe } from '../shared/pipes/filterBy.pipe';

// https://angular.io/styleguide#!#04-10
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AccordionModule.forRoot(),
        AlertModule.forRoot(),
        ButtonsModule.forRoot(),
        CarouselModule.forRoot(),
        CollapseModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        TabsModule.forRoot(),
        TimepickerModule.forRoot(),
        TooltipModule.forRoot(),
        ToasterModule,
        FacebookModule.forRoot()
    ],
    providers: [
        ColorsService,
        OrderPipe,
        Ng2SearchPipe
    ],
    declarations: [
        FlotDirective,
        SparklineDirective,
        EasypiechartDirective,
        CheckallDirective,
        VectormapDirective,
        NowDirective,
        ScrollableDirective,
        JqcloudDirective,
        OrderPipe,
        Ng2SearchPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AccordionModule,
        AlertModule,
        ButtonsModule,
        CarouselModule,
        CollapseModule,
        BsDatepickerModule,
        BsDropdownModule,
        ModalModule,
        PaginationModule,
        TabsModule,
        TimepickerModule,
        TooltipModule,
        ToasterModule,
        FlotDirective,
        SparklineDirective,
        EasypiechartDirective,
        CheckallDirective,
        VectormapDirective,
        NowDirective,
        ScrollableDirective,
        JqcloudDirective,
        OrderPipe,
        Ng2SearchPipe
    ]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}
