module.exports = {
  apps: [
    {
      name: "frontend",
      script: "cmd",
      args: "/c npm run start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
