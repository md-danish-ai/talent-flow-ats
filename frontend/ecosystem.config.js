module.exports = {
  apps: [
    {
      name: "frontend",
      script: "start.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
