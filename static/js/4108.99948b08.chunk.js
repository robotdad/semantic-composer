"use strict";(self.webpackChunksemantic_composer=self.webpackChunksemantic_composer||[]).push([[4108],{1517:(e,t,n)=>{n.d(t,{YD:()=>N,iH:()=>L,p0:()=>U});var o=n(4478),l=n(5846),a=n(4723),r=n(2420),i=n(9452),c=n(8387),s=Object.defineProperty,d=Object.getOwnPropertySymbols,u=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable,m=(e,t,n)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,g=(e,t)=>{for(var n in t||(t={}))u.call(t,n)&&m(e,n,t[n]);if(d)for(var n of d(t))p.call(t,n)&&m(e,n,t[n]);return e};function v(e,t){return Object.assign(e,{meta:g({package:"@milkdown/components"},t)}),e}var f=Object.defineProperty,b=Object.getOwnPropertySymbols,h=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable,$=(e,t,n)=>t in e?f(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,k=(e,t)=>{for(var n in t||(t={}))h.call(t,n)&&$(e,n,t[n]);if(b)for(var n of b(t))y.call(t,n)&&$(e,n,t[n]);return e};const w="image-block",N=(0,o.Yh)("image-block",(()=>({inline:!1,group:"block",selectable:!0,draggable:!0,isolating:!0,marks:"",atom:!0,priority:100,attrs:{src:{default:""},caption:{default:""},ratio:{default:1}},parseDOM:[{tag:`img[data-type="${w}"]`,getAttrs:e=>{var t;if(!(e instanceof HTMLElement))throw(0,l.Ik)(e);return{src:e.getAttribute("src")||"",caption:e.getAttribute("caption")||"",ratio:Number(null!=(t=e.getAttribute("ratio"))?t:1)}}}],toDOM:e=>["img",k({"data-type":w},e.attrs)],parseMarkdown:{match:e=>{let{type:t}=e;return"image-block"===t},runner:(e,t,n)=>{const o=t.url,l=t.title;let a=Number(t.alt||1);(Number.isNaN(a)||0===a)&&(a=1),e.addNode(n,{src:o,caption:l,ratio:a})}},toMarkdown:{match:e=>"image-block"===e.type.name,runner:(e,t)=>{e.openNode("paragraph"),e.addNode("image",void 0,void 0,{title:t.attrs.caption,url:t.attrs.src,alt:`${Number.parseFloat(t.attrs.ratio).toFixed(2)}`}),e.closeNode()}}})));function x(e){return(0,a.YR)(e,"paragraph",((e,t,n)=>{var o,l;if(1!==(null==(o=e.children)?void 0:o.length))return;const a=null==(l=e.children)?void 0:l[0];if(!a||"image"!==a.type)return;const{url:r,alt:i,title:c}=a,s={type:"image-block",url:r,alt:i,title:c};n.children.splice(t,1,s)}))}v(N.node,{displayName:"NodeSchema<image-block>",group:"ImageBlock"});const I=(0,o.lz)("remark-image-block",(()=>()=>x));v(I.plugin,{displayName:"Remark<remarkImageBlock>",group:"ImageBlock"}),v(I.options,{displayName:"RemarkConfig<remarkImageBlock>",group:"ImageBlock"});const P={imageIcon:()=>"\ud83c\udf0c",captionIcon:()=>"\ud83d\udcac",uploadButton:()=>r.qy`Upload file`,confirmButton:()=>r.qy`Confirm ⏎`,uploadPlaceholderText:"or paste the image link ...",captionPlaceholderText:"Image caption",onUpload:e=>Promise.resolve(URL.createObjectURL(e))},U=(0,o.Qx)(P,"imageBlockConfigCtx");v(U,{displayName:"Config<image-block>",group:"ImageBlock"});let B=0;const O=(0,i.d_)("abcdefg",8),E=e=>{let{src:t="",caption:n="",ratio:o=1,selected:l=!1,readonly:a=!1,setAttr:i,config:s}=e;const d=(0,r.li)(),u=(0,r.li)(),p=(0,r.li)(),[m,g]=(0,r.J0)(n.length>0),[v,f]=(0,r.J0)(0!==t.length),[b]=(0,r.J0)(O()),[h,y]=(0,r.J0)(!1),[$,k]=(0,r.J0)(t);!function(e){let{image:t,resizeHandle:n,ratio:o,setRatio:l,src:a,readonly:i}=e;const c=(0,r.KT)(),s=(0,r.Kr)((()=>c.current.getRootNode()),[c]);(0,r.vJ)((()=>{const e=t.current;e&&(delete e.dataset.origin,delete e.dataset.height,e.style.height="")}),[a]),(0,r.vJ)((()=>{const e=n.current,a=t.current;if(!e||!a)return;const r=e=>{e.preventDefault();const t=a.getBoundingClientRect().top,n=e.clientY-t,o=Number(n<100?100:n).toFixed(2);a.dataset.height=o,a.style.height=`${o}px`},d=()=>{s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",d);const e=Number(a.dataset.origin),t=Number(a.dataset.height),n=Number.parseFloat(Number(t/e).toFixed(2));Number.isNaN(n)||l(n)},u=e=>{i||(e.preventDefault(),s.addEventListener("pointermove",r),s.addEventListener("pointerup",d))},p=e=>{const t=c.current.getBoundingClientRect().width;if(!t)return;const n=e.target,l=n.height,r=n.width,i=r<t?l:t*(l/r),s=(i*o).toFixed(2);a.dataset.origin=i.toFixed(2),a.dataset.height=s,a.style.height=`${s}px`};return a.addEventListener("load",p),e.addEventListener("pointerdown",u),()=>{a.removeEventListener("load",p),e.removeEventListener("pointerdown",u)}}),[])}({image:d,resizeHandle:u,ratio:o,setRatio:e=>null==i?void 0:i("ratio",e),src:t,readonly:a}),(0,r.vJ)((()=>{l||g(n.length>0)}),[l]);const N=()=>{var e,t;null==i||i("src",null!=(t=null==(e=p.current)?void 0:e.value)?t:"")},x=e=>{e.preventDefault(),e.stopPropagation()};return r.qy`<host class=${(0,c.A)(l&&"selected")}>
    <div class=${(0,c.A)("image-edit",t.length>0&&"hidden")}>
      <div class="image-icon">${null==s?void 0:s.imageIcon()}</div>
      <div class=${(0,c.A)("link-importer",h&&"focus")}>
        <input
          ref=${p}
          draggable="true"
          ondragstart=${x}
          disabled=${a}
          class="link-input-area"
          value=${$}
          oninput=${e=>{const t=e.target.value;f(0!==t.length),k(t)}}
          onkeydown=${e=>{"Enter"===e.key&&N()}}
          onfocus=${()=>y(!0)}
          onblur=${()=>y(!1)}
        />
        <div class=${(0,c.A)("placeholder",v&&"hidden")}>
          <input
            disabled=${a}
            class="hidden"
            id=${b}
            type="file"
            accept="image/*"
            onchange=${e=>{return t=void 0,n=null,o=function*(){var t;const n=null==(t=e.target.files)?void 0:t[0];if(!n)return;const o=yield null==s?void 0:s.onUpload(n);o&&(null==i||i("src",o),f(!0))},new Promise(((l,a)=>{var r=t=>{try{c(o.next(t))}catch(e){a(e)}},i=t=>{try{c(o.throw(t))}catch(e){a(e)}},c=e=>e.done?l(e.value):Promise.resolve(e.value).then(r,i);c((o=o.apply(t,n)).next())}));var t,n,o}}
          />
          <label class="uploader" for=${b}>
            ${null==s?void 0:s.uploadButton()}
          </label>
          <span class="text" onclick=${()=>{var e;return null==(e=p.current)?void 0:e.focus()}}>
            ${null==s?void 0:s.uploadPlaceholderText}
          </span>
        </div>
      </div>
      <div
        class=${(0,c.A)("confirm",0===$.length&&"hidden")}
        onclick=${()=>N()}
      >
        ${null==s?void 0:s.confirmButton()}
      </div>
    </div>
    <div class=${(0,c.A)("image-wrapper",0===t.length&&"hidden")}>
      <div class="operation">
        <div class="operation-item" onpointerdown=${e=>{e.preventDefault(),e.stopPropagation(),a||g((e=>!e))}}>
          ${null==s?void 0:s.captionIcon()}
        </div>
      </div>
      <img
        ref=${d}
        data-type=${w}
        src=${t}
        alt=${n}
        ratio=${o}
      />
      <div ref=${u} class="image-resize-handle"></div>
    </div>
    <input
      draggable="true"
      ondragstart=${x}
      class=${(0,c.A)("caption-input",!m&&"hidden")}
      placeholder=${null==s?void 0:s.captionPlaceholderText}
      oninput=${e=>{const t=e.target.value;B&&window.clearTimeout(B),B=window.setTimeout((()=>{null==i||i("caption",t)}),1e3)}}
      onblur=${e=>{const t=e.target.value;B&&(window.clearTimeout(B),B=0),null==i||i("caption",t)}}
      value=${n}
    />
  </host>`};E.props={src:String,caption:String,ratio:Number,selected:Boolean,readonly:Boolean,setAttr:Function,config:Object};!function(e,t){const n=customElements.get(e);null!=n?n!==t&&console.warn(`Custom element ${e} has been defined before.`):customElements.define(e,t)}("milkdown-image-block",(0,r.c)(E));const A=(0,o.m5)(N.node,(e=>(t,n,o)=>{const l=document.createElement("milkdown-image-block"),a=e.get(U.key),r=a.proxyDomURL,i=e=>{if(r){const t=r(e.attrs.src);"string"===typeof t?l.src=t:t.then((e=>{l.src=e}))}else l.src=e.attrs.src;l.ratio=e.attrs.ratio,l.caption=e.attrs.caption,l.readonly=!n.editable};return i(t),l.selected=!1,l.setAttr=(e,t)=>{const l=o();null!=l&&n.dispatch(n.state.tr.setNodeAttribute(l,e,t))},l.config=a,{dom:l,update:e=>e.type===t.type&&(i(e),!0),stopEvent:e=>e.target instanceof HTMLInputElement,selectNode:()=>{l.selected=!0},deselectNode:()=>{l.selected=!1},destroy:()=>{l.remove()}}}));v(A,{displayName:"NodeView<image-block>",group:"ImageBlock"});const L=[I,N,A,U].flat()},4108:(e,t,n)=>{n.d(t,{defineFeature:()=>N});var o=n(1517),l=n(4478),a=n(2420),r=n(9118),i=n(9452),c=n(8387),s=Object.defineProperty,d=Object.getOwnPropertySymbols,u=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable,m=(e,t,n)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,g=(e,t)=>{for(var n in t||(t={}))u.call(t,n)&&m(e,n,t[n]);if(d)for(var n of d(t))p.call(t,n)&&m(e,n,t[n]);return e};function v(e,t){return Object.assign(e,{meta:g({package:"@milkdown/components"},t)}),e}const f={imageIcon:()=>"\ud83c\udf0c",uploadButton:()=>a.qy`Upload`,confirmButton:()=>a.qy`⏎`,uploadPlaceholderText:"/Paste",onUpload:e=>Promise.resolve(URL.createObjectURL(e))},b=(0,l.Qx)(f,"inlineImageConfigCtx");v(b,{displayName:"Config<image-inline>",group:"ImageInline"});const h=(0,i.d_)("abcdefg",8),y=e=>{let{src:t="",selected:n=!1,alt:o,title:l,setAttr:r,config:i}=e;const s=(0,a.li)(),[d]=(0,a.J0)(h()),[u,p]=(0,a.J0)(!1),[m,g]=(0,a.J0)(0!==t.length),[v,f]=(0,a.J0)(t),b=()=>{var e,t;null==r||r("src",null!=(t=null==(e=s.current)?void 0:e.value)?t:"")};return a.qy`<host class=${(0,c.A)(n&&"selected",!t&&"empty")}>
    ${t?a.qy`<img class="image-inline" src=${t} alt=${o} title=${l} />`:a.qy`<div class="empty-image-inline">
          <div class="image-icon">${null==i?void 0:i.imageIcon()}</div>
          <div class=${(0,c.A)("link-importer",u&&"focus")}>
            <input
              draggable="true"
              ref=${s}
              ondragstart=${e=>{e.preventDefault(),e.stopPropagation()}}
              class="link-input-area"
              value=${v}
              oninput=${e=>{const t=e.target.value;g(0!==t.length),f(t)}}
              onkeydown=${e=>{"Enter"===e.key&&b()}}
              onfocus=${()=>p(!0)}
              onblur=${()=>p(!1)}
            />
            <div class=${(0,c.A)("placeholder",m&&"hidden")}>
              <input
                class="hidden"
                id=${d}
                type="file"
                accept="image/*"
                onchange=${e=>{return t=void 0,n=null,o=function*(){var t;const n=null==(t=e.target.files)?void 0:t[0];if(!n)return;const o=yield null==i?void 0:i.onUpload(n);o&&(null==r||r("src",o),g(!0))},new Promise(((l,a)=>{var r=t=>{try{c(o.next(t))}catch(e){a(e)}},i=t=>{try{c(o.throw(t))}catch(e){a(e)}},c=e=>e.done?l(e.value):Promise.resolve(e.value).then(r,i);c((o=o.apply(t,n)).next())}));var t,n,o}}
              />
              <label class="uploader" for=${d}>
                ${null==i?void 0:i.uploadButton()}
              </label>
              <span class="text" onclick=${()=>{var e;return null==(e=s.current)?void 0:e.focus()}}>
                ${null==i?void 0:i.uploadPlaceholderText}
              </span>
            </div>
          </div>
          <div
            class=${(0,c.A)("confirm",0===v.length&&"hidden")}
            onclick=${()=>b()}
          >
            ${null==i?void 0:i.confirmButton()}
          </div>
        </div>`}
  </host>`};y.props={src:String,alt:String,title:String,selected:Boolean,setAttr:Function,config:Object};!function(e,t){const n=customElements.get(e);null!=n?n!==t&&console.warn(`Custom element ${e} has been defined before.`):customElements.define(e,t)}("milkdown-image-inline",(0,a.c)(y));const $=(0,l.m5)(r.Fi.node,(e=>(t,n,o)=>{const l=document.createElement("milkdown-image-inline"),a=e.get(b.key),r=a.proxyDomURL,i=e=>{if(r){const t=r(e.attrs.src);"string"===typeof t?l.src=t:t.then((e=>{l.src=e}))}else l.src=e.attrs.src;l.alt=e.attrs.alt,l.title=e.attrs.title};return i(t),l.selected=!1,l.setAttr=(e,t)=>{const l=o();null!=l&&n.dispatch(n.state.tr.setNodeAttribute(l,e,t))},l.config=a,{dom:l,update:e=>e.type===t.type&&(i(e),!0),stopEvent:e=>!!(l.selected&&e.target instanceof HTMLInputElement),selectNode:()=>{l.selected=!0},deselectNode:()=>{l.selected=!1},destroy:()=>{l.remove()}}}));v($,{displayName:"NodeView<image-inline>",group:"ImageInline"});const k=[b,$];var w=n(7511);const N=(e,t)=>{e.config((e=>{e.update(b.key,(e=>{var n,o,l,a,r,i;return{uploadButton:null!=(n=null==t?void 0:t.inlineUploadButton)?n:()=>"Upload",imageIcon:null!=(o=null==t?void 0:t.inlineImageIcon)?o:()=>w.i,confirmButton:null!=(l=null==t?void 0:t.inlineConfirmButton)?l:()=>w.g,uploadPlaceholderText:null!=(a=null==t?void 0:t.inlineUploadPlaceholderText)?a:"or paste link",onUpload:null!=(i=null!=(r=null==t?void 0:t.inlineOnUpload)?r:null==t?void 0:t.onUpload)?i:e.onUpload,proxyDomURL:null==t?void 0:t.proxyDomURL}})),e.update(o.p0.key,(e=>{var n,o,l,a,r,i,c,s;return{uploadButton:null!=(n=null==t?void 0:t.blockUploadButton)?n:()=>"Upload file",imageIcon:null!=(o=null==t?void 0:t.blockImageIcon)?o:()=>w.i,captionIcon:null!=(l=null==t?void 0:t.blockCaptionIcon)?l:()=>w.j,confirmButton:null!=(a=null==t?void 0:t.blockConfirmButton)?a:()=>"Confirm",captionPlaceholderText:null!=(r=null==t?void 0:t.blockCaptionPlaceholderText)?r:"Write Image Caption",uploadPlaceholderText:null!=(i=null==t?void 0:t.blockUploadPlaceholderText)?i:"or paste link",onUpload:null!=(s=null!=(c=null==t?void 0:t.blockOnUpload)?c:null==t?void 0:t.onUpload)?s:e.onUpload,proxyDomURL:null==t?void 0:t.proxyDomURL}}))})).use(o.iH).use(k)}}}]);
//# sourceMappingURL=4108.99948b08.chunk.js.map