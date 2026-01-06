import { Component, OnInit } from '@angular/core';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { sharedservice } from '../../shared.service';

@Component({
  selector: 'app-dummy-dash',
  templateUrl: './dummy-dash.component.html',
  styleUrls: ['./dummy-dash.component.css']
})
export class DummyDashComponent implements OnInit {

  constructor(private mandaterService:mandateservice,private sharedService:sharedservice,private retailServcie:retailservice) { }

  ngOnInit() {
  }

}
