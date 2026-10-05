@echo off
setlocal EnableExtensions

if not defined NODE_EXE (
  if exist "D:\codigos\node\node.exe" set "NODE_EXE=D:\codigos\node\node.exe"
)
if not defined NODE_EXE (
  if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
)
if not defined NODE_EXE (
  if exist "%LocalAppData%\Programs\node\node.exe" set "NODE_EXE=%LocalAppData%\Programs\node\node.exe"
)
if not defined NODE_EXE (
  for /f "delims=" %%i in ('where node 2^>nul') do (
    set "NODE_EXE=%%i"
    goto :found
  )
)

:found
if not defined NODE_EXE (
  echo.
  echo Node.js nao encontrado no PATH.
  echo Instale Node 20+ ^(https://nodejs.org^) e abra um terminal novo.
  echo.
  exit /b 1
)

set "ROOT=%~dp0.."
set "NEXT=%ROOT%\node_modules\next\dist\bin\next"

if not exist "%NEXT%" (
  echo.
  echo Dependencias ausentes. Rode: pnpm install
  echo.
  exit /b 1
)

"%NODE_EXE%" "%NEXT%" dev --turbopack %*
