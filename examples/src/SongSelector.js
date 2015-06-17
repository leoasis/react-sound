import React from 'react';

export default class SongSelector extends React.Component {
  render() {
    return <label>
      Select a song:
      {' '}
      <select value={this.props.songs.indexOf(this.props.selectedSong)} onChange={this.handleSongChange.bind(this)}>
        <option></option>
        {this.renderSongOptions()}
      </select>
    </label>;
  }

  renderSongOptions() {
    return this.props.songs.map((song, index) => {
      return <option key={index} value={index}>{song.title}</option>;
    });
  }

  handleSongChange(ev) {
    this.props.onSongSelected(this.props.songs[ev.target.value]);
  }
}
