# Builder
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
LABEL maintainer="graham.david@epa.gov"
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

#RUN apt install libffi-dev gcc libc-dev curl
RUN apt-get update && \
    apt-get install -y libffi-dev gcc libc-dev curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

ADD . /app

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# App
FROM python:3.12-slim-bookworm

COPY --from=builder --chown=app:app /app /app

ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0:8000", "--workers", "2", "-k", "uvicorn_worker.UvicornWorker", "haztrak.asgi:app"]
