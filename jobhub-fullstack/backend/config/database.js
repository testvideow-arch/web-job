const sql = require('mssql');

const dbConfig = {
  server: 'localhost',
  database: 'JobHub',
  user: 'sa',
  password: 'YourPassword123',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ Kết nối SQL Server thành công!');
    return pool;
  } catch (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database chưa được kết nối');
  }
  return pool;
};

module.exports = { connectDB, getPool, sql };