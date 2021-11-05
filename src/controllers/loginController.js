const { getCookie } = require("./getCookie");
const { getFile } = require("./getFile");
const { readFile } = require("./readFile");

let getFileExcel = (username, password) => {
   return new Promise((resolve, reject) => {
      getFile(username, password).then((res) => {
          return resolve({
            'status' : 200,
            'message' : 'Login successful',
            'user' : {
                'name' : username
            }
          })
      }).catch((err) => {
        return reject({task:'getFile',success: false, error:err});
      })
   }).catch((err) => {
    return reject({task:'getFile',success: false, error:err});
   })
};

let login =  (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  getFileExcel(username, password)
    .then((result) => {
       res.send(result)
    })
    .catch((err) => {
        res.send({
            'status' : 500,
            'message' : 'Login failed' 
        });
    });
};

module.exports = {
  login: login,
};
