console.log("Loading Dependencies: fs")
const fs = require("fs");
const { format } = require("path");
console.log("Loading config...")
const config = require("./config.js")

//Load up days into program
console.log("Loading "+ config.daysFileName + "...")
var days = JSON.parse(fs.readFileSync("./"+config.daysFileName).toString());

//Load up classes into program
console.log("Loading "+ config.classesFileName + "...")
var classes = JSON.parse(fs.readFileSync("./"+config.classesFileName).toString());

console.log("--------- Program ---------")

var dayTypes = []
    for (var type in config.consts.names){
        dayTypes.push(type);
    }

var dayNames = [];
var normalDaysOutput = "";

// Get the used weekdays in the classes file. We do not need to iterate thru unused weekdays, specially in javascript
// If you ask why not use the days file, its because its probably complete for all weekdays.
for (var weekday in classes){
    dayNames.push(weekday);   
}
// Iterate thru any weekday where we have classes:
dayNames.forEach((dayName) => { 
    // Go thru the dayName in days.normal (contains months + dates where that weekday is found on the schedule) and get its data
    days.normal[dayName].forEach((dayData) => {
        // Go thru every day of the dayData. 1 Day data has a singular "month" attribute and a "days" array, 
        //making up all the date of that month that are x "weekday" or "dayName"
        dayData.days.forEach((day) => {
            // Now we go thru the classes of x "weekday" or "dayName", obtaining each classData, which contains
            // the classe's name, code, room, start time and end time. 
            classes[dayName].forEach((classData) => {
                // here we append to the output string the generatedoutputLine.
                normalDaysOutput = normalDaysOutput + generateoutputLine(classData, dayData.month, day) + "\n";
            })        

        })   
    })
})
console.log(normalDaysOutput)
console.log("--------------------")


var specialDays = [];
for(var type in days.otherDays) {
    for (var month in days.otherDays[type]){
        for(var date of days.otherDays[type][month]) {
            dayText = [];
            dayText.push(`Cégep - ${replaceDayType(type)}`)
            dayText.push(`${generateOutputDayName(month, date)} at ${config.consts.day.start}`)
            dayText.push(`${generateOutputDayName(month, date)} at ${config.consts.day.end}`)        
            specialDays.push(dayText.join(";"))
        }
    }
}
var specialDaysOutput = specialDays.join("\n")
console.log(specialDaysOutput);
fs.writeFileSync("output.txt",specialDaysOutput+ "\n" + normalDaysOutput);

function replaceDayType(type){
    if(dayTypes.includes(type.toLowerCase())){
        return config.consts.names[type.toLowerCase()];
    }
    else{
        return type
    }
}

function generateoutputLine(classToUse, month, dayNum){
    // load up the output line format from config
    var format = config.outputFormat;
    // try to get the full class name from the class data.
    try {
        // get the full class name
        var fullClassName = getClassFullName(classToUse);
    }
    catch(err) {
        // If it fails, just call it "Fail".
        fullClassName = "Fail"
    }
    // replace the placeholder in the format with the previously loaded variable
    format = format.replace("fullClassName", fullClassName)
    try {
        // generate the output day name.
        var classDay = generateOutputDayName(month, dayNum);
    }
    catch(err) {
        // If it fails, just call it "Fail".
        classDay = "Fail"
    }
    // replace the placeholder in the format with the previously loaded variable
    // Runs twice because normally classDay is present twice in the placeholder format
    format = format.replace("classDay", classDay)
    format = format.replace("classDay", classDay)
    try {
        // get the time at which the class starts
        var classTimeStart = classToUse.time.start;
    }
    catch(err) {
        // If it fails, just call it "Fail".
        classTimeStart = "Fail"
    }
    // replace the placeholder in the format with the previously loaded variable
    format = format.replace("classTimeStart", classTimeStart)
    try {
        // get the time at which the class ends
        var classTimeEnd = classToUse.time.end;
    }
    catch(err) {
        // If it fails, just call it "Fail".
        classTimeEnd = "Fail"
    }
    // replace the placeholder in the format with the previously loaded variable
    format = format.replace("classTimeEnd", classTimeEnd)
    // return the output line
    return format.trim();
}

function generateOutputDayName(month, dayNum){
    // generates the output day name from the format in the config.
    var format = config.classDayFormat;
    //replace the placeholders
    return format.replace("month", capitaliseFirstLetter(month)).replace("dayNum", dayNum).trim();
}

// This function capitalises the first letter of a string
function capitaliseFirstLetter(string){
    // get the first char, uppercase it
    firstLetter = string.substring(0,1).toUpperCase();
    // get the rest of the string
    restOfString = string.substring(1,string.length)
    // return the first char uppercased and the rest of the string.
    return firstLetter+restOfString;
}

function getClassFullName(classToUse) {
    // load up the class name format from the config
    var format = config.fullClassNameFormat;
    //try to get the class code
    try {
        // get the class code
        var code = classToUse.class.code;
    }
    catch(err) {
        // If it fails, just call it "Fail".
        code = "Fail"
    }
    try {
        // get the class name
        var name = classToUse.class.name;
    }
    catch(err) {
        // If it fails, just call it "Fail".
        name = "Fail"
    }
    try {
        // get the class room
        var room = classToUse.class.room;
    }
    catch(err) {
        // If it fails, just call it "Fail".
        room = "Fail"
    }
    // replace the placeholders and return the full class name
    return format.replace("classCode", code).replace("className", name).replace("classRoom", room).trim();
}
