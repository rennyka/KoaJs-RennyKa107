const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const fetch = require('node-fetch');
const fs = require('fs');

app.use(bodyParser());
app.use(session(app));
app.keys = ['107']

async function crawlData() {
    let writeSuccess = false;
    const response = await fetch('http://dummy.restapiexample.com/api/v1/employees');
    const data = await response.json();
    fs.writeFile('employees.json', JSON.stringify(data.data), function (err) {
    })
}

function verifyLogin(ctx, next) {
    if (!ctx.session.user) {
        ctx.status = 403;
        ctx.body = "Fobidden"
    } else {
        return next()
    }
}

router.use(['/employees', '/employees/crawl'], verifyLogin)

router.get('/', ctx => {
    ctx.body = 'Hello World'
}).post('/login', ctx => {
    const req = ctx.request.body;
    if (req.username == 'rennyka' && req.password == '123') {
        ctx.session.user = {
            username: req.username,
            password: req.password
        }
        ctx.body = `Welcome ${req.username}`
    } else {
        ctx.status = 401;
        ctx.body = 'Unauthorized'
    }
}).get('/logout', ctx => {
    ctx.session = null;
    ctx.redirect('/')
}).post('/employees/crawl', ctx => {
    crawlData();
}).get('/employees', ctx => {
    let data = fs.readFileSync('employees.json', 'utf8')
    ctx.body = JSON.parse(data);
})


app.use(router.routes()).use(router.allowedMethods())
app.listen(3000);