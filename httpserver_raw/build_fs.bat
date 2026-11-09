@echo off
setlocal enabledelayedexpansion

rem ============================================================
rem  build_fs.bat - regenerate fsdata.c from fs/ folder
rem  Лежит в ...\main\httpserver_raw\build_fs.bat
rem ============================================================

set "HTTP_DIR=%~dp0"
if "%HTTP_DIR:~-1%"=="\" set "HTTP_DIR=%HTTP_DIR:~0,-1%"

set "FS_DIR=%HTTP_DIR%\fs"
set "FSDATA=%HTTP_DIR%\fsdata.c"
set "MAKEFSDATA_SRC=%HTTP_DIR%\makefsdata.c"
set "MAKEFSDATA_EXE=%HTTP_DIR%\makefsdata.exe"

set "PATH=C:\mingw64\bin;%PATH%"

echo.
echo ============================================================
echo  Rebuild fsdata.c
echo ============================================================
echo  HTTP dir: %HTTP_DIR%
echo  FS dir  : %FS_DIR%
echo.

if not exist "%FS_DIR%" (
    echo [ERROR] FS directory not found: %FS_DIR%
    exit /b 1
)
if not exist "%MAKEFSDATA_SRC%" (
    echo [ERROR] makefsdata.c not found: %MAKEFSDATA_SRC%
    exit /b 1
)

echo [OK] Using gcc from C:\mingw64\bin

echo.
echo [1/2] Compiling makefsdata.exe ...
pushd "%HTTP_DIR%"
gcc -DWIN32 -O2 -o "%MAKEFSDATA_EXE%" "%MAKEFSDATA_SRC%"
if errorlevel 1 (
    echo [ERROR] Failed to compile makefsdata.c
    popd
    exit /b 1
)
popd
echo [OK] makefsdata.exe built

echo.
echo [2/2] Running makefsdata on fs/ ...
pushd "%HTTP_DIR%"
"%MAKEFSDATA_EXE%" -e fs
set "FS_ERR=%errorlevel%"
popd

if not "%FS_ERR%"=="0" (
    echo [ERROR] makefsdata failed with code %FS_ERR%
    exit /b 1
)
if not exist "%FSDATA%" (
    echo [ERROR] fsdata.c was not generated
    exit /b 1
)

for %%A in ("%FSDATA%") do set "FSDATA_SIZE=%%~zA"
echo.
echo ============================================================
echo  DONE
echo ============================================================
echo  fsdata.c : %FSDATA%
echo  Size     : %FSDATA_SIZE% bytes
echo.

endlocal
exit /b 0