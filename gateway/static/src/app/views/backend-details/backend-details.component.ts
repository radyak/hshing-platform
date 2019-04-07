import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendsService } from '../../services/backends.service';
import { Backend } from '../../model/Backend';

@Component({
  selector: 'backend-details',
  templateUrl: './backend-details.component.html',
  styleUrls: ['./backend-details.component.scss']
})
export class BackendDetailsComponent implements OnInit {

  // TODO: Remove default
  private backend: any = {
    "status": {
      "state": "running",
      "indicator": "green"
    },
    "name": "test-app",
    "description": "Some sample app",
    "label": "Test-App"
  }

  private isLoading: boolean = false;

  constructor(
    private location: Location,
    private backendsService: BackendsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.update()
  }

  update(): void {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    this.backendsService.getBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
      this.isLoading = false;
    })
  }

  stop(): void {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    this.backendsService.stopBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
      this.isLoading = false;
    })
  }

  start(): void {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    this.backendsService.startBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
      this.isLoading = false;
    })
  }

  remove(): void {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    this.backendsService.removeBackend(name).subscribe((backend: Backend) => {
      this.router.navigate(['overview']);
      this.isLoading = false;
    })
  }

  isRunning(): boolean {
    return this.backend.status.state === 'running';
  }

  goBack(): void {
    this.location.back();
  }

}
