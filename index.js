const express = require('express');
const app = express();
const validUrl = require('valid-url');
const shortid = require('shortid');
const { Urls } = require('./models');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
var certificate = fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8');

var credentials = {key: privateKey, cert: certificate};


app.use(express.json());

app.get('/', async (req, res) => {
  // res.send(`<pre>${JSON.stringify(req.headers, null, 2)}</pre>`);
  res.send('Hello World!');
  return;
});

app.all('/create', async (req, res) => {
  const { long_url, short, random } = req.body;

  if (validUrl.isUri(long_url)) {
    // url is valid
    let count;
    let short_url;

    if (random === false) {
      res.status(400).send(
        JSON.stringify({
          status: 'error',
          message: 'Invalid Request',
        })
      );
      return;
    }
    if (!random) {
      //not random
      if (short) {
        // short is there
        count = await Urls.count({ where: { short_url: short } });
        if (count && !random) {
          res
            .status(409)
            .send({ status: 'Error!', message: 'Already Exists!' });
          return;
        }

        short_url = short;
      } else {
        // nor random neither short
        // default random is true
        short_url = shortid.generate();
        while (await Urls.count({ where: { short_url: short_url } })) {
          short_url = shortid.generate();
        }
      }
    } else {
      short_url = shortid.generate();
      while (await Urls.count({ where: { short_url: short_url } })) {
        short_url = shortid.generate();
      }
    }

    const variable = await Urls.create({
      long_url,
      short_url,
    });

    if (variable) {
      res.status(201).send({
        status: 'success',
        message: req.headers.host + '/' + short_url,
      });
      return;
    } else {
      res.status(500).send({ status: 'Error!', message: 'Unknown' });
      return;
    }
  }

  res.status(400).send({ status: 'Error', message: 'Is Not A Valid Url!' });
  return;
});

app.get('/favicon.ico', (req,res)=>{
return;
})

app.get('/:id', async (req, res) => {
  const { id } = req.params;
	console.log(id)
	if (id===""){
return
}
  // if (!shortid.isValid(id)) {
  //   res.sendStatus(404);
  //   return;
  // }

  const variable = await Urls.findOne({
    where: {
      short_url: id,
    },
  });

if(variable){
  res.status(302).redirect(variable.long_url);
}
else{
res.sendStatus(404);
}
});

//const PORT = process.env.PORT || 3000;
//app.listen(PORT, '0.0.0.0', () => {
//  console.log(`Listening on ${PORT}`);
//});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT || 80);
httpsServer.listen(process.env.HTTPS_PORT || 443);
