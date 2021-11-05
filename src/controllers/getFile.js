
var fs = require('fs');
const path = require('path');
const requestPromise = require("request-promise");
const { getCookie } = require("./getCookie");
const { getElements } = require("./getElement");
const urlOrigin = "http://qldt.actvn.edu.vn";
const urlStudentTimeTable = "http://qldt.actvn.edu.vn/CMCSoft.IU.Web.Info/Reports/Form/StudentTimeTable.aspx"
let optionsGetFile = (cookies,form) =>{
    return {
        resolveWithFullResponse: true,
        method : 'POST',
        encoding: null,
        uri : urlStudentTimeTable,
        headers: {
            'Connection' : 'keep-alive',
            'Cache-Control' : 'max-age=0',
            'Origin' : urlOrigin,
            'Upgrade-Insecure-Requests' : '1',
            'Content-Type' : 'application/x-www-form-urlencoded',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
            'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Referer' : urlStudentTimeTable,
            'Accept-Encoding' : 'gzip, deflate',
            'Accept-Language' : 'en-US,en;q=0.9,vi;q=0.8',
            'cookie' : cookies
        },
        form:form
    }
}


let getFile = async(username,password) =>{
    return new Promise((resolve,reject)=>{
        getCookie(username,password).then((result)=>{
            let cookies = result.cookies
            getElements(urlStudentTimeTable,cookies).then(async(_result)=>{
                requestPromise(optionsGetFile(cookies,_result.elements)).then(async(__result)=>{
                    let file =   fs.createWriteStream(path.resolve(`${__dirname}/file`,`${username}.xls`));
                    file.write(__result.body);
                    file.end();
                    return resolve({task:'getFile',success:true,filename:`${username}.xls`});
                })
            }).catch((err) => {
                return reject({task:'getFile',success: false, error:err});
            })
        }).catch((error)=>{
            return reject({task:'getCookie',success: false, error:error});
        })
    }); 
}

module.exports = {
    getFile : getFile
}