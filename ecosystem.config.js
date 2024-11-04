module.exports = {
    apps: [{
      name: "backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 8080
      },
      watch: true,
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G'
    }]
  }