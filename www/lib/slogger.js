/**
 * User: sunny
 * Date: 13-10-28
 * Time: 下午6:44
 */
var config = require('../config');

var tracelogger = config.tracelogger;
var errorlogger = config.errorlogger;
var slogger = {
    debug : function() {
        console.debug.apply(console, arguments);
        tracelogger.debug.apply(tracelogger,arguments);
    },
    isDebugEnable : function() {
        return tracelogger.isLevelEnabled('DEBUG');
    },
    trace : function() {
        console.trace.apply(console, arguments);
        tracelogger.trace.apply(tracelogger,arguments);
    },
    isTraceEnable:function() {
        return   tracelogger.isLevelEnabled('TRACE');
    },
    warn : function() {
        console.warn(console, arguments);
        tracelogger.warn.apply(tracelogger,arguments);
    },
    isWarnEnable : function() {
        return   tracelogger.isLevelEnabled('WARN');
    },
    error : function() {
        console.error.apply(console, arguments);
        errorlogger.error.apply(errorlogger,arguments);
    }
};

module.exports = slogger;