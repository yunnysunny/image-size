var log4js = require('log4js');


var configObj = require('./config.json');
var settings = require('./lib/settings').init(configObj);

var traceFile = settings.loadNecessaryFile('tracelogfilename', true);
var errorFile = settings.loadNecessaryFile('errorlogfilename', true);

log4js.configure({
    appenders: [
        //{type: 'console'},
        {type: 'dateFile', filename: traceFile,  maxLogSize: 1024000, backups: 10, category: 'trace'},
        {type: 'file', filename: errorFile, maxLogSize: 1024000, backups: 10, category: 'error'}
    ]//,
    //replaceConsole: true
});

exports.debuglogger = log4js.getLogger('debug');
exports.tracelogger = log4js.getLogger('trace');
exports.errorlogger = log4js.getLogger('error');
