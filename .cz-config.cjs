"use strict";
module.exports = {
  types: [
    { value: "feat", name: "特性: 新增一个功能" },
    { value: "fix", name: "修复: 修复一个Bug" },
    { value: "docs", name: "文档: 文档变更" },
    { value: "style", name: "格式: 代码格式（不影响功能，例如空格、分号等格式修正）" },
    { value: "refactor", name: "重构: 代码重构，注意和特性、修复区分开" },
    { value: "perf", name: "性能: 改善性能" },
    { value: "test", name: "测试: 添加一个测试" },
    { value: "chore", name: "工具: 变更构建流程或辅助工具" },
    { value: "revert", name: "回滚: 代码回退" },
    { value: "build", name: "打包: 变更项目构建或外部依赖（例如scopes: webpack、gulp、npm等）" },
    { value: "ci", name: "ci: 更改持续集成软件的配置文件和package中的scripts命令，例如scopes: Travis, Circle等" },
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
