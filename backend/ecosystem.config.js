require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'gestor-proyectos-backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        JWT_SECRET: process.env.JWT_SECRET,
        SWAGGER_HABILITADO:
          process.env.NODE_ENV === 'production' ? 'false' : 'true',
      },
      time: true,
    },
  ],
};
