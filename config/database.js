module.exports = {
  host: process.env.DB_HOST || '86.75.61.19',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecotrack_wordpress',
  port: process.env.DB_PORT || 3306,
};
