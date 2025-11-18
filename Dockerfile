# 使用官方 Node.js 18 Alpine 作为基础镜像
FROM node:18-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# 安装依赖（仅生产依赖）
FROM base AS deps
RUN pnpm install --frozen-lockfile --prod

# 开发依赖安装阶段
FROM base AS dev-deps
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# 设置构建环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 构建应用（使用 webpack 构建以符合项目要求）
RUN pnpm build --webpack

# 生产运行阶段
FROM node:18-alpine AS runner
WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 安装 pnpm
RUN npm install -g pnpm

# 复制生产依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 设置环境变量
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# 暴露端口
EXPOSE 3000

# 切换到非 root 用户
USER nextjs

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动应用
CMD ["node", "server.js"]