import { Component, OnInit, Input } from '@angular/core';
import { MockData } from '../mock-data/mock-data';

@Component({
    selector: 'app-mock-data-display',
    templateUrl: './mock-data-display.component.html',
    styleUrls: ['./mock-data-display.component.scss']
})
export class MockDataDisplayComponent implements OnInit {

    @Input() items: MockData[] = [];

    constructor() { }

    ngOnInit() {
    }

}
