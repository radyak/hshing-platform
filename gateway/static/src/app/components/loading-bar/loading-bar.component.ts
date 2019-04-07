import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() isLoading: boolean = false;

  getClass() {
    console.log(`isLoading=${this.isLoading}`)
    return this.isLoading ? 'is-loading' : ''
  }

}
