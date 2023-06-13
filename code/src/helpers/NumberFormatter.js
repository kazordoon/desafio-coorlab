export default class NumberFormatter {
  /**
   * @param {string} currency 
   */
  static currencyToNumber(currency) {
    return Number(currency.replace(/R\$\s/, ''))
  }
}