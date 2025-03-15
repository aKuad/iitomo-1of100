/**
 * @file 3 digits shuffling viewing module
 *
 * @author aKuad
 */


/**
 * 3 digits shuffling viewing module
 *
 * Every digits are changed at every time.
 * Random 3 digits viewing at [10 times/sec].
 */
export class Digits3Shuffle {
  /**
   * HTML element to view digits
   *
   * @type {HTMLElement}
   */
  #view_element;


  /**
   * Interval ID of shuffling process
   *
   * `null` means not in run
   *
   * @type {number | null}
   */
  #interval_id;


  /**
   * Current (last viewed) digits
   *
   * @type {Array<number>}
   */
  #current_digits;


  /**
   * Construct with view target element
   *
   * @param {HTMLElement} view_element
   */
  constructor(view_element) {
    this.#view_element = view_element;
    this.#current_digits = new Array(3).fill(0);
  }


  /**
   * Digits view updating
   *
   * 1 call, toggle 1 time
   */
  #digits_view_toggle() {
    for(let i = 0; i < this.#current_digits.length; i++) {
      const rand_1to9 = Math.ceil(Math.random() * 9);
      // Add 1~9 then % 10 -> digit must be changed every time
      this.#current_digits[i] = (this.#current_digits[i] + rand_1to9) % 10;
    }

    this.#view_element.innerText = this.#current_digits.join("");
  }


  /**
   * Start to shuffling
   */
  run() {
    // If in run, do nothing
    if(this.#interval_id != null) { return; }

    this.#interval_id = setInterval(this.#digits_view_toggle.bind(this), 100);
  }


  /**
   * Stop to shuffling
   */
  stop() {
    // If not in run, do nothing
    if(this.#interval_id === null) { return; }

    clearInterval(this.#interval_id);
    this.#interval_id = null;
  }
}
