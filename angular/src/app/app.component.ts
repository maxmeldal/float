import { Component } from '@angular/core';
import {ProjectService} from "./services/project.service";
import {BucketService} from "./services/bucket.service";

@Component({
  selector: 'float-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'float';

  constructor(_projectService: ProjectService,
              _bucketService: BucketService) {
  }
}
