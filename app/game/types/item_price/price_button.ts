import {Component, EventEmitter} from 'angular2/core';
import {Button} from 'ionic-framework/ionic';

@Component({
  selector: 'price-button',
  template: '<button full dark (click)="onClick()">{{ price }}</button>',
  directives: [Button],
  inputs: ['price'],
  outputs: ['picked'],
})
export class PriceButton {
  public price:number;
  picked = new EventEmitter();

  onClick() {
    this.picked.emit(this.price);
  }
}