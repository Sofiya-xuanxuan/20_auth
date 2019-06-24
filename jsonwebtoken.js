const jsonwebtoken=require('jsonwebtoken');

const secret='123334';
const opt={
    secret:'jwt_secret',
    key:'user'
};

const user={
    username:'abc',
    password:'111111'
};

const token=jsonwebtoken.sign({
    data:user,
    //设置token过期时间
    exp:Math.floor(Date.now()/100)+60*60
},secret);

console.log('生成token：', token);

//解码
console.log('解码：', jsonwebtoken.verify(token, secret, opt));
