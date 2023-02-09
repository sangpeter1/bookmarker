const express = require('express')
const app = express();
const client = require('./routes/');
const SQL = require('./routes');
const fs = require('fs');

app.get('/', async(req, res, next) => {
  const response = await(client.query(`
  SELECT *
  FROM bookmark
  `))
  const bookmarks = response.rows;
  res.send(`
  <html>
    <head>
    <title>Bookmarkers</title>
    </head>
    <body>
      <h1>Bookmarkers</h1>
      <ul>
        ${bookmarks.map( bookmark => {
            return `
            <li>
              ${bookmark.name}
            </li>
            `
        }).join(' ')

        }
      </ul>
    </body>
  </html>
  `)
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

app.use('/public', express.static('assets'));
app.use(express.urlencoded({extended:false}));

app.get('/', async(req, res, next) =>{
  try{
    await res.send('hello')
  }
  catch(ex){
    next(ex)
  }
})



app.listen(port, async() => {
  try {
    console.log(`listening on ${port}`);
    await client.connect();
    const SQL = await readFile('./routes/sql_db');
    await client.query(SQL);
  }
  catch(ex) {
      console.log(ex);
    }
  });