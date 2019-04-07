import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendsService } from '../service/backends.service';
import { Backend } from '../model/Backend';

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

  constructor(
    private location: Location,
    private backendsService: BackendsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.update()
  }

  update(): void {
    let name: string = this.route.snapshot.params['name']
    this.backendsService.getBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
    })
  }

  stop(): void {
    let name: string = this.route.snapshot.params['name']
    this.backendsService.stopBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
    })
  }

  start(): void {
    let name: string = this.route.snapshot.params['name']
    this.backendsService.startBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
    })
  }

  remove(): void {
    let name: string = this.route.snapshot.params['name']
    this.backendsService.removeBackend(name).subscribe((backend: Backend) => {
      this.router.navigate(['overview']);
    })
  }

  isRunning(): boolean {
    return this.backend.status.state === 'running';
  }

  goBack(): void {
    this.location.back();
  }

}
