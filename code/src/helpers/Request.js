export default class Request {
  /**
   * @param {string} URL
   */
  static async GET(URL) {
    const response = await fetch(URL);
    return response.json();
  }
}
