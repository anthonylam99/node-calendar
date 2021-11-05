const cheerio = require("cheerio");
var requestPromise = require("request-promise");
const urlLogin = "http://qldt.actvn.edu.vn/CMCSoft.IU.Web.Info/Login.aspx";
const urlOrigin = "http://qldt.actvn.edu.vn";
let optionsGetElement = (uri,cookies) =>{
 
    return {
        method : 'GET',
        uri : uri,
        followRedirect: true,
        headers: {
            'Connection' : 'keep-alive',
            'Cache-Control' : 'max-age=0',
            'Origin' : urlOrigin,
            'Upgrade-Insecure-Requests':'1',
            'Content-Type' : 'application/x-www-form-urlencoded',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.18 Safari/537.36 Edg/75.0.139.4',
            'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Referer' : urlLogin,
            'Accept-Encoding' : 'gzip, deflate',
            'Accept-Language' : 'en-US,en;q=0.9',
            'cookie' : cookies,
        }
    }    
}

let getElements = (uri, cookies) => {
  return new Promise((resolve, reject) => {
    requestPromise(optionsGetElement(uri, cookies))
      .then((response) => {
        let $ = cheerio.load(response);
        let hiddenInputList = $('input[type="hidden"]');

        let elements = {};
        if (cookies != null) {
          let options = $('option[selected="selected"]');
          elements["PageHeader1$drpNgonNgu"] = options[0].attribs.value;
          elements["drpSemester"] = options[1].attribs.value;
          elements["drpTerm"] = options[2].attribs.value;
          elements["drpType"] = options[3].attribs.value;
          elements["btnView"] = "Xuất file Excel";
        }

        for (let i = 0; i < hiddenInputList.length; i++) {
          if (hiddenInputList[i].attribs.value == undefined) {
            elements[hiddenInputList[i].attribs.name] = "";
          } else {
            elements[hiddenInputList[i].attribs.name] =
              hiddenInputList[i].attribs.value;
          }
        }
        return resolve({
          task: "getElements",
          success: true,
          elements: elements,
        });
      })
      .catch((error) => {
        return reject({ task: "getElements", success: false, error: error });
      });
  });
};

module.exports = {
  getElements: getElements,
};
