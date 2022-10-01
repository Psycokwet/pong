#/bin/bash
cd ./frontend
npm i
rm shared
ln -s ../backend/shared/ shared
cd ../backend
npm i

# bash prepare_dev.sh