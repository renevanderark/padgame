class WrappedAudio {
  constructor(resourceName) {
    if (typeof android !== 'undefined' && android.playAudio) {
      this.audio = {
        play: () => android.playAudio(resourceName)
      }
    } else {
      this.audio = new Audio(`./${resourceName}.ogg`);
    }
  }

  play() {

    this.audio.play();
  }
}

export default WrappedAudio;
