require('date-utils');
var request = require('request');
var _ = require('lodash');
var crypto = require('crypto');
function md5(data,format){
	var MD5 = crypto.createHash("md5");
	MD5.update(data);
	return MD5.digest(format || 'hex');
}
function jsontosearch(json){
	var search = '';
	if(_.isObject(json)){
		_.forEach(json,function(val,key){
			search += key + '=' + val + '&';
		});
	}
	return search.substring(0,search.length-1);
}
function UNION_FLOW(config){
	this.config = {}
	if(_.isObject(config)){
		this.config.apiUrl = config.apiUrl;
		this.config.cpid = config.cpid;
		this.config.secretkey = config.secretkey;
	}
}
UNION_FLOW.prototype.recharge = function(params,cb){
	if(!_.isObject(params)){
		return cb('参数必须是json');
	}
	var defaultConfig = _.clone(this.config);
	params = _.extend(defaultConfig,params);
	if(!params.apiUrl){
		return cb('缺少api请求地址:apiUrl');
	}
	if(!params.cpid){
		return cb('缺少渠道ID:cpid');
	}
	if(!params.usercode){
		return cb('缺少手机:usercode');
	}
	if(!params.pid){
		return cb('缺少套餐ID:pid');
	}
	if(!params.reqordernum){
		return cb('缺少订购请求流水号:reqordernum');
	}
	if(!params.secretkey){
		return cb('缺少加密秘钥:secretkey');
	}
	var toParams = {
		serviceid:params.serviceid || 'Asynorder',
		timeStamp:new Date(params.timeStamp || Date.now()).toFormat('YYYYMMDDHH24MISS'),
		eftype:params.eftype || "0"
	}
	params.gamecode ? (toParams.gamecode = params.gamecode) : '';	
	toParams.cpid = params.cpid;
	toParams.usercode = params.usercode;
	toParams.pid = params.pid;
	toParams.reqordernum = params.reqordernum;
	var passwordStr = toParams.cpid + '|' + toParams.usercode + '|' + toParams.timeStamp + '|' + params.secretkey;
	toParams.password = md5(passwordStr);
	request.post({url:params.apiUrl,form:toParams},function(error,response,body){
		if(!error && response.statusCode === 200){
			try{
				body = JSON.parse(body);
				cb(null,body);
			}catch(e){
				cb('流量赠送异常:'+body);
			}
		}else{
			cb(error, response, body);
		}	
	})
}
UNION_FLOW.prototype.query = function(params,cb){
	if(!_.isObject(params)){
		return cb('参数必须是json');
	}
	var defaultConfig = _.clone(this.config);
	params = _.extend(defaultConfig,params);
	if(!params.apiUrl){
		return cb('缺少api请求地址:apiUrl');
	}
	if(!params.cpid){
		return cb('缺少渠道ID:cpid');
	}
	if(!(params.thirdOrderNum || params.ordernum)){
		return cb('缺少第三方订单号(订购reqordernum):thirdOrderNum or ordernum');
	}
	var toParams = {
		serviceid:params.serviceid || 'searchOrderNum'
	}
	toParams.cpid = params.cpid;
	if(params.ordernum){
		toParams.ordernum = params.ordernum;
	}else{
		toParams.thirdOrderNum = params.thirdOrderNum;
	}
	request.post({url:params.apiUrl,form:toParams},function(error,response,body){
		if(!error && response.statusCode === 200){
			try{
				body = JSON.parse(body);
				cb(null,body);
			}catch(e){
				cb('流量查询异常:'+body);
			}
		}else{
			cb(error, response, body);
		}	
	})
}
UNION_FLOW.prototype.exists = function(params,cb){
	this.query(params,function(err,data){
		if(!err && _.isObject(data)){
			if(data.resultcode === '2001'){
				cb(null,false);
			}else{	
				cb(null,true);
			}
		}else{
			cb(err || data);
		}
	});
}
UNION_FLOW.prototype.success = function(params,cb){
	this.query(params,function(err,data){
		if(!err && _.isObject(data)){
			if(data.resultcode === '2000'){
				cb(null,true);
			}else{	
				cb(null,false);
			}
		}else{
			cb(err || data);
		}
	});
}
UNION_FLOW.prototype.getStopNotifyData = function(){
	return 'success';
}
UNION_FLOW.prototype.notifyHandler = function(notifyData){
	var header = {};
	var body = {};
	if(!_.isObject(notifyData) || !_.isObject(notifyData.header) || !_.isObject(notifyData.body)){
		return {
			returncode:"9999",
			message:"非法回调",
			notifyData:notifyData
		}
	}else{
		header = notifyData.header;
		body = notifyData.body;
		if(notifyData.header.sign !== md5(header.key+header.resTime+header.reqSeq+header.channel+header.version)){
			return {
				returncode:"8888",
				message:"签名验证错误",
				notifyData:notifyData
			}
		}else{
			return {
				returncode:body.returncode,
				phonenumber:body.phonenumber,
				pid:body.pid,
				message:body.message,
				datenum:body.datenum,
				ordernum:header.reqSeq
			}
		}
	} 
}
function UNION(config){
	return new UNION_FLOW(config);
}
module.exports = UNION;