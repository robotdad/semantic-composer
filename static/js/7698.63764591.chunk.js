"use strict";(self.webpackChunksemantic_composer=self.webpackChunksemantic_composer||[]).push([[7698],{7698:(e,t,l)=>{l.d(t,{defineFeature:()=>w});var n=l(4478),o=l(7184),c=l(9118),s=l(2420),a=Object.defineProperty,r=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable,u=(e,t,l)=>t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):e[t]=l,p=(e,t)=>{for(var l in t||(t={}))i.call(t,l)&&u(e,l,t[l]);if(r)for(var l of r(t))d.call(t,l)&&u(e,l,t[l]);return e};function b(e,t){return Object.assign(e,{meta:p({package:"@milkdown/components"},t)}),e}const m=e=>{let{selected:t,label:l="",listType:n="",checked:o,onMount:c,setAttr:a,config:r,readonly:i}=e;const d=(0,s.KT)(),u=(0,s.li)();(0,s.Nf)((()=>{const e=u.current;if(!e)return;const t=d.current.querySelector("[data-content-dom]");t&&(e.appendChild(t),null==c||c())}),[]);const p={label:l,listType:n,checked:o,readonly:i};return s.qy`<host class=${t&&"ProseMirror-selectednode"}>
    <li class="list-item">
      <div
        class="label-wrapper"
        onclick=${()=>{null!=o&&(null==a||a("checked",!o))}}
        contenteditable="false"
      >
        ${null==r?void 0:r.renderLabel(p)}
      </div>
      <div class="children" ref=${u}></div>
    </li>
  </host>`};m.props={label:String,checked:Boolean,readonly:Boolean,listType:String,config:Object,selected:Boolean,setAttr:Function,onMount:Function};const y=(0,s.c)(m),k={renderLabel:e=>{let{label:t,listType:l,checked:n,readonly:o}=e;return null==n?s.qy`<span class="label"
        >${"bullet"===l?"\u29bf":t}</span
      >`:s.qy`<input
      disabled=${o}
      class="label"
      type="checkbox"
      checked=${n}
    />`}},h=(0,n.Qx)(k,"listItemBlockConfigCtx");b(h,{displayName:"Config<list-item-block>",group:"ListItemBlock"}),function(e,t){const l=customElements.get(e);null!=l?l!==t&&console.warn(`Custom element ${e} has been defined before.`):customElements.define(e,t)}("milkdown-list-item-block",y);const f=(0,n.m5)(c.hm.node,(e=>(t,l,n)=>{const c=document.createElement("milkdown-list-item-block"),s=document.createElement("div");s.setAttribute("data-content-dom","true"),s.classList.add("content-dom");const a=e.get(h.key),r=e=>{c.listType=e.attrs.listType,c.label=e.attrs.label,c.checked=e.attrs.checked,c.readonly=!l.editable};r(t),c.appendChild(s),c.selected=!1,c.setAttr=(e,t)=>{const o=n();null!=o&&l.dispatch(l.state.tr.setNodeAttribute(o,e,t))},c.onMount=()=>{const{anchor:e,head:t}=l.state.selection;l.hasFocus()&&setTimeout((()=>{const n=l.state.doc.resolve(e),c=l.state.doc.resolve(t);l.dispatch(l.state.tr.setSelection(new o.U3(n,c)))}))};let i=t;return c.config=a,{dom:c,contentDOM:s,update:e=>e.type===t.type&&(e.sameMarkup(i)&&e.content.eq(i.content)||(i=e,r(e)),!0),ignoreMutation:e=>!c||!s||"selection"!==e.type&&(s===e.target&&"attributes"===e.type||!s.contains(e.target)),selectNode:()=>{c.selected=!0},deselectNode:()=>{c.selected=!1},destroy:()=>{c.remove(),s.remove()}}}));b(f,{displayName:"NodeView<list-item-block>",group:"ListItemBlock"});const v=[h,f];var g=l(8387),$=l(7511);const w=(e,t)=>{e.config((e=>function(e,t){e.set(h.key,{renderLabel:e=>{let{label:l,listType:n,checked:o,readonly:c}=e;var a,r,i,d,u,p;return null==o?"bullet"===n?s.qy`<span class="label"
            >${null!=(r=null==(a=null==t?void 0:t.bulletIcon)?void 0:a.call(t))?r:$.b}</span
          >`:s.qy`<span class="label">${l}</span>`:o?s.qy`<span
          class=${(0,g.A)("label checkbox",c&&"readonly")}
          >${null!=(d=null==(i=null==t?void 0:t.checkBoxCheckedIcon)?void 0:i.call(t))?d:$.d}</span
        >`:s.qy`<span class=${(0,g.A)("label checkbox",c&&"readonly")}
        >${null!=(p=null==(u=null==t?void 0:t.checkBoxUncheckedIcon)?void 0:u.call(t))?p:$.f}</span
      >`}})}(e,t))).use(v)}}}]);
//# sourceMappingURL=7698.63764591.chunk.js.map