import{m as g,a as E}from"./index-706eafad.js";import{r as u,o as T,c as V,a as v,b as a,w as n,e as c,f as C,h as l,V as M,E as $}from"./index-c88748e7.js";import"./axios-585fb22d.js";const D={class:"oc-box"},B={class:"oc-box__header"},G={class:"oc-box__main"},O={__name:"index",setup(N){const s=u(),r=u([]),p=async e=>{const t=s.value;if(t){const o={key:""},{row:i}=await t.insertAt(o,e);await t.setEditCell(i,"name")}},f=()=>{const e=s.value;e&&e.removeCheckboxRow()},b=async()=>{const e=s.value;e&&await M.modal.confirm("您确定要还原数据吗?")==="confirm"&&await e.revertData()},x=()=>{const e=s.value;if(e){const t=e.getTableData().tableData;k(t)}},_=()=>{g("generalTermsMap").then(e=>{if(!(e!=null&&e.data))return;r.value=[];const t=e.data.parseAssistanceMap;for(const o in t)Object.hasOwnProperty.call(t,o)&&(t[o],r.value.push({key:o}))})},k=e=>{const t={};e.forEach(o=>{t[o.key]=""}),E("generalTermsMap",{generalTerms:t}).then(o=>{o.code==0&&($.success("保存成功！"),_())})};return T(()=>{_()}),(e,t)=>{const o=c("vxe-button"),i=c("vxe-toolbar"),m=c("vxe-column"),h=c("vxe-input"),w=c("vxe-table");return C(),V("div",D,[v("div",B,[a(i,null,{buttons:n(()=>[a(o,{onClick:t[0]||(t[0]=d=>p())},{default:n(()=>[l("新增")]),_:1}),a(o,{onClick:f},{default:n(()=>[l("删除选中")]),_:1}),a(o,{onClick:b},{default:n(()=>[l("还原")]),_:1}),a(o,{onClick:x},{default:n(()=>[l("保存")]),_:1})]),_:1})]),v("div",G,[a(w,{border:"","show-overflow":"","keep-source":"",ref_key:"xTable",ref:s,"max-height":"100%",align:"center",data:r.value,"edit-config":{trigger:"click",mode:"cell",showStatus:!0}},{default:n(()=>[a(m,{type:"checkbox",width:"60"}),a(m,{field:"key",title:"名称","edit-render":{}},{edit:n(({row:d})=>[a(h,{modelValue:d.key,"onUpdate:modelValue":y=>d.key=y,type:"text"},null,8,["modelValue","onUpdate:modelValue"])]),_:1})]),_:1},8,["data"])])])}}};export{O as default};
