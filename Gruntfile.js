'use strict';

const path = require('path');
const childProcess = require('child_process');

// wrapper function for grunt configuration
module.exports = function(grunt) {

  grunt.initConfig({

    // read in the package information
    pkg: grunt.file.readJSON('package.json'),

    // grunt-eslint plugin configuration (lint for JS)
    eslint: {
      options: {
      },
      target: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    // grunt-contrib-clean plugin configuration (clean up files)
    clean: {
      build: [
        'dist/*',
        'test/config/'
      ],
      options: {
        force: true
      }
    },

    exec: {
      clean: {
        command: 'scripts/clean-repository',
        stdout: false,
        stderr: false
      },
      publish: {
        command: 'scripts/publish-agents',
        stdout: false,
        stderr: false
      }
    },

    // grunt-mocha-test plugin configuration (unit testing)
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 10000 
        },
        src: [
          'test/**/*.js'
        ]
      }
    },

    // grunt-webpack plugin configuration (concatenates and removes whitespace)
    webpack: {
      lambdaConfig: {
        entry: ['./src/index.js'],
        target: 'node',
        mode: 'development',
        output: {
          path: `${process.cwd()}/dist`,
          filename: 'bali-nebula-repository.js',
          libraryTarget: 'umd'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('build', 'Build the module.', ['clean:build', 'exec:clean', 'eslint', 'mochaTest']);
  grunt.registerTask('package', 'Package the libraries.', ['clean:build', 'webpack', 'exec:publish']);
  grunt.registerTask('default', 'Default targets.', ['build']);

};
