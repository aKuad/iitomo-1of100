/**
 * @file Sound Effect Player module
 *
 * @author aKuad
 */


/**
 * Sound Effect Player module
 */
export class SEPlayer {
  /**
   * Audio context what is base platform of this object
   *
   * @type {AudioContext}
   */
  #ctx;

  /**
   * Gain note of SE volume control
   *
   * @type {number}
   */
  #gain_node;

  /**
   * Audio buffer of decoded input file
   *
   * @type {AudioBuffer | null}
   */
  #se_buffer;


  /**
   * Setup web audio api
   */
  constructor() {
    this.#ctx = new AudioContext();
    this.#gain_node = this.#ctx.createGain();
    this.#gain_node.connect(this.#ctx.destination);
    this.#se_buffer = null;
  }


  /**
   * Set an audio file to play
   *
   * It will be fulfilled on buffer decoded then ready (with returning audio duration)
   *
   * @param {File} file Audio file to set
   * @returns {Promise<number>} Duration of input file
   */
  async set_file(file) {
    const array_buffer = await file.arrayBuffer();
    const audio_buffer = await this.#ctx.decodeAudioData(array_buffer);
    this.#se_buffer = audio_buffer;
    return audio_buffer.duration;
  }


  /**
   * Unset input file
   *
   * On next `.play()`, audio won't be played
   */
  unset_file() {
    this.#se_buffer = null;
  }


  /**
   * Play SE
   *
   * When no file input or unset, do nothing.
   */
  play() {
    if(this.#se_buffer === null) { return; }

    const buffer_source_node = this.#ctx.createBufferSource();
    buffer_source_node.buffer = this.#se_buffer;
    buffer_source_node.connect(this.#gain_node);
    buffer_source_node.start();

    buffer_source_node.addEventListener("ended", () => buffer_source_node.disconnect());
  }


  /**
   * Set gain for SE volume control
   *
   * @param {number} gain Gain to set (1.0 for neutral, 0.0 for mute)
   */
  set_gain(gain) {
    this.#gain_node.gain.value = gain;
  }
}
