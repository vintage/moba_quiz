export class GameTypeModel {
  constructor(public name: string, public component: any) {
  }
}

export class GameChoice {
  constructor(public option: any, public isValid: boolean) {

  }
}
