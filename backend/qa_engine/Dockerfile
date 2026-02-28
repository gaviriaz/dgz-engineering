FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for GeoPandas/Fiona (GDAL, PROJ, GEOS)
RUN apt-get update && apt-get install -y \
    build-essential \
    libgdal-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Fix specific variables for GDAL to compile/install properly if needed
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

COPY requirements.txt /app/requirements.txt

# Create a lighter install by avoiding caching
RUN pip install --no-cache-dir -U pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

# Start command mapped to the 'main.py' file inside QA Engine
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
