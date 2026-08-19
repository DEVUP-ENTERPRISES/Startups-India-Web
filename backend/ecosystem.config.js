// PM2 Ecosystem Configuration
// Start:   pm2 start ecosystem.config.js
// Reload:  pm2 reload ecosystem.config.js  (zero-downtime)
// Stop:    pm2 stop all
// Monitor: pm2 monit

module.exports = {
  apps: [
    {
      name: 'incubation-backend',
      script: 'src/server.js',
      cwd: __dirname,

      // ─── CLUSTER MODE ──────────────────────────────────
      instances: process.env.PM2_INSTANCES || 'max', // 1 per CPU core
      exec_mode: 'cluster',

      // ─── RESTART POLICIES ──────────────────────────────
      max_memory_restart: '500M',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000, // 1s delay between restarts
      min_uptime: '10s', // consider stable after 10s

      // ─── GRACEFUL SHUTDOWN ─────────────────────────────
      kill_timeout: 5000, // 5s to finish in-flight requests
      listen_timeout: 8000, // 8s to start listening
      shutdown_with_message: true,
      wait_ready: true, // wait for process.send('ready')

      // ─── ENVIRONMENT ──────────────────────────────────
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },

      // ─── LOGGING ───────────────────────────────────────
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
      log_type: 'json',

      // ─── WATCHING (dev only) ───────────────────────────
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.log'],
    },
  ],
};
