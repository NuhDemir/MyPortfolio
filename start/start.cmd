@echo off
setlocal
cd /d %~dp0..
if not exist backend (
  echo Backend klasoru bulunamadi.
  exit /b 1
)
if not exist frontend (
  echo Frontend klasoru bulunamadi.
  exit /b 1
)
echo Backend ve frontend gelistirme sunuculari baslatiliyor...
start "backend" cmd /k "cd /d %~dp0..\backend && npm run dev"
start "frontend" cmd /k "cd /d %~dp0..\frontend && npm run dev"
echo Ayri iki komut penceresi acildi. Cikmak icin bu pencereyi kapatabilirsiniz.
endlocal
