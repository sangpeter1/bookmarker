const express = require('express')
const app = express();
app.use(express.urlencoded({extended:false}));
const client = require('./db');
const fs = require('fs');

app.get('/', async(req, res, next) => {
  res.redirect('/bookmarks')
})

const port = (process.env.PORT || 3000);

const readFile = (path)=> {
    return new Promise((res, rej)=> {
      fs.readFile(path, (err, result)=> {
        if(err){
          rej(err);
        }
        else {
          res(result.toString());
        }
      });
    });
  };

app.use('/bookmarks', require('./routes/bookmarks'));


app.listen(port, async() => {
  try {
    console.log(`listening on ${port}`);
    await client.connect();
    const SQL = await readFile('./sql_db');
    await client.query(SQL);
  }
  catch(ex) {
      console.log(ex);
    }
  });