FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto de archivos
COPY . .

# Exponer puerto 3001 para desarrollo
EXPOSE 3001

# Ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]