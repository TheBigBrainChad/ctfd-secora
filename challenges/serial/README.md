# PHP Insecure Deserialization CTF

This is a simple CTF challenge demonstrating PHP Object Injection via insecure deserialization of a cookie.

## Deployment

### Option 1: Docker Compose (Recommended)
1. Ensure you have Docker/Podman and Docker Compose installed.
2. Run `docker-compose up -d --build`.
3. The application will be available at `http://localhost:8080`.
4. Note: In the Docker environment, the flag is located at `/flag.txt` to prevent direct web access.

### Option 2: PHP Built-in Server
If you have PHP installed locally, you can run:
```bash
php -S localhost:8080
```
Then visit `http://localhost:8080` in your browser.
Note: Ensure `flag.txt` is in the same directory as `index.php` for this method.

## Challenge Info
-   **Goal**: Read the `flag.txt` file on the server.
-   **Clue**: Check how the session is handled and look at the source code. In Docker, the flag is at `/flag.txt`.

## Files
-   `index.php`: Web server entry point.
-   `FileHandler.php`: Vulnerable class.
-   `flag.txt`: Flag source (copied to `/flag.txt` in Docker).
-   `exploit.php`: Solution script.
-   `Dockerfile`: Docker configuration.
-   `docker-compose.yml`: Docker Compose configuration.
-   `.dockerignore`: Excluded files for Docker build.
