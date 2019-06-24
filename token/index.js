const Koa=require('koa');
const router=require('koa-router')();
const static=require('koa-static');
const bodyParser=require('koa-bodyparser');
const app=new Koa();
const jwt=require('jsonwebtoken');
const jwtAuth=require('koa-jwt');

const secret="it's a secret";
app.use(bodyParser());
app.use(static(__dirname+'/'));

router.post('/login-token',async ctx=>{
    const {body}=ctx.request;
   //设置session
   const userinfo=body.username;
   ctx.body={
       message:'登录成功',
       user:userinfo,
       token:jwt.sign({
           data:userinfo,
           //设置token过期时间，一小时后，秒为单位
           exp:Math.floor(Date.now()/1000)+60*60
       },secret)
   }
});

router.get('/getUser-token',jwtAuth({secret}),async ctx=>{
    //验证通过
    console.log(ctx.state.user);//state 用于存储中间件的一些值
   //获取session
   ctx.body={
       message: '获取数据成功',
       userinfo:ctx.state.user.data
   }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);