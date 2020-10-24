const express = require('express');
const app = express();
const port = 3000;
const localHostString = `http://localhost:${port}`  // string literal templayes using acutes `

app.get('/', (req, res) => {        // the / or route is looking for the root url path, which I think is the main: in the package.json, which I routed correctely 
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at ${localHostString}`)
  })