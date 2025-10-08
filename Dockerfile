# Etapa base: usa Node 22
FROM node:22

# Crea un directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json primero
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "index.js"]
