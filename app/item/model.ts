import {get} from 'lodash';

export class ItemModel {
    public id: string;
    public name: string;
    public from: ItemModel[];
    public into: ItemModel[];
    public price: number;
    private image: string;

    constructor(json: Object) {
        this.id = json.id;
        this.name = json.name;
        this.from = get(json, 'from', []);
        this.into = get(json, 'into', []);
        this.price = json.price;
        this.image = json.image;
    }

    getImageSource() {
        return "data/images/items/" + this.image;
    }
}