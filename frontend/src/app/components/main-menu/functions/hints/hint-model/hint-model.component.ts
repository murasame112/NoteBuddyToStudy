import { Component, Input, OnInit } from '@angular/core';
import { Hint } from 'src/app/models/hint.model';

@Component({
  selector: 'app-hint-model',
  templateUrl: './hint-model.component.html',
  styleUrls: ['./hint-model.component.scss'],
})
export class HintModelComponent implements OnInit {
  ngOnInit(): void {}
  @Input() hintContent: Hint | null = null;
}
