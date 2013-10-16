var afterTransition = require('after-transition');
var classes = require('classes');
var redraw = require('redraw');
var Emitter = require('emitter');
var events = require('events');

// Markers should be formatted like:
//
// {
//  '43' : {
//    'duration' :'10',
//    'content': 'some content'
//   }
// }

function PopupVideo(video, markers){
  if (!(this instanceof PopupVideo))
    return new PopupVideo(video, markers);
  this.video = video;
  this.parentNode = this.video.parentNode;
  this.listContainer = document.createElement('ul');
  this.listContainer.className = 'popup-video-container';
  this.parentNode.appendChild(this.listContainer);
  this.markers = markers;
  this.bind();
}

module.exports = PopupVideo;

Emitter(PopupVideo.prototype);

PopupVideo.prototype.bind = function(){
  this.events = events(this.video, this);
  this.events.bind('timeupdate');
};

PopupVideo.prototype.ontimeupdate = function(data){
  var current = Math.ceil(this.video.currentTime);
  if (this.currentSeconds === current) return;
  this.currentSeconds = current;
  var currentMarker = this.markers[current];
  console.log('current marker', currentMarker);
    if (currentMarker) {
      this.showNotification(currentMarker);
    }
};

PopupVideo.prototype.showNotification = function(json){
  var el = document.createElement('li');
  el.className = 'popup-video-notification';
  el.innerHTML = json.html;
  this.listContainer.appendChild(el);
  redraw(el);
  var self = this;
  afterTransition.once(el, function(){
    self.emit('showing', el, json, self);
  });
  classes(el).add('show-notification');
  setTimeout(function(){
    self.hideNotification.call(self, el, json);
  }, json.duration * 1000 || 10000);
};



PopupVideo.prototype.hideNotification = function(el, json){
  var self = this;
  afterTransition.once(el, function(){
    el.parentNode.removeChild(el);
    self.emit('hidden', el, json, self);
  });
  classes(el).remove('show-notification');
};


