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
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './pages/login/login.component';
import {ListComponent} from './pages/list/list/list.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DatePickerComponent} from './form-controlls/date-picker/date-picker.component';
import {NgbDateFRParserFormatter} from './form-controlls/date-picker/ngb-date-frparser-formatter';
import {NgbUTCStringAdapter} from './form-controlls/date-picker/ngb-utcstring-adapter';
import {SofiaDateDirective} from './directives/sofia-date.directive';
import {NgxMaskModule} from 'ngx-mask';
import {DatePipe} from '@angular/common';
import {AuthenticationHeaderInterceptor} from './interceptors/authentication-header-interceptor';
import {HttpRequestLoadingInterceptor} from './interceptors/http-request-loading.interceptor';
import {HttpRequestErrorInterceptor} from './interceptors/http-request-error.interceptor';
import {ListSelectorComponent} from './form-controlls/list-selector/list-selector.component';
import {FormComponent} from './pages/form/form/form.component';
import {NumericInputComponent} from './form-controlls/numeric-input/numeric-input.component';
import {VarcharInputComponent} from './form-controlls/varchar-input/varchar-input.component';
import {TextInputComponent} from './form-controlls/text-input/text-input.component';
import {FormTableComponent} from './pages/form/form/form-table/form-table.component';
import {DashboardComponent} from './pages/dashboard/dashboard/dashboard.component';
import {ChartComponent} from './pages/chart/chart.component';
import {InfoCardComponent} from './pages/info-card/info-card.component';
import {EmptyComponent} from './pages/empty/empty.component';
import {YesNoDialogComponent} from './shared/yes-no-dialog/yes-no-dialog.component';
import {OkDialogComponent} from './shared/ok-dialog/ok-dialog.component';
import {XlsImportComponent} from './pages/xls-import/xls-import.component';
import {Title} from '@angular/platform-browser';
import {ComboBoxComponent} from './form-controlls/combo-box/combo-box.component';
import {SearchComponent} from './pages/search/search.component';
import {ListWrapperComponent} from './pages/list/list-wrapper/list-wrapper.component';
import {AutocompleteComboBoxComponent} from './form-controlls/autocomplete-combo-box/autocomplete-combo-box.component';
import {CheckBoxComponent} from './form-controlls/check-box/check-box.component';
import {CallBackComponent} from './pages/call-back/call-back.component';
import {FormWrapperComponent} from './pages/form/form-wrapper/form-wrapper.component';
import {HtmlDashboardComponent} from './pages/html-dashboard/html-dashboard.component';
import {SafeHtmlPipe} from './services/system/safe-html.pipe';
import {AceModule} from 'ngx-ace-wrapper';
import {ChipsComponent} from './form-controlls/chips/chips.component';
import {PivotListComponent} from './pages/pivot-list/pivot-list/pivot-list.component';
import {PivotListWrapperComponent} from './pages/pivot-list/pivot-list-wrapper/pivot-list-wrapper.component';
import {DashboardWrapperComponent} from './pages/dashboard/dashboard-wrapper/dashboard-wrapper.component';
import {PasswordInputComponent} from './form-controlls/password-input/password-input.component';
import {FileSelectorComponent} from './form-controlls/file-selector/file-selector.component';
import {TimelineComponent} from './pages/timeline/timeline.component';
import { DateTimePickerComponent } from './form-controlls/date-time-picker/date-time-picker.component';
import { HtmlTemplatePreviewComponent } from './pages/html-template-preview/html-template-preview.component';
import { ImageSelectorComponent } from './form-controlls/image-selector/image-selector.component';
import { UiPluginComponent } from './pages/ui-plugin/ui-plugin.component';
import { RuleDesignerComponent } from './pages/rule-designer/rule-designer.component';
import { WsNotificationComponent } from './pages/ws-notification/ws-notification.component';
import { NgChartsModule } from 'ng2-charts';
import { ChatComponent } from './pages/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ListComponent,
    DatePickerComponent,
    SofiaDateDirective,
    ListSelectorComponent,
    FormComponent,
    NumericInputComponent,
    VarcharInputComponent,
    TextInputComponent,
    FormTableComponent,
    DashboardComponent,
    ChartComponent,
    InfoCardComponent,
    EmptyComponent,
    YesNoDialogComponent,
    OkDialogComponent,
    XlsImportComponent,
    ComboBoxComponent,
    SearchComponent,
    ListWrapperComponent,
    AutocompleteComboBoxComponent,
    CheckBoxComponent,
    CallBackComponent,
    FormWrapperComponent,
    HtmlDashboardComponent,
    SafeHtmlPipe,
    ChipsComponent,
    PivotListComponent,
    PivotListWrapperComponent,
    DashboardWrapperComponent,
    PasswordInputComponent,
    FileSelectorComponent,
    TimelineComponent,
    DateTimePickerComponent,
    HtmlTemplatePreviewComponent,
    ImageSelectorComponent,
    UiPluginComponent,
    RuleDesignerComponent,
    WsNotificationComponent,
    ChatComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      onSameUrlNavigation: 'reload'
    }),
    NgxMaskModule.forRoot(),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    FormsModule,
    HttpClientModule,
    NgbDatepickerModule,
    NgbModule,
    AceModule,
    NgChartsModule
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
    Title
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
