define([
  'jquery',
  'backbone',
  'handlebars'
], function($, Backbone, Handlebars){

	'use strict';

	// return a handle to modules that consume this guy
	return {
		message: "<p>some codez!</p>",
		method: function () {
			if ("function" === typeof console.log) {
				console.log('hurrah');
			}
			$
		},
		method2: function () {
			Handlebars.compile(this.message);
		}
	}

});
