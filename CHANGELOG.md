# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed
* The `GMH_STAGED_FILES` environment variable now contains the path to a JSON file with the array of staged files instead of directly containing the JSON string.

### Deprecated

### Removed

### Fixed
* The `GMH_STAGED_FILES` environment variable being undefined on Windows when a large number of files are staged.

### Security

## [0.1.0] 2019-08-04
Initial MVP release.

## [0.0.1] 2019-06-19
Initial release to preserve package name. Zero functionality.