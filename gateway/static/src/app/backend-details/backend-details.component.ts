import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'backend-details',
  templateUrl: './backend-details.component.html',
  styleUrls: ['./backend-details.component.scss']
})
export class BackendDetailsComponent implements OnInit {

  private backend: any = {
    "status": {
      "state": "running",
      "indicator": "green"
    },
    "name": "test-app",
    "description": "Some sample app",
    "label": "Test-App"
  }

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
