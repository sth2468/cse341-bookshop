// mine
const fs = require('fs');

const users = ['HarryPotter', 'RonWeasly', 'HermoineGranger', 'TomRiddle'];
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Prove01</title>');
    res.write('<style>');
    res.write('body { background-color: black; color: white; }');
    res.write('h1 { font-family: "Blackadder ITC", "Curlz MT", "Felix Titling", sans-serif; color: white; font-size: 55pt; text-align: center; padding: 15pt; }');
    res.write('form { padding: 0 200pt; }');
    res.write('label { font-size: 20pt; }');
    res.write('button { font-size: 20pt; margin: 20pt; }');
    res.write('</style></head>');
    res.write('<body>');
    res.write('<h1>Welcome to the Wizarding World of Prove 01!</h1>');
    res.write('<form action="/create-user" method="POST"><label for="username">Username:</label><input type="text" id="username" name="username"><button type="submit">Submit</button></form>');
    res.write('</body></html>');
    return res.end();
  }
  
  if (url === '/users') {
    res.write('<html>');
    res.write('<head><title>Dummies</title>');
    res.write('<style>');
    res.write('body { background-color: black; color: white; }');
    res.write('h1 { font-family: "Blackadder ITC", "Curlz MT", "Felix Titling", sans-serif; color: white; font-size: 55pt; text-align: center; padding: 15pt; }');
    res.write('ul, form { padding: 0 200pt; }');
    res.write('li, label { font-size: 20pt; }');
    res.write('button { font-size: 20pt; margin: 20pt; }');
    res.write('</style></head>');
    res.write('<body><h1>Prove 01 Wizards & Witches User List:</h1>');
    res.write('<ul>');
    for (const user of users) {
      res.write(`<li>${user}</li>`);
    }
    res.write('</ul>');
    res.write('<form action="/create-user" method="POST"><label for="username">Username:</label><input type="text" id="username" name="username"><button type="submit">Submit</button></form>');
    res.write('</body></html>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const newUser = parsedBody.split('=')[1];
      fs.writeFile('users.txt', newUser, err => {
        console.log(newUser);
        users.push(newUser);
        res.writeHead(302, { Location: '/users' });
        return res.end();
      });
    });
  }
};

exports.handler = requestHandler;