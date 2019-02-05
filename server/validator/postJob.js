
var missingParameters = function (job, requiredParameters) {
    var validateObj = {
        isValid: true
    }

    for (var i = 0; i < requiredParameters.length; i++) {
        var param = requiredParameters[i];
        if (!job[param]) {
            validateObj.isValid = false;
            validateObj.message = 'Missing Parameter ' + param;
            break;
        }
    }

    return validateObj;
}

module.exports = {
    missingParameters: missingParameters
}
