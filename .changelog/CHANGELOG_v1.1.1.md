# Changelog - v1.1.1

## 🐛 修复

- 🔧 修复 middleware/decorators.ts 中重复导入 Constructor 类型的问题
  - 删除第 72 行的重复导入语句
  - 修复 TypeScript 编译错误（TS2300: Duplicate identifier）

---

**完整变更列表：**

- fix(middleware): remove duplicate Constructor import

