module.exports = function(grunt) {
     grunt.initConfig({
         pkg: grunt.file.readJSON('www/package.json'),
         nodewebkit: {
             
             options: {
                 version: 'v0.12.0',
                 platforms: ['win'],
                 buildDir: 'builds'
             },
             src: ['www/**/*']
         }
         
     });
 
     grunt.loadNpmTasks('grunt-node-webkit-builder');
     grunt.registerTask('default', ['nodewebkit']);
 };