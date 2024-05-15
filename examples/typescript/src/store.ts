import { makeAutoObservable } from 'mobx-miniprogram'

class Store {
  numA = 1
  numB = 2

  constructor() {
    makeAutoObservable(this)
  }

  get sum() {
    return this.numA + this.numB
  }

  update() {
    const sum = this.sum
    this.numA = this.numB
    this.numB = sum
  }
}

export const store = new Store()
