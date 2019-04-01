import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DockerContainerService } from '../service/docker-container.service';
import { DockerContainer } from '../model/DockerContainer';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  private backends: DockerContainer[];

  constructor(private router: Router, private dockerContainerService: DockerContainerService) {
  }

  ngOnInit() {
    this.update()
  }

  update() {
    this.dockerContainerService.getContainers().subscribe((containers: DockerContainer[]) => {
      this.backends = containers
    })
  }

  showDetails(backend) {
    this.router.navigate(['details', backend.name]);
  }

}
