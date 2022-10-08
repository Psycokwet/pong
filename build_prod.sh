#/bin/bash

rm -rf dist_project
mkdir dist_project -p
FOLDERS=( frontend backend nginx )

LINE=-_-_-_-_-_-_-

echo $LINE Selecting files and folder for dist $LINE
for i in ${FOLDERS[@]}
do
    rsync -av ${i}/ dist_project/${i} --exclude node_modules --exclude Dockerfile.local --exclude .env --exclude '*.git*' --exclude '*.md' --exclude 'dist' --exclude 'test'
    mv dist_project/${i}/.dockerignore.production dist_project/${i}/.dockerignore
done
echo $LINE Getting locals files for dist... Omitting directories is wanted. $LINE
cp ./* dist_project/ 
echo $LINE Cleaning unused files in dist... $LINE
rm  dist_project/*.md
rm  dist_project/`basename "$0"`
echo $LINE Renaming prod docker-compose dist... $LINE
mv  dist_project/docker-compose-prod.yml  dist_project/docker-compose.yml
echo $LINE Copying shared $LINE
rm -rf dist_project/frontend/shared
rsync -av dist_project/backend/shared dist_project/frontend

# bash build_prod.sh && cd dist_project && cp ../frontend/.env frontend/.env  && cp ../backend/.env backend/.env && sudo docker system prune -fa && sudo docker-compose up
# bash build_prod.sh && cd dist_project && cp ../backend/.env backend/.env && sudo docker system prune -fa && sudo docker-compose up
# bash build_prod.sh && cd dist_project && cp ../backend/.env backend/.env && sudo docker-compose build --no-cache frontend && sudo docker-compose up