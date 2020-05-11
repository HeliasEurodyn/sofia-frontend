import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from '@angular/common/http';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TableDesignerFormComponent } from './pages/table-designer/table-designer-form/table-designer-form.component';
import { TableDesignerListComponent } from './pages/table-designer/table-designer-list/table-designer-list.component';
import {FormsModule} from '@angular/forms';
import { MenuDesignerListComponent } from './pages/menu/menu-designer-list/menu-designer-list.component';
import { MenuDesignerFormComponent } from './pages/menu/menu-designer-form/menu-designer-form.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    TableDesignerFormComponent,
    TableDesignerListComponent,
    MenuDesignerListComponent,
    MenuDesignerFormComponent
  ],
    imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes, {
            useHash: true
        }),
        SidebarModule,
        NavbarModule,
        ToastrModule.forRoot(),
        FooterModule,
        FixedPluginModule,
        FormsModule,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
