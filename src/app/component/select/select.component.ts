import { Component, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})

export class SelectComponent {
  @Output() selectionChanged: EventEmitter<string> = new EventEmitter<string>()

  talkBack(eventData: MatSelectChange) {
    this.selectionChanged.emit(eventData.value);
  }
}
