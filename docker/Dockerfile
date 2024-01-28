FROM node:16.19.0-alpine as base

# Check installation https://pnpm.io/installation if change node version
RUN npm install -g pnpm@8.5

FROM base as builder
RUN npm install -g @nestjs/cli@9.4.2

ENV NODE_ENV production

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.1 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

# Build proto file => build app
RUN pnpm build proto-schema && \
    pnpm build public-api && \
    pnpm build internal-grpc && \
    pnpm build worker && \
    pnpm build commander && \
    pnpm build websocket && \
    pnpm build scheduler


FROM base as production

WORKDIR /app

COPY --from=builder /app/dist/apps /app/apps
# For proto schema
COPY --from=builder /app/dist/libs /app/dist/libs
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /bin/grpc_health_probe /bin/grpc_health_probe
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/tsconfig.json /app/

# For migration
COPY --from=builder /app/typeorm.config.ts /app/
COPY --from=builder /app/libs/psql/src/migrations /app/libs/psql/src/migrations

RUN chmod +x /bin/grpc_health_probe

# For test locally
# COPY .env /app/
# CMD [ "node", "/app/apps/public-api/apps/public-api/src/main.js" ]