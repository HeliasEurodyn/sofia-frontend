import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HtmlTemplatePreviewService } from 'app/services/crud/html-template-preview.service';
import { PageComponent } from '../page/page-component';

@Component({
  selector: 'app-html-template-preview',
  templateUrl: './html-template-preview.component.html',
  styleUrls: ['./html-template-preview.component.css']
})
export class HtmlTemplatePreviewComponent extends PageComponent implements OnInit  {
  
  private html = "";

  private id = "";
  private selectionId = "";

  

  constructor(private service: HtmlTemplatePreviewService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {

    this.initNav(this.activatedRoute);
    this.selectionId = '';
    const locateParams = this.getLocateParams();
  
    if (locateParams.has('ID')) {
      this.id = locateParams.get('ID');
    }

    if (locateParams.has('SELECTION-ID')) {
      this.selectionId = locateParams.get('SELECTION-ID');
    }


    this.service.printPreview(this.id, this.selectionId).subscribe(data => {
      this.html = data['html'];
    });
 
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

}
