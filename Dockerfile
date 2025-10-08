<<<<<<< HEAD
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
=======
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY . .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
>>>>>>> 50c58789e5c025b004c30e937acc7bdf5118235e
