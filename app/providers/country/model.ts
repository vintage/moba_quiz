export class CountryModel {
  public id: string;
  public name: string;

  constructor(json: Object) {
    this.id = json.iso;
    this.name = json.name;
  }

  getImageSource() {
    return "img/flags/" + this.id + ".png";
  }
}
