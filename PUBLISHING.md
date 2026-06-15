# Publishing to GitHub

当前项目已经是一个本地 git 仓库，默认分支为 `main`。

如果你安装并登录了 GitHub CLI，可以直接运行：

```bash
gh auth login
gh repo create fbi-fantong-behavior-identification --public --source=. --remote=origin --push
```

如果你已经在 GitHub 网页端创建了空仓库，可以运行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/fbi-fantong-behavior-identification.git
git push -u origin main
```

发布后可在仓库 `Settings -> Pages` 中启用 GitHub Pages：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`
