*This repository is a mirror of the [component](http://component.io) module [bmcmahen/popup-video](http://github.com/bmcmahen/popup-video). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/bmcmahen-popup-video`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*

# popup-video

  show certain dom elements at particular points during video playback

## Installation

  Install with [component(1)](http://component.io):

    $ component install bmcmahen/popup-video

  Or use the standalone build located in `standalone` and accessible under the global variable `popupvideo`.

## Usage
```javascript
var popupvideo = require('popup-video');
var el = document.querySelector('video');
var json = {
  2: {
    duration: 10,
    html: '<h5> Michener Center </h5> <p> <a href="#">learn more </a></p>'
  },

  4: {
    duration: 15,
    html: '<p> world </p>'
  }
}
var pop = new popupvideo(el, json);
pop.on('showing', function(){
  console.log('showing');
});
pop.on('hidden', function(){
  console.log('hidden');
});
```


## License

  MIT
