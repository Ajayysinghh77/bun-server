# Changelog - v1.1.3

## 🐛 修复

- 🔧 修复发布脚本，支持将 docs 目录包含到 npm 包中
  - 更新 `publish:package` 脚本，复制 docs 目录到发布包
  - 添加 `.gitignore` 文件，忽略临时复制的文件
  - 更新 `package.json` 的 `files` 字段，包含 docs 目录

## 📝 文档

- 📚 更新 v1.1.x roadmap 文档状态
  - 标记所有 Phase 5 任务为已完成
  - 更新测试统计（491 个测试全部通过）
  - 更新版本号范围（v1.1.0 - v1.1.2）

---

**完整变更列表：**

- fix(package): update publish script to include docs directory
- docs(roadmap): update v1.1.x completion status

