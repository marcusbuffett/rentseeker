FROM rust:latest as builder
RUN rustup update nightly; rustup default nightly;
WORKDIR /usr/src/myapp
COPY . .
ENV ROCKET_ENV=production
ENV DB_PATH=/mnt/data
ENV SECRET="0f2baa54-c50b-484e-8bee-a21ac0fe1440"
CMD ["cargo", "run"]
# FROM debian:buster-slim
# # RUN apt-get update && apt-get install -y extra-runtime-dependencies && rm -rf /var/lib/apt/lists/*
# COPY --from=builder /usr/local/cargo/bin/myapp /usr/local/bin/myapp
# CMD ["myapp"]
