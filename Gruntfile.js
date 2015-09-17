module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        files: {
          'public/dist/utilityLib.js' : ['public/lib/jquery.js',
            'public/lib/underscore.js',
            'public/lib/backbone.js',
            'public/lib/handlebars.js'
          ],
          'public/dist/client.js': ['public/client/**/*.js'],
        }
      }
      // dist: {
      //   // src: ['public/lib/*.js'],
      //   src: ['public/lib/jquery.js',
      //   'public/lib/underscore.js',
      //   'public/lib/backbone.js',
      //   'public/lib/handlebars.js'
      //   ],
      //   dest: 'public/dist/utilityLib.js'
      // }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        files: {
          'public/dist/utilityLib.min.js' : 'public/dist/utilityLib.js',
          'public/dist/app.min.js': ['app/**/*.js'],
          'public/dist/client.min.js': ['public/client/**/*.js'],
          'public/dist/server.min.js': ['./*.js', 'lib/*.js']
        }
      }
    },

    jshint: {
      files: {
        // Add filespec list here
        src: ['./*.js', 'app/**/*.js', 'public/client/*.js', 'lib/*.js']
      },

      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
        // Add filespec list here
      build: {
            src:'public/style.css',
            dest: 'public/dist/style.min.css'
        }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  grunt.registerTask('referenceUpdate', function(location, destination){
    //??
  });
  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here

    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      // add your production server task here
  ]);


};
