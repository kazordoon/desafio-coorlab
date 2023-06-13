export default class NumberFormatter {
  /**
   * @param {string} currency 
   */
  static currencyToNumber(currency) {
    return Number(currency.replace('R$ ', ''))
  }

  /**
   * @param {string} hours 
   */
  static hoursToNumber(hours) {
    return Number(hours.replace('h', ''))
  }
}