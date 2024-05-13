# Especifica a imagem base
FROM node:21

# Cria o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de pacote e instala as dependências
COPY package*.json ./
RUN npm install

# Copia os arquivos restantes do projeto
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Expõe a porta que o servidor utilizará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/App.js"]
