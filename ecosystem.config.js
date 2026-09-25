module.exports = {
  apps: [
    {
      name: 'digitalstation-web',
      script: '.next/standalone/server.js',
      cwd: __dirname,
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/error.log',
      out_file: 'logs/access.log',
      merge_logs: true,
    },
  ],
};
