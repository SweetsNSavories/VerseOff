!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i=t();for(var n in i)("object"==typeof exports?exports:e)[n]=i[n]}}(this,function(){return function(e){function t(n){if(i[n])return i[n].exports;var r=i[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var i={};return t.m=e,t.c=i,t.i=function(e){return e},t.d=function(e,i,n){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var i=e&&e.e?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=30)}([function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});!function(e){e[e.Unspecified=0]="Unspecified",e[e.String=1]="String",e[e.Int64=2]="Int64",e[e.Double=3]="Double",e[e.Boolean=4]="Boolean",e[e.Date=5]="Date"}(t.AWTPropertyType||(t.AWTPropertyType={}));!function(e){e[e.NotSet=0]="NotSet",e[e.DistinguishedName=1]="DistinguishedName",e[e.GenericData=2]="GenericData",e[e.IPV4Address=3]="IPV4Address",e[e.IPv6Address=4]="IPv6Address",e[e.MailSubject=5]="MailSubject",e[e.PhoneNumber=6]="PhoneNumber",e[e.QueryString=7]="QueryString",e[e.SipAddress=8]="SipAddress",e[e.SmtpAddress=9]="SmtpAddress",e[e.Identity=10]="Identity",e[e.Uri=11]="Uri",e[e.Fqdn=12]="Fqdn",e[e.IPV4AddressLegacy=13]="IPV4AddressLegacy"}(t.AWTPiiKind||(t.AWTPiiKind={}));!function(e){e[e.NotSet=0]="NotSet",e[e.GenericContent=1]="GenericContent"}(t.AWTCustomerContentKind||(t.AWTCustomerContentKind={}));!function(e){e[e.Low=1]="Low",e[e.Normal=2]="Normal",e[e.High=3]="High",e[e.Immediate_sync=5]="Immediate_sync"}(t.AWTEventPriority||(t.AWTEventPriority={}));!function(e){e[e.NonRetryableStatus=1]="NonRetryableStatus",e[e.QueueFull=3]="QueueFull"}(t.AWTEventsDroppedReason||(t.AWTEventsDroppedReason={}));!function(e){e[e.InvalidEvent=1]="InvalidEvent",e[e.SizeLimitExceeded=2]="SizeLimitExceeded",e[e.KillSwitch=3]="KillSwitch"}(t.AWTEventsRejectedReason||(t.AWTEventsRejectedReason={}))},function(e,t,i){"use strict";function n(e){var t=new B.Int64("0");return t.low=4294967295&e,t.high=Math.floor(e/4294967296),t}function r(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(C,function(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})}function o(e){return"string"==typeof e}function s(e){return"number"==typeof e}function a(e){return"boolean"==typeof e}function u(e){return e instanceof Date}function d(e){return(e+b)*R}function c(e){var t=e.indexOf("-");return t>-1?e.substring(0,t):""}function _(){return O===D&&(O="undefined"!=typeof navigator&&Boolean(navigator.sendBeacon)),O}function l(){return N===D&&(N="undefined"!=typeof Uint8Array&&!W()&&!y()),N}function p(e){return!(!s(e)||!(e>=1&&e<=3||5===e))}function f(e,i){return!t.PropertyNameRegex.test(e)||P(i)?D:(P(i.value)&&(i={value:i,type:w.AWTPropertyType.Unspecified}),i.type=m(i.value,i.type),i.type?(u(i.value)&&(i.value=d(i.value.getTime())),i.pii>0&&i.cc>0?D:i.pii?A(i.pii)?i:D:i.cc?I(i.cc)?i:D:i):D)}function h(e){return e.getUTCFullYear()+"-"+T(e.getUTCMonth()+1)+"-"+T(e.getUTCDate())+"T"+T(e.getUTCHours())+":"+T(e.getUTCMinutes())+":"+T(e.getUTCSeconds())+"."+g(e.getUTCMilliseconds())+"Z"}function v(){if(M===D){var e=new XMLHttpRequest;M=void 0===e.withCredentials&&"undefined"!=typeof XDomainRequest}return M}function y(){return!("undefined"==typeof navigator||!navigator.product)&&"ReactNative"===navigator.product}function T(e){return e<10?"0"+e:e.toString()}function g(e){return e<10?"00"+e:e<100?"0"+e:e.toString()}function m(e,t){switch(t=E(t)?t:w.AWTPropertyType.Unspecified){case w.AWTPropertyType.Unspecified:return S(e);case w.AWTPropertyType.String:return o(e)?t:D;case w.AWTPropertyType.Boolean:return a(e)?t:D;case w.AWTPropertyType.Date:return u(e)&&NaN!==e.getTime()?t:D;case w.AWTPropertyType.Int64:return s(e)&&e%1==0?t:D;case w.AWTPropertyType.Double:return s(e)?t:D}return D}function S(e){switch(typeof e){case"string":return w.AWTPropertyType.String;case"boolean":return w.AWTPropertyType.Boolean;case"number":return w.AWTPropertyType.Double;case"object":return u(e)?w.AWTPropertyType.Date:D}return D}function A(e){return!!(s(e)&&e>=0&&e<=13)}function I(e){return!!(s(e)&&e>=0&&e<=1)}function E(e){return!!(s(e)&&e>=0&&e<=4)}function W(){if("undefined"!=typeof navigator&&navigator.userAgent){var e=navigator.userAgent.toLowerCase();if((e.indexOf("safari")>=0||e.indexOf("firefox")>=0)&&e.indexOf("chrome")<0)return!0}return!1}function P(e){return void 0===e||e===D||""===e}Object.defineProperty(t,"__esModule",{value:!0});var B=i(4),w=i(0),C=/[xy]/g,b=621355968e5,R=1e4,D=null;t.EventNameAndTypeRegex=/^[a-zA-Z]([a-zA-Z0-9]|_){2,98}[a-zA-Z0-9]$/,t.EventNameDotRegex=/\./g,t.PropertyNameRegex=/^[a-zA-Z](([a-zA-Z0-9|_|\.]){0,98}[a-zA-Z0-9])?$/,t.StatsApiKey="a387cfcf60114a43a7699f9fbb49289e-9bceb9fe-1c06-460f-96c5-6a0b247358bc-7238";var O=D,N=D,M=D;t.numberToBondInt64=n,t.newGuid=r,t.isString=o,t.isNumber=s,t.isBoolean=a,t.isDate=u,t.msToTicks=d,t.getTenantId=c,t.isBeaconsSupported=_,t.isUint8ArrayAvailable=l,t.isPriority=p,t.sanitizeProperty=f,t.getISOString=h,t.useXDomainRequest=v,t.isReactNative=y},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e.addNotificationListener=function(e){this.listeners.push(e)},e.removeNotificationListener=function(e){for(var t=this.listeners.indexOf(e);t>-1;)this.listeners.splice(t,1),t=this.listeners.indexOf(e)},e.eventsSent=function(e){for(var t=this,i=this,n=0;n<this.listeners.length;++n)!function(n){i.listeners[n].eventsSent&&setTimeout(function(){return t.listeners[n].eventsSent(e)},0)}(n)},e.eventsDropped=function(e,t){for(var i=this,n=this,r=0;r<this.listeners.length;++r)!function(r){n.listeners[r].eventsDropped&&setTimeout(function(){return i.listeners[r].eventsDropped(e,t)},0)}(r)},e.eventsRetrying=function(e){for(var t=this,i=this,n=0;n<this.listeners.length;++n)!function(n){i.listeners[n].eventsRetrying&&setTimeout(function(){return t.listeners[n].eventsRetrying(e)},0)}(n)},e.eventsRejected=function(e,t){for(var i=this,n=this,r=0;r<this.listeners.length;++r)!function(r){n.listeners[r].eventsRejected&&setTimeout(function(){return i.listeners[r].eventsRejected(e,t)},0)}(r)},e.listeners=[],e}();t.default=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(14),r=i(0),o=i(28),s=i(10),a=i(5),u=i(11),d=i(1),c=function(){function e(){}return e.setEventsHandler=function(e){this.t=e},e.getEventsHandler=function(){return this.t},e.scheduleTimer=function(){var e=this,t=this.r[this.a][2];this.u<0&&t>=0&&!this._&&(this.t.hasEvents()?(0===t&&this.f>0&&(t=1),this.u=setTimeout(function(){return e.h()},t*(1<<this.f)*1e3)):this.v=0)},e.initialize=function(e){var t=this;this.y=!0,this.T=e,this.t=new o.default(e.collectorUri,e.cacheMemorySizeLimitInNumberOfEvents,e.httpXHROverride,e.clockSkewRefreshDurationInMins),this.g(),s.default.initialize(function(e,i){if(t.T.canSendStatEvent("awt_stats")){var n=new a.default("awt_stats");n.setEventPriority(r.AWTEventPriority.High),n.setProperty("TenantId",i);for(var o in e)e.hasOwnProperty(o)&&n.setProperty(o,e[o].toString());u.default.getLogger(d.StatsApiKey).logEvent(n)}})},e.setTransmitProfile=function(e){this.a!==e&&void 0!==this.r[e]&&(this.clearTimeout(),this.a=e,this.scheduleTimer())},e.loadTransmitProfiles=function(e){this.S();for(var t in e)if(e.hasOwnProperty(t)){if(3!==e[t].length)continue;for(var i=2;i>=0;--i)if(e[t][i]<0){for(var n=i;n>=0;--n)e[t][n]=-1;break}for(var i=2;i>0;--i)if(e[t][i]>0&&e[t][i-1]>0){var r=e[t][i-1]/e[t][i];e[t][i-1]=Math.ceil(r)*e[t][i]}this.r[t]=e[t]}},e.sendEvent=function(e){this.y&&(this.f>0&&e.priority===r.AWTEventPriority.Immediate_sync&&(e.priority=r.AWTEventPriority.High),this.t.addEvent(e),this.scheduleTimer())},e.flush=function(e){var t=(new Date).getTime();!this._&&this.A+3e4<t&&(this.A=t,this.u>-1&&(clearTimeout(this.u),this.u=-1),this.t.uploadNow(e))},e.pauseTransmission=function(){this._||(this.clearTimeout(),this.t.pauseTransmission(),this._=!0)},e.resumeTransmision=function(){this._&&(this._=!1,this.t.resumeTransmission(),this.scheduleTimer())},e.flushAndTeardown=function(){s.default.teardown(),this.y=!1,this.clearTimeout(),this.t.teardown()},e.backOffTransmission=function(){this.f<4&&(this.f++,this.clearTimeout(),this.scheduleTimer())},e.clearBackOff=function(){this.f>0&&(this.f=0,this.clearTimeout(),this.scheduleTimer())},e.S=function(){this.clearTimeout(),this.g(),this.a=n.AWT_REAL_TIME,this.scheduleTimer()},e.clearTimeout=function(){this.u>0&&(clearTimeout(this.u),this.u=-1,this.v=0)},e.h=function(){var e=r.AWTEventPriority.High;this.v++,this.v*this.r[this.a][2]===this.r[this.a][0]?(e=r.AWTEventPriority.Low,this.v=0):this.v*this.r[this.a][2]===this.r[this.a][1]&&(e=r.AWTEventPriority.Normal),this.t.sendEventsForPriorityAndAbove(e),this.u=-1,this.scheduleTimer()},e.g=function(){this.r={},this.r[n.AWT_REAL_TIME]=[4,2,1],this.r[n.AWT_NEAR_REAL_TIME]=[12,6,3],this.r[n.AWT_BEST_EFFORT]=[36,18,9]},e.y=!1,e.a=n.AWT_REAL_TIME,e.u=-1,e.f=0,e._=!1,e.v=0,e.A=0,e}();t.default=c},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){this.low=0,this.high=0,this.low=parseInt(e,10),this.low<0&&(this.high=-1)}return e.prototype.I=function(t){var i=new e(t);return this.low===i.low&&this.high===i.high},e}();t.Int64=n;var r=function(){function e(e){this.low=0,this.high=0,this.low=parseInt(e,10)}return e.prototype.I=function(t){var i=new e(t);return this.low===i.low&&this.high===i.high},e}();t.UInt64=r;var o=function(){function e(){}return e.W=function(e){return this.P(e)},e.P=function(e){return 255&e},e.B=function(e){return 2147483647&e|2147483648&e},e.w=function(e){return 4294967295&e},e}();t.Number=o},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(1),r=i(0),o=function(){function e(e){this.C={name:"",properties:{}},e&&this.setName(e)}return e.prototype.setName=function(e){this.C.name=e},e.prototype.getName=function(){return this.C.name},e.prototype.setType=function(e){this.C.type=e},e.prototype.getType=function(){return this.C.type},e.prototype.setTimestamp=function(e){this.C.timestamp=e},e.prototype.getTimestamp=function(){return this.C.timestamp},e.prototype.setEventPriority=function(e){this.C.priority=e},e.prototype.getEventPriority=function(){return this.C.priority},e.prototype.setProperty=function(e,t,i){void 0===i&&(i=r.AWTPropertyType.Unspecified);var o={value:t,type:i,pii:r.AWTPiiKind.NotSet,cc:r.AWTCustomerContentKind.NotSet};if(null===(o=n.sanitizeProperty(e,o)))return void delete this.C.properties[e];this.C.properties[e]=o},e.prototype.setPropertyWithPii=function(e,t,i,o){void 0===o&&(o=r.AWTPropertyType.Unspecified);var s={value:t,type:o,pii:i,cc:r.AWTCustomerContentKind.NotSet};if(null===(s=n.sanitizeProperty(e,s)))return void delete this.C.properties[e];this.C.properties[e]=s},e.prototype.setPropertyWithCustomerContent=function(e,t,i,o){void 0===o&&(o=r.AWTPropertyType.Unspecified);var s={value:t,type:o,pii:r.AWTPiiKind.NotSet,cc:i};if(null===(s=n.sanitizeProperty(e,s)))return void delete this.C.properties[e];this.C.properties[e]=s},e.prototype.getPropertyMap=function(){return this.C.properties},e.prototype.getEvent=function(){return this.C},e}();t.default=o},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});!function(e){e[e.Unknown=0]="Unknown",e[e.MSACID=1]="MSACID",e[e.MSAPUID=2]="MSAPUID",e[e.ANID=3]="ANID",e[e.OrgIdCID=4]="OrgIdCID",e[e.OrgIdPUID=5]="OrgIdPUID",e[e.UserObjectId=6]="UserObjectId",e[e.Skype=7]="Skype",e[e.Yammer=8]="Yammer",e[e.EmailAddress=9]="EmailAddress",e[e.PhoneNumber=10]="PhoneNumber",e[e.SipAddress=11]="SipAddress",e[e.MUID=12]="MUID"}(t.AWTUserIdType||(t.AWTUserIdType={}));!function(e){e[e.Started=0]="Started",e[e.Ended=1]="Ended"}(t.AWTSessionState||(t.AWTSessionState={}))},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(1),r="MicrosoftApplicationsTelemetryDeviceId",o="MicrosoftApplicationsTelemetryFirstLaunchTime",s={MSIE:"MSIE",CHROME:"Chrome",FIREFOX:"Firefox",SAFARI:"Safari",EDGE:"Edge",ELECTRON:"Electron",SKYPE_SHELL:"SkypeShell",PHANTOMJS:"PhantomJS",OPERA:"Opera"},a={WINDOWS:"Windows",MACOSX:"Mac OS X",WINDOWS_PHONE:"Windows Phone",WINDOWS_RT:"Windows RT",IOS:"iOS",ANDROID:"Android",LINUX:"Linux",CROS:"Chrome OS",UNKNOWN:"Unknown"},u={WIN:/(windows|win32)/i,WINRT:/ arm;/i,WINPHONE:/windows\sphone\s\d+\.\d+/i,OSX:/(macintosh|mac os x)/i,IOS:/(iPad|iPhone|iPod)(?=.*like Mac OS X)/i,LINUX:/(linux|joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)/i,ANDROID:/android/i,CROS:/CrOS/i},d={5.1:"XP","6.0":"Vista",6.1:"7",6.2:"8",6.3:"8.1","10.0":"10"},c=function(){function e(){}return e.addPropertyStorageOverride=function(e){return!!e&&(this.b=e,!0)},e.autoCollect=function(e,t,i){if(this.R=e,this.D=t,this.O(),i||"undefined"==typeof navigator||(i=navigator.userAgent||""),this.N(i),this.D&&!this.b)return this.M(r),void this.M(o);(this.b||this.k&&!this.D)&&this.U()},e.checkAndSaveDeviceId=function(e){if(e){var t=this.x(r),i=this.x(o);t!==e&&(i=n.getISOString(new Date)),this.L(r,e),this.L(o,i),this.F(i)}},e.U=function(){var e=this.x(r);e||(e=n.newGuid()),this.R.setDeviceId(e)},e.O=function(){"undefined"!=typeof document&&document.documentElement&&this.R.setAppLanguage(document.documentElement.lang),"undefined"!=typeof navigator&&this.R.setUserLanguage(navigator.userLanguage||navigator.language);var e=(new Date).getTimezoneOffset(),t=e%60,i=(e-t)/60,n="+";i>0&&(n="-"),i=Math.abs(i),t=Math.abs(t),this.R.setUserTimeZone(n+(i<10?"0"+i:i.toString())+":"+(t<10?"0"+t:t.toString()))},e.N=function(e){if(e){var t=this.q(e);this.R.setDeviceBrowserName(t),this.R.setDeviceBrowserVersion(this.H(e,t));var i=this.Q(e);this.R.setDeviceOsName(i),this.R.setDeviceOsVersion(this.j(e,i))}},e.q=function(e){return this.z("OPR/",e)?s.OPERA:this.z(s.PHANTOMJS,e)?s.PHANTOMJS:this.z(s.EDGE,e)?s.EDGE:this.z(s.ELECTRON,e)?s.ELECTRON:this.z(s.CHROME,e)?s.CHROME:this.z("Trident",e)?s.MSIE:this.z(s.FIREFOX,e)?s.FIREFOX:this.z(s.SAFARI,e)?s.SAFARI:this.z(s.SKYPE_SHELL,e)?s.SKYPE_SHELL:"Unknown"},e.F=function(e){if(!isNaN(e)){var t=new Date;t.setTime(parseInt(e,10)),e=n.getISOString(t)}this.firstLaunchTime=e},e.z=function(e,t){return t.indexOf(e)>-1},e.H=function(e,t){return t===s.MSIE?this.K(e):this.G(t,e)},e.K=function(e){var t=e.match(new RegExp(s.MSIE+" ([\\d,.]+)"));if(t)return t[1];var i=e.match(new RegExp("rv:([\\d,.]+)"));return i?i[1]:void 0},e.G=function(e,t){e===s.SAFARI&&(e="Version");var i=t.match(new RegExp(e+"/([\\d,.]+)"));return i?i[1]:"Unknown"},e.Q=function(e){return e.match(u.WINPHONE)?a.WINDOWS_PHONE:e.match(u.WINRT)?a.WINDOWS_RT:e.match(u.IOS)?a.IOS:e.match(u.ANDROID)?a.ANDROID:e.match(u.LINUX)?a.LINUX:e.match(u.OSX)?a.MACOSX:e.match(u.WIN)?a.WINDOWS:e.match(u.CROS)?a.CROS:"Unknown"},e.j=function(e,t){return t===a.WINDOWS?this.V(e,"Windows NT"):t===a.ANDROID?this.V(e,t):t===a.MACOSX?this.X(e):"Unknown"},e.V=function(e,t){var i=e.match(new RegExp(t+" ([\\d,.]+)"));return i?d[i[1]]?d[i[1]]:i[1]:"Unknown"},e.X=function(e){var t=e.match(new RegExp(a.MACOSX+" ([\\d,_,.]+)"));if(t){var i=t[1].replace(/_/g,".");if(i){var n=this.Z(i);if(n){return i.split(n)[0]}return i}}return"Unknown"},e.Z=function(e){return e.indexOf(".")>-1?".":e.indexOf("_")>-1?"_":null},e.L=function(e,t){if(this.b)this.b.setProperty(e,t);else if(this.k){var i=new Date;i.setTime(i.getTime()+31536e6);var n="expires="+i.toUTCString();document.cookie=e+"="+t+"; "+n}},e.x=function(e){if(this.b)return this.b.getProperty(e)||"";if(this.k){e+="=";for(var t=document.cookie.split(";"),i=0;i<t.length;i++){for(var n=t[i],r=0;" "===n.charAt(r);)r++;if(n=n.substring(r),0===n.indexOf(e))return n.substring(e.length,n.length)}}return""},e.M=function(e){this.k&&(document.cookie=e+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;")},e.D=!1,e.k="undefined"!=typeof document&&void 0!==document.cookie,e}();t.default=c},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(7),r=i(0),o=i(6),s=function(){function e(e,t){this.J=e,this.Y=t}return e.prototype.setAppId=function(e){this.$("AppInfo.Id",e)},e.prototype.setAppVersion=function(e){this.$("AppInfo.Version",e)},e.prototype.setAppLanguage=function(e){this.$("AppInfo.Language",e)},e.prototype.setDeviceId=function(e){this.J&&(n.default.checkAndSaveDeviceId(e),this.$("DeviceInfo.Id",e))},e.prototype.setDeviceOsName=function(e){this.J&&this.$("DeviceInfo.OsName",e)},e.prototype.setDeviceOsVersion=function(e){this.J&&this.$("DeviceInfo.OsVersion",e)},e.prototype.setDeviceBrowserName=function(e){this.J&&this.$("DeviceInfo.BrowserName",e)},e.prototype.setDeviceBrowserVersion=function(e){this.J&&this.$("DeviceInfo.BrowserVersion",e)},e.prototype.setDeviceMake=function(e){this.J&&this.$("DeviceInfo.Make",e)},e.prototype.setDeviceModel=function(e){this.J&&this.$("DeviceInfo.Model",e)},e.prototype.setUserId=function(e,t,i){if(!isNaN(i)&&null!==i&&i>=0&&i<=12)this.$("UserInfo.IdType",i.toString());else{var n=void 0;switch(t){case r.AWTPiiKind.SipAddress:n=o.AWTUserIdType.SipAddress;break;case r.AWTPiiKind.PhoneNumber:n=o.AWTUserIdType.PhoneNumber;break;case r.AWTPiiKind.SmtpAddress:n=o.AWTUserIdType.EmailAddress;break;default:n=o.AWTUserIdType.Unknown}this.$("UserInfo.IdType",n.toString())}if(isNaN(t)||null===t||t===r.AWTPiiKind.NotSet||t>13)switch(i){case o.AWTUserIdType.Skype:t=r.AWTPiiKind.Identity;break;case o.AWTUserIdType.EmailAddress:t=r.AWTPiiKind.SmtpAddress;break;case o.AWTUserIdType.PhoneNumber:t=r.AWTPiiKind.PhoneNumber;break;case o.AWTUserIdType.SipAddress:t=r.AWTPiiKind.SipAddress;break;default:t=r.AWTPiiKind.NotSet}this.ee("UserInfo.Id",e,t)},e.prototype.setUserAdvertisingId=function(e){this.$("UserInfo.AdvertisingId",e)},e.prototype.setUserTimeZone=function(e){this.$("UserInfo.TimeZone",e)},e.prototype.setUserLanguage=function(e){this.$("UserInfo.Language",e)},e.prototype.$=function(e,t){"string"==typeof t&&this.Y.setProperty(e,t)},e.prototype.ee=function(e,t,i){"string"==typeof t&&this.Y.setPropertyWithPii(e,t,i)},e}();t.default=s},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(21),r=i(0),o=i(2),s=i(1),a=function(){function e(){}return e.getPayloadBlob=function(e,t){var i,a=!1,u=new n.IO.MemoryStream,d=new n.CompactBinaryProtocolWriter(u);d.te(n.ne.ie,3,null),d.re(t,n.ne.oe,n.ne.se);for(var c in e)if(a)i||(i={}),i[c]=e[c],delete e[c];else if(e.hasOwnProperty(c)){d.ae(c);var _=e[c];d.ue(1,n.ne.de),d.te(n.ne.oe,2,null),d.ae("act_default_source"),d.te(n.ne.oe,5,null),d.ae(s.newGuid()),d.te(n.ne.ce,6,null),d._e(s.numberToBondInt64(Date.now())),d.te(n.ne.se,8,null);var l=u.le().length+1;d.ue(e[c].length,n.ne.de);for(var p=u.le().length-l,f=0;f<_.length;++f){var h=u.le().length;if(this.writeEvent(_[f],d),u.le().length-h>2936012)o.default.eventsRejected([_[f]],r.AWTEventsRejectedReason.SizeLimitExceeded),_.splice(f--,1),u.le().splice(h),this.pe(_.length,u,p,l);else if(u.le().length>2936012){u.le().splice(h),i||(i={}),e[c]=_.splice(0,f),i[c]=_,this.pe(e[c].length,u,p,l),a=!0;break}}d.fe(!1)}return d.fe(!1),{payloadBlob:u.le(),remainingRequest:i}},e.pe=function(e,t,i,r){for(var o=n.ve.he(n.Number.w(e)),s=0;s<i;++s){if(!(s<o.length)){t.le().slice(r+s,i-s);break}t.le()[r+s]=o[s]}},e.writeEvent=function(e,t){t.te(n.ne.oe,1,null),t.ae(e.id),t.te(n.ne.ce,3,null),t._e(s.numberToBondInt64(e.timestamp)),t.te(n.ne.oe,5,null),t.ae(e.type),t.te(n.ne.oe,6,null),t.ae(e.name);var i={},o=0,a={},u=0,d={},c=0,_={},l=0,p={},f=0,h={},v=0,y={},T=0;for(var g in e.properties)if(e.properties.hasOwnProperty(g)){var m=e.properties[g];if(m.cc>0)y[g]=m,T++;else if(m.pii>0)h[g]=m,v++;else switch(m.type){case r.AWTPropertyType.String:i[g]=m.value,o++;break;case r.AWTPropertyType.Int64:a[g]=m.value,u++;break;case r.AWTPropertyType.Double:d[g]=m.value,c++;break;case r.AWTPropertyType.Boolean:_[g]=m.value,l++;break;case r.AWTPropertyType.Date:p[g]=m.value,f++}}if(o){t.te(n.ne.ie,13,null),t.re(o,n.ne.oe,n.ne.oe);for(var g in i)if(i.hasOwnProperty(g)){var S=i[g];t.ae(g),t.ae(S.toString())}}if(v){t.te(n.ne.ie,30,null),t.re(v,n.ne.oe,n.ne.de);for(var g in h)if(h.hasOwnProperty(g)){var m=h[g];t.ae(g),t.te(n.ne.ye,1,null),t.Te(1),t.te(n.ne.ye,2,null),t.Te(m.pii),t.te(n.ne.oe,3,null),t.ae(m.value.toString()),t.fe(!1)}}if(l){t.te(n.ne.ie,31,null),t.re(l,n.ne.oe,n.ne.ge);for(var g in _)if(_.hasOwnProperty(g)){var S=_[g];t.ae(g),t.me(S)}}if(f){t.te(n.ne.ie,32,null),t.re(f,n.ne.oe,n.ne.ce);for(var g in p)if(p.hasOwnProperty(g)){var S=p[g];t.ae(g),t._e(s.numberToBondInt64(S))}}if(u){t.te(n.ne.ie,33,null),t.re(u,n.ne.oe,n.ne.ce);for(var g in a)if(a.hasOwnProperty(g)){var S=a[g];t.ae(g),t._e(s.numberToBondInt64(S))}}if(c){t.te(n.ne.ie,34,null),t.re(c,n.ne.oe,n.ne.Se);for(var g in d)if(d.hasOwnProperty(g)){var S=d[g];t.ae(g),t.Ae(S)}}if(T){t.te(n.ne.ie,36,null),t.re(T,n.ne.oe,n.ne.de);for(var g in y)if(y.hasOwnProperty(g)){var m=y[g];t.ae(g),t.te(n.ne.ye,1,null),t.Te(m.cc),t.te(n.ne.oe,2,null),t.ae(m.value.toString()),t.fe(!1)}}t.fe(!1)},e.base64Encode=function(e){return n.ve.Ie(e)},e}();t.default=a},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(1),r=i(2),o=i(0),s=function(){function e(){}return e.initialize=function(e){var t=this;this.Ee=e,this.We=!0,r.default.addNotificationListener({eventsSent:function(e){t.Pe("records_sent_count",e.length,e[0].apiKey)},eventsDropped:function(e,i){switch(i){case o.AWTEventsDroppedReason.NonRetryableStatus:t.Pe("d_send_fail",e.length,e[0].apiKey),t.Pe("records_dropped_count",e.length,e[0].apiKey);break;case o.AWTEventsDroppedReason.QueueFull:t.Pe("d_queue_full",e.length,e[0].apiKey)}},eventsRejected:function(e,i){switch(i){case o.AWTEventsRejectedReason.InvalidEvent:t.Pe("r_inv",e.length,e[0].apiKey);break;case o.AWTEventsRejectedReason.KillSwitch:t.Pe("r_kl",e.length,e[0].apiKey);break;case o.AWTEventsRejectedReason.SizeLimitExceeded:t.Pe("r_size",e.length,e[0].apiKey)}t.Pe("r_count",e.length,e[0].apiKey)},eventsRetrying:null}),setTimeout(function(){return t.flush()},6e4)},e.teardown=function(){this.We&&(this.flush(),this.We=!1)},e.eventReceived=function(t){e.Pe("records_received_count",1,t)},e.flush=function(){var e=this;if(this.We){for(var t in this.Be)this.Be.hasOwnProperty(t)&&this.Ee(this.Be[t],t);this.Be={},setTimeout(function(){return e.flush()},6e4)}},e.Pe=function(e,t,i){if(this.We&&i!==n.StatsApiKey){var r=n.getTenantId(i);this.Be[r]||(this.Be[r]={}),this.Be[r][e]?this.Be[r][e]=this.Be[r][e]+t:this.Be[r][e]=t}},e.We=!1,e.Be={},e}();t.default=s},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(0),r=i(6),o=i(12),s=i(13),a=i(3),u=i(2),d=i(7),c=function(){function e(){}return e.initialize=function(e,t){if(void 0===t&&(t={}),!this.we)return this.we=!0,o.default.defaultTenantToken=e,this.Ce(t),this.T.disableCookiesUsage&&!this.T.propertyStorageOverride&&(o.default.sessionEnabled=!1),d.default.addPropertyStorageOverride(this.T.propertyStorageOverride),d.default.autoCollect(o.default.semanticContext,this.T.disableCookiesUsage,this.T.userAgent),a.default.initialize(this.T),o.default.loggingEnabled=!0,this.T.enableAutoUserSession&&(this.getLogger().logSession(r.AWTSessionState.Started),window.addEventListener("beforeunload",this.flushAndTeardown)),this.getLogger()},e.getSemanticContext=function(){return o.default.semanticContext},e.flush=function(e){this.we&&!this.be&&a.default.flush(e)},e.flushAndTeardown=function(){this.we&&!this.be&&(this.T.enableAutoUserSession&&this.getLogger().logSession(r.AWTSessionState.Ended),a.default.flushAndTeardown(),o.default.loggingEnabled=!1,this.be=!0)},e.pauseTransmission=function(){this.we&&!this.be&&a.default.pauseTransmission()},e.resumeTransmision=function(){this.we&&!this.be&&a.default.resumeTransmision()},e.setTransmitProfile=function(e){this.we&&!this.be&&a.default.setTransmitProfile(e)},e.loadTransmitProfiles=function(e){this.we&&!this.be&&a.default.loadTransmitProfiles(e)},e.setContext=function(e,t,i){void 0===i&&(i=n.AWTPropertyType.Unspecified),o.default.logManagerContext.setProperty(e,t,i)},e.setContextWithPii=function(e,t,i,r){void 0===r&&(r=n.AWTPropertyType.Unspecified),o.default.logManagerContext.setPropertyWithPii(e,t,i,r)},e.setContextWithCustomerContent=function(e,t,i,r){void 0===r&&(r=n.AWTPropertyType.Unspecified),o.default.logManagerContext.setPropertyWithCustomerContent(e,t,i,r)},e.getLogger=function(e){var t=e;return t&&t!==o.default.defaultTenantToken||(t=""),this.Re[t]||(this.Re[t]=new s.default(t)),this.Re[t]},e.addNotificationListener=function(e){u.default.addNotificationListener(e)},e.removeNotificationListener=function(e){u.default.removeNotificationListener(e)},e.Ce=function(e){e.collectorUri&&(this.T.collectorUri=e.collectorUri),e.cacheMemorySizeLimitInNumberOfEvents>0&&(this.T.cacheMemorySizeLimitInNumberOfEvents=e.cacheMemorySizeLimitInNumberOfEvents),e.httpXHROverride&&e.httpXHROverride.sendPOST&&(this.T.httpXHROverride=e.httpXHROverride),e.propertyStorageOverride&&e.propertyStorageOverride.getProperty&&e.propertyStorageOverride.setProperty&&(this.T.propertyStorageOverride=e.propertyStorageOverride),e.userAgent&&(this.T.userAgent=e.userAgent),e.disableCookiesUsage&&(this.T.disableCookiesUsage=e.disableCookiesUsage),e.canSendStatEvent&&(this.T.canSendStatEvent=e.canSendStatEvent),e.enableAutoUserSession&&"undefined"!=typeof window&&window.addEventListener&&(this.T.enableAutoUserSession=e.enableAutoUserSession),e.clockSkewRefreshDurationInMins>0&&(this.T.clockSkewRefreshDurationInMins=e.clockSkewRefreshDurationInMins)},e.Re={},e.we=!1,e.be=!1,e.T={collectorUri:"https://browser.pipe.aria.microsoft.com/Collector/3.0/",cacheMemorySizeLimitInNumberOfEvents:1e4,disableCookiesUsage:!1,canSendStatEvent:function(e){return!0},clockSkewRefreshDurationInMins:0},e}();t.default=c},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(5),r=i(8),o=function(){function e(){}return e.logManagerContext=new n.default,e.sessionEnabled=!0,e.loggingEnabled=!1,e.defaultTenantToken="",e.semanticContext=new r.default(!0,e.logManagerContext),e}();t.default=o},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(0),r=i(6),o=i(5),s=i(1),a=i(10),u=i(2),d=i(3),c=i(12),_=i(15),l=i(8),p=i(7),f=function(){function e(e){this.De=e,this.Oe=new o.default,this.R=new l.default(!1,this.Oe),this.Ne=0,this.Me()}return e.prototype.setContext=function(e,t,i){void 0===i&&(i=n.AWTPropertyType.Unspecified),this.Oe.setProperty(e,t,i)},e.prototype.setContextWithPii=function(e,t,i,r){void 0===r&&(r=n.AWTPropertyType.Unspecified),this.Oe.setPropertyWithPii(e,t,i,r)},e.prototype.setContextWithCustomerContent=function(e,t,i,r){void 0===r&&(r=n.AWTPropertyType.Unspecified),this.Oe.setPropertyWithCustomerContent(e,t,i,r)},e.prototype.getSemanticContext=function(){return this.R},e.prototype.logEvent=function(t){if(c.default.loggingEnabled){this.De||(this.De=c.default.defaultTenantToken,this.Me());var i=!0;s.isString(t)?t={name:t}:t instanceof o.default&&(t=t.getEvent(),i=!1),a.default.eventReceived(this.De),e.ke(e.Ue(t,this.De,i),this.Oe)}},e.prototype.logSession=function(t,i){if(c.default.sessionEnabled){var o={name:"session",type:"session",properties:{}};if(e.xe(o,i),o.priority=n.AWTEventPriority.High,t===r.AWTSessionState.Started){if(this.Ne>0)return;this.Ne=(new Date).getTime(),this.Le=s.newGuid(),this.setContext("Session.Id",this.Le),o.properties["Session.State"]="Started"}else{if(t!==r.AWTSessionState.Ended)return;if(0===this.Ne)return;var a=Math.floor(((new Date).getTime()-this.Ne)/1e3);o.properties["Session.Id"]=this.Le,o.properties["Session.State"]="Ended",o.properties["Session.Duration"]=a.toString(),o.properties["Session.DurationBucket"]=e.Fe(a),this.Ne=0,this.setContext("Session.Id",null),this.Le=void 0}o.properties["Session.FirstLaunchTime"]=p.default.firstLaunchTime,this.logEvent(o)}},e.prototype.getSessionId=function(){return this.Le},e.prototype.logFailure=function(t,i,r,o,s){if(t&&i){var a={name:"failure",type:"failure",properties:{}};e.xe(a,s),a.properties["Failure.Signature"]=t,a.properties["Failure.Detail"]=i,r&&(a.properties["Failure.Category"]=r),o&&(a.properties["Failure.Id"]=o),a.priority=n.AWTEventPriority.High,this.logEvent(a)}},e.prototype.logPageView=function(t,i,n,r,o,s){if(t&&i){var a={name:"pageview",type:"pageview",properties:{}};e.xe(a,s),a.properties["PageView.Id"]=t,a.properties["PageView.Name"]=i,n&&(a.properties["PageView.Category"]=n),r&&(a.properties["PageView.Uri"]=r),o&&(a.properties["PageView.ReferrerUri"]=o),this.logEvent(a)}},e.prototype.Me=function(){!e.qe[this.De]&&this.De&&(e.qe[this.De]=s.newGuid())},e.xe=function(e,t){if(t){t instanceof o.default&&(t=t.getEvent()),t.name&&(e.name=t.name),t.priority&&(e.priority=t.priority);for(var i in t.properties)t.properties.hasOwnProperty(i)&&(e.properties[i]=t.properties[i])}},e.Fe=function(e){return e<0?"Undefined":e<=3?"UpTo3Sec":e<=10?"UpTo10Sec":e<=30?"UpTo30Sec":e<=60?"UpTo60Sec":e<=180?"UpTo3Min":e<=600?"UpTo10Min":e<=1800?"UpTo30Min":"Above30Min"},e.ke=function(e,t){return e.name&&s.isString(e.name)?(e.name=e.name.toLowerCase(),e.name=e.name.replace(s.EventNameDotRegex,"_"),e.type&&s.isString(e.type)?e.type=e.type.toLowerCase():e.type="custom",s.EventNameAndTypeRegex.test(e.name)&&s.EventNameAndTypeRegex.test(e.type)?((!s.isNumber(e.timestamp)||e.timestamp<0)&&(e.timestamp=(new Date).getTime()),e.properties||(e.properties={}),this.He(e,t.getPropertyMap()),this.He(e,c.default.logManagerContext.getPropertyMap()),this.Qe(e,"EventInfo.InitId",this.je(e.apiKey)),this.Qe(e,"EventInfo.Sequence",this.ze(e.apiKey)),this.Qe(e,"EventInfo.SdkVersion",_.FullVersionString),this.Qe(e,"EventInfo.Name",e.name),this.Qe(e,"EventInfo.Time",new Date(e.timestamp).toISOString()),s.isPriority(e.priority)||(e.priority=n.AWTEventPriority.Normal),void this.Ke(e)):void u.default.eventsRejected([e],n.AWTEventsRejectedReason.InvalidEvent)):void u.default.eventsRejected([e],n.AWTEventsRejectedReason.InvalidEvent)},e.He=function(e,t){if(t)for(var i in t)t.hasOwnProperty(i)&&(e.properties[i]||(e.properties[i]=t[i]))},e.Qe=function(e,t,i){e.properties[t]={value:i,pii:n.AWTPiiKind.NotSet,type:n.AWTPropertyType.String}},e.Ke=function(e){d.default.sendEvent(e)},e.Ue=function(e,t,i){if(e.properties=e.properties||{},i)for(var n in e.properties)e.properties.hasOwnProperty(n)&&(e.properties[n]=s.sanitizeProperty(n,e.properties[n]),null===e.properties[n]&&delete e.properties[n]);var r=e;return r.id=s.newGuid(),r.apiKey=t,r},e.je=function(t){return e.qe[t]},e.ze=function(t){return void 0===e.Ge[t]&&(e.Ge[t]=0),(++e.Ge[t]).toString()},e.Ge={},e.qe={},e}();t.default=f},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.AWT_REAL_TIME="REAL_TIME",t.AWT_NEAR_REAL_TIME="NEAR_REAL_TIME",t.AWT_BEST_EFFORT="BEST_EFFORT"},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Version="1.8.3",t.FullVersionString="AWT-Web-JS-"+t.Version},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(0);t.AWTPropertyType=n.AWTPropertyType,t.AWTPiiKind=n.AWTPiiKind,t.AWTEventPriority=n.AWTEventPriority,t.AWTEventsDroppedReason=n.AWTEventsDroppedReason,t.AWTEventsRejectedReason=n.AWTEventsRejectedReason,t.AWTCustomerContentKind=n.AWTCustomerContentKind;var r=i(6);t.AWTUserIdType=r.AWTUserIdType,t.AWTSessionState=r.AWTSessionState;var o=i(14);t.AWT_BEST_EFFORT=o.AWT_BEST_EFFORT,t.AWT_NEAR_REAL_TIME=o.AWT_NEAR_REAL_TIME,t.AWT_REAL_TIME=o.AWT_REAL_TIME;var s=i(5);t.AWTEventProperties=s.default;var a=i(13);t.AWTLogger=a.default;var u=i(11);t.AWTLogManager=u.default;var d=i(29);t.AWTTransmissionManager=d.default;var c=i(9);t.AWTSerializer=c.default;var _=i(8);t.AWTSemanticContext=_.default,t.AWT_COLLECTOR_URL_UNITED_STATES="https://us.pipe.aria.microsoft.com/Collector/3.0/",t.AWT_COLLECTOR_URL_GERMANY="https://de.pipe.aria.microsoft.com/Collector/3.0/",t.AWT_COLLECTOR_URL_JAPAN="https://jp.pipe.aria.microsoft.com/Collector/3.0/",t.AWT_COLLECTOR_URL_AUSTRALIA="https://au.pipe.aria.microsoft.com/Collector/3.0/",t.AWT_COLLECTOR_URL_EUROPE="https://eu.pipe.aria.microsoft.com/Collector/3.0/",t.AWT_COLLECTOR_URL_USGOV_DOD="https://pf.pipe.aria.microsoft.com/Collector/3.0",t.AWT_COLLECTOR_URL_USGOV_DOJ="https://tb.pipe.aria.microsoft.com/Collector/3.0"},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});!function(e){e[e.Ve=0]="_BT_STOP",e[e.Xe=1]="_BT_STOP_BASE",e[e.ge=2]="_BT_BOOL",e[e.Se=8]="_BT_DOUBLE",e[e.oe=9]="_BT_STRING",e[e.de=10]="_BT_STRUCT",e[e.se=11]="_BT_LIST",e[e.ie=13]="_BT_MAP",e[e.ye=16]="_BT_INT32",e[e.ce=17]="_BT_INT64"}(t.ne||(t.ne={}))},function(e,t,i){"use strict";function n(e){for(var t=[],i=0;i<e.length;++i){var n=e.charCodeAt(i);n<128?t.push(n):n<2048?t.push(192|n>>6,128|63&n):n<55296||n>=57344?t.push(224|n>>12,128|n>>6&63,128|63&n):(n=65536+((1023&n)<<10|1023&e.charCodeAt(++i)),t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return t}function r(e){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=[],n=e.length%3,r=0,o=e.length-n;r<o;r+=3){var s=(e[r]<<16)+(e[r+1]<<8)+e[r+2];i.push(function(e){return[t.charAt(e>>18&63),t.charAt(e>>12&63),t.charAt(e>>6&63),t.charAt(63&e)].join("")}(s))}switch(n){case 1:var s=e[e.length-1];i.push(t.charAt(s>>2)),i.push(t.charAt(s<<4&63)),i.push("==");break;case 2:var a=(e[e.length-2]<<8)+e[e.length-1];i.push(t.charAt(a>>10)),i.push(t.charAt(a>>4&63)),i.push(t.charAt(a<<2&63)),i.push("=")}return i.join("")}function o(e){for(var t=[];4294967168&e;)t.push(127&e|128),e>>>=7;return t.push(127&e),t}function s(e){for(var t=e.low,i=e.high,n=[];i||4294967168&t;)n.push(127&t|128),t=(127&i)<<25|t>>>7,i>>>=7;return n.push(127&t),n}function a(e){if(l.BrowserChecker.Ze()){var t=new DataView(new ArrayBuffer(8));t.setFloat64(0,e,!0);for(var i=[],n=0;n<8;++n)i.push(t.getUint8(n));return i}return _.FloatUtils.Je(e,!0)}function u(e){return(e=c.Number.B(e))<<1^e>>31}function d(e){var t=e.low,i=e.high,n=i<<1|t>>>31,r=t<<1;2147483648&i&&(n=~n,r=~r);var o=new c.UInt64("0");return o.low=r,o.high=n,o}Object.defineProperty(t,"__esModule",{value:!0});var c=i(4),_=i(19),l=i(22);t.Ye=n,t.Ie=r,t.he=o,t.$e=s,t.et=a,t.tt=u,t.it=d},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e.Je=function(e,t){if(!e)return t?this.nt:this.rt;var i=t?11:8,n=t?52:23,r=(1<<i-1)-1,o=1-r,s=r,a=e<0?1:0;e=Math.abs(e);for(var u=Math.floor(e),d=e-u,c=2*(r+2)+n,_=new Array(c),l=0;l<c;)_[l++]=0;for(l=r+2;l&&u;)_[--l]=u%2,u=Math.floor(u/2);for(l=r+1;l<c-1&&d>0;)d*=2,d>=1?(_[++l]=1,--d):_[++l]=0;for(var p=0;p<c&&!_[p];)p++;var f=r+1-p,h=p+n;if(_[h+1]){for(l=h;l>p&&(_[l]=1-_[l],!_);--l);l===p&&++f}if(f>s||u)return a?t?this.ot:this.st:t?this.at:this.ut;if(f<o)return t?this.nt:this.rt;if(t){var v=0;for(l=0;l<20;++l)v=v<<1|_[++p];for(var y=0;l<52;++l)y=y<<1|_[++p];v|=f+r<<20,v=a<<31|2147483647&v;var T=[255&y,y>>8&255,y>>16&255,y>>>24,255&v,v>>8&255,v>>16&255,v>>>24];return T}var g=0;for(l=0;l<23;++l)g=g<<1|_[++p];g|=f+r<<23,g=a<<31|2147483647&g;var T=[255&g,g>>8&255,g>>16&255,g>>>24];return T},e.rt=[0,0,0,0],e.nt=[0,0,0,0,0,0,0,0],e.ut=[0,0,128,127],e.st=[0,0,128,255],e.at=[0,0,0,0,0,0,240,127],e.ot=[0,0,0,0,0,0,240,255],e}();t.FloatUtils=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(4),r=function(){function e(){this.dt=[]}return e.prototype.ct=function(e){this.dt.push(n.Number.W(e))},e.prototype._t=function(e,t,i){for(;i--;)this.ct(e[t++])},e.prototype.le=function(){return this.dt},e}();t.MemoryStream=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(17);t.ne=n.ne;var r=i(18);t.ve=r;var o=i(20);t.IO=o;var s=i(4);t.Int64=s.Int64,t.UInt64=s.UInt64,t.Number=s.Number;var a=function(){function e(e){this.lt=e}return e.prototype.pt=function(e){this.lt._t(e,0,e.length)},e.prototype.me=function(e){this.lt.ct(e?1:0)},e.prototype.ue=function(e,t){this.ft(t),this.ht(e)},e.prototype.re=function(e,t,i){this.ft(t),this.ft(i),this.ht(e)},e.prototype.Ae=function(e){var t=r.et(e);this.lt._t(t,0,t.length)},e.prototype.te=function(e,t,i){t<=5?this.lt.ct(e|t<<5):t<=255?(this.lt.ct(192|e),this.lt.ct(t)):(this.lt.ct(224|e),this.lt.ct(t),this.lt.ct(t>>8))},e.prototype.Te=function(e){e=r.tt(e),this.ht(e)},e.prototype._e=function(e){this.vt(r.it(e))},e.prototype.ae=function(e){if(""===e)this.ht(0);else{var t=r.Ye(e);this.ht(t.length),this.lt._t(t,0,t.length)}},e.prototype.fe=function(e){this.ft(e?n.ne.Xe:n.ne.Ve)},e.prototype.ht=function(e){var t=r.he(s.Number.w(e));this.lt._t(t,0,t.length)},e.prototype.vt=function(e){var t=r.$e(e);this.lt._t(t,0,t.length)},e.prototype.ft=function(e){this.lt.ct(s.Number.P(e))},e}();t.CompactBinaryProtocolWriter=a},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e.Ze=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof DataView},e}();t.BrowserChecker=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){this.clockSkewRefreshDurationInMins=e,this.yt()}return e.prototype.allowRequestSending=function(){return this.Tt&&!this.gt?(this.Tt=!1,this.mt=!1,!0):this.mt},e.prototype.shouldAddClockSkewHeaders=function(){return this.St},e.prototype.getClockSkewHeaderValue=function(){return this.At},e.prototype.setClockSkew=function(e){this.gt||(e?this.At=e:this.St=!1,this.gt=!0,this.mt=!0)},e.prototype.yt=function(){var e=this;this.Tt=!0,this.gt=!1,this.mt=!0,this.St=!0,this.At="use-collector-delta",this.clockSkewRefreshDurationInMins>0&&setTimeout(function(){return e.yt()},6e4*this.clockSkewRefreshDurationInMins)},e}();t.default=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){this.It={}}return e.prototype.setKillSwitchTenants=function(e,t){if(e&&t)try{var i=e.split(",");if("this-request-only"===t)return i;for(var n=1e3*parseInt(t,10),r=0;r<i.length;++r)this.It[i[r]]=Date.now()+n}catch(e){return[]}return[]},e.prototype.isTenantKilled=function(e){return void 0!==this.It[e]&&this.It[e]>Date.now()||(delete this.It[e],!1)},e}();t.default=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(0),r=function(){function e(e,t){this.Et=e,this.Wt=t,this.Pt={},this.Bt=0}return e.prototype.addEventToBatch=function(e){if(e.priority===n.AWTEventPriority.Immediate_sync){var t={};return t[e.apiKey]=[e],t}return this.Bt>=this.Wt&&this.flushBatch(),void 0===this.Pt[e.apiKey]&&(this.Pt[e.apiKey]=[]),this.Pt[e.apiKey].push(e),this.Bt++,null},e.prototype.flushBatch=function(){this.Bt>0&&(this.Et.push(this.Pt),this.Pt={},this.Bt=0)},e.prototype.hasBatch=function(){return this.Bt>0},e}();t.default=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e.shouldRetryForStatus=function(e){return!(e>=300&&e<500&&408!==e||501===e||505===e)},e.getMillisToBackoffForRetry=function(e){var t=0,i=Math.floor(1200*Math.random())+2400;return t=Math.pow(4,e)*i,Math.min(t,12e4)},e}();t.default=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(0),r=i(9),o=i(26),s=i(24),a=i(23),u=i(15),d=i(1),c=i(2),_=i(3),l="POST",p=function(){function e(e,t,i,n,r){var o=this;this.wt=e,this.Ct=i,this.bt=n,this.Rt="?qsp=true&content-type=application%2Fbond-compact-binary&client-id=NO_AUTH&sdk-version="+u.FullVersionString,this.Dt=new s.default,this._=!1,this.Ot=!1,this.Nt=0,this.Mt=new a.default(r),d.isUint8ArrayAvailable()||(this.Rt+="&content-encoding=base64"),this.Rt=t+this.Rt,this.bt||(this.Ot=!d.isReactNative(),this.bt={sendPOST:function(e,t,i,n,r,s){try{if(d.useXDomainRequest()){var a=new XDomainRequest;a.open(l,e),a.onload=function(){r(200,null)},a.onerror=function(){n(400,null)},a.ontimeout=function(){i(500,null)},a.send(t)}else if(d.isReactNative())fetch(e,{body:t,method:l}).then(function(e){var t={};e.headers&&e.headers.forEach(function(e,i){t[i]=e}),r(e.status,t)}).catch(function(e){n(0,{})});else{var u=new XMLHttpRequest;u.open(l,e,!s),u.onload=function(){r(u.status,o.kt(u.getAllResponseHeaders()))},u.onerror=function(){n(u.status,o.kt(u.getAllResponseHeaders()))},u.ontimeout=function(){i(u.status,o.kt(u.getAllResponseHeaders()))},u.send(t)}}catch(e){n(400,null)}}})}return e.prototype.hasIdleConnection=function(){return this.Nt<2},e.prototype.sendQueuedRequests=function(){for(;this.hasIdleConnection()&&!this._&&this.wt.length>0&&this.Mt.allowRequestSending();)this.Nt++,this.Ut(this.wt.shift(),0,!1);this.hasIdleConnection()&&_.default.scheduleTimer()},e.prototype.isCompletelyIdle=function(){return 0===this.Nt},e.prototype.teardown=function(){for(;this.wt.length>0;)this.Ut(this.wt.shift(),0,!0)},e.prototype.pause=function(){this._=!0},e.prototype.resume=function(){this._=!1,this.sendQueuedRequests()},e.prototype.removeQueuedRequests=function(){this.wt.length=0},e.prototype.sendSynchronousRequest=function(e,t){this._&&(e[t][0].priority=n.AWTEventPriority.High),this.Nt++,this.Ut(e,0,!1,!0)},e.prototype.Ut=function(e,t,i,o){var s=this;void 0===o&&(o=!1);try{if(this._)return this.Nt--,void this.Ct.addBackRequest(e);var a=0,u="";for(var _ in e)e.hasOwnProperty(_)&&(this.Dt.isTenantKilled(_)?(c.default.eventsRejected(e[_],n.AWTEventsRejectedReason.KillSwitch),delete e[_]):(u.length>0&&(u+=","),u+=_,a++));if(a>0){var l=r.default.getPayloadBlob(e,a);l.remainingRequest&&this.wt.push(l.remainingRequest);var p=this.Rt+"&x-apikey="+u+"&client-time-epoch-millis="+Date.now().toString();this.Mt.shouldAddClockSkewHeaders()&&(p=p+"&time-delta-to-apply-millis="+this.Mt.getClockSkewHeaderValue());var f=void 0;f=d.isUint8ArrayAvailable()?new Uint8Array(l.payloadBlob):r.default.base64Encode(l.payloadBlob);for(var _ in e)if(e.hasOwnProperty(_))for(var h=0;h<e[_].length;++h)e[_][h].sendAttempt>0?e[_][h].sendAttempt++:e[_][h].sendAttempt=1;if(this.Ot&&i&&d.isBeaconsSupported()&&navigator.sendBeacon(p,f))return;this.bt.sendPOST(p,f,function(n,r){s.xt(n,r,e,a,u,t,i,o)},function(n,r){s.xt(n,r,e,a,u,t,i,o)},function(n,r){s.xt(n,r,e,a,u,t,i,o)},i||o)}else i||this.Lt(!1,{},i,o)}catch(e){this.Lt(!1,{},i,o)}},e.prototype.xt=function(e,t,i,r,s,a,u,d){var l=this,p=!0;if(void 0!==e){if(t){var f=this.Dt.setKillSwitchTenants(t["kill-tokens"],t["kill-duration-seconds"]);this.Mt.setClockSkew(t["time-delta-millis"]);for(var h=0;h<f.length;++h)c.default.eventsRejected(i[f[h]],n.AWTEventsRejectedReason.KillSwitch),delete i[f[h]],r--}else this.Mt.setClockSkew(null);if(200===e)return void this.Lt(!0,i,u,d);(!o.default.shouldRetryForStatus(e)||r<=0)&&(p=!1)}if(p)if(d)this.Nt--,i[s][0].priority=n.AWTEventPriority.High,this.Ct.addBackRequest(i);else if(a<1){for(var v in i)i.hasOwnProperty(v)&&c.default.eventsRetrying(i[v]);setTimeout(function(){return l.Ut(i,a+1,!1)},o.default.getMillisToBackoffForRetry(a))}else this.Nt--,_.default.backOffTransmission(),this.Ct.addBackRequest(i);else this.Lt(!1,i,u,d)},e.prototype.Lt=function(e,t,i,r){e&&_.default.clearBackOff();for(var o in t)t.hasOwnProperty(o)&&(e?c.default.eventsSent(t[o]):c.default.eventsDropped(t[o],n.AWTEventsDroppedReason.NonRetryableStatus));this.Nt--,r||i||this.sendQueuedRequests()},e.prototype.kt=function(e){var t={};if(e)for(var i=e.split("\n"),n=0;n<i.length;++n){var r=i[n].split(": ");t[r[0]]=r[1]}return t},e}();t.default=p},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(0),r=i(27),o=i(3),s=i(25),a=i(2),u=i(1),d=500,c=function(){function e(e,t,i,o){this.Ft=t,this.qt=!1,this.Ht=[],this.Qt=!1,this._=!1,this.jt=0,this.Et=[],this.zt={},this.zt[n.AWTEventPriority.High]=[],this.zt[n.AWTEventPriority.Normal]=[],this.zt[n.AWTEventPriority.Low]=[],this.Kt(),this.Gt=new s.default(this.Et,d),this.Vt=new r.default(this.Et,e,this,i,o)}return e.prototype.addEvent=function(e){u.isPriority(e.priority)||(e.priority=n.AWTEventPriority.Normal),e.priority===n.AWTEventPriority.Immediate_sync?this.Vt.sendSynchronousRequest(this.Gt.addEventToBatch(e),e.apiKey):this.jt<this.Ft?this.Xt(e):this.Zt(e.priority)?this.Xt(e):a.default.eventsDropped([e],n.AWTEventsDroppedReason.QueueFull)},e.prototype.sendEventsForPriorityAndAbove=function(e){this.Jt(e),this.Vt.sendQueuedRequests()},e.prototype.hasEvents=function(){return(this.zt[n.AWTEventPriority.High][0].length>0||this.zt[n.AWTEventPriority.Normal][0].length>0||this.zt[n.AWTEventPriority.Low][0].length>0||this.Gt.hasBatch())&&this.Vt.hasIdleConnection()},e.prototype.addBackRequest=function(e){if(!this._||!this.Qt){for(var t in e)if(e.hasOwnProperty(t))for(var i=0;i<e[t].length;++i)e[t][i].sendAttempt<6?this.addEvent(e[t][i]):a.default.eventsDropped([e[t][i]],n.AWTEventsDroppedReason.NonRetryableStatus);o.default.scheduleTimer()}},e.prototype.teardown=function(){this._||(this.Jt(n.AWTEventPriority.Low),this.Vt.teardown())},e.prototype.uploadNow=function(e){var t=this;this.Kt(),this.qt?this.Ht.push(e):(this.qt=!0,setTimeout(function(){return t.Yt(e)},0))},e.prototype.pauseTransmission=function(){this._=!0,this.Vt.pause(),this.shouldDropEventsOnPause&&(this.jt-=this.zt[n.AWTEventPriority.High][0].length+this.zt[n.AWTEventPriority.Normal][0].length+this.zt[n.AWTEventPriority.Low][0].length,this.zt[n.AWTEventPriority.High][0]=[],this.zt[n.AWTEventPriority.Normal][0]=[],this.zt[n.AWTEventPriority.Low][0]=[],this.Vt.removeQueuedRequests())},e.prototype.resumeTransmission=function(){this._=!1,this.Vt.resume()},e.prototype.shouldDropEventsOnPause=function(e){this.Qt=e},e.prototype.$t=function(){this.zt[n.AWTEventPriority.High].shift(),this.zt[n.AWTEventPriority.Normal].shift(),this.zt[n.AWTEventPriority.Low].shift()},e.prototype.Kt=function(){this.zt[n.AWTEventPriority.High].push([]),this.zt[n.AWTEventPriority.Normal].push([]),this.zt[n.AWTEventPriority.Low].push([])},e.prototype.Xt=function(e){this._&&this.Qt||(this.jt++,this.zt[e.priority][this.zt[e.priority].length-1].push(e))},e.prototype.Zt=function(e){for(var t=n.AWTEventPriority.Low;t<=e;){if(this.zt[t][this.zt[t].length-1].length>0)return a.default.eventsDropped([this.zt[t][this.zt[t].length-1].shift()],n.AWTEventsDroppedReason.QueueFull),!0;t++}return!1},e.prototype.Jt=function(e){for(var t=n.AWTEventPriority.High;t>=e;){for(;this.zt[t][0].length>0;){var i=this.zt[t][0].pop();this.jt--,this.Gt.addEventToBatch(i)}t--}this.Gt.flushBatch()},e.prototype.Yt=function(e){var t=this;this.hasEvents()&&this.sendEventsForPriorityAndAbove(n.AWTEventPriority.Low),this.ei(function(){t.$t(),null!==e&&void 0!==e&&e(),t.Ht.length>0?setTimeout(function(){return t.Yt(t.Ht.shift())},0):(t.qt=!1,t.hasEvents()&&o.default.scheduleTimer())})},e.prototype.ei=function(e){var t=this;this.Vt.isCompletelyIdle()?e():setTimeout(function(){return t.ei(e)},250)},e}();t.default=c},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(3),r=function(){function e(){}return e.setEventsHandler=function(e){n.default.setEventsHandler(e)},e.getEventsHandler=function(){return n.default.getEventsHandler()},e.scheduleTimer=function(){n.default.scheduleTimer()},e}();t.default=r},function(e,t,i){e.exports=i(16)}])});
//# sourceMappingURL=aria-webjs-sdk-1.8.3.min.js.map 
 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ClientRuntime;
(function (ClientRuntime) {
    "use strict";
    class AutoAcceptEventHandler {
        /**
         * Form on-load event handler
         * @param executionContext execution context
         */
        static onFormLoad(executionContext) {
            ClientRuntime.TelemetryManager.init();
            AutoAcceptEventHandler.populateNotificationFormValues(executionContext);
            AutoAcceptEventHandler.showOrHideRejectButtonText(executionContext);
            AutoAcceptEventHandler.showOrHideAutoPopupSessionToggle(executionContext);
            AutoAcceptEventHandler.modifyUIComponentsBasedOnAutoAcceptSetting(executionContext, ClientRuntime.NotificationTemplateEntityConstants.onLoadEvent);
            AutoAcceptEventHandler.modifyUIComponentsBasedOnAutoPopupSetting(executionContext, ClientRuntime.NotificationTemplateEntityConstants.onLoadEvent);
        }
        /*
         * shows or hides the 'Reject Button Text' based on the value of the field showRejectButton.
         */
        static showOrHideRejectButtonText(executionContext) {
            const formContext = executionContext.getFormContext();
            const showRejectButtonAttrribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_showrejectbutton);
            if (!ClientRuntime.Utility.isNullOrUndefined(showRejectButtonAttrribute)) {
                const isShowRejectButtonEnabled = showRejectButtonAttrribute.getValue();
                formContext.getControl(ClientRuntime.NotificationTemplateEntityConstants.msdyn_rejectbuttontext).setVisible(isShowRejectButtonEnabled);
            }
        }
        /*
         * shows or hides the 'Auto popup session toggle' basing on the value of the field msdyn_autoacceptnotification
         */
        static showOrHideAutoPopupSessionToggle(executionContext) {
            const formContext = executionContext.getFormContext();
            const autoAcceptControl = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_autoacceptnotification);
            const isAutoAcceptEnabled = !ClientRuntime.Utility.isNullOrUndefined(autoAcceptControl) && autoAcceptControl.getValue();
            if (!ClientRuntime.Utility.isNullOrUndefined(isAutoAcceptEnabled)) {
                formContext.getControl(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateAutoPopupSession).setVisible(isAutoAcceptEnabled);
            }
        }
        /*
         *  This method is called when auto auto popup option is toggled. It modifies the UI elements based on the current auto-popup setting.
         */
        static onAutoPopupToggle(executionContext) {
            AutoAcceptEventHandler.modifyUIComponentsBasedOnAutoPopupSetting(executionContext, ClientRuntime.NotificationTemplateEntityConstants.onToggleEvent);
        }
        /*
         *  This method is called when timeout value is modified. It will show/clear notification whether auto-accept is enabled and timeout is too short.
         */
        static onTimeoutChanged(executionContext) {
            const formContext = executionContext.getFormContext();
            const timeOutAttribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateTimeoutAttribute);
            const timeOutValue = !ClientRuntime.Utility.isNullOrUndefined(timeOutAttribute) && timeOutAttribute.getValue();
            if (timeOutValue >= 0 && timeOutValue <= 9) {
                const autoAcceptControl = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_autoacceptnotification);
                const isAutoAcceptEnabled = !ClientRuntime.Utility.isNullOrUndefined(autoAcceptControl) && autoAcceptControl.getValue();
                if (!ClientRuntime.Utility.isNullOrUndefined(isAutoAcceptEnabled && isAutoAcceptEnabled)) {
                    formContext.ui.setFormNotification(ClientRuntime.Utility.getResourceString(ClientRuntime.ResourceStringConstants.timeoutTooShortMessage), ClientRuntime.NotificationMessageConstants.warning, ClientRuntime.NotificationMessageConstants.timeoutTooShortHandlerID);
                }
                else {
                    formContext.ui.clearFormNotification(ClientRuntime.NotificationMessageConstants.timeoutTooShortHandlerID);
                }
            }
            else {
                formContext.ui.clearFormNotification(ClientRuntime.NotificationMessageConstants.timeoutTooShortHandlerID);
            }
        }
        static updateLabelsBasedOnAutoAcceptSetting(executionContext) {
            const formContext = executionContext.getFormContext();
            const autoAcceptControl = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_autoacceptnotification);
            const isAutoAcceptEnabled = !ClientRuntime.Utility.isNullOrUndefined(autoAcceptControl) && autoAcceptControl.getValue();
            const acceptButtonTextAttribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_acceptbuttontext);
            if (isAutoAcceptEnabled) {
                acceptButtonTextAttribute.setValue(ClientRuntime.Utility.getResourceString(ClientRuntime.NotificationTemplateEntityConstants.accept_button_text_when_autoaccept_is_enabled));
            }
            else {
                acceptButtonTextAttribute.setValue(ClientRuntime.Utility.getResourceString(ClientRuntime.NotificationTemplateEntityConstants.accept_button_text));
            }
        }
        /*
         *  This method is called when auto accept option is toggled. It modifies the UI elements based on the current auto-accept setting.
         */
        static onAutoAcceptToggle(executionContext) {
            AutoAcceptEventHandler.modifyUIComponentsBasedOnAutoAcceptSetting(executionContext, ClientRuntime.NotificationTemplateEntityConstants.onToggleEvent);
            AutoAcceptEventHandler.updateLabelsBasedOnAutoAcceptSetting(executionContext);
        }
        static modifyUIComponentsBasedOnAutoAcceptSetting(executionContext, eventType) {
            const formContext = executionContext.getFormContext();
            const autoAcceptControl = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_autoacceptnotification);
            const isAutoAcceptEnabled = !ClientRuntime.Utility.isNullOrUndefined(autoAcceptControl) && autoAcceptControl.getValue();
            const showRejectButtonControl = formContext.getControl(ClientRuntime.NotificationTemplateEntityConstants.msdyn_showrejectbutton);
            const showRejectButtonAttrribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_showrejectbutton);
            //auto popup session
            const showOrHideAutoPopupSessionControl = formContext.getControl(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateAutoPopupSession);
            const showOrHideshowAutoPopupSessionAttrribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateAutoPopupSession);
            //disable countdown/timeout field
            const showCountdownControl = formContext.getControl(ClientRuntime.NotificationTemplateEntityConstants.msdyn_showtimeout);
            if (isAutoAcceptEnabled) {
                if (showRejectButtonControl) {
                    showRejectButtonAttrribute.setValue(false); // Note: onChange handler is not called automatically when the change happens programatically, hence calling the handler explicitly in next line.
                    AutoAcceptEventHandler.showOrHideRejectButtonText(executionContext);
                    showRejectButtonControl.setDisabled(true); // make this field read only.
                }
                if (showOrHideAutoPopupSessionControl) {
                    AutoAcceptEventHandler.showOrHideAutoPopupSessionToggle(executionContext);
                }
            }
            else if (eventType === ClientRuntime.NotificationTemplateEntityConstants.onToggleEvent) {
                if (showRejectButtonControl) {
                    showRejectButtonAttrribute.setValue(true); // setting to default value.
                    AutoAcceptEventHandler.showOrHideRejectButtonText(executionContext);
                    showRejectButtonControl.setDisabled(false); // enable the field.
                }
                if (showOrHideAutoPopupSessionControl) {
                    showOrHideshowAutoPopupSessionAttrribute.setValue(false);
                    AutoAcceptEventHandler.showOrHideAutoPopupSessionToggle(executionContext);
                }
                if (showCountdownControl) {
                    showCountdownControl.setDisabled(false); //enable showCoundown Field
                }
            }
        }
        static modifyUIComponentsBasedOnAutoPopupSetting(executionContext, eventType) {
            const formContext = executionContext.getFormContext();
            const autoAcceptControl = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_autoacceptnotification);
            const isAutoAcceptEnabled = !ClientRuntime.Utility.isNullOrUndefined(autoAcceptControl) && autoAcceptControl.getValue();
            const showAutoPopupSessionAttrribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateAutoPopupSession);
            const isAutoPopupSessionEnabled = !ClientRuntime.Utility.isNullOrUndefined(showAutoPopupSessionAttrribute) && showAutoPopupSessionAttrribute.getValue();
            const showCountdownControl = formContext.getControl(ClientRuntime.NotificationTemplateEntityConstants.msdyn_showtimeout);
            const showCountdownAttrribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_showtimeout);
            if (isAutoAcceptEnabled && isAutoPopupSessionEnabled) {
                if (showCountdownControl) {
                    //when auto popup session enabled (auto accept enabled in the admin form) show Countdown is alwasy true
                    showCountdownAttrribute.setValue(true);
                    showCountdownControl.setDisabled(true);
                }
                formContext.ui.setFormNotification(ClientRuntime.Utility.getResourceString(ClientRuntime.ResourceStringConstants.autoPopUpEnableMessage), ClientRuntime.NotificationMessageConstants.warning, ClientRuntime.NotificationMessageConstants.autoPopUpEnableMessageHandlerID);
            }
            else if (eventType === ClientRuntime.NotificationTemplateEntityConstants.onToggleEvent) {
                if (showCountdownControl) {
                    showCountdownControl.setDisabled(false);
                }
                formContext.ui.clearFormNotification(ClientRuntime.NotificationMessageConstants.autoPopUpEnableMessageHandlerID);
            }
        }
        static populateNotificationFormValues(executionContext) {
            let formContext = executionContext.getFormContext();
            if (formContext.ui.getFormType() == 1) {
                try {
                    //icon
                    let notificationIconAttribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateIconAttribute);
                    if (!ClientRuntime.Utility.isNullOrUndefined(notificationIconAttribute)) {
                        notificationIconAttribute.setValue(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateIconDefaultValue);
                    }
                    //timeout
                    let notificationTimeoutAttribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.notificationTemplateTimeoutAttribute);
                    if (!ClientRuntime.Utility.isNullOrUndefined(notificationTimeoutAttribute)) {
                        notificationTimeoutAttribute.setValue(ClientRuntime.NotificationTemplateEntityConstants.timeoutValue);
                    }
                    //Reject button text
                    let rejectButtonTextAttribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_rejectbuttontext);
                    if (!ClientRuntime.Utility.isNullOrUndefined(rejectButtonTextAttribute) && ClientRuntime.Utility.isNullOrEmptyString(rejectButtonTextAttribute.getValue())) {
                        rejectButtonTextAttribute.setValue(ClientRuntime.Utility.getResourceString(ClientRuntime.NotificationTemplateEntityConstants.reject_button_default_text));
                    }
                    //Accept button
                    let acceptButtonTextAttribute = formContext.getAttribute(ClientRuntime.NotificationTemplateEntityConstants.msdyn_acceptbuttontext);
                    if (!ClientRuntime.Utility.isNullOrUndefined(acceptButtonTextAttribute) && ClientRuntime.Utility.isNullOrEmptyString(acceptButtonTextAttribute.getValue())) {
                        acceptButtonTextAttribute.setValue(ClientRuntime.Utility.getResourceString(ClientRuntime.NotificationTemplateEntityConstants.accept_button_text));
                    }
                }
                catch (ex) {
                    ClientRuntime.Logger.error(`Error setting the default values in Notification template form: ${ex}`);
                }
            }
        }
    }
    ClientRuntime.AutoAcceptEventHandler = AutoAcceptEventHandler;
})(ClientRuntime || (ClientRuntime = {}));
var ClientRuntime;
(function (ClientRuntime) {
    class NotificationTemplateEntityConstants {
    }
    NotificationTemplateEntityConstants.webResourceName = "Localization/CEC_webresource_strings";
    NotificationTemplateEntityConstants.msdyn_showrejectbutton = "msdyn_showrejectbutton";
    NotificationTemplateEntityConstants.msdyn_rejectbuttontext = "msdyn_rejectbuttontext";
    NotificationTemplateEntityConstants.msdyn_autoacceptnotification = "msdyn_autoacceptnotification";
    NotificationTemplateEntityConstants.msdyn_acceptbuttontext = "msdyn_acceptbuttontext";
    NotificationTemplateEntityConstants.msdyn_showtimeout = "msdyn_showtimeout";
    NotificationTemplateEntityConstants.onLoadEvent = "onLoad";
    NotificationTemplateEntityConstants.onToggleEvent = "onToggle";
    NotificationTemplateEntityConstants.accept_button_text = "ACCEPT_BUTTON_TEXT";
    NotificationTemplateEntityConstants.accept_button_text_when_autoaccept_is_enabled = "ACCEPT_BUTTON_TEXT_WHEN_AUTOACCEPT_IS_ENABLED";
    NotificationTemplateEntityConstants.reject_button_default_text = "REJECT_BUTTON_DEFAULT_TEXT";
    NotificationTemplateEntityConstants.timeoutValue = 120;
    NotificationTemplateEntityConstants.notificationTemplateIconAttribute = "msdyn_icon";
    NotificationTemplateEntityConstants.notificationTemplateIconDefaultValue = "/webresources/msdyn_chat_icon_zfp.svg";
    NotificationTemplateEntityConstants.notificationTemplateTimeoutAttribute = "msdyn_timeout";
    NotificationTemplateEntityConstants.notificationTemplateAutoPopupSession = "msdyn_autopopupsession";
    ClientRuntime.NotificationTemplateEntityConstants = NotificationTemplateEntityConstants;
    class ResourceStringConstants {
    }
    ResourceStringConstants.autoPopUpEnableMessage = "NOTIFICATION_MESSAGE_ENABLE_AUTOPOPUP";
    ResourceStringConstants.timeoutTooShortMessage = "NOTIFICATION_TIMEOUT_TOO_SHORT";
    ClientRuntime.ResourceStringConstants = ResourceStringConstants;
    class NotificationMessageConstants {
    }
    NotificationMessageConstants.autoPopUpEnableMessageHandlerID = "a101ec8d-7a10-426c-9b3d-efb8d38e1b76";
    NotificationMessageConstants.timeoutTooShortHandlerID = "987d0d5e-cd49-4f80-892f-1da7174bd6e4";
    NotificationMessageConstants.warning = "WARNING";
    ClientRuntime.NotificationMessageConstants = NotificationMessageConstants;
})(ClientRuntime || (ClientRuntime = {}));
var ClientRuntime;
(function (ClientRuntime) {
    "use strict";
    class Utility {
        static getResourceString(key) {
            var _a;
            let value = key;
            if ((_a = Xrm === null || Xrm === void 0 ? void 0 : Xrm.Utility) === null || _a === void 0 ? void 0 : _a.getResourceString) {
                value = Xrm.Utility.getResourceString(ClientRuntime.NotificationTemplateEntityConstants.webResourceName, key);
                if (Utility.isNullOrUndefined(value)) {
                    value = key;
                }
            }
            return value;
        }
        static isNullOrUndefined(object) {
            return typeof object == "undefined" || object == null;
        }
        static isNullOrEmptyString(text) {
            return text && text.trim().length > 0 ? false : true;
        }
    }
    ClientRuntime.Utility = Utility;
})(ClientRuntime || (ClientRuntime = {}));
var ClientRuntime;
(function (ClientRuntime) {
    class AriaConnectionProperties {
    }
    AriaConnectionProperties.ProdIngestionKey = "0cd345da5c484bff8b75c696a3ac2159-3a768593-5759-4630-a59e-a75af2a7bf20-6631";
    AriaConnectionProperties.DevIngestionKey = "39f156fe0f00465288756928db675fe0-fef5dc1c-14bd-4361-9259-5f10f8ef5040-7209";
    AriaConnectionProperties.GERMANY_ENDPOINT = "https://de.pipe.aria.microsoft.com/Collector/3.0/";
    AriaConnectionProperties.GCCH_ENDPOINT = "https://tb.pipe.aria.microsoft.com/Collector/3.0/";
    AriaConnectionProperties.DOD_ENDPOINT = "https://pf.pipe.aria.microsoft.com/Collector/3.0";
    AriaConnectionProperties.EUROPE_ENDPOINT = "https://eu-mobile.events.data.microsoft.com/Collector/3.0/"; // EUDB Collector URL. Please refer: https://www.aria.ms/developers/deep-dives/eudb-routing/
    AriaConnectionProperties.MOONCAKE_ENDPOINT = ""; // Add MoonCake ARIA Endpoint whenever available
    ClientRuntime.AriaConnectionProperties = AriaConnectionProperties;
    let LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["INFO"] = 0] = "INFO";
        LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
        LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
        LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
        LogLevel[LogLevel["PERF"] = 4] = "PERF";
    })(LogLevel = ClientRuntime.LogLevel || (ClientRuntime.LogLevel = {}));
    let EventType;
    (function (EventType) {
        EventType["GENERIC"] = "GENERIC";
        EventType["RESOURCE_LOAD_SUCCESS"] = "RESOURCE_LOAD_SUCCESS";
        EventType["RESOURCE_LOAD_SKIPPED"] = "RESOURCE_LOAD_SKIPPED";
        EventType["ERROR_LOADING_SCRIPT"] = "ERROR_LOADING_SCRIPT";
        EventType["SCRIPT_LOAD_CALLBACK_FAILED"] = "SCRIPT_LOAD_CALLBACK_FAILED";
        EventType["INIT_SUCCESS"] = "INIT_SUCCESS";
        EventType["INIT_FAILURE"] = "INIT_FAILURE";
        EventType["SESSION_TEMPLATE_ERROR"] = "SESSION_TEMPLATE_ERROR";
        EventType["SESSION_TEMPLATE_NAME_MISSING"] = "SESSION_TEMPLATE_NAME_MISSING";
        EventType["SESSION_ID_MISSING"] = "SESSION_ID_MISSING";
        EventType["NOTIFICATION_TEMPLATE_NAME_MISSING"] = "NOTIFICATION_TEMPLATE_NAME_MISSING";
        EventType["NOTIFICATION_ID_MISSING"] = "NOTIFICATION_ID_MISSING";
        EventType["EXECUTE_ACTION_ERROR"] = "EXECUTE_ACTION_ERROR";
        EventType["CREATE_SESSION_ERROR"] = "CREATE_SESSION_ERROR";
        EventType["CREATE_TAB_ERROR"] = "CREATE_TAB_ERROR";
        EventType["TITLE_RESOLVE_ERROR"] = "TITLE_RESOLVE_ERROR";
        EventType["PARAMETERS_RESOLVE_ERROR"] = "PARAMETERS_RESOLVE_ERROR";
        EventType["TAB_TEMPLATE_NAME_MISSING"] = "TAB_TEMPLATE_NAME_MISSING";
        EventType["KPI_BREACH_ERROR"] = "KPI_BREACH_ERROR";
        EventType["NEW_ACTIVITY_ERROR"] = "NEW_ACTIVITY_ERROR";
        EventType["CLOSE_TAB_ERROR"] = "CLOSE_TAB_ERROR";
        EventType["CLOSE_SESSION_ERROR"] = "CLOSE_SESSION_ERROR";
        EventType["RESET_ACTIVITY_ERROR"] = "RESET_ACTIVITY_ERROR";
        EventType["ADD_ON_CONTEXT_CHANGE_ERROR"] = "ADD_ON_CONTEXT_CHANGE_ERROR";
        EventType["ADD_ON_SESSION_REFRESH_ERROR"] = "ADD_ON_SESSION_REFRESH_ERROR";
        EventType["REMOVE_ON_SESSION_REFRESH_ERROR"] = "REMOVE_ON_SESSION_REFRESH_ERROR";
        EventType["REFRESH_SESSION_ERROR"] = "REFRESH_SESSION_ERROR";
        EventType["REFRESH_CONTEXT_ERROR"] = "REFRESH_CONTEXT_ERROR";
        EventType["REMOVE_ON_CONTEXT_CHANGE_ERROR"] = "REMOVE_ON_CONTEXT_CHANGE_ERROR";
        EventType["APP_EXTENSION_LOAD_SUCCESS"] = "APP_EXTENSION_LOAD_SUCCESS";
        EventType["APP_EXTENSION_LOAD_FAIL"] = "APP_EXTENSION_LOAD_FAIL";
        EventType["CREATE_TAB_INTERNAL_ERROR"] = "CREATE_TAB_INTERNAL_ERROR";
        EventType["CREATE_TAB_TAB_INPUT_MISSING"] = "CREATE_TAB_TAB_INPUT_MISSING";
        EventType["ADD_ON_NOTIFICATION_STATE_CHANGE_ERROR"] = "ADD_ON_NOTIFICATION_STATE_CHANGE_ERROR";
        EventType["REMOVE_ON_NOTIFICATION_STATE_CHANGE_ERROR"] = "REMOVE_ON_NOTIFICATION_STATE_CHANGE_ERROR";
        EventType["ADD_ON_WINDOW_VISIBILITY_STATE_CHANGE_ERROR"] = "ADD_ON_WINDOW_VISIBILITY_STATE_CHANGE_ERROR";
        EventType["REMOVE_ON_WINDOW_VISIBILITY_STATE_CHANGE_ERROR"] = "REMOVE_ON_WINDOW_VISIBILITY_STATE_CHANGE_ERROR";
        EventType["GET_CHANNEL_PROVIDERS_ERROR"] = "GET_CHANNEL_PROVIDERS_ERROR";
        EventType["GET_SESSION_TEMPLATE_ERROR"] = "GET_SESSION_TEMPLATE_ERROR";
        EventType["KILL_SWITCH"] = "KILL_SWITCH";
        EventType["SERVICE_WORKER_TELEMETRY"] = "SERVICE_WORKER_TELEMETRY";
        EventType["GET_TEMPLATE"] = "GET_TEMPLATE";
        EventType["MULTISESSION_ACTIVITY"] = "MULTISESSION_ACTIVITY";
        EventType["APM_API_ACTIVITY"] = "APM_API_ACTIVITY";
        EventType["APM_API_ERROR"] = "APM_API_ERROR";
        EventType["APM_INTERNAL_API_ERROR"] = "APM_INTERNAL_API_ERROR";
        EventType["EXTERNAL_ACTIVITY"] = "EXTERNAL_ACTIVITY";
        EventType["REGISTRY_SESSION_STATE_PERSISTENCE_ERROR"] = "REGISTRY_SESSION_STATE_PERSISTENCE_ERROR";
        EventType["CACHE_SESSION_STATE_ERROR"] = "CACHE_SESSION_STATE_ERROR";
        EventType["RESTORE_SESSION_STATE_ERROR"] = "RESTORE_SESSION_STATE_ERROR";
        EventType["REMOVE_SESSION_STATE_ERROR"] = "REMOVE_SESSION_STATE_ERROR";
        EventType["STATE_PERSISTENCE_RESTORE_FUNC_ERROR"] = "STATE_PERSISTENCE_RESTORE_FUNC_ERROR";
        EventType["STATE_PERSISTENCE_API_ACTIVITY"] = "STATE_PERSISTENCE_API_ACTIVITY";
        EventType["MULTISESSION_ACTIVITY_BEFORE_CEC_INIT"] = "MULTISESSION_ACTIVITY_BEFORE_CEC_INIT";
        EventType["SESSION_TEMPLATE_NAME_MISMATCHED"] = "SESSION_TEMPLATE_NAME_MISMATCHED";
        EventType["GET_XRM_SESSION_TEMPLATE_ERROR"] = "GET_XRM_SESSION_TEMPLATE_ERROR";
        EventType["CHECK_INLINE_NAVIGATION_ERROR"] = "CHECK_INLINE_NAVIGATION_ERROR";
        EventType["GET_XRM_TAB_TEMPLATE_ERROR"] = "GET_XRM_TAB_TEMPLATE_ERROR";
        EventType["POP_UP_NOTIFICATION"] = "POP_UP_NOTIFICATION";
        EventType["CEC_RUNTIME_LOADED_AFTER_CREATE_SESSION"] = "CEC_RUNTIME_LOADED_AFTER_CREATE_SESSION";
        EventType["CECNotification_ShowNotification"] = "CECNotification_ShowNotification";
        EventType["CECNotification_CancelNotification"] = "CECNotification_CancelNotification";
        EventType["NotificationOrchestrator_ShowNotification"] = "NotificationOrchestrator_ShowNotification";
        EventType["NotificationOrchestrator_CancelNotification"] = "NotificationOrchestrator_CancelNotification";
        EventType["NotificationOrchestrator_ProcessNotificationQueue"] = "NotificationOrchestrator_ProcessNotificationQueue";
        EventType["NotificationOrchestrator_EnqueueAndProcess"] = "NotificationOrchestrator_EnqueueAndProcess";
        EventType["NotificationOrchestrator_RemoveFromQueue"] = "NotificationOrchestrator_RemoveFromQueue";
        EventType["Third_Party_Web_Using_Custom_Page"] = "Third_Party_Web_Using_Custom_Page";
        EventType["Third_Party_Web_Using_WebResource"] = "Third_Party_Web_Using_WebResource";
    })(EventType = ClientRuntime.EventType || (ClientRuntime.EventType = {}));
})(ClientRuntime || (ClientRuntime = {}));
/// <reference path="./Types.ts" />
var ClientRuntime;
(function (ClientRuntime) {
    "use strict";
    class ConfigurationConstants {
    }
    ConfigurationConstants.CONSOLE_LOG_LEVELS = [ClientRuntime.LogLevel.DEBUG, ClientRuntime.LogLevel.ERROR, ClientRuntime.LogLevel.INFO, ClientRuntime.LogLevel.PERF, ClientRuntime.LogLevel.WARNING];
    ConfigurationConstants.TELEMETRY_LOG_LEVELS = [ClientRuntime.LogLevel.DEBUG, ClientRuntime.LogLevel.ERROR, ClientRuntime.LogLevel.INFO, ClientRuntime.LogLevel.PERF, ClientRuntime.LogLevel.WARNING];
    ClientRuntime.ConfigurationConstants = ConfigurationConstants;
    class ConfigurationManager {
        static getConsoleEnabledLogLevels() {
            return ConfigurationConstants.CONSOLE_LOG_LEVELS;
        }
        static getTelemetryEnabledLogLevels() {
            return ConfigurationConstants.TELEMETRY_LOG_LEVELS;
        }
    }
    ClientRuntime.ConfigurationManager = ConfigurationManager;
})(ClientRuntime || (ClientRuntime = {}));
var ClientRuntime;
(function (ClientRuntime) {
    class Constants {
    }
    Constants.TelemetryPrefix = "CEC";
    ClientRuntime.Constants = Constants;
    class TelemetryConstants {
    }
    // Event Names
    TelemetryConstants.ErrorEventName = "CECRuntimeErrorEvent";
    TelemetryConstants.DefaultEventName = "CECRuntimeEvent";
    TelemetryConstants.PerfEventName = "CECRuntimePerfEvent";
    // Keys of PII to be redacted from telemetry if they are logged
    TelemetryConstants._knownPIIKeys = ["customername", "agentName", "AgentDisplayName", "email", "agentemail", "senderDisplayName",
        "agentDomainNameForMSAUser", "msdyn_value", "callClientName",
        "ssn", "creditcard", "phone", "address", "ip", "username", "password", "accountNumber", "routingnumber",
        "pin", "cvv", "dob"]
        .map(s => s.toLowerCase());
    ClientRuntime.TelemetryConstants = TelemetryConstants;
    let EnvironmentType;
    (function (EnvironmentType) {
        EnvironmentType[EnvironmentType["DoD"] = 0] = "DoD";
        EnvironmentType[EnvironmentType["GCCHigh"] = 1] = "GCCHigh";
        EnvironmentType[EnvironmentType["BlackForest"] = 2] = "BlackForest";
        EnvironmentType[EnvironmentType["MoonCake"] = 3] = "MoonCake";
        EnvironmentType[EnvironmentType["Europe"] = 4] = "Europe";
        EnvironmentType[EnvironmentType["Internal"] = 5] = "Internal";
        EnvironmentType[EnvironmentType["Public"] = 6] = "Public";
    })(EnvironmentType = ClientRuntime.EnvironmentType || (ClientRuntime.EnvironmentType = {}));
})(ClientRuntime || (ClientRuntime = {}));
var ClientRuntime;
(function (ClientRuntime) {
    "use strict";
    class Logger {
        static set consoleLogLevels(logLevel) {
            Logger._consoleEnabled = logLevel;
        }
        static set telemetryLogLevels(logLevel) {
            Logger._telemeteryEnabled = logLevel;
        }
        static get consoleLogLevels() {
            return Logger._consoleEnabled;
        }
        static get telemetryLogLevels() {
            return Logger._telemeteryEnabled;
        }
        static log(eventType, message, level, telemetryData, shouldBubbletoHost, eventDuration) {
            this.consoleLogLevels = ClientRuntime.ConfigurationManager.getConsoleEnabledLogLevels();
            this.telemetryLogLevels = ClientRuntime.ConfigurationManager.getTelemetryEnabledLogLevels();
            this.filterTelemetryData(telemetryData);
            if (Logger.telemetryLogLevels && Logger.telemetryLogLevels.indexOf(level) !== -1) {
                let event = {};
                if (telemetryData instanceof Error) {
                    event.exception = JSON.stringify(telemetryData) === "{}" ? telemetryData.stack : JSON.stringify(telemetryData);
                }
                else {
                    event = this.transformTelemetryData(telemetryData);
                    if (telemetryData && telemetryData.exception && event && event.exception) {
                        event.exception = JSON.stringify(telemetryData.exception) === "{}" ? telemetryData.exception.stack : JSON.stringify(telemetryData.exception);
                    }
                }
                let flattenedTelemetryData = ClientRuntime.Util.flattenObject(event, ClientRuntime.Constants.TelemetryPrefix, ClientRuntime.Util.capitalizeString);
                if (eventDuration) {
                    flattenedTelemetryData[ClientRuntime.Constants.TelemetryPrefix + ".Perf.Duration"] = eventDuration.toString();
                }
                const payload = ClientRuntime.Util._extend({ Level: ClientRuntime.LogLevel[level], Message: message, eventType: ClientRuntime.EventType[eventType] }, flattenedTelemetryData);
                Logger.reportTelemetery(payload);
            }
        }
        static transformTelemetryData(telemetryData) {
            if (telemetryData) {
                if (ClientRuntime.Util.isDataContainsObject(telemetryData)) {
                    return telemetryData;
                }
                else {
                    return { customData: telemetryData };
                }
            }
        }
        static filterTelemetryData(telemetryData) {
            if (telemetryData && Object.keys(telemetryData).length > 0) {
                //filter out the agent name and replace it with empty string; avoid the agent name being logged
                //into database
            }
        }
        static reportTelemetery(payload) {
            if (payload) {
                let eventName = ClientRuntime.TelemetryConstants.DefaultEventName;
                if (payload.Level.toString() === ClientRuntime.LogLevel[ClientRuntime.LogLevel.ERROR]) {
                    eventName = ClientRuntime.TelemetryConstants.ErrorEventName;
                }
                if (!payload.eventType || payload.eventType.length === 0) {
                    payload.eventType = ClientRuntime.LogLevel[payload.Level];
                }
                ClientRuntime.TelemetryManager.sendTelemetry(eventName, payload);
            }
        }
        static info(eventTypeOrMessage, messageOrData, telemetryData) {
            let type = ClientRuntime.EventType.GENERIC;
            let msg = "";
            let data = {}; // tslint:disable-line:no-any
            if (eventTypeOrMessage && !!ClientRuntime.EventType[eventTypeOrMessage]) {
                type = eventTypeOrMessage;
                msg = messageOrData;
                data = telemetryData;
            }
            else if (eventTypeOrMessage && typeof eventTypeOrMessage === "string") {
                msg = eventTypeOrMessage;
                data = messageOrData;
            }
            if (data && data.eventType) {
                type = data.eventType;
            }
            this.log(type, msg, ClientRuntime.LogLevel.INFO, data);
        }
        static debug(eventTypeOrMessage, messageOrData, telemetryData) {
            let type = ClientRuntime.EventType.GENERIC;
            let msg = "";
            let data = {}; // tslint:disable-line:no-any
            if (eventTypeOrMessage && !!ClientRuntime.EventType[eventTypeOrMessage]) {
                type = eventTypeOrMessage;
                msg = messageOrData;
                data = telemetryData;
            }
            else if (eventTypeOrMessage && typeof eventTypeOrMessage === "string") {
                msg = eventTypeOrMessage;
                data = messageOrData;
            }
            if (data && data.eventType) {
                type = data.eventType;
            }
            this.log(type, msg, ClientRuntime.LogLevel.DEBUG, data, false);
        }
        static warning(eventTypeOrMessage, messageOrData, telemetryData) {
            let type = ClientRuntime.EventType.GENERIC;
            let msg = "";
            let data = {}; // tslint:disable-line:no-any
            if (eventTypeOrMessage && !!ClientRuntime.EventType[eventTypeOrMessage]) {
                type = eventTypeOrMessage;
                msg = messageOrData;
                data = telemetryData;
            }
            else if (eventTypeOrMessage && typeof eventTypeOrMessage === "string") {
                msg = eventTypeOrMessage;
                data = messageOrData;
            }
            if (data && data.eventType) {
                type = data.eventType;
            }
            this.log(type, msg, ClientRuntime.LogLevel.WARNING, data);
        }
        static error(eventTypeOrMessage, messageOrData, telemetryDataOrshouldBubbletoHost, shouldBubbletoHost) {
            let type = ClientRuntime.EventType.GENERIC;
            let msg = "";
            let data = {}; // tslint:disable-line:no-any
            let bubbleToHost = undefined;
            if (eventTypeOrMessage && !!ClientRuntime.EventType[eventTypeOrMessage]) {
                type = eventTypeOrMessage;
                msg = messageOrData;
                data = telemetryDataOrshouldBubbletoHost;
                bubbleToHost = shouldBubbletoHost;
            }
            else if (eventTypeOrMessage && typeof eventTypeOrMessage === "string") {
                msg = eventTypeOrMessage;
                data = messageOrData;
                bubbleToHost = telemetryDataOrshouldBubbletoHost;
            }
            if (data && data.eventType) {
                type = data.eventType;
            }
            this.log(type, msg, ClientRuntime.LogLevel.ERROR, data, bubbleToHost);
        }
        static alert(eventTypeOrMessage, messageOrData, telemetryData) {
            let type = ClientRuntime.EventType.GENERIC;
            let msg = "";
            let data = {}; // tslint:disable-line:no-any
            if (eventTypeOrMessage && !!ClientRuntime.EventType[eventTypeOrMessage]) {
                type = eventTypeOrMessage;
                msg = messageOrData;
                data = telemetryData;
            }
            else if (eventTypeOrMessage && typeof eventTypeOrMessage === "string") {
                msg = eventTypeOrMessage;
                data = messageOrData;
            }
            if (data && data.eventType) {
                type = data.eventType;
            }
            this.debug(type, msg, telemetryData);
        }
    }
    ClientRuntime.Logger = Logger;
})(ClientRuntime || (ClientRuntime = {}));
/// <reference path="../Typings/aria-webjs-sdk-1.8.3.d.ts" />
var ClientRuntime;
(function (ClientRuntime) {
    "use strict";
    class TelemetryManager {
        static init() {
            const environmentType = this.getEnvironmentType();
            const logConfig = this.getConfiguration(environmentType);
            if (ClientRuntime.Util.isNullOrUndefined(this.telemetryLogger)) {
                if (environmentType == ClientRuntime.EnvironmentType.Internal) {
                    this.telemetryLogger = AWTLogManager.initialize(ClientRuntime.AriaConnectionProperties.DevIngestionKey, logConfig);
                }
                else {
                    this.telemetryLogger = AWTLogManager.initialize(ClientRuntime.AriaConnectionProperties.ProdIngestionKey, logConfig);
                }
            }
            this.setAppModuleName();
        }
        static setAppModuleName() {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield Xrm.Utility.getGlobalContext().getCurrentAppProperties();
                this.appName = result === null || result === void 0 ? void 0 : result.uniqueName;
            });
        }
        static sendTelemetry(eventName, event) {
            const eventProperties = new AWTEventProperties();
            eventProperties.setName(eventName);
            for (const key in event) {
                eventProperties.setProperty(key, event[key]);
            }
            const globalContext = Xrm.Utility.getGlobalContext();
            eventProperties.setProperty("CustomProperties", JSON.stringify(this.redactPII(event, true)));
            eventProperties.setProperty("ClientType", globalContext.client.getClient());
            eventProperties.setProperty("CrmVersion", globalContext.getVersion());
            eventProperties.setProperty("OrganizationId", globalContext.organizationSettings.organizationId);
            eventProperties.setProperty("OrgUniqueName", globalContext.organizationSettings.uniqueName);
            eventProperties.setProperty("Geo", globalContext.organizationSettings.organizationGeo);
            eventProperties.setProperty("UserId", ClientRuntime.Util.convertGuidToStringLowercase(globalContext.userSettings.userId));
            eventProperties.setProperty("AppName", this.appName);
            eventProperties.setTimestamp((new Date).getTime());
            this.telemetryLogger.logEvent(eventProperties.getEvent());
        }
        // Returns the Host Name
        static getHost() {
            let hostValue = window.location.host;
            if (!hostValue) {
                hostValue = window.parent.location.host;
            }
            return hostValue;
        }
        // Returns the Domain of the Org
        static getEnvironmentType() {
            const hostValue = this.getHost();
            // Need to add checks for MoonCake(China) and Europe Orgs, if needed
            if (hostValue.endsWith("dod-crm.microsoftdynamics.us") || hostValue.endsWith("crm.appsplatform.us"))
                return ClientRuntime.EnvironmentType.DoD;
            else if (hostValue.endsWith("crm9.dynamics.com") || hostValue.endsWith("crm.microsoftdynamics.us"))
                return ClientRuntime.EnvironmentType.GCCHigh;
            else if (hostValue.endsWith("crm.microsoftdynamics.de"))
                return ClientRuntime.EnvironmentType.BlackForest;
            else if (hostValue.endsWith("crm.dynamics.cn"))
                return ClientRuntime.EnvironmentType.MoonCake;
            // EUR: crm4; FRA: crm12; GER: crm16; CHE: crm17; NOR: crm19
            else if (hostValue.endsWith("crm4.dynamics.com") || hostValue.endsWith("crm12.dynamics.com") || hostValue.endsWith("crm16.dynamics.com")
                || hostValue.endsWith("crm17.dynamics.com") || hostValue.endsWith("crm19.dynamics.com"))
                return ClientRuntime.EnvironmentType.Europe;
            else if (hostValue.endsWith("extest.microsoft.com") || hostValue.endsWith("crm10.dynamics.com") || hostValue.endsWith("crm.crmlivetie.com")
                || hostValue.endsWith("crm2.crmlivetie.com") || hostValue.endsWith("contoso.com:444") || hostValue.endsWith("microsoft.com")
                || hostValue.endsWith("msmecrm.com") || hostValue.endsWith("crm.crmlivetoday.com") || hostValue.endsWith("crm.1boxtest.com")
                || hostValue.endsWith("crm.crmifd.com") || hostValue.endsWith("msmecrm.com:444") || hostValue.search("localhost") === 0
                || hostValue.endsWith("crmtest.dynamics.com") || hostValue.endsWith("crm.dynamics-int.com"))
                return ClientRuntime.EnvironmentType.Internal;
            else
                return ClientRuntime.EnvironmentType.Public;
        }
        // Returns the ARIA configuration for the environment type
        static getConfiguration(envType) {
            const logConfiguration = {};
            // Disables the logging of Device ID
            logConfiguration.disableCookiesUsage = true;
            switch (envType) {
                case ClientRuntime.EnvironmentType.GCCHigh:
                    logConfiguration.collectorUri = ClientRuntime.AriaConnectionProperties.GCCH_ENDPOINT;
                    break;
                case ClientRuntime.EnvironmentType.DoD:
                    logConfiguration.collectorUri = ClientRuntime.AriaConnectionProperties.DOD_ENDPOINT;
                    break;
                case ClientRuntime.EnvironmentType.BlackForest:
                    logConfiguration.collectorUri = ClientRuntime.AriaConnectionProperties.GERMANY_ENDPOINT;
                    break;
                case ClientRuntime.EnvironmentType.Europe:
                    logConfiguration.collectorUri = ClientRuntime.AriaConnectionProperties.EUROPE_ENDPOINT;
                    break;
                //case EnvironmentType.MoonCake:
                //	logConfiguration.collectorUri = MOONCAKE_ENDPOINT;
                //	break;
            }
            return logConfiguration;
        }
        static redactPII(input, isCloningRequired = true) {
            var _a;
            if (input && typeof input == "object") {
                try {
                    // Clone the object in question, if required, to avoid modifying the original
                    const clonedInput = isCloningRequired ? JSON.parse(JSON.stringify(input)) : input;
                    const keys = Object.keys(clonedInput);
                    for (let x = 0; (_a = x < (keys === null || keys === void 0 ? void 0 : keys.length)) !== null && _a !== void 0 ? _a : 0; x++) {
                        if (typeof clonedInput[keys[x]] == "object") {
                            // Parse through the nested object and redact any PII
                            // Not required to reclone the object on subsequent passes
                            TelemetryManager.redactPII(clonedInput[keys[x]], false);
                        }
                        // conversion to lowercase to simplify matching
                        const lowercaseKey = keys[x].toLowerCase();
                        if (typeof clonedInput[keys[x]] == "string" && ClientRuntime.TelemetryConstants._knownPIIKeys.indexOf(lowercaseKey) !== -1) {
                            clonedInput[keys[x]] = clonedInput[keys[x]].slice(0, 1) + `**${clonedInput[keys[x]].length - 1} <<hidden>> due to potentially sensitive information**`;
                        }
                    }
                    return clonedInput;
                }
                catch (parseError) {
                    // In the case of a parsing error, return the error instead of returning potential PII
                    return { error: parseError, keys: Object.keys(input) };
                }
            }
            return input;
        }
    }
    TelemetryManager.appName = " ";
    ClientRuntime.TelemetryManager = TelemetryManager;
})(ClientRuntime || (ClientRuntime = {}));
var ClientRuntime;
(function (ClientRuntime) {
    "use strict";
    class Util {
        static isNullOrUndefined(obj) {
            return (obj === null || obj === undefined);
        }
        /**
         * Capitalizes the value provided
         * E.g. "abc" changes to "Abc"
         * @param {string} value The value to be capitalized
         * @returns {string} The capitalized value
         */
        static capitalizeString(value) {
            if (!Util.isNullOrUndefined(value) && value !== "") {
                let capitalizedValue = value.replace(/^\w/, function (chr) {
                    return chr.toUpperCase();
                });
                return capitalizedValue;
            }
        }
        static isDataContainsObject(data) {
            let didContainObject = false;
            Object.keys(data).forEach(function (key) {
                if (typeof data[key] === "object") {
                    didContainObject = true;
                }
            });
            return didContainObject;
        }
        static flattenObjectInternal(objectToFlatten, flattenedObject, prefix, transformKey) {
            if (Util.isNullOrUndefined(objectToFlatten)) {
                return;
            }
            if (Util.isNullOrUndefined(prefix)) {
                prefix = "";
            }
            for (let property in objectToFlatten) {
                if (typeof objectToFlatten[property] === "function") {
                    continue;
                }
                else if (typeof objectToFlatten[property] === "object") {
                    let propertyPrefix = (Util.isNullOrUndefined(transformKey)) ? property : transformKey(property);
                    Util.flattenObjectInternal(objectToFlatten[property], flattenedObject, prefix + "." + propertyPrefix, transformKey);
                }
                else {
                    let separator = "";
                    if (!Util.isNullOrUndefined(prefix) && prefix !== "") {
                        separator += ".";
                    }
                    let propertyKey = Util.isNullOrUndefined(transformKey) ? prefix + separator + property : prefix + separator + transformKey(property);
                    flattenedObject[propertyKey] = objectToFlatten[property];
                }
            }
        }
        /**
         * Flattens the object
         * @param objectToFlatten The object to flatten
         * @param prefix Optional prefix, if provided is prepended to the top-level object property names
         * @param transformKey Optional transformer for property name, if provided is used to transform the property name which would be used in the flattened object
         */
        static flattenObject(objectToFlatten, prefix, transformKey) {
            let flattenedObject = {};
            Util.flattenObjectInternal(objectToFlatten, flattenedObject, prefix, transformKey);
            return flattenedObject;
        }
        static _extend(a, b) {
            for (var key in b)
                if (b.hasOwnProperty(key))
                    a[key] = b[key];
            return a;
        }
        /**
         * convert guid to string and remove curly braces and convert to lowercase
         * @param guid original guid
         */
        static convertGuidToStringLowercase(guid) {
            if (guid) {
                guid = guid.replace("{", "").replace("}", "").toLowerCase();
            }
            return guid;
        }
    }
    ClientRuntime.Util = Util;
})(ClientRuntime || (ClientRuntime = {}));
//# sourceMappingURL=ClientNotificationTemplate.js.map 
 
