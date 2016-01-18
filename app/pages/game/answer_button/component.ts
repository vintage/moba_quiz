import {Component, EventEmitter} from 'angular2/core';
import {Button} from 'ionic-framework/ionic';

@Component({
  selector: 'answer-button',
  template: '<button full dark (click)="onClick()">{{ value }}</button>',
  directives: [Button],
  inputs: ['value'],
  outputs: ['picked'],
})
export class AnswerButton {
  public value:any;
  picked = new EventEmitter();

  onClick() {
    this.picked.emit(this.value);
  }
}