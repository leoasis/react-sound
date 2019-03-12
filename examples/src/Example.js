import React from 'react';
import Sound from 'react-sound';
import PlayerControls from './PlayerControls';
import SongSelector from './SongSelector';
import songs from './songs';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      controlled: true,
      currentSong: songs[0],
      position: 0,
      volume: 100,
      playbackRate: 1,
      loop: false,
      muted: false,
      playStatus: Sound.status.PLAYING
    };
  }

  getStatusText() {
    switch (this.state.playStatus) {
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

  handleSongSelected = (song) => {
    this.setState({ currentSong: song, position: 0 });
  }

  handleControlledComponentChange = (ev) => {
    this.setState({
      controlled: ev.target.checked,
      position: 0
    });
  }

  renderCurrentSong() {
    return (
      <p>
        Current song {this.state.currentSong.title}. Song is {this.getStatusText()}
      </p>
    );
  }

  render() {
    const { volume, playbackRate, loop, muted } = this.state;

    return (
      <div>
        <SongSelector
          songs={songs}
          selectedSong={this.state.currentSong}
          onSongSelected={this.handleSongSelected}
        />
        <label><input type="checkbox" checked={this.state.controlled} onChange={this.handleControlledComponentChange}/> Controlled Component</label>
        {this.state.currentSong && this.renderCurrentSong()}
        <PlayerControls
          playStatus={this.state.playStatus}
          loop={loop}
          muted={muted}
          onPlay={() => this.setState({ playStatus: Sound.status.PLAYING })}
          onPause={() => this.setState({ playStatus: Sound.status.PAUSED })}
          onResume={() => this.setState({ playStatus: Sound.status.PLAYING })}
          onStop={() => this.setState({ playStatus: Sound.status.STOPPED, position: 0 })}
          onSeek={position => this.setState({ position })}
          onVolumeUp={() => this.setState({ volume: volume >= 100 ? volume : volume + 10 })}
          onVolumeDown={() => this.setState({ volume: volume <= 0 ? volume : volume - 10 })}
          onPlaybackRateUp={() => this.setState({ playbackRate: playbackRate >= 4 ? playbackRate : playbackRate + 0.5 })}
          onPlaybackRateDown={() => this.setState({ playbackRate: playbackRate <= 0.5 ? playbackRate : playbackRate - 0.5 })}
          onToggleLoop={e => this.setState({ loop: e.target.checked })}
          onToggleMute={e => this.setState({ muted: e.target.checked })}
          duration={this.state.currentSong ? this.state.currentSong.duration : 0}
          position={this.state.position}
          playbackRate={playbackRate}
        />
        {this.state.currentSong && (
          this.state.controlled ? (
            <Sound
              url={this.state.currentSong.url}
              playStatus={this.state.playStatus}
              position={this.state.position}
              volume={volume}
              playbackRate={playbackRate}
              loop={loop}
              muted={muted}
              onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${bytesLoaded / bytesTotal * 100}% loaded`)}
              onLoad={() => console.log('Loaded')}
              onPlaying={({ position }) => this.setState({ position })}
              onPause={() => console.log('Paused')}
              onResume={() => console.log('Resumed')}
              onStop={() => console.log('Stopped')}
              onFinishedPlaying={() => this.setState({ playStatus: Sound.status.STOPPED })}
            />
          ) : (
            <Sound
              url={this.state.currentSong.url}
              playStatus={this.state.playStatus}
              playFromPosition={this.state.position}
              volume={volume}
              playbackRate={playbackRate}
              loop={loop}
              muted={muted}
              onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${bytesLoaded / bytesTotal * 100}% loaded`)}
              onLoad={() => console.log('Loaded')}
              onPlaying={({ position }) => console.log('Position', position)}
              onPause={() => console.log('Paused')}
              onResume={() => console.log('Resumed')}
              onStop={() => console.log('Stopped')}
              onFinishedPlaying={() => this.setState({ playStatus: Sound.status.STOPPED })}
            />
          )
        )}
      </div>
    );
  }
}
