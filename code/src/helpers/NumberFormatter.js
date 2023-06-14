export default class NumberFormatter {
  /**
   * @param {string} currency 
   */
  static currencyToNumber(currency) {
    return Number(currency.replace('R$ ', ''))
  }

  /**
   * @param {number} number 
   */
  static numberToCurrency(number) {
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  /**
   * @param {string} hours 
   */
  static hoursToNumber(hours) {
    return Number(hours.replace('h', ''))
  }
}