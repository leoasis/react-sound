# react-sound

[![npm version](https://img.shields.io/npm/v/react-sound.svg?style=flat-square)](https://www.npmjs.com/package/react-sound)

Sound component to play audio in your web apps. Backed by the mighty [soundmanager2](https://github.com/scottschiller/SoundManager2) library.

## Example

```js
// In your React component:
render() {
  return (
    <Sound
      url="cool_sound.mp3"
      playStatus={Sound.status.PLAYING}
      playFromPosition={300 /* in milliseconds */}
      onLoading={this.handleSongLoading}
      onPlaying={this.handleSongPlaying}
      onFinishedPlaying={this.handleSongFinishedPlaying}
    />
  );
}
```

## Sound as a component?

Yes! It's really easy to use sounds in your app as part of the component tree in your React app.

* **Want to start playing a sound?** Just render it with a `PLAYING` status.
* **Want to remove a playing sound?** Just stop rendering it.
* **Want to sync it with your app state?** Render it using props and state, just as with any React component!

## How to install

`npm install react-sound --save`

## How to use

```js
var React = require('react');
var Sound = require('react-sound').default;

// ... or using import:
import React from 'react';
import Sound from 'react-sound';

class MyComponentWithSound extends React.Component {
  render() {
    return <Sound {...props} />; // Check props in next section
  }
}
```

**Note:** By default, a restriction on mobile prevent you from playing multiple sounds. To avoid this, you need to set the `ignoreMobileRestrictions` property to `true` when setting up [soundManager2](http://www.schillmania.com/projects/soundmanager2/doc/).

### Props

* *url (string)*: The url of the sound to play.
* *playStatus (Sound.status.{PLAYING,STOPPED,PAUSED})*: The current sound playing status. Change it in successive renders to play, stop, pause and resume the sound.
* *playFromPosition (number)*: Seeks to the position specified by this prop, any time it changes. After that, the sound will continue playing (or not, if the `playStatus` is not `PLAYING`). Use this prop to seek to different positions in the sound, but not use it as a controlled component. You should use either this prop or `position`, but not both.
* *position (number)*: The current position the sound is at. Use this to make the component a controlled component, meaning that you must update this prop on every `onPlaying` callback. You should use either this prop or `playFromPosition`, but not both.
* *volume (number)*: The current sound's volume. A value between 0 and 100.
* *playbackRate (number)*: Number affecting sound playback. A value between 0.5 and 4 of normal rate (1).
* *autoLoad (boolean)*: If the sound should start loading automatically (defaults to `false`).
* *loop (boolean)*: If the sound should continue playing in a loop (defaults to `false`).
* *onError (function)*: Function that gets called when the sound fails to load, or fails during load or playback. It receives the arguments `errorCode` and `description` with details about the error.
* *onLoading (function)*: Function that gets called while the sound is loading. It receives an object with properties `bytesLoaded`, `bytesTotal` and `duration`.
* *onLoad (function)*: Function that gets called after the sound has finished loading. It receives an object with property `loaded`, a boolean set to true if the sound has finished loading successfully.
* *onPlaying (function)*: Function that gets called while the sound is playing. It receives an object with properties `position` and `duration`.
* *onPause (function)*: Function that gets called when the sound is paused. It receives an object with properties `position` and `duration`.
* *onResume (function)*: Function that gets called while the sound is resumed playing. It receives an object with properties `position` and `duration`.
* *onStop (function)*: Function that gets called while the sound playback is stopped. It receives an object with properties `position` and `duration`.
* *onFinishedPlaying (function)*: Function that gets called when the sound finishes playing (reached end of sound). It receives no parameters.

## How to contribute

Feel free to fork and send PRs or issues, be it for features, bug fixes, or documentation!
