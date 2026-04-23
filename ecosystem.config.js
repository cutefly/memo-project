module.exports = {
  apps: [
    {
      name: 'memo-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run dev',
      watch: true,
      ignore_watch: ['node_modules', 'dist'],
      env: {
        NODE_ENV: 'development',
      }
    },
    {
      name: 'memo-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      }
    }
  ]
};
