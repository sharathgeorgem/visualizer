function Microphone (_fft) {
  const FFT_SIZE = _fft || 1024

  this.spectrum = []
  this.volume = this.vol = 0
  this.peak_volume = 0

  var self = this
  const AudioContext = window.AudioContext || window.webkitAudioContext

  // Creates a new AudioContext object which produces an audio processing graph.
  // Built from audio modules linked together.
  // Each represented by an audio node.
  const audioContext = new AudioContext()

  window.AudioContext = window.AudioContext || window.webkitAudioContext
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia

  // Until microphone is fired up
  window.addEventListener('load', init, false)

  function init () {
    try {
      startMic(new AudioContext())
    } catch (e) {
      console.error('The error is ', e)
      console.alert('Web Audio API is not supported in this browser')
    }
  }

  function startMic (context) {
    navigator.getUserMedia({audio: true}, processSound, error)

    function processSound (stream) {
      // Analyser extracts frequency, waveform, etc.

      var analyser = context.createAnalyser()
      analyser.smoothingTimeConstant = 0.2
      analyser.fft_size = FFT_SIZE

      var node = context.createScriptProcessor(FFT_SIZE * 2, 1, 1)

      node.onaudioprocess = function () {
        // bitcount returns an array which is half the FFT_SIZE
        self.spectrum = new Uint8Array(analyser.frequencyBinCount)

        // getByteFrequencyData returns amplitude for each bin
        analyser.getByteFrequencyData(self.spectrum)

        self.vol = self.getRMS(self.spectrum)
        // get peak - A hack for when volumes are low
        if (self.vol > self.peak_volume) self.peak_volume = self.vol
        self.volume = self.vol

        console.log('Listening is happening')
      }
      var input = context.createMediaStreamSource(stream)
      input.connect(analyser)
      analyser.connect(node)
      node.connect(context.destination)
    }
    function error () {
      console.log(arguments)
    }
  }

  this.getRMS = function (spectrum) {
    var rms = 0
    for (var i = 0; i < spectrum.length; i++) {
      rms += spectrum[i] * spectrum[i]
    }
    rms /= spectrum.length
    rms = Math.sqrt(rms)
    return rms
  }

  return this
}

var Mic = new Microphone()
