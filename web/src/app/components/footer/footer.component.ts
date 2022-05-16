import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  
  data_time: Date= new Date();

  constructor() { }

  ngOnInit() {
  }

}
