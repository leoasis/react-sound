import React, {PropTypes as T} from 'react';
import { soundManager } from 'soundmanager2';

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
    onLoading: T.func,
    onPlaying: T.func,
    onFinishedPlaying: T.func
  };

  static defaultProps = {
    playFromPosition: 0,
    onLoading: noop,
    onPlaying: noop,
    onFinishedPlaying: noop
  };

  componentDidMount() {
    this.createSound();
  }

  componentWillUnmount() {
    this.removeSound();
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.createSound();
    }

    if (!this.sound) { return; }

    if (this.props.playStatus === playStatuses.PLAYING) {
      if (prevProps.playStatus === playStatuses.STOPPED) {
        this.sound.play();
      } else if (prevProps.playStatus === playStatuses.PAUSED) {
        this.sound.resume();
      }
    } else if (this.props.playStatus === playStatuses.STOPPED && prevProps.playStatus !== playStatuses.STOPPED) {
      this.sound.stop();
    } else {// 'PAUSED'
      if (prevProps.playStatus === playStatuses.PLAYING) {
        this.sound.pause();
      }
    }

    if (this.props.playFromPosition !== prevProps.playFromPosition) {
      this.sound.setPosition(this.props.playFromPosition);
    }

    if (this.props.position != null) {
      if (this.sound.position !== this.props.position &&
        Math.round(this.sound.position) !== Math.round(this.props.position)) {

        this.sound.setPosition(this.props.position);
      }
    }
  }

  createSound() {
    if (this.sound) {
      this.removeSound();
    }
    const props = this.props;

    if (!props.url) { return; }

    this.sound = soundManager.createSound({
      url: this.props.url,
      whileloading() {
        props.onLoading(this);
      },
      whileplaying() {
        props.onPlaying(this);
      },
      onfinish() {
        props.onFinishedPlaying();
      }
    });
  }

  removeSound() {
    if (!this.sound) { return; }

    try {
      this.sound.destruct();
    } catch (e) {} // eslint-disable-line

    delete this.sound;
  }

  render() {
    return <noscript />;
  }
}
