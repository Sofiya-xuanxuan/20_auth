const Koa=require('koa');
const router=require('koa-router')();
const session=require('koa-session');
const cors=require('koa2-cors');
const bodyParser=require('koa-bodyparser');//用于解析post请求体
const static=require('koa-static');
const app=new Koa();

//配置session中间件
app.use(cors({
    credentials:true
}));

app.keys=['some secret'];


app.use(static(__dirname+'/'));
app.use(bodyParser());
app.use(session(app));

//鉴权
app.use((ctx,next)=>{
    if(ctx.url.indexOf('login')>-1) {
        next()
    } else {
        console.log('session', ctx.session.userinfo);
        if(!ctx.session.userinfo) {
            ctx.body={
                message:'登录失败'
            }
        }else {
            next();
        }
    }
});

router.post('/login',async (ctx)=>{
    const {body}=ctx.request;
    //设置session
    ctx.session.userinfo=body.username;
    ctx.body={
        message:'登录成功'
    }
});

router.post('/logout',async (ctx)=>{
    //删除session
    delete ctx.session.userinfo;
    ctx.body={
        message:'登出成功'
    }
});

router.get('/getUser',async (ctx)=>{
    ctx.body={
        message:'获取数据成功',
        userinfo:ctx.session.userinfo
    }
});

app.use(router.routes());

app.use(router.allowedMethods());

app.listen(3000);

