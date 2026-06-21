# Build using official Python slim image for performance and size efficiency
FROM python:3.11-slim

# Set environment variables to optimize Python performance inside Docker containers
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /code

# Copy requirement files first to utilize Docker layer caching mechanisms
COPY ./requirements.txt /code/requirements.txt

# Install python system dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the entire backend application codebase
COPY . /code/

# Expose the application port (typically 8000)
EXPOSE 8000

# Start Uvicorn ASGI server hosting our FastAPI application
# Bind host to 0.0.0.0 to enable external traffic routing
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
