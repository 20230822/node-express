"use strict";(self.webpackChunklight=self.webpackChunklight||[]).push([[79],{79:function(e,t,s){s.r(t),s.d(t,{default:function(){return o}});var n=s(165),r=s(861),a=s(439),c=s(791),i=s(689),l=s(184),o=function(){var e=(0,i.UO)().id,t=(0,c.useState)([{CONTENT:"",TITLE:"",WRITE_DT:"",USER_NM:""}]),s=(0,a.Z)(t,2),o=s[0],d=s[1];function u(){return(u=(0,r.Z)((0,n.Z)().mark((function t(){var s,r;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("/api/notice/detail?page="+e,{credentials:"include",method:"POST",headers:{"Content-Type":"application/json",Authorization:""},body:JSON.stringify(o)});case 3:if(!(s=t.sent).ok){t.next=11;break}return t.next=7,s.json();case 7:(r=t.sent).success?d(r.data[0]):alert(r.msg),t.next=12;break;case 11:throw Error("\uc11c\ubc84 \uc751\ub2f5 \uc2e4\ud328");case 12:t.next=17;break;case 14:t.prev=14,t.t0=t.catch(0),console.error(Error("\ub85c\uadf8\uc778 \uc911 \uc5d0\ub7ec \ubc1c\uc0dd"));case 17:case"end":return t.stop()}}),t,null,[[0,14]])})))).apply(this,arguments)}return(0,c.useEffect)((function(){!function(){u.apply(this,arguments)}()}),[]),(0,l.jsxs)("div",{className:"HelpDetail",children:[(0,l.jsx)("h2",{children:"\uac8c\uc2dc\ubb3c \uc0c1\uc138 \ud398\uc774\uc9c0"}),(0,l.jsxs)("div",{className:"post-details",children:[(0,l.jsx)("div",{className:"post-detail",children:(0,l.jsxs)("h3",{children:["\uc81c\ubaa9: ",o.TITLE]})}),(0,l.jsx)("div",{className:"post-detail",children:(0,l.jsxs)("p",{children:["\uc791\uc131\uc77c: ",new Date(o.WRITE_DT).toLocaleString()]})})]}),(0,l.jsx)("div",{className:"post-content",children:(0,l.jsxs)("p",{children:["\ub0b4\uc6a9: ",o.CONTENT]})})]})}}}]);
//# sourceMappingURL=79.3be32c8a.chunk.js.map