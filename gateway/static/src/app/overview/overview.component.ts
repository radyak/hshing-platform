import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  private backends: any[] = [
    {
      "status": {
        "state": "running",
        "indicator": "green"
      },
      "name": "mongodb",
      "description": "This Home Sweet Host's database",
      "label": "Persistence"
    },
    {
      "status": {
        "state": "running",
        "indicator": "green"
      },
      "name": "test-app",
      "description": "Some sample app",
      "label": "Test-App"
    }
  ]

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  showDetails(backend) {
    this.router.navigate(['details', backend.name]);
  }

}
