export default class FreightValidator {
  #validationError;

  get validationError() {
    return this.#validationError
  }

  validate(destination, weight) {
    if (!destination || !weight) {
      return this.#validationError = 'Preencha todos os campos!'
    }
  }
}