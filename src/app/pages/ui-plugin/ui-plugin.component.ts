import { Component, OnInit } from '@angular/core';
import {PageComponent} from "../page/page-component";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-ui-plugin',
  templateUrl: './ui-plugin.component.html',
  styleUrls: ['./ui-plugin.component.scss']
})
export class UiPluginComponent extends PageComponent implements OnInit {

  pluginContent: SafeHtml;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.initNav(this.activatedRoute);
    console.log(this.params);
    console.log(this.params.get('HTML'));


    for (let jsFile of this.params.get('JS')) {
      console.log(jsFile);
    }

    this.loadMyPageContent(this.params.get('CONTEXT'), this.params.get('HTML'), this.params.get('JS'));

  }

  loadMyPageContent(context: string, htmlFile: string, jsFiles: [] ) {
    this.http.get(`assets/ui-plugins/${context}/${htmlFile}`, { responseType: 'text' }).subscribe(
      (data) => {

        const htmlContent = this.sanitizer.bypassSecurityTrustHtml(data);
        this.pluginContent = htmlContent;
        const div = document.getElementById('my-page');

        for (let jsFile of jsFiles) {
          const jsContent = this.createScriptTag(context, jsFile);
          div.appendChild(jsContent);
        }

      },
      (error) => {
        console.error('Error loading mypage.html', error);
      }
    );
  }

  createScriptTag(context: string, htmlFile: string) {
    const scriptTag = document.createElement('script');
    scriptTag.src = `assets/ui-plugins/${context}/${htmlFile}`;
    return scriptTag;
  }




}
