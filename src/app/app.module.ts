import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToastrModule} from 'ngx-toastr';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {SidebarModule} from './shared/sidebar/sidebar.module';
import {FooterModule} from './shared/footer/footer.module';
import {NavbarModule} from './shared/navbar/navbar.module';
import {FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import {AppComponent} from './app.component';
import {AppRoutes} from './app.routing';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {TableDesignerFormComponent} from './pages/table-designer/table-designer-form/table-designer-form.component';
import {TableDesignerListComponent} from './pages/table-designer/table-designer-list/table-designer-list.component';
import {FormsModule} from '@angular/forms';
import {MenuDesignerListComponent} from './pages/menu-designer/menu-designer-list/menu-designer-list.component';
import {MenuDesignerFormComponent} from './pages/menu-designer/menu-designer-form/menu-designer-form.component';
import {LoginComponent} from './pages/login/login.component';
import {ListDesignerFormComponent} from './pages/list-designer/list-designer-form/list-designer-form.component';
import {ListDesignerListComponent} from './pages/list-designer/list-designer-list/list-designer-list.component';
import {ComponentDesignerListComponent} from './pages/component-designer/component-designer-list/component-designer-list.component';
import {ComponentDesignerFormComponent} from './pages/component-designer/component-designer-form/component-designer-form.component';
import {ViewDesignerListComponent} from './pages/view-designer/view-designer-list/view-designer-list.component';
import {ViewDesignerFormComponent} from './pages/view-designer/view-designer-form/view-designer-form.component';
import {ListComponent} from './pages/list/list/list.component';
import {NavigatorComponent} from './pages/navigator/navigator.component';
import {AppViewDesignerFormComponent} from './pages/appview-designer/app-view-designer-form/app-view-designer-form.component';
import {AppViewDesignerListComponent} from './pages/appview-designer/app-view-designer-list/app-view-designer-list.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DatePickerComponent} from './form-controlls/date-picker/date-picker.component';
import {NgbDateFRParserFormatter} from './form-controlls/date-picker/ngb-date-frparser-formatter';
import {NgbUTCStringAdapter} from './form-controlls/date-picker/ngb-utcstring-adapter';
import {SofiaDateDirective} from './directives/sofia-date.directive';
import {NgxMaskModule} from 'ngx-mask';
import {DatePipe} from '@angular/common';
import {UserFormComponent} from './pages/user/user-form/user-form.component';
import {UserListComponent} from './pages/user/user-list/user-list.component';
import {AuthenticationHeaderInterceptor} from './interceptors/authentication-header-interceptor';
import {HttpRequestLoadingInterceptor} from './interceptors/http-request-loading.interceptor';
import {HttpRequestErrorInterceptor} from './interceptors/http-request-error.interceptor';
import {ListSelectorComponent} from './form-controlls/list-selector/list-selector.component';
import {FormDesignerFormComponent} from './pages/form-designer/form-designer-form/form-designer-form.component';
import {FormDesignerListComponent} from './pages/form-designer/form-designer-list/form-designer-list.component';
import {FormDesignerFormToolBoxComponent} from './pages/form-designer/form-designer-form-tool-box/form-designer-form-tool-box.component';
import { FormComponent } from './pages/form/form.component';
import { NumericInputComponent } from './form-controlls/numeric-input/numeric-input.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    TableDesignerFormComponent,
    TableDesignerListComponent,
    MenuDesignerListComponent,
    MenuDesignerFormComponent,
    LoginComponent,
    ListDesignerFormComponent,
    ListDesignerListComponent,
    ComponentDesignerListComponent,
    ComponentDesignerFormComponent,
    ViewDesignerListComponent,
    ViewDesignerFormComponent,
    ListComponent,
    NavigatorComponent,
    AppViewDesignerFormComponent,
    AppViewDesignerListComponent,
    DatePickerComponent,
    SofiaDateDirective,
    UserFormComponent,
    UserListComponent,
    ListSelectorComponent,
    FormDesignerFormComponent,
    FormDesignerListComponent,
    FormDesignerFormToolBoxComponent,
    FormComponent,
    NumericInputComponent
  ],
    imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes),
        NgxMaskModule.forRoot(),
        SidebarModule,
        NavbarModule,
        ToastrModule.forRoot(),
        FooterModule,
        FixedPluginModule,
        FormsModule,
        HttpClientModule,
        NgbDatepickerModule,
        NgbModule
    ],
  providers: [
    DatePipe,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateFRParserFormatter
    },
    {
      provide: NgbDateAdapter,
      useClass: NgbUTCStringAdapter
    },
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationHeaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpRequestLoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpRequestErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
