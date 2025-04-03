"use strict";(self.webpackChunksemantic_composer=self.webpackChunksemantic_composer||[]).push([[9396],{9396:(e,t,n)=>{function r(e,t,n,r,a,o){this.indented=e,this.column=t,this.type=n,this.info=r,this.align=a,this.prev=o}function a(e,t,n,a){var o=e.indented;return e.context&&"statement"==e.context.type&&"statement"!=n&&(o=e.context.indented),e.context=new r(o,t,n,a,null,e.context)}function o(e){var t=e.context.type;return")"!=t&&"]"!=t&&"}"!=t||(e.indented=e.context.indented),e.context=e.context.prev}function i(e,t,n){return"variable"==t.prevToken||"type"==t.prevToken||(!!/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(e.string.slice(0,n))||(!(!t.typeAtEndOfLine||e.column()!=e.indentation())||void 0))}function l(e){for(;;){if(!e||"top"==e.type)return!0;if("}"==e.type&&"namespace"!=e.prev.info)return!1;e=e.prev}}function s(e){var t,n,s=e.statementIndentUnit,c=e.dontAlignCalls,d=e.keywords||{},f=e.types||{},p=e.builtin||{},m=e.blockKeywords||{},h=e.defKeywords||{},y=e.atoms||{},g=e.hooks||{},k=e.multiLineStrings,b=!1!==e.indentStatements,v=!1!==e.indentSwitch,w=e.namespaceSeparator,_=e.isPunctuationChar||/[\[\]{}\(\),;\:\.]/,x=e.numberStart||/[\d\.]/,S=e.number||/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i,T=e.isOperatorChar||/[+\-*&%=<>!?|\/]/,N=e.isIdentifierChar||/[\w\$_\xa1-\uffff]/,C=e.isReservedIdentifier||!1;function I(e,r){var a,o=e.next();if(g[o]){var i=g[o](e,r);if(!1!==i)return i}if('"'==o||"'"==o)return r.tokenize=(a=o,function(e,t){for(var n,r=!1,o=!1;null!=(n=e.next());){if(n==a&&!r){o=!0;break}r=!r&&"\\"==n}return(o||!r&&!k)&&(t.tokenize=null),"string"}),r.tokenize(e,r);if(x.test(o)){if(e.backUp(1),e.match(S))return"number";e.next()}if(_.test(o))return t=o,null;if("/"==o){if(e.eat("*"))return r.tokenize=D,D(e,r);if(e.eat("/"))return e.skipToEnd(),"comment"}if(T.test(o)){for(;!e.match(/^\/[\/*]/,!1)&&e.eat(T););return"operator"}if(e.eatWhile(N),w)for(;e.match(w);)e.eatWhile(N);var l=e.current();return u(d,l)?(u(m,l)&&(t="newstatement"),u(h,l)&&(n=!0),"keyword"):u(f,l)?"type":u(p,l)||C&&C(l)?(u(m,l)&&(t="newstatement"),"builtin"):u(y,l)?"atom":"variable"}function D(e,t){for(var n,r=!1;n=e.next();){if("/"==n&&r){t.tokenize=null;break}r="*"==n}return"comment"}function z(t,n){e.typeFirstDefinitions&&t.eol()&&l(n.context)&&(n.typeAtEndOfLine=i(t,n,t.pos))}return{name:e.name,startState:function(e){return{tokenize:null,context:new r(-e,0,"top",null,!1),indented:0,startOfLine:!0,prevToken:null}},token:function(r,s){var c=s.context;if(r.sol()&&(null==c.align&&(c.align=!1),s.indented=r.indentation(),s.startOfLine=!0),r.eatSpace())return z(r,s),null;t=n=null;var u=(s.tokenize||I)(r,s);if("comment"==u||"meta"==u)return u;if(null==c.align&&(c.align=!0),";"==t||":"==t||","==t&&r.match(/^\s*(?:\/\/.*)?$/,!1))for(;"statement"==s.context.type;)o(s);else if("{"==t)a(s,r.column(),"}");else if("["==t)a(s,r.column(),"]");else if("("==t)a(s,r.column(),")");else if("}"==t){for(;"statement"==c.type;)c=o(s);for("}"==c.type&&(c=o(s));"statement"==c.type;)c=o(s)}else t==c.type?o(s):b&&(("}"==c.type||"top"==c.type)&&";"!=t||"statement"==c.type&&"newstatement"==t)&&a(s,r.column(),"statement",r.current());if("variable"==u&&("def"==s.prevToken||e.typeFirstDefinitions&&i(r,s,r.start)&&l(s.context)&&r.match(/^\s*\(/,!1))&&(u="def"),g.token){var d=g.token(r,s,u);void 0!==d&&(u=d)}return"def"==u&&!1===e.styleDefs&&(u="variable"),s.startOfLine=!1,s.prevToken=n?"def":u||t,z(r,s),u},indent:function(t,n,r){if(t.tokenize!=I&&null!=t.tokenize||t.typeAtEndOfLine&&l(t.context))return null;var a=t.context,o=n&&n.charAt(0),i=o==a.type;if("statement"==a.type&&"}"==o&&(a=a.prev),e.dontIndentStatements)for(;"statement"==a.type&&e.dontIndentStatements.test(a.info);)a=a.prev;if(g.indent){var u=g.indent(t,a,n,r.unit);if("number"==typeof u)return u}var d=a.prev&&"switch"==a.prev.info;if(e.allmanIndentation&&/[{(]/.test(o)){for(;"top"!=a.type&&"}"!=a.type;)a=a.prev;return a.indented}return"statement"==a.type?a.indented+("{"==o?0:s||r.unit):!a.align||c&&")"==a.type?")"!=a.type||i?a.indented+(i?0:r.unit)+(i||!d||/^(?:case|default)\b/.test(n)?0:r.unit):a.indented+(s||r.unit):a.column+(i?0:1)},languageData:{indentOnInput:v?/^\s*(?:case .*?:|default:|\{\}?|\})$/:/^\s*[{}]$/,commentTokens:{line:"//",block:{open:"/*",close:"*/"}},autocomplete:Object.keys(d).concat(Object.keys(f)).concat(Object.keys(p)).concat(Object.keys(y)),...e.languageData}}}function c(e){for(var t={},n=e.split(" "),r=0;r<n.length;++r)t[n[r]]=!0;return t}function u(e,t){return"function"===typeof e?e(t):e.propertyIsEnumerable(t)}n.r(t),n.d(t,{c:()=>D,ceylon:()=>q,clike:()=>s,cpp:()=>z,csharp:()=>M,dart:()=>X,java:()=>L,kotlin:()=>R,nesC:()=>j,objectiveC:()=>A,objectiveCpp:()=>U,scala:()=>P,shader:()=>O,squirrel:()=>$});var d="auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran",f="alignas alignof and and_eq audit axiom bitand bitor catch class compl concept constexpr const_cast decltype delete dynamic_cast explicit export final friend import module mutable namespace new noexcept not not_eq operator or or_eq override private protected public reinterpret_cast requires static_assert static_cast template this thread_local throw try typeid typename using virtual xor xor_eq",p="bycopy byref in inout oneway out self super atomic nonatomic retain copy readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd @interface @implementation @end @protocol @encode @property @synthesize @dynamic @class @public @package @private @protected @required @optional @try @catch @finally @import @selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available",m="FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION  NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT",h=c("int long char short double float unsigned signed void bool"),y=c("SEL instancetype id Class Protocol BOOL");function g(e){return u(h,e)||/.+_t$/.test(e)}function k(e){return g(e)||u(y,e)}var b="case do else for if switch while struct enum union",v="struct enum union";function w(e,t){if(!t.startOfLine)return!1;for(var n,r=null;n=e.peek();){if("\\"==n&&e.match(/^.$/)){r=w;break}if("/"==n&&e.match(/^\/[\/\*]/,!1))break;e.next()}return t.tokenize=r,"meta"}function _(e,t){return"type"==t.prevToken&&"type"}function x(e){return!(!e||e.length<2)&&("_"==e[0]&&("_"==e[1]||e[1]!==e[1].toLowerCase()))}function S(e){return e.eatWhile(/[\w\.']/),"number"}function T(e,t){if(e.backUp(1),e.match(/^(?:R|u8R|uR|UR|LR)/)){var n=e.match(/^"([^\s\\()]{0,16})\(/);return!!n&&(t.cpp11RawStringDelim=n[1],t.tokenize=I,I(e,t))}return e.match(/^(?:u8|u|U|L)/)?!!e.match(/^["']/,!1)&&"string":(e.next(),!1)}function N(e){var t=/(\w+)::~?(\w+)$/.exec(e);return t&&t[1]==t[2]}function C(e,t){for(var n;null!=(n=e.next());)if('"'==n&&!e.eat('"')){t.tokenize=null;break}return"string"}function I(e,t){var n=t.cpp11RawStringDelim.replace(/[^\w\s]/g,"\\$&");return e.match(new RegExp(".*?\\)"+n+'"'))?t.tokenize=null:e.skipToEnd(),"string"}const D=s({name:"c",keywords:c(d),types:g,blockKeywords:c(b),defKeywords:c(v),typeFirstDefinitions:!0,atoms:c("NULL true false"),isReservedIdentifier:x,hooks:{"#":w,"*":_}}),z=s({name:"cpp",keywords:c(d+" "+f),types:g,blockKeywords:c(b+" class try catch"),defKeywords:c(v+" class namespace"),typeFirstDefinitions:!0,atoms:c("true false NULL nullptr"),dontIndentStatements:/^template$/,isIdentifierChar:/[\w\$_~\xa1-\uffff]/,isReservedIdentifier:x,hooks:{"#":w,"*":_,u:T,U:T,L:T,R:T,0:S,1:S,2:S,3:S,4:S,5:S,6:S,7:S,8:S,9:S,token:function(e,t,n){if("variable"==n&&"("==e.peek()&&(";"==t.prevToken||null==t.prevToken||"}"==t.prevToken)&&N(e.current()))return"def"}},namespaceSeparator:"::"}),L=s({name:"java",keywords:c("abstract assert break case catch class const continue default do else enum extends final finally for goto if implements import instanceof interface native new package private protected public return static strictfp super switch synchronized this throw throws transient try volatile while @interface"),types:c("var byte short int long float double boolean char void Boolean Byte Character Double Float Integer Long Number Object Short String StringBuffer StringBuilder Void"),blockKeywords:c("catch class do else finally for if switch try while"),defKeywords:c("class interface enum @interface"),typeFirstDefinitions:!0,atoms:c("true false null"),number:/^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+\.?\d*|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,hooks:{"@":function(e){return!e.match("interface",!1)&&(e.eatWhile(/[\w\$_]/),"meta")},'"':function(e,t){return!!e.match(/""$/)&&(t.tokenize=E,t.tokenize(e,t))}}}),M=s({name:"csharp",keywords:c("abstract as async await base break case catch checked class const continue default delegate do else enum event explicit extern finally fixed for foreach goto if implicit in init interface internal is lock namespace new operator out override params private protected public readonly record ref required return sealed sizeof stackalloc static struct switch this throw try typeof unchecked unsafe using virtual void volatile while add alias ascending descending dynamic from get global group into join let orderby partial remove select set value var yield"),types:c("Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32 UInt64 bool byte char decimal double short int long object sbyte float string ushort uint ulong"),blockKeywords:c("catch class do else finally for foreach if struct switch try while"),defKeywords:c("class interface namespace record struct var"),typeFirstDefinitions:!0,atoms:c("true false null"),hooks:{"@":function(e,t){return e.eat('"')?(t.tokenize=C,C(e,t)):(e.eatWhile(/[\w\$_]/),"meta")}}});function E(e,t){for(var n=!1;!e.eol();){if(!n&&e.match('"""')){t.tokenize=null;break}n="\\"==e.next()&&!n}return"string"}function F(e){return function(t,n){for(var r;r=t.next();){if("*"==r&&t.eat("/")){if(1==e){n.tokenize=null;break}return n.tokenize=F(e-1),n.tokenize(t,n)}if("/"==r&&t.eat("*"))return n.tokenize=F(e+1),n.tokenize(t,n)}return"comment"}}const P=s({name:"scala",keywords:c("abstract case catch class def do else extends final finally for forSome if implicit import lazy match new null object override package private protected return sealed super this throw trait try type val var while with yield _ assert assume require print println printf readLine readBoolean readByte readShort readChar readInt readLong readFloat readDouble"),types:c("AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either Enumeration Equiv Error Exception Fractional Function IndexedSeq Int Integral Iterable Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"),multiLineStrings:!0,blockKeywords:c("catch class enum do else finally for forSome if match switch try while"),defKeywords:c("class enum def object package trait type val var"),atoms:c("true false null"),indentStatements:!1,indentSwitch:!1,isOperatorChar:/[+\-*&%=<>!?|\/#:@]/,hooks:{"@":function(e){return e.eatWhile(/[\w\$_]/),"meta"},'"':function(e,t){return!!e.match('""')&&(t.tokenize=E,t.tokenize(e,t))},"'":function(e){return e.match(/^(\\[^'\s]+|[^\\'])'/)?"character":(e.eatWhile(/[\w\$_\xa1-\uffff]/),"atom")},"=":function(e,t){var n=t.context;return!("}"!=n.type||!n.align||!e.eat(">"))&&(t.context=new r(n.indented,n.column,n.type,n.info,null,n.prev),"operator")},"/":function(e,t){return!!e.eat("*")&&(t.tokenize=F(1),t.tokenize(e,t))}},languageData:{closeBrackets:{brackets:["(","[","{","'",'"','"""']}}});const R=s({name:"kotlin",keywords:c("package as typealias class interface this super val operator var fun for is in This throw return annotation break continue object if else while do try when !in !is as? file import where by get set abstract enum open inner override private public internal protected catch finally out final vararg reified dynamic companion constructor init sealed field property receiver param sparam lateinit data inline noinline tailrec external annotation crossinline const operator infix suspend actual expect setparam"),types:c("Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void Annotation Any BooleanArray ByteArray Char CharArray DeprecationLevel DoubleArray Enum FloatArray Function Int IntArray Lazy LazyThreadSafetyMode LongArray Nothing ShortArray Unit"),intendSwitch:!1,indentStatements:!1,multiLineStrings:!0,number:/^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,blockKeywords:c("catch class do else finally for if where try while enum"),defKeywords:c("class val var object interface fun"),atoms:c("true false null this"),hooks:{"@":function(e){return e.eatWhile(/[\w\$_]/),"meta"},"*":function(e,t){return"."==t.prevToken?"variable":"operator"},'"':function(e,t){var n;return t.tokenize=(n=e.match('""'),function(e,t){for(var r,a=!1,o=!1;!e.eol();){if(!n&&!a&&e.match('"')){o=!0;break}if(n&&e.match('"""')){o=!0;break}r=e.next(),!a&&"$"==r&&e.match("{")&&e.skipTo("}"),a=!a&&"\\"==r&&!n}return!o&&n||(t.tokenize=null),"string"}),t.tokenize(e,t)},"/":function(e,t){return!!e.eat("*")&&(t.tokenize=F(1),t.tokenize(e,t))},indent:function(e,t,n,r){var a=n&&n.charAt(0);return"}"!=e.prevToken&&")"!=e.prevToken||""!=n?"operator"==e.prevToken&&"}"!=n&&"}"!=e.context.type||"variable"==e.prevToken&&"."==a||("}"==e.prevToken||")"==e.prevToken)&&"."==a?2*r+t.indented:t.align&&"}"==t.type?t.indented+(e.context.type==(n||"").charAt(0)?0:r):void 0:e.indented}},languageData:{closeBrackets:{brackets:["(","[","{","'",'"','"""']}}}),O=s({name:"shader",keywords:c("sampler1D sampler2D sampler3D samplerCube sampler1DShadow sampler2DShadow const attribute uniform varying break continue discard return for while do if else struct in out inout"),types:c("float int bool void vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 mat2 mat3 mat4"),blockKeywords:c("for while do if else struct"),builtin:c("radians degrees sin cos tan asin acos atan pow exp log exp2 sqrt inversesqrt abs sign floor ceil fract mod min max clamp mix step smoothstep length distance dot cross normalize ftransform faceforward reflect refract matrixCompMult lessThan lessThanEqual greaterThan greaterThanEqual equal notEqual any all not texture1D texture1DProj texture1DLod texture1DProjLod texture2D texture2DProj texture2DLod texture2DProjLod texture3D texture3DProj texture3DLod texture3DProjLod textureCube textureCubeLod shadow1D shadow2D shadow1DProj shadow2DProj shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod dFdx dFdy fwidth noise1 noise2 noise3 noise4"),atoms:c("true false gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_FogCoord gl_PointCoord gl_Position gl_PointSize gl_ClipVertex gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor gl_TexCoord gl_FogFragCoord gl_FragCoord gl_FrontFacing gl_FragData gl_FragDepth gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse gl_TextureMatrixTranspose gl_ModelViewMatrixInverseTranspose gl_ProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixInverseTranspose gl_TextureMatrixInverseTranspose gl_NormalScale gl_DepthRange gl_ClipPlane gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel gl_FrontLightModelProduct gl_BackLightModelProduct gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ gl_FogParameters gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits gl_MaxDrawBuffers"),indentSwitch:!1,hooks:{"#":w}}),j=s({name:"nesc",keywords:c(d+" as atomic async call command component components configuration event generic implementation includes interface module new norace nx_struct nx_union post provides signal task uses abstract extends"),types:g,blockKeywords:c(b),atoms:c("null true false"),hooks:{"#":w}}),A=s({name:"objectivec",keywords:c(d+" "+p),types:k,builtin:c(m),blockKeywords:c(b+" @synthesize @try @catch @finally @autoreleasepool @synchronized"),defKeywords:c(v+" @interface @implementation @protocol @class"),dontIndentStatements:/^@.*$/,typeFirstDefinitions:!0,atoms:c("YES NO NULL Nil nil true false nullptr"),isReservedIdentifier:x,hooks:{"#":w,"*":_}}),U=s({name:"objectivecpp",keywords:c(d+" "+p+" "+f),types:k,builtin:c(m),blockKeywords:c(b+" @synthesize @try @catch @finally @autoreleasepool @synchronized class try catch"),defKeywords:c(v+" @interface @implementation @protocol @class class namespace"),dontIndentStatements:/^@.*$|^template$/,typeFirstDefinitions:!0,atoms:c("YES NO NULL Nil nil true false nullptr"),isReservedIdentifier:x,hooks:{"#":w,"*":_,u:T,U:T,L:T,R:T,0:S,1:S,2:S,3:S,4:S,5:S,6:S,7:S,8:S,9:S,token:function(e,t,n){if("variable"==n&&"("==e.peek()&&(";"==t.prevToken||null==t.prevToken||"}"==t.prevToken)&&N(e.current()))return"def"}},namespaceSeparator:"::"}),$=s({name:"squirrel",keywords:c("base break clone continue const default delete enum extends function in class foreach local resume return this throw typeof yield constructor instanceof static"),types:g,blockKeywords:c("case catch class else for foreach if switch try while"),defKeywords:c("function local class"),typeFirstDefinitions:!0,atoms:c("true false null"),hooks:{"#":w}});var B=null;function K(e){return function(t,n){for(var r,a=!1,o=!1;!t.eol();){if(!a&&t.match('"')&&("single"==e||t.match('""'))){o=!0;break}if(!a&&t.match("``")){B=K(e),o=!0;break}r=t.next(),a="single"==e&&!a&&"\\"==r}return o&&(n.tokenize=null),"string"}}const q=s({name:"ceylon",keywords:c("abstracts alias assembly assert assign break case catch class continue dynamic else exists extends finally for function given if import in interface is let module new nonempty object of out outer package return satisfies super switch then this throw try value void while"),types:function(e){var t=e.charAt(0);return t===t.toUpperCase()&&t!==t.toLowerCase()},blockKeywords:c("case catch class dynamic else finally for function if interface module new object switch try while"),defKeywords:c("class dynamic function interface module object package value"),builtin:c("abstract actual aliased annotation by default deprecated doc final formal late license native optional sealed see serializable shared suppressWarnings tagged throws variable"),isPunctuationChar:/[\[\]{}\(\),;\:\.`]/,isOperatorChar:/[+\-*&%=<>!?|^~:\/]/,numberStart:/[\d#$]/,number:/^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,multiLineStrings:!0,typeFirstDefinitions:!0,atoms:c("true false null larger smaller equal empty finished"),indentSwitch:!1,styleDefs:!1,hooks:{"@":function(e){return e.eatWhile(/[\w\$_]/),"meta"},'"':function(e,t){return t.tokenize=K(e.match('""')?"triple":"single"),t.tokenize(e,t)},"`":function(e,t){return!(!B||!e.match("`"))&&(t.tokenize=B,B=null,t.tokenize(e,t))},"'":function(e){return e.match(/^(\\[^'\s]+|[^\\'])'/)?"string.special":(e.eatWhile(/[\w\$_\xa1-\uffff]/),"atom")},token:function(e,t,n){if(("variable"==n||"type"==n)&&"."==t.prevToken)return"variableName.special"}},languageData:{closeBrackets:{brackets:["(","[","{","'",'"','"""']}}});function V(e){(e.interpolationStack||(e.interpolationStack=[])).push(e.tokenize)}function W(e){return(e.interpolationStack||(e.interpolationStack=[])).pop()}function G(e,t,n,r){var a=!1;if(t.eat(e)){if(!t.eat(e))return"string";a=!0}function o(t,n){for(var o=!1;!t.eol();){if(!r&&!o&&"$"==t.peek())return V(n),n.tokenize=Z,"string";var i=t.next();if(i==e&&!o&&(!a||t.match(e+e))){n.tokenize=null;break}o=!r&&!o&&"\\"==i}return"string"}return n.tokenize=o,o(t,n)}function Z(e,t){return e.eat("$"),e.eat("{")?t.tokenize=null:t.tokenize=Q,null}function Q(e,t){return e.eatWhile(/[\w_]/),t.tokenize=W(t),"variable"}const X=s({name:"dart",keywords:c("this super static final const abstract class extends external factory implements mixin get native set typedef with enum throw rethrow assert break case continue default in return new deferred async await covariant try catch finally do else for if switch while import library export part of show hide is as extension on yield late required sealed base interface when inline"),blockKeywords:c("try catch finally do else for if switch while"),builtin:c("void bool num int double dynamic var String Null Never"),atoms:c("true false null"),number:/^(?:0x[a-f\d_]+|(?:[\d_]+\.?[\d_]*|\.[\d_]+)(?:e[-+]?[\d_]+)?)/i,hooks:{"@":function(e){return e.eatWhile(/[\w\$_\.]/),"meta"},"'":function(e,t){return G("'",e,t,!1)},'"':function(e,t){return G('"',e,t,!1)},r:function(e,t){var n=e.peek();return("'"==n||'"'==n)&&G(e.next(),e,t,!0)},"}":function(e,t){return function(e){return e.interpolationStack?e.interpolationStack.length:0}(t)>0&&(t.tokenize=W(t),null)},"/":function(e,t){return!!e.eat("*")&&(t.tokenize=F(1),t.tokenize(e,t))},token:function(e,t,n){if("variable"==n&&RegExp("^[_$]*[A-Z][a-zA-Z0-9_$]*$","g").test(e.current()))return"type"}}})}}]);
//# sourceMappingURL=9396.62fb6326.chunk.js.map