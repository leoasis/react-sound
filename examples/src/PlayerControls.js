import React from 'react';
import Sound from 'react-sound';

function control(text, clickHandler) {
  const onClick = ev => {
    ev.preventDefault();
    clickHandler();
  };
  return (
    <li>
      <a href="#" onClick={onClick}>
        {text}
      </a>
    </li>
  );
}

const numberFormat = new Intl.NumberFormat([], { minimumFractionDigits: 2 });

export default class PlayerControls extends React.Component {
  render() {
    return <div>{this.renderControls()}</div>;
  }

  renderControls() {
    const controls = {
      play: this.props.playStatus === Sound.status.STOPPED,
      stop: this.props.playStatus !== Sound.status.STOPPED,
      pause: this.props.playStatus === Sound.status.PLAYING,
      resume: this.props.playStatus === Sound.status.PAUSED
    };

    return (
      <div>
        Volume:
        <button onClick={this.props.onVolumeDown}>-</button>
        <button onClick={this.props.onVolumeUp}>+</button>
        <ul>
          {controls.play && control('Play', this.props.onPlay)}
          {controls.stop && control('Stop', this.props.onStop)}
          {controls.pause && control('Pause', this.props.onPause)}
          {controls.resume && control('Resume', this.props.onResume)}
        </ul>
        <div>
          Playback Rate:
          <button onClick={this.props.onPlaybackRateDown}>-</button>
          {' '}
          {numberFormat.format(this.props.playbackRate)}
          {' '}
          <button onClick={this.props.onPlaybackRateUp}>+</button>
        </div>
        <div>
          Loop?:
          <input type="checkbox" checked={this.props.loop} onChange={this.props.onToggleLoop} />
          </div>
        <div>
          Mute?:
          <input type="checkbox" checked={this.props.muted} onChange={this.props.onToggleMute} />
        </div>
      </div>
    );
  }
}
