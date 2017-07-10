'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pendingCalls = [];
var initialized = false;

var soundManager = void 0;
if (typeof window !== 'undefined') {
  soundManager = require('soundmanager2').soundManager;

  soundManager.onready(function () {
    pendingCalls.slice().forEach(function (cb) {
      return cb();
    });
  });
}

function _createSound(options, cb) {
  if (soundManager.ok()) {
    cb(soundManager.createSound(options));
    return function () {};
  } else {
    if (!initialized) {
      initialized = true;
      soundManager.beginDelayedInit();
    }

    var call = function call() {
      cb(soundManager.createSound(options));
    };

    pendingCalls.push(call);

    return function () {
      pendingCalls.splice(pendingCalls.indexOf(call), 1);
    };
  }
}

function noop() {}

var playStatuses = {
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
};

var Sound = function (_React$Component) {
  _inherits(Sound, _React$Component);

  function Sound() {
    _classCallCheck(this, Sound);

    return _possibleConstructorReturn(this, (Sound.__proto__ || Object.getPrototypeOf(Sound)).apply(this, arguments));
  }

  _createClass(Sound, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.createSound(function (sound) {
        if (_this2.props.playStatus === playStatuses.PLAYING) {
          sound.play();
        }
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removeSound();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;

      var withSound = function withSound(sound) {
        if (!sound) {
          return;
        }

        if (_this3.props.playStatus === playStatuses.PLAYING) {
          if (sound.playState === 0) {
            sound.play();
          }

          if (sound.paused) {
            sound.resume();
          }
        } else if (_this3.props.playStatus === playStatuses.STOPPED) {
          if (sound.playState !== 0) {
            sound.stop();
          }
        } else {
          // this.props.playStatus === playStatuses.PAUSED
          if (!sound.paused) {
            sound.pause();
          }
        }

        if (_this3.props.playFromPosition !== prevProps.playFromPosition) {
          sound.setPosition(_this3.props.playFromPosition);
        }

        if (_this3.props.position != null) {
          if (sound.position !== _this3.props.position && Math.round(sound.position) !== Math.round(_this3.props.position)) {

            sound.setPosition(_this3.props.position);
          }
        }

        if (_this3.props.volume !== prevProps.volume) {
          sound.setVolume(_this3.props.volume);
        }
      };

      if (this.props.url !== prevProps.url) {
        this.createSound(withSound);
      } else {
        withSound(this.sound);
      }
    }
  }, {
    key: 'createSound',
    value: function createSound(callback) {
      var _this4 = this;

      this.removeSound();

      var props = this.props;

      if (!props.url) {
        return;
      }

      this.stopCreatingSound = _createSound({
        url: this.props.url,
        volume: props.volume,
        position: this.props.playFromPosition || this.props.position || 0,
        whileloading: function whileloading() {
          props.onLoading(this);
        },
        whileplaying: function whileplaying() {
          props.onPlaying(this);
        },
        onfinish: function onfinish() {
          props.onFinishedPlaying();
        }
      }, function (sound) {
        _this4.sound = sound;
        callback(sound);
      });
    }
  }, {
    key: 'removeSound',
    value: function removeSound() {
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
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Sound;
}(_react2.default.Component);

Sound.status = playStatuses;
Sound.propTypes = {
  url: _propTypes2.default.string.isRequired,
  playStatus: _propTypes2.default.oneOf(Object.keys(playStatuses)).isRequired,
  position: _propTypes2.default.number,
  playFromPosition: _propTypes2.default.number,
  volume: _propTypes2.default.number,
  onLoading: _propTypes2.default.func,
  onPlaying: _propTypes2.default.func,
  onFinishedPlaying: _propTypes2.default.func
};
Sound.defaultProps = {
  playFromPosition: 0,
  volume: 100,
  onLoading: noop,
  onPlaying: noop,
  onFinishedPlaying: noop
};
exports.default = Sound;