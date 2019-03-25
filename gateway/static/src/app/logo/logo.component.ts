import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() width: number = 50;
  @Input() height: number = 70;
  @Input() color: string = 'white';
  @Input() fill: string = 'white';

}
