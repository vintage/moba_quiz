import {Component} from 'angular2/core';

export class GameTypeModel {
    public name: string;
    public component: Component;

    constructor(name: string, component: Component) {
        this.name = name;
        this.component = component;
    }
}