const http=require('http');
const session={};
http.createServer((req,res)=>{
    if(req.url==='/favicon.ico'){
        res.end(' ');
        return;
    }
    //观察cookie
    console.log('cookie:', req.headers.cookie);

    const sessionKey='sid';
    const cookie=req.headers.cookie;
    if(cookie && cookie.indexOf(sessionKey)>-1){
        res.end('come back');
        const pattern=new RegExp(`${sessionKey}=([^;]+);?\S*`);
        //\S表示可见字符
        //^只有在[]内才表示非 在外边表示开始
        //"*"  重复零次或更多 x>=0
        //"+"  重复一次或更多次 x>=1
        //"?"  重复零次或一次  x=(0||1)
        const sid=pattern.exec(cookie)[1];
        console.log('session:', sid, session, session[sid]);
    }else {
        //设置
        const sid=(Math.random()*999999999).toFixed();
        res.setHeader('Set-Cookie',`${sessionKey}=${sid};`);
        session[sid]={name:'laowang'};
        res.end('Hello');
    }
    //设置cookie
    // res.setHeader('Set-Cookie','cookie1=abc');
    // res.end('Hello cookie');
}).listen(3000);

//cookie: undefined
// cookie: sid=523606354
// session: 523606354 { '523606354': { name: 'laowang' } } { name: 'laowang' }