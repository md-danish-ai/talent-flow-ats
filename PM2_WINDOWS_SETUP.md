# PM2 Setup Guide for Windows 11

This guide provides a foolproof, step-by-step process to install and configure PM2 on a Windows 11 machine. This ensures your Next.js frontend runs continuously in the background, even after you close the terminal or restart your PC.

## 1. Prerequisites & Preparation
Ensure Node.js and npm are installed.
Since Windows 11 has strict security policies for running scripts, we first need to allow script execution.

1. Click on the **Start Menu**, type `PowerShell`.
2. Right-click on **Windows PowerShell** and select **Run as Administrator**.
3. Run the following command and press `Y` if prompted:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## 2. Install PM2 Globally
In the same **Administrator PowerShell** window, install PM2:
```powershell
npm install -g pm2
```

## 3. Update the .env File
Navigate to the `frontend` folder and update the `.env` file with your Windows machine's IP:
```env
NEXT_PUBLIC_API_BASE_URL=http://YOUR_WINDOWS_IP:4000
```
> ⚠️ Replace `YOUR_WINDOWS_IP` with your actual IP (e.g. `192.168.136.5`).
> To find your IP, run `ipconfig` and look for **IPv4 Address**.

## 4. Build the Application
Navigate to the `frontend` folder and run the production build:
```powershell
cd C:\path\to\talent-flow-ats\frontend
npm install
npm run build
```

## 5. Start the Application with PM2
Use the `ecosystem.config.js` file (already present in the `frontend` folder) to start the app correctly on Windows:
```powershell
pm2 start ecosystem.config.js
```

## 6. Save the PM2 Process List
```powershell
pm2 save
```

## 7. Enable Auto-Start on Windows 11 Reboot
To ensure your app automatically starts when Windows 11 reboots:

1. Install the startup tool:
   ```powershell
   npm install -g pm2-windows-startup
   ```
2. Initialize the startup script:
   ```powershell
   pm2-startup install
   ```
3. Save the process list one final time:
   ```powershell
   pm2 save
   ```

---

## 🛠️ Useful PM2 Commands

- **Check Status:**
  ```powershell
  pm2 status
  ```
- **View Logs (to debug errors):**
  ```powershell
  pm2 logs frontend
  ```
- **Restart after a new build:**
  ```powershell
  pm2 restart frontend
  ```
- **Stop the App:**
  ```powershell
  pm2 stop frontend
  ```
- **Delete and re-start fresh:**
  ```powershell
  pm2 delete all
  pm2 start ecosystem.config.js
  pm2 save
  ```
