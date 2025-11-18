# Docker 部署指南

本文档说明如何使用 Docker 部署 Smart Diagram 应用。

## 🐳 镜像信息

- **Registry:** GitHub Container Registry (ghcr.io)
- **Repository:** `ghcr.io/your-username/smart-diagram`
- **Supported Architectures:** linux/amd64, linux/arm64

## 🚀 快速开始

### 1. 使用预构建镜像（推荐）

```bash
# 拉取最新镜像
docker pull ghcr.io/your-username/smart-diagram:latest

# 运行容器
docker run -d \
  --name smart-diagram \
  -p 3000:3000 \
  -e NODE_ENV=production \
  ghcr.io/your-username/smart-diagram:latest
```

### 2. 使用 Docker Compose

```bash
# 下载 docker-compose.yml
curl -O https://raw.githubusercontent.com/your-username/smart-diagram/main/docker-compose.yml

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 3. 生产环境部署

```bash
# 复制生产环境配置
cp .env.prod.example .env.prod

# 编辑配置文件
vim .env.prod

# 使用生产配置启动
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 配置选项

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `SERVER_LLM_TYPE` | 服务端 LLM 类型 | - |
| `SERVER_LLM_API_KEY` | 服务端 API 密钥 | - |
| `SERVER_LLM_MODEL` | 服务端模型 | - |
| `ACCESS_PASSWORD` | 访问密码 | - |

### 卷挂载

```bash
# 数据持久化
-v /your/data/path:/app/data

# 日志持久化
-v /your/logs/path:/app/logs

# 自定义配置
-v /your/config/.env:/app/.env.local
```

## 🔒 安全配置

### 1. 非 Root 用户运行

镜像默认使用非 root 用户（UID:1001）运行，确保安全性。

### 2. 只读文件系统

生产环境建议使用只读文件系统：

```yaml
read_only: true
tmpfs:
  - /tmp:noexec,nosuid,size=100m
  - /var/run:noexec,nosuid,size=100m
```

### 3. 资源限制

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 1G
    reservations:
      cpus: '1.0'
      memory: 512M
```

## 🏥 健康检查

容器包含内置健康检查：

```bash
# 手动执行健康检查
curl -f http://localhost:3000/api/health

# 响应示例
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "commit": "abc123",
  "uptime": 3600,
  "memory": {
    "rss": 67108864,
    "heapTotal": 33554432,
    "heapUsed": 20971520,
    "external": 1048576
  }
}
```

## 📊 监控和日志

### 1. 查看日志

```bash
# Docker 日志
docker logs -f smart-diagram

# Docker Compose 日志
docker-compose logs -f smart-diagram
```

### 2. 监控指标

应用通过 `/api/health` 端点提供基本监控数据：

- 应用状态
- 内存使用情况
- 运行时间
- 版本信息

## 🔄 更新部署

### 自动更新

```bash
# 拉取最新镜像
docker-compose pull

# 重新创建容器
docker-compose up -d --force-recreate

# 清理旧镜像
docker image prune -f
```

### 手动更新

```bash
# 停止容器
docker stop smart-diagram

# 拉取新镜像
docker pull ghcr.io/your-username/smart-diagram:latest

# 启动新容器
docker run -d --name smart-diagram \
  -p 3000:3000 \
  ghcr.io/your-username/smart-diagram:latest
```

## 🌐 反向代理配置

### Nginx 示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Traefik 示例

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.smart-diagram.rule=Host(`your-domain.com`)"
  - "traefik.http.routers.smart-diagram.tls=true"
  - "traefik.http.routers.smart-diagram.tls.certresolver=letsencrypt"
```

## 🔍 故障排除

### 常见问题

1. **容器无法启动**
   ```bash
   # 检查日志
   docker logs smart-diagram

   # 检查环境变量
   docker exec smart-diagram env | grep -E "(NODE_ENV|SERVER_)"
   ```

2. **健康检查失败**
   ```bash
   # 手动测试健康检查
   docker exec smart-diagram curl -f http://localhost:3000/api/health
   ```

3. **内存不足**
   ```bash
   # 监控内存使用
   docker stats smart-diagram
   ```

### 性能优化

1. **启用 HTTP/2**
2. **配置 CDN**
3. **启用压缩**
4. **设置适当的缓存头**

## 📋 生产部署检查清单

- [ ] 使用专用的生产环境配置文件
- [ ] 设置适当的资源限制
- [ ] 配置健康检查
- [ ] 启用日志收集
- [ ] 设置监控和告警
- [ ] 配置备份策略
- [ ] 使用 HTTPS
- [ ] 配置防火墙规则
- [ ] 定期更新镜像
- [ ] 测试灾难恢复计划

## 🆘 获取帮助

如果遇到部署问题：

1. 查看 [GitHub Issues](https://github.com/your-username/smart-diagram/issues)
2. 检查 [项目文档](https://github.com/your-username/smart-diagram)
3. 提交新的 Issue 并提供详细错误信息

---

**注意:** 请将 `your-username` 替换为实际的 GitHub 用户名或组织名。