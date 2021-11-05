const requestPromise = require("request-promise");
const { getElements } = require("./getElement");

const urlLogin = "http://qldt.actvn.edu.vn/CMCSoft.IU.Web.Info/Login.aspx";
const urlOrigin = "http://qldt.actvn.edu.vn"
let optionsGetCookies = (username, password, form) => {
  form["__EVENTTARGET"] = "";
  form["txtUserName"] = username;
  form["txtPassword"] = password;
  form["btnSubmit"] = "Đăng nhập";
  
  return {
    method: "POST",
    uri: urlLogin,
    simple: false,
    timeout: 20000,
    followRedirect: true,
    resolveWithFullResponse: true,
    form: form,
    headers: {
      Connection: "keep-alive",
      "Cache-Control": "max-age=0",
      Origin: urlOrigin,
      "Upgrade-Insecure-Requests": "1",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.18 Safari/537.36 Edg/75.0.139.4",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      Referer: urlLogin,
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.9",
    },
  };
};

let getCookie = (username,password) =>{
    return new Promise((resolve,reject)=>{
        getElements(urlLogin,null).then((result)=>{
            // const username = 'AT140726'
            // const password = '1edc3dc97b5b6645f7353b4eee578207'
            let elements = result.elements;
            
            requestPromise(optionsGetCookies(username,password,elements)).then((_result)=>{
                // console.log({task:'getCookies',success:true, cookies:_result.headers['set-cookie']});
               return resolve({task:'getCookies',success:true, cookies:_result.headers['set-cookie']});
            }).catch((_error)=>{
                return reject({task:'getCookies',success: false, error:_error});
            })
        }).catch((error)=>{
            return {task:'getElements',success: false, error:error};
        })
    });
}


module.exports = {
    getCookie: getCookie,
  };
  