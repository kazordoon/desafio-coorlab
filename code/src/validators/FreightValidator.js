export default class FreightValidator {

  validate(destination, weight) {
    if (!destination || !weight) {
      return 'Preencha todos os campos!'
    }
  }
}