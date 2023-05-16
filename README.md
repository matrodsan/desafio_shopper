# INSTRUÇÕES DE USO DA APLICAÇÃO
Tecnologias utilizadas: MySQL, NodeJs, Docker.

## MySQL

1. Para criar o cenário em que a aplicação será rodada foi utilizado o docker para rodar uma imagem do MySQL 5.7 com um banco já populado.
2. No diretório /database do projeto execute o seguinte comando:  docker build -t shopper .
3. Em seguida executo o seguinte: docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=shopper -e MYSQL_USER=mateus -e MYSQL_PASSWORD=shopper shopper


## Backend
1. Para rodar a parte do sistema responsável pela comunicação com o banco vá até o diretório /backend e através de um terminal e execute o seguinte comando: npm start

## Frontend
1. Por fim execute o ambiente de desenvolvimento do Vite executando a seguinte linha de código abrindo um terminal na pasta /frontend/shopper: npm dev run

Após essas etapas o aplicativo poderá ser visualizado no endereço http://localhost:5173/
