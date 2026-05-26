const isWindows = process.platform === 'win32';

module.exports = {
  apps: [
    {
      name: "frontend",
      script: isWindows ? "npm.cmd" : "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
