"use strict";(self.webpackChunksemantic_composer=self.webpackChunksemantic_composer||[]).push([[1109],{1109:(t,e,n)=>{var r;function a(t){return new RegExp("^(?:"+t.join("|")+")$","i")}n.r(e),n.d(e,{sparql:()=>F});var u=a(["str","lang","langmatches","datatype","bound","sameterm","isiri","isuri","iri","uri","bnode","count","sum","min","max","avg","sample","group_concat","rand","abs","ceil","floor","round","concat","substr","strlen","replace","ucase","lcase","encode_for_uri","contains","strstarts","strends","strbefore","strafter","year","month","day","hours","minutes","seconds","timezone","tz","now","uuid","struuid","md5","sha1","sha256","sha384","sha512","coalesce","if","strlang","strdt","isnumeric","regex","exists","isblank","isliteral","a","bind"]),o=a(["base","prefix","select","distinct","reduced","construct","describe","ask","from","named","where","order","limit","offset","filter","optional","graph","by","asc","desc","as","having","undef","values","group","minus","in","not","service","silent","using","insert","delete","union","true","false","with","data","copy","to","move","add","create","drop","clear","load","into"]),i=/[*+\-<>=&|\^\/!\?]/,c="[A-Za-z_\\-0-9]",s=new RegExp("[A-Za-z]"),l=new RegExp("(("+c+"|\\.)*("+c+"))?:");function p(t,e){var n,a=t.next();if(r=null,"$"==a||"?"==a)return"?"==a&&t.match(/\s/,!1)?"operator":(t.match(/^[A-Za-z0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Za-z0-9_\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*/),"variableName.local");if("<"==a&&!t.match(/^[\s\u00a0=]/,!1))return t.match(/^[^\s\u00a0>]*>?/),"atom";if('"'==a||"'"==a)return e.tokenize=(n=a,function(t,e){for(var r,a=!1;null!=(r=t.next());){if(r==n&&!a){e.tokenize=p;break}a=!a&&"\\"==r}return"string"}),e.tokenize(t,e);if(/[{}\(\),\.;\[\]]/.test(a))return r=a,"bracket";if("#"==a)return t.skipToEnd(),"comment";if(i.test(a))return"operator";if(":"==a)return m(t),"atom";if("@"==a)return t.eatWhile(/[a-z\d\-]/i),"meta";if(s.test(a)&&t.match(l))return m(t),"atom";t.eatWhile(/[_\w\d]/);var c=t.current();return u.test(c)?"builtin":o.test(c)?"keyword":"variable"}function m(t){t.match(/(\.(?=[\w_\-\\%])|[:\w_-]|\\[-\\_~.!$&'()*+,;=/?#@%]|%[a-f\d][a-f\d])+/i)}function d(t,e,n){t.context={prev:t.context,indent:t.indent,col:n,type:e}}function f(t){t.indent=t.context.indent,t.context=t.context.prev}const F={name:"sparql",startState:function(){return{tokenize:p,context:null,indent:0,col:0}},token:function(t,e){if(t.sol()&&(e.context&&null==e.context.align&&(e.context.align=!1),e.indent=t.indentation()),t.eatSpace())return null;var n=e.tokenize(t,e);if("comment"!=n&&e.context&&null==e.context.align&&"pattern"!=e.context.type&&(e.context.align=!0),"("==r)d(e,")",t.column());else if("["==r)d(e,"]",t.column());else if("{"==r)d(e,"}",t.column());else if(/[\]\}\)]/.test(r)){for(;e.context&&"pattern"==e.context.type;)f(e);e.context&&r==e.context.type&&(f(e),"}"==r&&e.context&&"pattern"==e.context.type&&f(e))}else"."==r&&e.context&&"pattern"==e.context.type?f(e):/atom|string|variable/.test(n)&&e.context&&(/[\}\]]/.test(e.context.type)?d(e,"pattern",t.column()):"pattern"!=e.context.type||e.context.align||(e.context.align=!0,e.context.col=t.column()));return n},indent:function(t,e,n){var r=e&&e.charAt(0),a=t.context;if(/[\]\}]/.test(r))for(;a&&"pattern"==a.type;)a=a.prev;var u=a&&r==a.type;return a?"pattern"==a.type?a.col:a.align?a.col+(u?0:1):a.indent+(u?0:n.unit):0},languageData:{commentTokens:{line:"#"}}}}}]);
//# sourceMappingURL=1109.fb1faa80.chunk.js.map