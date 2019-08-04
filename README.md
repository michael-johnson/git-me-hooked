# Git Me Hooked

Manage your git hooks in a language and repository agnostic manner.


## Changelog

A changelog is maintained for this project and is available [here](https://gitlab.com/michael-johnson/git-me-hooked/blob/develop/CHANGELOG.md).


## Requirements

* `Node` and `npm` and it's globally installed packages in your PATH.
* `git` (duh)


## Usage

1. Install the package globally:

```bash
npm i -g git-me-hooked
```

2. Initialize a repository to use the hook manager:

```bash
git-me-hooked init <repoPath>
```

3. Use git and enjoy


## Limitations

* It is not possible to use `git-me-hooked` in conjunction with git hooks not executed by `git-me-hooked`. Any existing git hooks are backed up on `init` and are restored on `unistall`.
* Currently the only supported hook type is `pre-commit`. More will be added as development continues.


## Configuration

A `git-me-hooked.json` file is created in the repository's top directory that defines what scripts are executed for each git hook. An example configuration is created by default:
```json
{
    "scripts": {
        "pre-commit": [
            {
                "exec": "echo \"hiya\""
            }
        ]
    }
}
```

Each commit hook name inside of `scripts` is an array of objects that define what is executed when that hook is triggered. Each object in the array has an `exec` field that is the shell command that will be executed by the hook runner.

## Writing Scripts
### General
* A non-zero exit status in any of the scripts for a hook will abort the git action (if possible).
* Output to stdout and stderr is not silenced.
* The hook runner populates a `GMH_STAGED_FILES` environment variable with a JSON encoded array of the absolute paths of currently staged files.

### Examples
#### pre-commit
```javascript
#!/usr/bin/env node
const process = require('process');

// Log all of the currently staged files
const files = JSON.parse(process.env.GMH_STAGED_FILES);
files.forEach(file => {
    console.log(file);
});

```
