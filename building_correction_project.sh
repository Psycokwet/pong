#/bin/bash

rm -rf dist_project
mkdir dist_project -p
FOLDERS=( frontend backend nginx )

for i in ${FOLDERS[@]}
do
    rsync -av ${i}/ dist_project/${i} --exclude node_modules --exclude Dockerfile.local --exclude .env --exclude '*.git*' --exclude '*.md' --exclude 'dist' --exclude 'test'
done
cp ./* dist_project/ 
rm  dist_project/*.md
rm  dist_project/`basename "$0"`
mv  dist_project/docker-compose-prod.yml  dist_project/docker-compose.yml