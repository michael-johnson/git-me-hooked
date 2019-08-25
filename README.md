# Git Me Hooked

Manage your git hooks in a language and repository agnostic manner.


## Changelog

A changelog is maintained for this project and is available [here](https://gitlab.com/michael-johnson/git-me-hooked/blob/develop/CHANGELOG.md).


## Requirements

* `Node` >= 8
* `npm` and it's globally installed packages in your PATH.
* `git` (duh)


## Usage

Install the package globally:

```bash
npm i -g git-me-hooked
```

Initialize a repository to use the hook manager:

```bash
git-me-hooked init <repoPath>
```

Use git and enjoy


## Limitations

* It is not possible to use `git-me-hooked` in conjunction with git hooks not executed by `git-me-hooked`. Any existing git hooks are backed up on `init` and are restored on `uninstall`.
* Currently the only supported hook types are `pre-commit`, `commit-msg`, and `pre-push`. More will be added as development continues.


## Configuration

A `git-me-hooked.json` file is created in the repository's top directory that defines what scripts are executed for each git hook. An example configuration is created by default:
```json
{
    "includes": [
        "../some-other-places/more-hooks.json"
    ],
    "scripts": {
        "pre-commit": [
            {
                "name": "Say hiya",
                "exec": "echo \"hiya\""
            }
        ]
    }
}
```

* Each commit hook name inside of `scripts` is an array of objects that define what is executed when that hook is triggered. Each object in the array has an `exec` field that is the shell command that will be executed by the hook runner. There is also an optional `name` field that the CLI will use when displaying results if it is provided.
* Additional hook configuration files can be included by specifying their relative path in the `includes` array. Each `exec` is always executed from the same directory as the config file it's defined in.


## Writing Scripts

### General

* A non-zero exit status in any of the scripts for a hook will abort the git action (if possible).
* Output to stdout and stderr is not silenced by default, but can be by adding `silence: true` to the hook's entry in the `scripts` config.
* Paths in configuration files are always executed relative to the config files path. 
* Hook script arguments are not guaranteed to be in the same position as if the script was called directly by git. Prefer using `GMH_GIT_ARGUMENTS` to retrieve arguments from git.

### Environment Variables

A handful of environment variables are populated by the hook runner to make writing scripts easier.

#### Global

* `GMH_RUNNING`: this is a simple flag that contains the string 'true' that is set anytime git-me-hooked is executing a git hook.
* `GMH_GIT_ARGUMENTS`: contains a list of space separated arguments that git called the hook with.
* `GMH_REPO_DIRECTORY`: a path that points to the root of the repo that the hook is currently being executed for.

#### Pre-commit

* `GMH_STAGED_FILES`: contains the path of a JSON file with an array of the absolute paths of currently staged files.


### Examples

#### Pre-commit

```javascript
#!/usr/bin/env node
const process = require('process');
const fs = require('fs');

const files = JSON.parse(fs.readFileSync(process.env.GMH_STAGED_FILES));
files.forEach(file => {
    console.log(file);
});
```
