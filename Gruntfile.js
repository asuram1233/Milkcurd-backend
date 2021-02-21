module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'api/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          console: true,
          module: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'qunit']
      },
      configFiles: {
        files: ['Gruntfile.js', 'config/*.js'],
        options: {
          reload: true
        }
      }
    },
    concurrent: {
      default: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    apidoc: {
      wcloudapi: {
        src: "api/",
        dest: "apidocs/"
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-apidoc');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('test', ['jshint', 'nodemon', 'watch']);
  grunt.registerTask('default', ['jshint', 'apidoc', 'concurrent']);
  grunt.registerTask('bump', ['bump']);
  grunt.registerTask('rs', ['nodemon', 'watch']);

};
