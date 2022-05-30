import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {Project} from "../../domain/project";
import {ApplicationStateService} from "../../services/application-state.service";
import {Bucket} from "../../domain/bucket";
import {DeepReadonly} from "ts-essentials";
import {User} from "../../domain/user";
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import {BucketService} from "../../services/bucket.service";



@Component({
  selector: 'float-view-statistic-dialog',
  templateUrl: './view-statistic-dialog.component.html',
  styleUrls: ['./view-statistic-dialog.component.scss']
})
export class ViewStatisticDialogComponent implements OnInit {
  project: Observable<Project | undefined>;
  buckets: Observable<DeepReadonly<Bucket[]>>;
  user: Observable<User | undefined>;
  percentage: number = 0;
  done: number = 0;
  total: number = 0;

  constructor(private state: ApplicationStateService, private bucketService: BucketService) {
   this.project = this.state.observe('selectedProject');
   this.buckets = this.state.observe('buckets');
   this.user = this.state.observe('user');
    this.buckets.subscribe(buckets => {
        this.done = 0;
        this.total = 0;
        buckets.forEach(bucket => {
          if(bucket.name == 'done') {
            bucket.tasks.forEach(task => {
              this.done +=1;
              this.total +=1;
            })
          }else{
            bucket.tasks.forEach(task => {
              this.total += 1;
            })
          }
        this.percentage = Math.round(this.done/this.total*100);
        })
      }
    )
  }

  ngOnInit(): void {
    this.bucketService.getBuckets();
  }

  @ViewChild('pdfTable', {static: false}) pdfTable!: ElementRef;


  public exportHtmlToPDF(){
    let data = document.getElementById('content');

    if (data) {
      html2canvas(data).then(canvas => {
        let docWidth = 208;
        let docHeight = canvas.height * docWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png')
        let doc = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight)

        doc.save('exportedPdf.pdf');
      });
    }
  }


}
