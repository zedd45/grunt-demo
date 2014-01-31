/**
 * Example / Demo Gruntfile
 * the concept is to get a bunch of tasks, group related ones with aliases so we can "batch" them together
 * and make bundling development and production versions very easy
 * you could further integrate git commit hooks to kick off CI environments. 
 */

module.exports = function (grunt) {
	
	"use strict";
	
	// dynamically load modules that start with "grunt" from package.json
	require('matchdep').filterAll('grunt-*', require("./package.json")).forEach( grunt.loadNpmTasks );
	
	
	grunt.initConfig({
		
		lessTargets: [{
			expand: true,
			cwd: 'less/',
			src: ['**/!(_)*.less'],
			dest: 'dist/css/',
			ext: '.css'
		}],
		
		/**
		 * Wire up our Bower Deps. with our existing require config.
		 * our require config in this example is empty, but this would work with existing config files
		 * https://github.com/yeoman/grunt-bower-requirejs
		 */
		bower: {
			dist: {
				rjsConfig: 'require_config.js'
			}
	    },

		/**
		 * delete generated files
		 * https://github.com/gruntjs/grunt-contrib-clean
		 */
		clean: {
			// this is a multi-task, so we can use named targets, and run those with task:target (clean:dist)
			// or we can call "clean" to run them all 
			components: ['components'],
			dist: ['dist']
	    },

	    /**
	     * get your feelings hurt, but imporove your code
	     * https://github.com/stephenmathieson/grunt-jslint
	     */
	    jslint: {
	    	grunt: {
	    		files: [{
	    			expand: true,
	    			cwd: 'js',
	    			src: ['**/*.js']
	    		}],
	    		directives: {
		          browser: true,
		          white: true,
		          devel: true,
		          predef: [
		          	'define'
		          ]
		        },
		        options: {
		        	errorsOnly: true
		        }	
	    	}
	    },

		/**
		 * this is where our less parser puts together our finalized CSS files
		 * https://github.com/gruntjs/grunt-contrib-less
		 */
		less: {
			
			options: {
				ieCompat: true
			},
			
			dev: {
				options: {
					sourceMap: true
				},
				files: '<%= lessTargets %>'
		  	},
			
			dist: {
				options: {
					report:	'min',
					cleancss: true
				},
				files: '<%= lessTargets %>'
			}
		},

		/**
		 * this target allows us to bump the version in package.json and push to the default repo, npm, and create a new tag on the repo
		 * https://github.com/geddski/grunt-release
		 */
		release: {
			options: {
				npm: false, // no repo; this isn't a component so much as a demo 
				folder: '', //default project root for NPM; unset as we're not using NPM
				commitMessage: 'Grunt Release of Grunt Demo project.  Version: <%= version %>'
			}
		},
		
		/**
		 * optimize require modules using r.js.
		 * https://github.com/gruntjs/grunt-contrib-requirejs
		 * https://github.com/jrburke/r.js/blob/master/build/example.build.js
		 * TODO: http://requirejs.org/docs/faq-advanced.html#rename  -- namespace TST modules?
		 */
		requirejs: {
		    
			/*
			options: {
				// ignore CSS files
				optimizeCss: "none",
				
				
				// Introduced in 2.1.2 and considered EXPERIMENTAL; this tries to make unminified versions that we can read in Chrome etc. for production / dev.  it works... OK, but not great.
				generateSourceMaps: true,
				// must be off for GenSourceMaps
				preserveLicenseComments: false,
				
				// if you want to keep the directory you are optimizing...
				keepBuildDir: true,
				
				baseUrl: "js",
				dir: "dist/js",
				mainConfigFile: "require_config.js",
				
				modules: [
					{ 
						name: "js/pageOne.js"
					},
					{ 
						name: "js/pageTwo.js"
					}
				]
			},

			dev : {
				options: {
					optimize: "none" 
				}
			},
		
			dist: {
				options: {
					optimize: "uglify2"
				}
			}
			*/

			
		    options: {
		      findNestedDependencies: true,
		      mainConfigFile: 'require_config.js',
		      name : 'js/pageOne',
		      out: 'dist/js/pageOne.js',
		      // optimize: 'uglify2',
		      optimize: 'none',
		      optimizeCss: 'none',
			  generateSourceMaps: true,
				  // must be off for GenSourceMaps
		      preserveLicenseComments: false,
		      relativeUrl: './',
		      skipDirOptimize: true,
		      useStrict: true
		    },
			 

			 dev : {
				options: {
					optimize: "none" 
				}
			},
		
			dist: {
				options: {
					optimize: "uglify2"
				}
			}

	
		},

		template: {
    		dev: {
    			engine: 'handlebars',
      			cwd: './',
      			partials: ['handlebars/partials/*.hbs'],
      			data: 'data/myData.json',
      			files: [{
          			expand: true,     // Enable dynamic expansion.
          			cwd: 'handlebars',      // Src matches are relative to this path.
          			src: ['*.hbs', '*.handlebars'], // Actual pattern(s) to match.
          			dest: 'dist/',   // Destination path prefix.
          			ext: '.html'  // Dest filepaths will have this extension.
          		}]
          	}
        },
		
		
		/**
		 * recompile assets when one changes
		 * https://github.com/gruntjs/grunt-contrib-watch
		 */ 
		watch: {
		    
		    options: {
		        // required in order to selectively process targets (aka single file vs all files)
                nospawn: true
		    },
			bower: {
				files: [ 'components' ],
				tasks: ['bower']
			},
			less: {
				files: ['less/**/*.less'],
				tasks: ['less:dev']
			},
			handlebars:{
				files: ['handlebars/**/*.handlebars', 'handlebars/**/*.hb'],
				tasks: ['handlebars:dist']
			},
			js: {
				files: ['js/**/*.js'],
				tasks: ['requirejs:dev']
			}
			// COFFEE!!!!! (Like I need another cup...)
	    }
		
	});
	
	// http://stackoverflow.com/questions/14166591/automate-npm-and-bower-install-with-grunt
	 grunt.registerTask('install', 'install the bower (frontend) dependencies', function() {
        
        var exec = require('child_process').exec,
        	callback = this.async();

        // this should execute in the folder context of your bower.json.
        exec('bower install', {cwd: './'}, function(err, stdout, stderr) {
            if (stderr) {
            	console.error(stderr);
            }
            console.log(stdout);
            callback();
        });
    });
	

	/**
	 * target for developers to do FS watch and recompile on change
	 */ 
	grunt.registerTask('dev', ['watch']);

	// if we run "grunt" with no modifiers, we get uncompressed, developer friendly versions of the files
	grunt.registerTask('default', [
		'install',
		//'template',
		'bower:dist',
		'requirejs:dev',
		'less:dev'
	]);
	
	// production target
	grunt.registerTask('dist', [
		'clean',
		'install',
		'bower_clean',
		'bower:dist',
		//'template',
		'requirejs:dist',
		'less:dist'
	]);		
};