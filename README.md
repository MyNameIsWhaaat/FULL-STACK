#Скачать репозиторий
git clone https://github.com/MyNameIsWhaaat/FULL-STACK.git

#Забилдить образы
cd /home/kate/project/FULL-STACK/ПроектСоСтатьямиBackend
docker build . -t backend

cd /home/kate/project/FULL-STACK/ПроектСоСтатьямиFrontend
docker build . -t frontend

#Запустить compose
cd /home/kate/project/FULL-STACK
docker-compose build
docker-compose up

#Работа находится на localhost:3000
