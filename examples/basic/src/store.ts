import { action, computed, observable } from "mobx"

class Store {
  @observable accessor numA = 1
  @observable accessor numB = 2

  @computed
  get sum() {
    return this.numA + this.numB
  }

  @action
  update() {
    const sum = this.sum
    this.numA = this.numB
    this.numB = sum
  }
}

export const store = new Store()
