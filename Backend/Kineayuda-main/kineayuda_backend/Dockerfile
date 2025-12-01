FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Requisitos en la raíz del proyecto (Kineayuda-main/requirements.txt)
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt \
    && pip install --no-cache-dir dj-database-url==2.2.0 firebase-admin==6.5.0

# Copiamos solo el backend al contenedor
COPY kineayuda_backend /app/kineayuda_backend

# Cambiamos el directorio de trabajo al backend (donde está manage.py)
WORKDIR /app/kineayuda_backend

EXPOSE 8000


