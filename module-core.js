/*  Usage:

	Author: Noah Damiani
	
	Define your web app: App.container = document.getElementById('#your-app-name') |or jquery| $('#your-app-name');
	Define Modules, reference module-example.js
	Start module core: App.Core.startAll();
	
*/

var App = App || {};

Chassis = function(obj) {
	return {
		sync: function(sync) {
			var xhr = new XMLHttpRequest();
			xhr.open(sync.method, encodeURI(sync.url), true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onload = function() {
			  if (xhr.status >= 200 && xhr.status < 400) {
			  	sync.success(JSON.parse(xhr.responseText));
			  }
			};
			if(sync.hasOwnProperty('content')) {
				xhr.send(JSON.stringify(sync.content));
			} else {
				xhr.send();
			}
		}
	}
};

App.Core = function() {
	var moduleData = {};

	return {

		register: function(moduleId, generator) {
			moduleData[moduleId] = {
				generator: generator,
				instance: null
			};
		},

		start: function(moduleId) {
			var mi = moduleData[moduleId].instance;
			mi = moduleData[moduleId].generator(new Chassis(this));
			mi.elString = mi.el;
			mi.el = document.querySelector(mi.el);
			mi.init();
			this.eventMapper(mi);
		},

		startAll: function() {
			for (var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.start(moduleId);
				}
			}
		},

		stop: function(moduleId) {
			var data = moduleData[moduleId];
			if (data.instance) {
				data.instance.destroy();
				data.instance = null;
			}
		},

		stopAll: function() {
			for (var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.stop(moduleId);
				}
			}
		},

		eventMapper: function(module) {
			for (e in module.events) {
				var myEvent = e.substr(0, e.indexOf(' ')),
					second = e.substr(e.indexOf(' ')+1),
					selector = document.querySelectorAll(module.elString + ' ' + second);
				if(selector.length) {
					for (var i = 0; i < selector.length; i++) {
						selector[i].addEventListener(myEvent, module.events[e].bind(module));
					}
				} else {
					throw 'Could not find ' + selector + ' while trying to create ' + myEvent + ' event in module.';
				}
			}
		}
	};
}();
