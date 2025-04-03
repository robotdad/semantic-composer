"use strict";(self.webpackChunksemantic_composer=self.webpackChunksemantic_composer||[]).push([[7666],{2572:(t,e,o)=>{o.d(e,{GN:()=>Et,Q3:()=>P,e7:()=>E,h1:()=>Mt});var n=o(4478),i=o(2420),s=o(7472),r=o(446),l=o(616),a=o(9118),c=o(8387),u=o(7184),h=o(1310),d=Object.defineProperty,p=Object.getOwnPropertySymbols,m=Object.prototype.hasOwnProperty,f=Object.prototype.propertyIsEnumerable,k=(t,e,o)=>e in t?d(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,v=(t,e)=>{for(var o in e||(e={}))m.call(e,o)&&k(t,o,e[o]);if(p)for(var o of p(e))f.call(e,o)&&k(t,o,e[o]);return t};function y(t,e){return Object.assign(t,{meta:v({package:"@milkdown/components"},e)}),t}var b=Object.defineProperty,w=Object.getOwnPropertySymbols,g=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable,$=(t,e,o)=>e in t?b(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,L=(t,e)=>{for(var o in e||(e={}))g.call(e,o)&&$(t,o,e[o]);if(w)for(var o of w(e))O.call(e,o)&&$(t,o,e[o]);return t};const x=(0,n.Qx)(L({},{mode:"preview"}),"linkTooltipStateCtx");y(x,{displayName:"State<link-tooltip>",group:"LinkTooltip"});const P=(0,n.Qx)(L({},{addLink:()=>{},editLink:()=>{},removeLink:()=>{}}),"linkTooltipAPICtx");y(x,{displayName:"API<link-tooltip>",group:"LinkTooltip"});const C={linkIcon:()=>"\ud83d\udd17",editButton:()=>"\u270e",removeButton:()=>"\u232b",confirmButton:()=>i.qy`Confirm ⏎`,onCopyLink:()=>{},inputPlaceholder:"Paste link..."},E=(0,n.Qx)(L({},C),"linkTooltipConfigCtx");y(x,{displayName:"Config<link-tooltip>",group:"LinkTooltip"});const M=(0,s.y)("LINK_PREVIEW");y(M[0],{displayName:"PreviewTooltipSpec<link-tooltip>",group:"LinkTooltip"}),y(M[1],{displayName:"PreviewTooltipPlugin<link-tooltip>",group:"LinkTooltip"});const j=(0,s.y)("LINK_EDIT");function S(t,e){const o=customElements.get(t);null!=o?o!==e&&console.warn(`Custom element ${t} has been defined before.`):customElements.define(t,e)}y(j[0],{displayName:"EditTooltipSpec<link-tooltip>",group:"LinkTooltip"}),y(j[1],{displayName:"EditTooltipPlugin<link-tooltip>",group:"LinkTooltip"});const T=t=>{let{config:e,src:o,onEdit:n,onRemove:s}=t;return i.qy`
    <host>
      <div class="link-preview" onmousedown=${t=>{t.preventDefault(),navigator.clipboard&&o&&navigator.clipboard.writeText(o).then((()=>{null==e||e.onCopyLink(o)})).catch((t=>{throw t}))}}>
        <span class="link-icon"> ${null==e?void 0:e.linkIcon()} </span>
        <a href=${o} target="_blank" class="link-display">${o}</a>
        <span class="button link-edit-button" onmousedown=${t=>{t.stopPropagation(),t.preventDefault(),null==n||n()}}>
          ${null==e?void 0:e.editButton()}
        </span>
        <span
          class="button link-remove-button"
          onmousedown=${t=>{t.stopPropagation(),t.preventDefault(),null==s||s()}}
        >
          ${null==e?void 0:e.removeButton()}
        </span>
      </div>
    </host>
  `};T.props={config:Object,src:String,onEdit:Function,onRemove:Function};const W=(0,i.c)(T);var I,B,A,D,Y,F,N,R,q=t=>{throw TypeError(t)},Q=(t,e,o)=>e.has(t)||q("Cannot "+o),_=(t,e,o)=>(Q(t,e,"read from private field"),o?o.call(t):e.get(t)),U=(t,e,o)=>e.has(t)?q("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),G=(t,e,o,n)=>(Q(t,e,"write to private field"),e.set(t,o),o);class J{constructor(t,e){this.ctx=t,U(this,I,new W),U(this,B),U(this,A,this.ctx.use(x.key)),U(this,D,!1),U(this,Y,(t=>{let{mode:e}=t;"edit"===e&&_(this,R).call(this)})),U(this,F,(()=>{G(this,D,!0)})),U(this,N,(()=>{G(this,D,!1)})),U(this,R,(()=>{_(this,B).hide(),_(this,B).element.removeEventListener("mouseenter",_(this,F)),_(this,B).element.removeEventListener("mouseleave",_(this,N))})),this.show=(t,e,o,n)=>{_(this,I).config=this.ctx.get(E.key),_(this,I).src=t.attrs.href,_(this,I).onEdit=()=>{this.ctx.get(P.key).editLink(t,e,o)},_(this,I).onRemove=()=>{this.ctx.get(P.key).removeLink(e,o),_(this,R).call(this)},_(this,B).show({getBoundingClientRect:()=>n}),_(this,B).element.addEventListener("mouseenter",_(this,F)),_(this,B).element.addEventListener("mouseleave",_(this,N))},this.hide=()=>{_(this,D)||_(this,R).call(this)},this.update=()=>{},this.destroy=()=>{_(this,A).off(_(this,Y)),_(this,B).destroy(),_(this,I).remove()},G(this,B,new s.B({debounce:0,content:_(this,I),shouldShow:()=>!1})),_(this,B).update(e),G(this,A,t.use(x.key)),_(this,A).on(_(this,Y))}}function H(t){let e;const o=r(((o,n)=>{if(!e)return;if(!o.hasFocus())return;if("edit"===t.get(x.key).mode)return;const i=function(t,e,o){const n=e.posAtCoords({left:o.clientX,top:o.clientY});if(!n)return;const{pos:i}=n,s=e.state.doc.nodeAt(i);if(!s)return;const r=s.marks.find((e=>e.type===a.Yk.mark.type(t)));if(!r)return;return M.pluginKey()?{show:!0,pos:i,node:s,mark:r}:void 0}(t,o,n);if(i){const t=o.state.doc.resolve(i.pos),n=function(t,e,o,n,i){let s={start:-1,end:-1};return o.nodesBetween(n,i,((o,n)=>{if(s.start>-1)return!1;-1===s.start&&t.isInSet(o.marks)&&e===o&&(s={start:n,end:n+Math.max(o.textContent.length,1)})})),s}(i.mark,i.node,o.state.doc,t.before(),t.after()),s=n.start,r=n.end;e.show(i.mark,s,r,(0,l.MG)(o,s,r))}else e.hide()}),200);t.set(M.key,{props:{handleDOMEvents:{mousemove:o,mouseleave:()=>{setTimeout((()=>{null==e||e.hide()}),200)}}},view:o=>(e=new J(t,o),e)})}I=new WeakMap,B=new WeakMap,A=new WeakMap,D=new WeakMap,Y=new WeakMap,F=new WeakMap,N=new WeakMap,R=new WeakMap,S("milkdown-link-preview",W);const K=t=>{let{src:e,onConfirm:o,onCancel:n,config:s}=t;const r=(0,i.li)(),[l,a]=(0,i.J0)(e);(0,i.vJ)((()=>{a(null!=e?e:"")}),[e]);return i.qy`
    <host>
      <div class="link-edit">
        <input
          class="input-area"
          placeholder=${null==s?void 0:s.inputPlaceholder}
          ref=${r}
          onkeydown=${t=>{var e,i;t.stopPropagation(),"Enter"===t.key&&(null==o||o(null!=(i=null==(e=r.current)?void 0:e.value)?i:""),t.preventDefault()),"Escape"===t.key&&(null==n||n(),t.preventDefault())}}
          oninput=${t=>a(t.target.value)}
          value=${l}
        />
        <span
          class=${(0,c.A)("button confirm",!l&&"hidden")}
          onclick=${()=>{var t,e;null==o||o(null!=(e=null==(t=r.current)?void 0:t.value)?e:"")}}
        >
          ${null==s?void 0:s.confirmButton()}
        </span>
      </div>
    </host>
  `};K.props={config:Object,src:String,onConfirm:Function,onCancel:Function};const V=(0,i.c)(K);var X,z,Z,tt,et,ot,nt=Object.defineProperty,it=Object.defineProperties,st=Object.getOwnPropertyDescriptors,rt=Object.getOwnPropertySymbols,lt=Object.prototype.hasOwnProperty,at=Object.prototype.propertyIsEnumerable,ct=t=>{throw TypeError(t)},ut=(t,e,o)=>e in t?nt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,ht=(t,e)=>{for(var o in e||(e={}))lt.call(e,o)&&ut(t,o,e[o]);if(rt)for(var o of rt(e))at.call(e,o)&&ut(t,o,e[o]);return t},dt=(t,e)=>it(t,st(e)),pt=(t,e,o)=>e.has(t)||ct("Cannot "+o),mt=(t,e,o)=>(pt(t,e,"read from private field"),o?o.call(t):e.get(t)),ft=(t,e,o)=>e.has(t)?ct("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),kt=(t,e,o,n)=>(pt(t,e,"write to private field"),e.set(t,o),o);const vt={from:-1,to:-1,mark:null};class yt{constructor(t,e){this.ctx=t,ft(this,X,new V),ft(this,z),ft(this,Z,ht({},vt)),ft(this,tt,(()=>{mt(this,z).hide(),this.ctx.update(x.key,(t=>dt(ht({},t),{mode:"preview"}))),kt(this,Z,ht({},vt))})),ft(this,et,(t=>{const e=this.ctx.get(h.kY),{from:o,to:n,mark:i}=mt(this,Z),s=a.Yk.type(this.ctx);if(i&&i.attrs.href===t)return void mt(this,tt).call(this);const r=e.state.tr;i&&r.removeMark(o,n,i),r.addMark(o,n,s.create({href:t})),e.dispatch(r),mt(this,tt).call(this)})),ft(this,ot,((t,e,o)=>{const n=this.ctx.get(E.key);mt(this,X).config=n,mt(this,X).src=t,this.ctx.update(x.key,(t=>dt(ht({},t),{mode:"edit"})));const i=this.ctx.get(h.kY);i.dispatch(i.state.tr.setSelection(u.U3.create(i.state.doc,e,o))),mt(this,z).show({getBoundingClientRect:()=>(0,l.MG)(i,e,o)}),requestAnimationFrame((()=>{var t;null==(t=mt(this,X).querySelector("input"))||t.focus()}))})),this.update=t=>{const{state:e}=t,{selection:o}=e;if(!(o instanceof u.U3))return;const{from:n,to:i}=o;n===mt(this,Z).from&&i===mt(this,Z).to||mt(this,tt).call(this)},this.destroy=()=>{mt(this,z).destroy(),mt(this,X).remove()},this.addLink=(t,e)=>{kt(this,Z,{from:t,to:e,mark:null}),mt(this,ot).call(this,"",t,e)},this.editLink=(t,e,o)=>{kt(this,Z,{from:e,to:o,mark:t}),mt(this,ot).call(this,t.attrs.href,e,o)},this.removeLink=(t,e)=>{const o=this.ctx.get(h.kY),n=o.state.tr;n.removeMark(t,e,a.Yk.type(this.ctx)),o.dispatch(n),mt(this,tt).call(this)},kt(this,z,new s.B({content:mt(this,X),debounce:0,shouldShow:()=>!1})),mt(this,z).onHide=()=>{mt(this,X).update().catch((t=>{throw t})),e.dom.focus({preventScroll:!0})},mt(this,z).update(e),mt(this,X).onConfirm=mt(this,et),mt(this,X).onCancel=mt(this,tt)}}X=new WeakMap,z=new WeakMap,Z=new WeakMap,tt=new WeakMap,et=new WeakMap,ot=new WeakMap;var bt=Object.defineProperty,wt=Object.defineProperties,gt=Object.getOwnPropertyDescriptors,Ot=Object.getOwnPropertySymbols,$t=Object.prototype.hasOwnProperty,Lt=Object.prototype.propertyIsEnumerable,xt=(t,e,o)=>e in t?bt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,Pt=(t,e)=>{for(var o in e||(e={}))$t.call(e,o)&&xt(t,o,e[o]);if(Ot)for(var o of Ot(e))Lt.call(e,o)&&xt(t,o,e[o]);return t},Ct=(t,e)=>wt(t,gt(e));function Et(t){H(t),function(t){let e;t.update(P.key,(t=>Ct(Pt({},t),{addLink:(t,o)=>{null==e||e.addLink(t,o)},editLink:(t,o,n)=>{null==e||e.editLink(t,o,n)},removeLink:(t,o)=>{null==e||e.removeLink(t,o)}}))),t.set(j.key,{view:o=>(e=new yt(t,o),e)})}(t)}S("milkdown-link-edit",V);const Mt=[x,P,E,M,j].flat()},7666:(t,e,o)=>{o.d(e,{defineFeature:()=>P});var n=o(7472),i=o(7184),s=o(4931),r=o(2420),l=o(1310),a=o(9118),c=o(8387),u=o(2572),h=o(2025),d=o(7511),p=o(8005),m=o(8990);o(349);const f=t=>{let{ctx:e,hide:o,show:n,config:s,selection:f}=t;var k,v,y,b,w,g,O,$,L,x,P,C;const E=(0,r.xS)();(0,r.vJ)((()=>{E()}),[n]);const M=t=>o=>{o.preventDefault(),e&&t(e),E()},j=t=>{if(!e||!f)return!1;const o=e.get(l.kY),{state:{doc:n}}=o;return n.rangeHasMark(f.from,f.to,t)},S=t=>{if(!e||!f)return!1;const o=e.get(l.kY),{state:{doc:n}}=o;if(f instanceof i.nh)return f.node.type===t;const{from:s,to:r}=f;let a=!1;return n.nodesBetween(s,r,(e=>e.type!==t||(a=!0,!1))),a},T=null==e?void 0:e.get(m.F),W=null==T?void 0:T.includes(m.C.Latex);return r.qy`<host>
    <button
      type="button"
      class=${(0,c.A)("toolbar-item",e&&j(a.t6.type(e))&&"active")}
      onmousedown=${M((t=>{t.get(l.MD).call(a.vY.key)}))}
    >
      ${null!=(v=null==(k=null==s?void 0:s.boldIcon)?void 0:k.call(s))?v:d.D}
    </button>
    <button
      type="button"
      class=${(0,c.A)("toolbar-item",e&&j(a.Wm.type(e))&&"active")}
      onmousedown=${M((t=>{t.get(l.MD).call(a.e0.key)}))}
    >
      ${null!=(b=null==(y=null==s?void 0:s.italicIcon)?void 0:y.call(s))?b:d.E}
    </button>
    <button
      type="button"
      class=${(0,c.A)("toolbar-item",e&&j(h.Jh.type(e))&&"active")}
      onmousedown=${M((t=>{t.get(l.MD).call(h.$l.key)}))}
    >
      ${null!=(g=null==(w=null==s?void 0:s.strikethroughIcon)?void 0:w.call(s))?g:d.F}
    </button>
    <div class="divider"></div>
    <button
      type="button"
      class=${(0,c.A)("toolbar-item",e&&j(a.Of.type(e))&&"active")}
      onmousedown=${M((t=>{t.get(l.MD).call(a.A.key)}))}
    >
      ${null!=($=null==(O=null==s?void 0:s.codeIcon)?void 0:O.call(s))?$:d.y}
    </button>
    ${W&&r.qy`<button
      type="button"
      class=${(0,c.A)("toolbar-item",e&&S(p.m.type(e))&&"active")}
      onmousedown=${M((t=>{const e=S(p.m.type(t)),o=t.get(l.kY),{selection:n,doc:s,tr:r}=o.state;if(!e){const e=s.textBetween(n.from,n.to);let l=r.replaceSelectionWith(p.m.type(t).create({value:e}));return void o.dispatch(l.setSelection(i.nh.create(l.doc,n.from)))}const{from:a,to:c}=n;let u=-1,h=null;if(s.nodesBetween(a,c,((e,o)=>!h&&(e.type!==p.m.type(t)||(u=o,h=e,!1)))),!h||u<0)return;let d=r.delete(u,u+1);const m=h.attrs.value;d=d.insertText(m,u),o.dispatch(d.setSelection(i.U3.create(d.doc,a,c+m.length-1)))}))}
    >
      ${null!=(x=null==(L=null==s?void 0:s.latexIcon)?void 0:L.call(s))?x:d.A}
    </button>`}
    <button
      type="button"
      class=${(0,c.A)("toolbar-item",e&&j(a.Yk.type(e))&&"active")}
      onmousedown=${M((t=>{const e=t.get(l.kY),{selection:n}=e.state;j(a.Yk.type(t))?t.get(u.Q3.key).removeLink(n.from,n.to):(t.get(u.Q3.key).addLink(n.from,n.to),null==o||o())}))}
    >
      ${null!=(C=null==(P=null==s?void 0:s.linkIcon)?void 0:P.call(s))?C:d.G}
    </button>
  </host>`};f.props={ctx:Object,hide:Function,show:Boolean,config:Object,selection:Object};const k=(0,r.c)(f);var v,y,b=t=>{throw TypeError(t)},w=(t,e,o)=>e.has(t)||b("Cannot "+o),g=(t,e,o)=>(w(t,e,"read from private field"),o?o.call(t):e.get(t)),O=(t,e,o)=>e.has(t)?b("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),$=(t,e,o,n)=>(w(t,e,"write to private field"),e.set(t,o),o);const L=(0,n.y)("CREPE_TOOLBAR");class x{constructor(t,e,o){O(this,v),O(this,y),this.update=(t,e)=>{g(this,v).update(t,e),g(this,y).selection=t.state.selection},this.destroy=()=>{g(this,v).destroy(),g(this,y).remove()},this.hide=()=>{g(this,v).hide()};const s=new k;$(this,y,s),g(this,y).ctx=t,g(this,y).hide=this.hide,g(this,y).config=o,g(this,y).selection=e.state.selection,$(this,v,new n.B({content:g(this,y),debounce:20,offset:10,shouldShow(t){const{doc:e,selection:o}=t.state,{empty:n,from:r,to:l}=o,a=!e.textBetween(r,l).length&&o instanceof i.U3,c=!(o instanceof i.U3),u=t.dom.getRootNode().activeElement,h=s.contains(u),d=!t.hasFocus()&&!h,p=!t.editable;return!(d||c||n||a||p)}})),g(this,v).onShow=()=>{g(this,y).show=!0},g(this,v).onHide=()=>{g(this,y).show=!1},this.update(e)}}v=new WeakMap,y=new WeakMap,(0,s.d)("milkdown-toolbar",k);const P=(t,e)=>{t.config((t=>{t.set(L.key,{view:o=>new x(t,o,e)})})).use(L)}}}]);
//# sourceMappingURL=7666.d3c02c76.chunk.js.map