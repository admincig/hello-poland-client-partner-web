# React Web App
Template project for web applications.

## Overview
### Project structure

```
/components - global components directory (used by more than one view)
  /ExampleComponent
    /__mocks__ - mock data used in tests
    /redux - component reducers
    index.jsx - exports component
    ExampleComponent.jsx - implementation of main component
    ExampleComponent.test.jsx - all kinds of tests
    ExampleButton.jsx - partial component
    ExampleButton.test.jsx
/config - default app configuration
/pages - next.js magic folder. Handles routing. Use [kebab-kase](http://wiki.c2.com/?KebabCase) naming convention.
  /account
    index.jsx - redirects to profile.jsx (preferably with 302 status)
    profile.jsx
    edit.jsx
  /movies
    index.jsx - resolves list and item routes (/movies - list view, /movies/:id - item view)
    add.jsx
    edit.jsc
  example-view.jsx
/redux - global reducers
/scripts - build scripts
/services - application services
/static - static files
  /images
  manifest.json - PWA manifest
/utils - pure JS utility functions
/views - view implamentations
  /ExampleView
    /components - view specific components
    /redux - component reducers
    index.jsx - exports view
    ExampleView.jsx - view implementation
.editorconfig - common editor settings
.eslintrc.json - linter configuration
.gitignore - files ignored by git
.gitlab-cu.yml - CI/CD configuration file - see https://docs.gitlab.com/ce/ci/yaml/
.npmrc - npm configuration
next.config.js - next.js configuration
```

## Initializing new project
To initialize new project using this repository click the "New project" button available in group directory. Next go to "Import project" tab and click "Repo by URL" button.

In "Git repository URL" paste the following URL:

```
git@git.fream.pl:fream/web/react-web-app.git
```

and specify new project path and name (use [kebab-case](http://wiki.c2.com/?KebabCase) convention). 

## Project stack
### Core packages
React + Redux + Next.js + Jest + JSS

### Other common libraries
Material UI
