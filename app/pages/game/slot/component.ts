import {Component, EventEmitter} from 'angular2/core';

import {ItemModel} from "../../../providers/item/model";

@Component({
  selector: 'game-slot',
  templateUrl: 'build/pages/game/slot/template.html',
  inputs: ['item'],
  outputs: ['picked'],
})
export class Slot {
  public emptyImageSource:string = "data/images/items/3041.png";
  public item:ItemModel;
  picked = new EventEmitter();

  onClick() {
    this.picked.emit(this.item);
  }
}
