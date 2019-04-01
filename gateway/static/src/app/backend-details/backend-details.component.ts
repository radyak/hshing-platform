import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DockerContainerService } from '../service/docker-container.service';
import { DockerContainer } from '../model/DockerContainer';

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
    private dockerContainerService: DockerContainerService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.update()
  }

  update(): void {
    let name: string = this.route.snapshot.params['name']
    this.dockerContainerService.getContainer(name).subscribe((container: DockerContainer) => {
      this.backend = container
    })
  }

  stop(): void {
    let name: string = this.route.snapshot.params['name']
    this.dockerContainerService.stopContainer(name).subscribe((container: DockerContainer) => {
      this.backend = container
    })
  }

  start(): void {
    let name: string = this.route.snapshot.params['name']
    this.dockerContainerService.startContainer(name).subscribe((container: DockerContainer) => {
      this.backend = container
    })
  }

  isRunning(): boolean {
    return this.backend.status.state === 'running';
  }

  goBack(): void {
    this.location.back();
  }

}
