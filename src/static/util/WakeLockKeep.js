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
   *
   *
   * @type {boolean}
   */
  #is_wakelock_available = false;

  /**
   * Status
   *
   * @type {boolean}
   */
  #is_wakelock_keep_enable = false;


  /**
   * Construct with WakeLock API available checking
   */
  constructor() {
    // WakeLock API availability check
    this.#is_wakelock_available = "wakeLock" in navigator;
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
    const wakelock_acquire = this.#wakelock_acquire;  // For keep 'this' for the object, not for document.addEventListener
    document.addEventListener("visibilitychange", wakelock_acquire);
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

    // Unset event for re-acquire
    const wakelock_acquire = this.#wakelock_acquire;
    document.removeEventListener("visibilitychange", wakelock_acquire);
    this.#is_wakelock_keep_enable = false;
  }


  /**
   * Wakelock acquiring
   *
   * It considering calling by visibilitychange event
   */
  #wakelock_acquire() {
    if(document.visibilityState === "visible") {
      navigator.wakeLock.request("screen")
      // .then(() => console.info("WakeLock reacquired"))  // For view acquired debug message, uncomment this
      .catch(() => console.error("Failed to WakeLock reacquiring"));
    }
  }
}
