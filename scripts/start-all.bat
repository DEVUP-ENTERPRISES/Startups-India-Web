@echo off
echo Starting Startups India Platform...

REM Start backend server
echo Starting backend server...
cd ..\backend
start "Backend Server" cmd /c "pnpm run dev"
cd ..

REM Start frontend
echo Starting frontend...
cd frontend
start "Frontend" cmd /c "npm run dev"
cd ..

echo.
echo All services started!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
pause
