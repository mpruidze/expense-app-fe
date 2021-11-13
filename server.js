const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/home.html'));
});

const port = process.env.PORT || "2000";

app.listen(port, () => {
  console.log(`listen on `, port )
})

module.exports = app;
