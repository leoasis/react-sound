import React, {PropTypes as T} from 'react';
import { soundManager } from 'soundmanager2';

const pendingCalls = [];
let initialized = false;

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

soundManager.onready(() => {
  pendingCalls.slice().forEach(cb => cb());
});

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
    onLoading: T.func,
    onPlaying: T.func,
    onFinishedPlaying: T.func,
    debugMode: T.bool
  };

  static defaultProps = {
    playFromPosition: 0,
    volume: 100,
    onLoading: noop,
    onPlaying: noop,
    onFinishedPlaying: noop,
    debugMode: false
  };

  componentDidMount() {
    soundManager.setup({
      debugMode: this.props.debugMode
    })

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

    if (!props.url) { return; }

    this.stopCreatingSound = createSound({
      url: this.props.url,
      volume: props.volume,
      whileloading() {
        props.onLoading(this);
      },
      whileplaying() {
        props.onPlaying(this);
      },
      onfinish() {
        props.onFinishedPlaying();
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
