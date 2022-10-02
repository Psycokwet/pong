#/bin/bash

cd frontend
rm -rf node_modules
npm update
cd ../backend
rm -rf node_modules
npm update
# bash pre_build_prod.sh
