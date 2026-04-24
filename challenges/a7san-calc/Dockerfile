# Use a lightweight Python image
FROM python:3.10-slim

# Create a non-root user for security
RUN useradd -m ctfuser

# Set the working directory
WORKDIR /home/ctfuser

# Copy the application files
COPY app.py .
COPY flag.txt /flag.txt

# Install Flask
RUN pip install flask gunicorn

# Switch to the non-root user
USER ctfuser

# Use Gunicorn as a production-grade server instead of Flask's dev server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
