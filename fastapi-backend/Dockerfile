FROM python:3.11-slim

# Install build tools and g++
RUN apt-get update && apt-get install -y g++ libjsoncpp-dev

# Set working dir
WORKDIR /app

# Copy everything
COPY . .

# Install Python deps
RUN pip install -r requirements.txt

# Compile C++ code
RUN g++ analyze.cpp -o analyze -ljsoncpp

# Expose FastAPI port
EXPOSE 5000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
