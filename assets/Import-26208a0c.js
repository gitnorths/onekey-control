import{_ as b,a as y,b as e,c as d,d as m,e as s,f as o,w as t,l as x,i as r,v as h}from"./index-b83d8487.js";const k={class:"oc-box"},V={class:"oc-box__header"},I={class:"oc-box__main"},w={class:"deploy-import"},C={key:1,class:"oc-empty"},g={__name:"Import",setup(B){const l=y({station:"",voltage:"",bay:"",device:""}),n=()=>{console.log("submit!")};return(N,a)=>{const _=e("el-option"),p=e("el-select"),c=e("el-form-item"),i=e("el-button"),u=e("el-form");e("el-text"),e("dv-decoration-11"),e("el-link");const f=e("el-empty");return d(),m("div",k,[s("div",V,[o(u,{inline:!0,model:l,class:"demo-form-inline"},{default:t(()=>[o(c,{label:"选择场站"},{default:t(()=>[o(p,{modelValue:l.station,"onUpdate:modelValue":a[0]||(a[0]=v=>l.station=v),placeholder:"请选择",clearable:""},{default:t(()=>[o(_,{label:"场站1",value:"1"}),o(_,{label:"场站2",value:"2"})]),_:1},8,["modelValue"])]),_:1}),x(o(c,null,{default:t(()=>[o(i,{type:"primary",onClick:n},{default:t(()=>[r("配置全局解析字典")]),_:1}),o(i,{type:"primary",onClick:n},{default:t(()=>[r("导入")]),_:1})]),_:1},512),[[h,!1]])]),_:1},8,["model"])]),s("div",I,[s("div",w,[(d(),m("div",C,[o(f,{description:"暂无数据"})]))])])])}}},D=b(g,[["__scopeId","data-v-c1c2f5f4"]]);export{D as default};