module.exports = {
    consts: {
        day: {
            start: "8:00",
            end: "18:00",
        },
        names: {
            normal: "Cégep",
            jr: "Journée particulière d'enseignement",
            ec: "Évaluation terminale communes",
            ehr: "Évaluation terminales selon l'horaire régulier",
            jm: "Journée de mise à jour",
            je: "Journée d'encadrement",
            jp: "Journée pédagogique",
            x: "Congé Férié"
            // Needs to be completed
        },
    },
    generateFullDays: true, // generates an event called "Cegep" for the day start to end
    generateSpecialDays: true, // generates JR days and stuff
    classesFileName: "classes.json",
    daysFileName: "days.json",
    fullClassNameFormat: "classCode - classRoom - className",
    classDayFormat: "month dayNum",
    outputFormat: "fullClassName;classDay at classTimeStart;classDay at classTimeEnd",
};
