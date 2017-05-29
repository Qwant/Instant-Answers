
module.exports = function(severity, message, moduleName, trace, createdAt){
  severity = severity.toLowerCase();
  trace = trace || [];
  if(!Array.isArray(trace)) {
    trace = [trace];
  }
  moduleName = moduleName || '';
  message = message || ''
  createdAt = createdAt || new Date().getTime();
  var severities = [
    'emergency',
    'alert',
    'critical',
    'error',
    'warning',
    'notice',
    'info',
    'debug'
  ]
  if(severities.indexOf(severity) == -1) {
    severity = severities[0];
  }
  return {
    "created_at": createdAt,
    "module": moduleName,
    "severity": severity,
    "message": message,
    "trace": trace
  }
}