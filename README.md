# 联通流量专区充值接口(异步接口)

## DEMO

```js
var union_flow = require('union_flow')({
	apiUrl:"http://ip:port/server/store/servicedata.do",//联通流量充值ip,端口
	cpid:"",//渠道id
	secretkey:""//md5 key
});
union_flow.query({
        thirdOrderNum:"navy_test_xxxxxx_3"
},function(err,data){
        console.log('query',err,data);//{ resultcode: '1999', message: '系统错误' }
});
```

API:

[`recharge`](#recharge) : 流量充值接口

[`query`](#query) : 充值结果查询

[`exists`](#exists) : 判断充值订单是否存在

[`success`](#success) : 判断充值订单是否成功到账

[`notifyHandler`](#notifyHandler) : 充值结果异步回调处理

[`getStopNotifyData`](#getStopNotifyData) : 获取终止回调的响应内容

<a name="recharge" />
recharge:流量充值接口

```js
union_flow.recharge({ 
        pid:"",//流量套餐编号
        usercode:"",//手机号
        reqordernum:""//商户订单号
},function(err,data){
        console.log('recharge',err,data);//{ returncode: '0000', message: '成功', datenum: '20160107215145978909' }
});
```

<a name="query" />
query:充值结果查询

```js
union_flow.query({ 
        thirdOrderNum:""//商户订单号
},function(err,data){
        console.log('query',err,data);//{ resultcode: '2001', message: '没有找到您的订单' }
});
```

<a name="exists" />
exists:判断充值订单是否存在

```js
union_flow.exists({ 
        thirdOrderNum:""//商户订单号
},function(err,data){
        console.log('exists',err,data);//false
});
```

<a name="success" />
success:判断充值订单是否成功到账

```js
union_flow.success({ 
        thirdOrderNum:""//商户订单号
},function(err,data){
        console.log('success',err,data);//false
});
```

<a name="notifyHandler" />
notifyHandler:充值结果异步回调处理

```js
union_flow.notifyHandler({ 
    header:{
		    key: '',
    		resTime: '',
    		reqSeq: '',
    		channel: '',
    		version: '',
    		sign: '' 
	  },
	  body:{ 
  		returncode: '',
  		phonenumber: '',
  		pid: '',
  		message: '',
  		datenum: '' 
  	} 
},function(err,data){
        console.log('notifyHandler',err,data);//data为联通流量充值异步回调的结果
});
```

<a name="getStopNotifyData" />
getStopNotifyData:获取终止回调的响应内容

```js
res.send(union_flow.getStopNotifyData());//success
```
