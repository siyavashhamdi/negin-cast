module.exports = {
  apps: [
    {
      name: 'negincast-web',
      cwd: './web/app',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
