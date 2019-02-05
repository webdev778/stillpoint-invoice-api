var setHoursType = function (hoursType) {
    this.hoursType = hoursType;
}

var getHoursType = function () {
    return this.hoursType;
}

var setStates = function (states) {
    this.states = states;
}

var getStates = function () {
    return this.states;
}

var setPracticeArea = function (practiceArea) {
    this.practiceArea = practiceArea;
}

var getPracticeArea = function () {
    return this.practiceArea;
}

var setSkills = function (skills) {
    this.skills = skills;
}

var getSkills = function () {
    return this.skills;
}

module.exports = {
    states: [],
    practiceArea: [],
    skills: [],
    hoursType: [],
    getHoursType: getHoursType,
    setHoursType: setHoursType,
    setStates: setStates,
    getStates: getStates,
    setPracticeArea: setPracticeArea,
    getPracticeArea: getPracticeArea,
    setSkills: setSkills,
    getSkills: getSkills,
}