#!/bin/bash

mkdir -p notes

cat graphdata.json |
jq -c '.data.nodes[]' |
while read -r nodes; do
  id=$(echo "${nodes}" | jq -r '.id')
  file=$(echo "${nodes}" | jq -r '.file')
  cp -p "${file}" "notes/${id}"
done