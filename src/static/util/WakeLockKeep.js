/**
 * @file Keep WakeLock (no screen turn off, sleep or lock) even if document been re-visible
 *
 * @author aKuad
 */

/**
 * Start to keep WakeLock (no screen turn off, sleep or lock)
 *
 * If WakeLock released by document been inactive or hidden, re-acquire when document been visible.
 *
 * Note: For `WakeLock` API unsupported environment, do nothing
 */
export class WakeLockKeep {
  /**
   * Status of browser WakeLock API support
   *
   * @type {boolean}
   */
  #is_wakelock_available = false;

  /**
   * Status of WakeLock currently enabled
   *
   * @type {boolean}
   */
  #is_wakelock_keep_enable = false;


  /**
   * For WakeLock manually release
   *
   * @type {null | WakeLockSentinel}
   */
  #last_wakelock_sentinel = null;


  /**
   * '#wakelock_acquire' need to be keep 'this' reference to the object
   *
   * @type {Function}
   */
  #wakelock_acquire_bound;


  /**
   * Construct with WakeLock API available checking
   */
  constructor() {
    // WakeLock API availability check
    this.#is_wakelock_available = "wakeLock" in navigator;

    // Member '#wakelock_acquire_bound' init
    this.#wakelock_acquire_bound = this.#wakelock_acquire.bind(this);
  }


  /**
   * Return WakeLock API is available
   *
   * @returns {boolean} Is WakeLock API available
   */
  get is_wakelock_available() {
    return this.#is_wakelock_available;
  }


  /**
   * Enable wakelock keeping
   */
  enable() {
    // If WakeLock unavailable, do nothing
    if(!this.#is_wakelock_available)
      return;

    // If wakelock already ON, do nothing
    if(this.#is_wakelock_keep_enable)
      return;

    // Acquire wakelock
    this.#wakelock_acquire();

    // Set event for re-acquire when document been re-visible
    document.addEventListener("visibilitychange", this.#wakelock_acquire_bound);
    this.#is_wakelock_keep_enable = true;
  }


  /**
   * Disable wakelock keeping
   */
  disable() {
    // If WakeLock unavailable, do nothing
    if(!this.#is_wakelock_available)
      return;

    // If wakelock already OFF, do nothing
    if(!(this.#is_wakelock_keep_enable))
      return;

    // Release current acquired wakelock
    if(this.#last_wakelock_sentinel)
      this.#last_wakelock_sentinel.release();

    // Unset event for re-acquire
    document.removeEventListener("visibilitychange", this.#wakelock_acquire_bound);
    this.#is_wakelock_keep_enable = false;
  }


  /**
   * Wakelock acquiring
   *
   * It considering calling by visibilitychange event
   */
  async #wakelock_acquire() {
    if(document.visibilityState === "visible") {
      this.#last_wakelock_sentinel = await navigator.wakeLock.request("screen")
      // .then(() => console.info("WakeLock reacquired"))  // For view acquired debug message, uncomment this
      .catch(() => console.error("Failed to WakeLock reacquiring"));
    }
  }
}
