# Contributing

We welcome contributions of all kinds — bug fixes, features, documentation updates, and suggestions. Follow this guide to get started and contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Setting Up the Project Locally](#setting-up-the-project-locally)
- [Opening a Pull Request](#opening-a-pull-request)
- [Contribution Guidelines](#contribution-guidelines)
- [Contribution Points](#contribution-points)
- [Commit Messages](#commit-messages)
- [Creating Issues](#creating-issues)
- [Acknowledgments](#acknowledgments)

## Getting Started

1. Fork the repository by clicking the "Fork" button on the repository page.
2. Clone your forked repository:
```bash
   git clone https://github.com/<your-username>/bit-by-query.git
   cd bit-by-query
````

3. Create a new branch for your changes:

```bash
   git checkout -b feature/my-new-feature
```
4. Make your changes and test them locally.

## Setting Up the Project Locally

1. Add the original repository as upstream:

```bash
   git remote add upstream https://github.com/swarooppatilx/bit-by-query.git
   git remote -v
```

2. Stay updated by syncing your local `main` branch with the upstream repository:

```bash
  git fetch upstream main
  git pull upstream main
```

## Opening a Pull Request

1. Stage and commit your changes:

```bash
   git add .
   git commit -m "feat: brief description of your change"
```

2. Push your changes:

```bash
   git push origin feature
```

3. Open a pull request on GitHub from your forked repository. Provide a clear title and description of the changes you made.

## Contribution Guidelines

* Test your changes thoroughly before submitting a PR.
* Keep PRs focused on a single issue or feature.
* Write clear commit messages and PR descriptions.
* Be respectful and constructive in code reviews and discussions.

## Contribution Points

Tasks are categorized by difficulty, and contributors earn points accordingly:

| Level   | Description                 | Points |
| ------- | --------------------------- | ------ |
| Level 1 | Small fixes, documentation  | 10     |
| Level 2 | Medium features, UI updates | 25     |
| Level 3 | Major features, refactors   | 45     |

Consistent contributors may be recognized and featured in the project.

## Commit Messages

Use the following prefixes for commit messages:

* `feat:` for new features
* `fix:` for bug fixes
* `docs:` for documentation changes
* `chore:` for maintenance tasks

Example:

```bash
git commit -m "fix: resolve leaderboard ranking issue"
```

## Creating Issues

When submitting an issue:

* Use a clear and descriptive title.
* Include steps to reproduce the problem.
* Describe expected and actual behavior.
* Attach screenshots or logs if applicable.
* For feature requests, explain the use case and benefits.

## Acknowledgments

Thank you for contributing to Bit By Query. If you find this project useful, please star the repository to show your support.

Happy coding!