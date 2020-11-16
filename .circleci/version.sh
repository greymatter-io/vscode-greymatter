#!/bin/sh

# creates version file "./dist/VERSION" in the format:
# VERSION=1.2.3
# COMMIT=43cf1a9146ffcd9575b9e86db453ebb0bba23f57

# create and empty current VERSION file, if any
FILE="VERSION"
>$FILE

# copy current version from package.json
echo "VERSION=$(node -e "console.log(require('./package.json').version);")" >>$FILE

# copy over sha from most recent commit
echo "COMMIT=$(git rev-parse HEAD)" >>$FILE

# output created file to console
cat $FILE
