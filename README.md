# ClassEnrollBot Frontend

`ClassEnrollBot` 的前端應用，使用 React、TypeScript、Vite、Tailwind CSS 與 React Query，提供登入、課程追蹤、NTNU 帳號管理與操作狀態監控介面。

## 技術棧

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Axios

## 主要功能

- 使用者登入與註冊流程
- 儀表板與課程追蹤管理
- NTNU 帳號新增、刪除與測試登入
- WebSocket 即時操作日誌顯示
- Docker/Nginx 生產部署設定

## 專案結構

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── hooks/
│   ├── pages/
│   ├── stores/
│   └── types/
├── Dockerfile
├── Dockerfile.dev
├── nginx.conf
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 本地開發

```bash
npm install
npm run dev
```

預設開發伺服器使用 `http://localhost:5173`，並透過 `vite.config.ts` 代理 `/api` 到後端服務。

## 建置與檢查

```bash
npm run build
npm run lint
```

## 環境變數

主要設定：

- `VITE_API_URL`

如果你是在 parent repo `ClassEnrollBot` 內啟動完整環境，可從 parent repo 執行：

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up frontend
```

更多專案背景與系統文檔可參考主專案：

- https://github.com/Camel031/ClassEnrollBot/blob/main/README.md
- https://github.com/Camel031/ClassEnrollBot/blob/main/docs/development.md
- https://github.com/Camel031/ClassEnrollBot/blob/main/ARCHITECTURE.md
