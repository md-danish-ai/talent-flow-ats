module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npm",
      args: "run start",
      shell: true,
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
