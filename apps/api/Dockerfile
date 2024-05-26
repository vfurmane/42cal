FROM node:18-alpine as base

RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

RUN pnpm add turbo --global

FROM base as dev

ENV NODE_ENV dev

COPY --chown=node:node . .
RUN turbo prune 42cal-api --docker

FROM dev as install

COPY --chown=node:node --from=dev /app/out/json/ .
COPY --chown=node:node --from=dev /app/out/json/pnpm-lock.yaml ./pnpm-lock.yaml

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM install as build

ENV NODE_ENV production

COPY --chown=node:node --from=install /app/node_modules ./node_modules
COPY --chown=node:node --from=dev /app/out/full/ .

RUN turbo run build --filter=42cal-api...
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

USER node

FROM base as prod

ENV NODE_ENV production# Set Docker as non-root user


COPY --chown=node:node --from=build /app/apps/api/package.json package.json
COPY --chown=node:node --from=build /app/apps/api/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules

USER node

CMD ["npm", "run", "start:prod"]
