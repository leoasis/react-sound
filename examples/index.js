import React from 'react';
import Sound from '../src';

class Example extends React.Component {
  render() {
    return <Sound
      url="/song.mp3"
      status={Sound.status.PLAYING}
      positionInMs={0}
      onLoading={this.props.loadingEvents}
      onLoaded={this.props.loadingEvents}
      onPlaying={this.props.playingEvents}
      onFinishedPlaying={this.props.finishPlayingEvents} />
  }
}

React.render(<Example />, document.getElementById('app'));
