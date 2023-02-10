const express = require('express')
const app = express.Router();
const client = require('../db');

app.get('/', async(req, res, next) => {
  try {
    const response = await(client.query(`
      SELECT category.id, category.name as "categoryName", bookmark.name AS name, bookmark.url
      FROM bookmark
      LEFT JOIN category
      ON category.id = bookmark."categoryId" 
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
                    <a href=${ bookmark.url }>${ bookmark.name }</a> - <a href='/bookmarks/categories/${bookmark.id}
                    '>${bookmark.categoryName}</a>
                </li>
                `
            }).join(' ')
        
            }
          </ul>
        </body>
      </html>
    `)
    }
    catch(e) {
        next(e);
    }
});

app.get('/categories/:id', async(req, res, next) => {
    try {
      const response = await(client.query(`
        SELECT category.name AS "categoryName", bookmark.name
        FROM category
        LEFT JOIN bookmark
        ON category.id = bookmark."categoryId"
        WHERE category.id = $1
        `), [req.params.id])
      const categories = response.rows;
      console.log(categories);
    }
    catch(e) {
        next(e)
    }
})

module.exports = app;