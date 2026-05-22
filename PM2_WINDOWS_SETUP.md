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

## 3. Start the Next.js Application
Navigate to the `frontend` folder where your `package.json` is located. Make sure to replace `C:\path\to\...` with your actual folder path.
```powershell
cd C:\path\to\talent-flow-ats\frontend
```

Start the Next.js production server using PM2:
```powershell
pm2 start npm --name "frontend" -- start
```

## 4. Save the PM2 Process List
Save the current list of processes so that PM2 remembers to keep them running:
```powershell
pm2 save
```

## 5. Enable Auto-Start on Windows 11 Reboot
To ensure your app automatically starts when Windows 11 reboots, we need to install a helper package.

1. Still in the Administrator PowerShell, install the startup tool:
   ```powershell
   npm install -g pm2-windows-startup
   ```
2. Initialize the startup script:
   ```powershell
   pm2-startup install
   ```
3. Save the process list one final time to register it with the Windows startup registry:
   ```powershell
   pm2 save
   ```

---

## 🛠️ Useful PM2 Commands

*(Run these in any regular PowerShell or Command Prompt)*

- **Check Status:** View all running processes, memory usage, and status.
  ```powershell
  pm2 status
  ```
- **View Logs:** Check application logs to see console output or errors.
  ```powershell
  pm2 logs frontend
  ```
- **Restart the App:** Do this after you pull new code or create a new build.
  ```powershell
  pm2 restart frontend
  ```
- **Stop the App:** Temporarily stop the frontend.
  ```powershell
  pm2 stop frontend
  ```
- **Delete the App:** Completely remove the app from PM2's background list.
  ```powershell
  pm2 delete frontend
  ```
