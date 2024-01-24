# org-roam-ui-hosting

This action generates a static site for [org-roam-ui](https://github.com/org-roam/org-roam-ui) from [org-roam](https://www.orgroam.com/) files managed on GitHub.

It also allows deployment to GitHub Pages.

## How to Use

First, please manage the .org files in `org-roam-directory` and the db file in org-roam using git.

```lisp
(setq org-roam-directory "/path/to/org-roam-dir")
(setq org-roam-db-location "/path/to/org-roam-dir/<org-roam-filename>.db")
```

```bash
cd /path/to/org-roam-dir/
git init
```

Then, a static org-roam-ui site is easily generated for the artifact by creating a workflow like the following.

```yml
name: Generate static org-roam-ui page
on:
  push:
    branches:
      - main
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate org-roam-ui page
        uses: ikoamu/org-roam-ui-hosting@main
        with:
          org-roam-db-filename: <org-roam-filename>.db
```
