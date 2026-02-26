FROM python:3.11-slim

WORKDIR /backend

# System deps (needed for postgres tooling / pg_isready)
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY backend/requirements.txt /backend/requirements.txt
RUN pip install --no-cache-dir -r /backend/requirements.txt

# Copy backend code (includes scripts/run_migrations.sh)
COPY backend /backend

# Make Python imports work
ENV PYTHONPATH=/backend

#  This is the line that makes the run_migrations.sh script executable
RUN chmod +x /backend/scripts/run_migrations.sh

EXPOSE 4000

# Run app.main when the container launches
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
