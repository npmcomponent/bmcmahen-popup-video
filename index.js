var afterTransition = require('after-transition');
var classes = require('classes');
var redraw = require('redraw');
var Emitter = require('emitter');
var VideoEmitter = require('video-emitter');
var events = require('events');
var hover = require('hover');

// Markers should be formatted like:
//
// {
//  '43' : {
//    'duration' :'10',
//    'content': 'some content'
//   }
// }
//
//

/**
 * PopupVideo Constructor
 * @param {Element} video
 * @param {Object} markers
 */

function PopupVideo(video, markers){
  if (!(this instanceof PopupVideo))
    return new PopupVideo(video, markers);
  this.video = video;
  this.markers = markers;
  this.vidEmitter = new VideoEmitter(video, markers);
  this.parentNode = this.video.parentNode;
  this.listContainer = document.createElement('ul');
  this.listContainer.className = 'popup-video-container';
  this.parentNode.appendChild(this.listContainer);
  this.bind();
}

module.exports = PopupVideo;

Emitter(PopupVideo.prototype);

PopupVideo.prototype.bind = function(){
  console.log(this.vidEmitter.on);
  this.events = events(this.vidEmitter, this);
  this.events.bind('marker', 'showNotification');
};

/**
 * Show Notification
 * @param  {Int} seconds
 * @param  {Object} data
 */

PopupVideo.prototype.showNotification = function(seconds, data){
  // create our element and show it.
  var el = document.createElement('li');
  el.className = 'popup-video-notification';
  el.innerHTML = data.html;
  this.listContainer.appendChild(el);
  redraw(el);
  var self = this;
  afterTransition.once(el, function(){
    self.emit('showing', el, data, self);
  });
  classes(el).add('show-notification');

  // bind mouse hover events, if enabled. We only hide our
  // popup when we hover out of the popup.
  // xxx what about touch?
  var hovering, expired;

  if (this._pauseOnHover) {
    hover(el, function(){
      hovering = true;
      self.video.pause();
    }, function(){
      hovering = false;
      self.video.play();
      if (expired) self.hideNotification.call(self, el, data);
    });
  }

  // remove our element from view
  setTimeout(function(){
    if (!hovering) self.hideNotification.call(self, el, data);
    expired = true;
  }, data.duration * 1000 || 10000);
};

/**
 * Hide Notification
 * @param  {Element} el
 * @param  {Object} json
 */

PopupVideo.prototype.hideNotification = function(el, json){
  var self = this;
  afterTransition.once(el, function(){
    el.parentNode.removeChild(el);
    self.emit('hidden', el, json, self);
  });
  classes(el).remove('show-notification');
};

PopupVideo.prototype.close =
PopupVideo.prototype.remove = function(){
  this.vidEmitter.unbind();
  this.events.unbind();
  this.el.parentNode.removeChild(this.el);
};

/**
 * Enable pause on hover
 * @return {PopupVideo}
 */

PopupVideo.prototype.pauseOnHover = function(){
  this._pauseOnHover = true;
  return this;
};


