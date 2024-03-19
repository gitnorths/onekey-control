"use strict";
module.exports = {
  types: [
    { value: "feat", name: "特性: 一个新的特性" },
    { value: "fix", name: "修复: 修复一个Bug" },
    { value: "docs", name: "文档: 变更的只有文档" },
    { value: "style", name: "格式: 空格, 分号等格式修复" },
    { value: "refactor", name: "重构: 代码重构，注意和特性、修复区分开" },
    { value: "perf", name: "性能: 提升性能" },
    { value: "test", name: "测试: 添加一个测试" },
    { value: "chore", name: "工具: 开发工具变动(构建、脚手架工具等)" },
    { value: "revert", name: "回滚: 代码回退" },
    { value: "build", name: "打包: 代码打包" },
    { value: "ci", name: "ci: CI配置或脚本文件的改动" },
  ],
  messages: {
    type: "请选择提交的类型；",
    customScope: "请输入修改的范围（可选）",
    subject: "请简要描述提交（必填）",
    body: "请输入详细描述（可选）",
    footer: "请选择要关闭的issue（可选）",
    confirmCommit: "确认要使用以上信息提交？（y/n）",
  }, // limit subject length
  subjectLimit: 100,
};
