const titbit=require('titbit');
const crypto=require('crypto');
const xmlparse=require('xml2js').parseString;

var app=new titbit();
var{router}=app;
router.get('/wx/msg',async c=>{
    let token='xinxin';
    let urlargs=[
        c.query.nonce,
        c.query.timestamp,
        token
    ];

    urlargs.sort();
    let onestr=urlargs.join('');


    //创建sha1加密的Hash对象
    let hash=crypto.createHash('sha1');
    let sign=hash.update(onestr);//进行hash计算

    if(sign.digest('hex')===c.query.signature){
        c.res.body=c.query.echostr;
    }
});
router.post('/wx/msg',async c =>{
    console.log(c.body);

    try{
        let data=await new Promise((rv,rj)=>{
            xmlparse(c.body,{explicitArray:false},
                (err,result)=>{
                    if(err){
                        rj(err);
                    }else{
                        rv(result.xml);
                    }
                }
                )
        });

        if(data.MsgType=='text'){
            c.res.body=`<xml>
               <FromUserName>${data.ToUserName}</FromUserName>
               <ToUserName>${data.FromUserName}</ToUserName>
               <CreateTime>${parseInt(Date.now()/1000)}</CreateTime>
               <MsgType><![CDATA[text]]></MsgType>
               <Content><![CDATA[${data.Content}]]></Content>
            </xml>`;
        }
    }catch(err){
        console.log(err);
    }
});
app.run(8001,'localhost');
