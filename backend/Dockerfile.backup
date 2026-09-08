FROM python:3.11-slim

WORKDIR /backend

# System deps: build tools for pycairo (xhtml2pdf dep)
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Kolkata

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       postgresql-client \
       tzdata \
       libcairo2 \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY backend/requirements.txt /backend/requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip pip install -r /backend/requirements.txt

# Copy backend code (includes scripts/)
COPY backend /backend

# Make Python imports work
ENV PYTHONPATH=/backend

# Make scripts executable
RUN chmod +x /backend/scripts/run_migrations.sh

EXPOSE 4000

CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:4000", "--timeout", "60", "--graceful-timeout", "30"]
