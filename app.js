const Koa=require('koa');
const app=new Koa();
const session=require('koa-session');
//引入redis
const redisStore=require('koa-redis');
const redis=require('redis');
const redisClient=redis.createClient(6379,'localhost');

//将redisClient套一下，转换成promise的形式
const wrapper=require('co-redis');
const client=wrapper(redisClient);
//签名key keys作用  用来cookie进行签名
app.keys=['some secret'];


//配置项
const SESS_CONFIG={
    key:'kkb:sess',//cookie键名
    maxAge:86400000,//有效期，默认一天
    httpOnly:true,//仅服务器修改
    signed:true,//签名cookie
    store:redisStore({client})//session存储的地方，此处可以不必指定client
};

//注册
app.use(session(SESS_CONFIG,app));

//
app.use(async (ctx,next)=>{
    const keys=await client.keys('*');
    keys.forEach(async key=>console.log(key,await client.get(key)));
    await next();
});
//测试
app.use(ctx=>{
    if(ctx.path==='/favicon.ico')return;
    //获取
    console.log(ctx.session.count);
    let n=ctx.session.count || 0;
    //设置
    ctx.session.count=++n;

    ctx.body='第'+n+'次访问';

});

app.listen(3000);