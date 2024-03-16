# publish-org-roam-ui

This action generates a static site for [org-roam-ui](https://github.com/org-roam/org-roam-ui) from [org-roam](https://www.orgroam.com/) files managed on GitHub.

It also allows deployment to GitHub Pages.
(See https://ikoamu.github.io/publish-org-roam-ui/)

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
  main:
    runs-on: ubuntu-latest
    steps:
      - name: Generate org-roam-ui page
        uses: ikoamu/org-roam-ui-hosting@main
        with:
          org-roam-db-filename: <org-roam-filename>.db
```

<img width="669" alt="generated artifact" src="https://github.com/ikoamu/publish-org-roam-ui/assets/38206334/fdc9f133-c97c-4d3b-b328-3a1d86560e83">

Deploy to GitHub Pages by setting `deploy-to-pages` to true.

```yml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - name: Generate org-roam-ui page
        uses: ikoamu/org-roam-ui-hosting@main
        with:
          org-roam-db-filename: <org-roam-filename>.db
          deploy-to-pages: true
```

### Show Image

You can create an `img` directory directly under the repository and display image files stored there.

```org
[[./img/test.png]]
```

### Setting site tile

You can change the title of the site by specifying `site-tile`. (The default is ORUI)

```yml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - name: Generate org-roam-ui page
        uses: ikoamu/org-roam-ui-hosting@main
        with:
          org-roam-db-filename: <org-roam-filename>.db
          site-title: my org-roam!
```
