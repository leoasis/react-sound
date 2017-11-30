import React from 'react';
import T from 'prop-types';

const pendingCalls = [];
let initialized = false;

let soundManager;
if (typeof window !== 'undefined') {
  soundManager = require('soundmanager2').soundManager;

  soundManager.onready(() => {
    pendingCalls.slice().forEach(cb => cb());
  });
}

function createSound(options, cb) {
  if (soundManager.ok()) {
    cb(soundManager.createSound(options));
    return () => {};
  } else {
    if (!initialized) {
      initialized = true;
      soundManager.beginDelayedInit();
    }

    const call = () => {
      cb(soundManager.createSound(options));
    };

    pendingCalls.push(call);

    return () => {
      pendingCalls.splice(pendingCalls.indexOf(call), 1);
    };
  }
}

function noop() {}

const playStatuses = {
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
};

export default class Sound extends React.Component {
  static status = playStatuses;

  static propTypes = {
    url: T.string.isRequired,
    playStatus: T.oneOf(Object.keys(playStatuses)).isRequired,
    position: T.number,
    playFromPosition: T.number,
    volume: T.number,
    onError: T.func,
    onLoading: T.func,
    onLoad: T.func,
    onPlaying: T.func,
    onPause: T.func,
    onResume: T.func,
    onStop: T.func,
    onFinishedPlaying: T.func,
    autoLoad: T.bool,
    loop: T.bool,
  };

  static defaultProps = {
    playFromPosition: 0,
    volume: 100,
    onError: noop,
    onLoading: noop,
    onPlaying: noop,
    onLoad: noop,
    onPause: noop,
    onResume: noop,
    onStop: noop,
    onFinishedPlaying: noop,
    autoLoad: false,
    loop: false,
  };

  componentDidMount() {
    this.createSound(sound => {
      if (this.props.playStatus === playStatuses.PLAYING) {
        sound.play();
      }
    });
  }

  componentWillUnmount() {
    this.removeSound();
  }

  componentDidUpdate(prevProps) {
    const withSound = (sound) => {
      if (!sound) { return; }

      if (this.props.playStatus === playStatuses.PLAYING) {
        if (sound.playState === 0) {
          sound.play();
        }

        if (sound.paused) {
          sound.resume();
        }
      } else if (this.props.playStatus === playStatuses.STOPPED) {
        if (sound.playState !== 0) {
          sound.stop();
        }
      } else { // this.props.playStatus === playStatuses.PAUSED
        if (!sound.paused) {
          sound.pause();
        }
      }

      if (this.props.playFromPosition !== prevProps.playFromPosition) {
        sound.setPosition(this.props.playFromPosition);
      }

      if (this.props.position != null) {
        if (sound.position !== this.props.position &&
          Math.round(sound.position) !== Math.round(this.props.position)) {

          sound.setPosition(this.props.position);
        }
      }

      if (this.props.volume !== prevProps.volume) {
        sound.setVolume(this.props.volume);
      }

      sound.options.onfinish = () => this.props.onFinishedPlaying() || null;
      sound.options.whileplaying = () => this.props.onPlaying(this) || null;
      sound.options.whileloading = () => this.props.onLoading(this) || null;
    };

    if (this.props.url !== prevProps.url) {
      this.createSound(withSound);
    } else {
      withSound(this.sound);
    }
  }

  createSound(callback) {
    this.removeSound();

    const props = this.props;
    const that = this;

    if (!props.url) { return; }

    this.stopCreatingSound = createSound({
      url: this.props.url,
      autoLoad: props.autoLoad,
      volume: props.volume,
      position: this.props.playFromPosition || this.props.position || 0,
      whileloading() {
        props.onLoading(this);
      },
      whileplaying() {
        props.onPlaying(this);
      },
      onerror(errorCode, description) {
        props.onError(errorCode, description, this);
      },
      onload() {
        props.onLoad(this);
      },
      onpause() {
        props.onPause(this);
      },
      onresume() {
        props.onResume(this);
      },
      onstop() {
        props.onStop(this);
      },
      onfinish() {
        if (that.props.loop && that.props.playStatus === playStatuses.PLAYING) {
          that.sound.play()
        } else {
          props.onFinishedPlaying();
        }
      }
    }, sound => {
      this.sound = sound;
      callback(sound);
    });
  }

  removeSound() {
    if (this.stopCreatingSound) {
      this.stopCreatingSound();
      delete this.stopCreatingSound;
    }

    if (this.sound) {
      try {
        this.sound.destruct();
      } catch (e) {} // eslint-disable-line

      delete this.sound;
    }
  }

  render() {
    return null;
  }
}
