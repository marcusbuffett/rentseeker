FROM rust:latest as builder
RUN rustup update nightly; rustup default nightly;
WORKDIR /usr/src/myapp
COPY . .
ENV ROCKET_ENV=production
ENV DB_PATH=/mnt/data
CMD ["start.sh"]
# FROM debian:buster-slim
# # RUN apt-get update && apt-get install -y extra-runtime-dependencies && rm -rf /var/lib/apt/lists/*
# COPY --from=builder /usr/local/cargo/bin/myapp /usr/local/bin/myapp
# CMD ["myapp"]
