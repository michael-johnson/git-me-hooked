#!/bin/sh

args=$@
workingDir=$(pwd)

git-me-hooked exec $workingDir %%_HOOK_NAME_%% $args