var XLSX = require("xlsx");
const path = require("path");
var fs = require('fs');

let readFile= async (req, res) => {

  var workbook = XLSX.readFile(path.resolve(`${__dirname}/file`,`${req.body.name}.xls`));
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];

  let name = worksheet["C6"]["v"];
  let student_id = worksheet["F6"]["v"];
  let class_name = worksheet["C7"]["v"];
  let major = worksheet["F8"]["v"];

  let schedule = [];
  let timeSchedule = []
  timeSchedule["1,2,3"] = "07:00 - 09:25"
  timeSchedule["4,5,6"] = "09:35 - 11:55"
  timeSchedule["7,8,9"] = "12:30 - 14:45"
  let getAddressCell = (str) => {
    let r = /\d+/;
    let row = parseInt(str.match(r)[0]);
    let col = str.replace(row, "");
    return { row: row, col: col };
  };
  let formatDateYMD = (str) => {
    str = str.split("/");
    let day = str[0];
    let month = str[1];
    let year = str[2];
    return new Date(`${year}/${month}/${day}`);
  };
  let formatDay = (day) => {
    return day;
  };
  let findDatewithDay = (start_date, end_date, day) => {
    let dateList = [];
    for (let i = start_date; i < end_date; i += 60 * 60 * 24 * 1000) {
      let date_check = new Date(i);
      if (formatDay(day) == date_check.getDay()) {
        dateList.push(date_check.getTime());
      }
    }
    return dateList;
  };
  let findIndexDate = (date) => {
    let index = -1;
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i].dateInt == date) {
        return i;
      }
    }
    return index;
  };
  
  let addToSchedule = (
    start_date,
    end_date,
    day,
    lesson,
    subject_name,
    address
  ) => {
    let dateList = [];
    // console.log(start_date,end_date,day,lesson,subject_name,address);
    dateList = findDatewithDay(start_date, end_date, day);
    
    for (let i = 0; i < dateList.length; i++) {
      var found = findIndexDate(dateList[i]);
      
      if (found == -1) {
        let lessons = new Array();
        lessons.push({
          lesson: lesson,
          timer: timeSchedule[lesson],
          subject_name: subject_name,
          address: address,
        });
      
        schedule.push({ dateInt: dateList[i], date: new Date(dateList[i]).toISOString().split('T')[0], lessons: lessons });
        schedule.sort((a,b) => {
          return a.dateInt - b.dateInt;
        })
      } else {
        schedule[found].lessons.push({
          lesson: lesson,
          timer: timeSchedule[lesson],  
          subject_name: subject_name,
          address: address,
        });
      }
    }
  };
  let lessonArray = (lesson) => {
    let lesson_array_new = [];
    let lesson_array = ["1,2,3", "4,5,6", "7,8,9", "10,11,12", "13,14,15,16"];
    for (let i = 0; i < lesson_array.length; i++) {
      if (lesson.indexOf(lesson_array[i]) != -1) {
        lesson_array_new.push(lesson_array[i]);
      }
    }
    return lesson_array_new;
  };
  let getInfoDetail = (start_date, end_date, subject_name, str) => {
    str = str.split("\n");
    for (let i = 0; i < str.length; i++) {
      if (str[i] != "" && str[i] != null && str[i] != undefined) {
        //console.log("===>",str_start_date,str_end_date,str[i]);
        let str_info = str[i].split("tại");
        let address = str_info[1];
        let day_and_lesson = str_info[0].split("tiết");
        let lesson = day_and_lesson[1].replace(" ", "").replace(" ", "");
        let day = day_and_lesson[0].replace(" ", "").replace("Thứ", "");
        let lesson_array = lessonArray(lesson);
        for (let i = 0; i < lesson_array.length; i++) {
          // console.log(start_date,end_date,day,lesson_array[i],subject_name,address);
          addToSchedule(
            start_date,
            end_date,
            day,
            lesson_array[i],
            subject_name,
            address
          );
        }
      }
    }
  };

  for (let z in worksheet) {
    if (z[0] === "!") continue;
    //console.log(getAddressCell(z),z,worksheet[z]["v"]);
    if (
      worksheet[z]["v"].toString().indexOf("Từ") >= 0 &&
      worksheet[z]["v"].toString().indexOf("đến") >= 0
    ) {
      let address_cell = getAddressCell(z);
      let subject_name = worksheet[`F${address_cell.row}`]["v"].split("-")[0];
      let sessionList = worksheet[z]["v"].toString().split("Từ");
      for (let i = 0; i < sessionList.length; i++) {
        let str = sessionList[i].replace("\n", "").split(":");
        let str_datetime = str[0].replace(" ", "").split("đến");
        let str_start_date = str_datetime[0];
        let str_end_date = str_datetime[1];
        if (str_start_date != undefined && str_end_date != undefined) {
          getInfoDetail(
            formatDateYMD(str_start_date).getTime(),
            formatDateYMD(str_end_date).getTime(),
            subject_name,
            str[1]
          );
        }
      }
    }
  }
    return res.send({
      task:'readFile',
      success:true,
      student_id :student_id,
      name:name,
      class_name:class_name,
      major:major,
      schedule:schedule
    })
};

module.exports = {
  readFile: readFile,
};
