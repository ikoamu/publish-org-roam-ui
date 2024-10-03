#!/bin/bash

read -p "Enter the ROAM_PATH: " ROAM_PATH
read -p "Enter the ROAM_DB_FILE: " ROAM_DB_FILE
ROAM_DB_PATH=$ROAM_PATH/$ROAM_DB_FILE
ROAM_IMG_PATH=$ROAM_PATH/img

# If org-roam-ui directory does not exists, clone the org-roam-ui repository.
if [ ! -d "org-roam-ui" ]; then
    git clone -b publish-org-roam-ui https://github.com/ikoamu/org-roam-ui
fi

# create .env file
pushd org-roam-ui
if [ ! -f ".env" ]; then
    echo "NEXT_PUBLIC_DEFAULT_SECTION_OPEN=true" > .env
fi
popd

# Generate data for org-roam-ui
npm install
npm run generate:graphdata --script_params=$ROAM_DB_PATH
./create_notes.sh $ROAM_PATH
npm run generate:search
npm install fuse.js
node build-index.js

# Copy files to the org-roam-ui directory
cp -f searchdata.json org-roam-ui/components/Search/
cp -f fuse-index.json org-roam-ui/components/Search/

if [ -d $ROAM_IMG_PATH ]; then
    cp -r $ROAM_IMG_PATH org-roam-ui/public
fi

pushd org-roam-ui
yarn install
pushd standalone
./build-standalone-server.sh ../..
if [ -d "../../out" ]; then
    rm -rf ../../out
fi
mv out ../../
popd
popd
