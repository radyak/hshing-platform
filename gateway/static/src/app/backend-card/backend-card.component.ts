import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'backend-card',
  templateUrl: './backend-card.component.html',
  styleUrls: ['./backend-card.component.scss']
})
export class BackendCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private map = {
    'green': 'rgb(8, 224, 73)',
    'red': 'rgb(224, 8, 73)'
  };

  @Input() name: string;
  @Input() color: string;

  getColor() {
    console.log(this.color)
    return this.map[this.color]
  }

}
