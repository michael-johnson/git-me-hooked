# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [0.5.0] 2019-08-25

### Added
* Pretty spinners to show the status of running hooks from the command line.
* New optional fields to configure individual hook scripts: `silence` to suppress the script's output to stdout and stderr, and `name` to give the script a friendly name to display in the CLI.

### Changed
* Hook scripts now run asynchronously, improving performance.

### Fixed
* Readme referring to wrong environment variable for git arguments.


## [0.4.0] 2019-08-19

### Added
* Support for `pre-push` and `commit-msg` hooks scripts.
* The `GMH_GIT_ARGUMENTS` environment variable that contains arguments git called the hook with.
* The `GMH_RUNNING` environment variable which is always populated when executing a commit hook, to provide an easy way to programmatically check if a hook script is executed by git-me-hooked.


## [0.3.0] 2019-08-11

### Added
* The `GMH_STAGED_FILES` JSON file is cleaned up if an error happens executing a hook.

### Changed
* Updated git command for retrieving staged files for `GMH_STAGED_FILES` to `git diff`.

### Fixed
* The hook runner crashing if a config file didn't have a `scripts` field.


## [0.2.0] 2019-08-07

### Added
* Support for includes in config files.
* New `GMH_REPO_DIRECTORY` environment variable that contains the path to the repository where the hook is currently being executed on.

### Changed
* The `GMH_STAGED_FILES` environment variable now contains the path to a JSON file with the array of staged files instead of directly containing the JSON string.

### Fixed
* The `GMH_STAGED_FILES` environment variable being undefined on Windows when a large number of files are staged.


## [0.1.0] 2019-08-04
Initial MVP release.


## [0.0.1] 2019-06-19
Initial release to preserve package name. Zero functionality.