import React from 'react';
import Sound from 'react-sound';
import PlayerControls from './PlayerControls';
import SongSelector from './SongSelector';
import songs from './songs';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: songs[0],
      position: 0,
      volume: 100,
      loop: true,
      playStatus: Sound.status.PLAYING,
    };
  }

  render() {
    const { volume, loop } = this.state;

    return <div>
      <SongSelector
        songs={songs}
        selectedSong={this.state.currentSong}
        onSongSelected={this.handleSongSelected.bind(this)} />
      {this.state.currentSong && this.renderCurrentSong()}
      <PlayerControls
        playStatus={this.state.playStatus}
        loop={loop}
        onPlay={() => this.setState({playStatus: Sound.status.PLAYING})}
        onPause={() => this.setState({playStatus: Sound.status.PAUSED})}
        onResume={() => this.setState({playStatus: Sound.status.PLAYING})}
        onStop={() => this.setState({playStatus: Sound.status.STOPPED, position: 0})}
        onSeek={position => this.setState({ position })}
        onVolumeUp={() => this.setState({volume: volume >= 100 ? volume : volume+10})}
        onVolumeDown={() => this.setState({volume: volume <= 0 ? volume : volume-10})}
        onToggleLoop={(e) => this.setState({loop: e.target.checked})}
        duration={this.state.currentSong ? this.state.currentSong.duration : 0}
        position={this.state.position} />
      {this.state.currentSong &&
        <Sound
          url={this.state.currentSong.url}
          playStatus={this.state.playStatus}
          playFromPosition={this.state.position}
          volume={volume}
          loop={loop}
          onLoading={({bytesLoaded, bytesTotal}) => console.log(`${bytesLoaded / bytesTotal * 100}% loaded`)}
          onLoad={() => console.log('Loaded')}
          onPlaying={({position}) => console.log(position)}
          onPause={() => console.log('Paused')}
          onResume={() => console.log('Resumed')}
          onStop={() => console.log('Stopped')}
          onFinishedPlaying={() => this.setState({playStatus: Sound.status.STOPPED})} />}
    </div>;
  }

  getStatusText() {
    switch(this.state.playStatus) {
      case Sound.status.PLAYING:
        return 'playing';
      case Sound.status.PAUSED:
        return 'paused';
      case Sound.status.STOPPED:
        return 'stopped';
      default:
        return '(unknown)';
    }
  }

  renderCurrentSong() {
    return <p>
      Current song {this.state.currentSong.title}. Song is {this.getStatusText()}
    </p>;
  }

  handleSongSelected(song) {
    this.setState({currentSong: song, position: 0});
  }
}
