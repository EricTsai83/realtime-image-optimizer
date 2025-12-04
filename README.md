# Realtime Image Optimizer

A high-performance image optimization service built with Hono, Bun, and IPX. Provides real-time image processing with support for blur placeholders, enabling web applications to display lightweight preview images instantly before loading full-resolution assets.

## Features

- **Real-time Image Processing**: On-the-fly image optimization using IPX
- **Blur Placeholder Support**: Generate tiny, blurred preview images for progressive loading
- **Multiple Storage Backends**: Support for local filesystem and HTTP-based image sources
- **Flexible Operations**: Resize, format conversion, quality adjustment, and blur effects
- **Smart Caching**: HTTP cache headers with stale-while-revalidate strategy
- **Type-Safe**: Built with TypeScript for better developer experience

## Architecture

This service is built on:

- **[Hono](https://hono.dev/)**: Ultra-fast web framework
- **[Bun](https://bun.sh/)**: JavaScript runtime and package manager
- **[IPX](https://github.com/unjs/ipx)**: High-performance image processing library

The service accepts image optimization requests, processes them through IPX, and returns optimized images or blur placeholder metadata depending on the request parameters.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version recommended)

### Installation

```sh
bun install
```

### Running the Development Server

```sh
bun run dev
```

The server will start on `http://localhost:3001` by default.

## API Usage

### Base Endpoint Format

```
/optimize/<operations>/<image-source>
```

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `w` | Image width in pixels | `w=800` |
| `h` | Image height in pixels | `h=600` |
| `format` | Output format (webp, jpeg, png, etc.) | `format=webp` |
| `q` | Quality (1-100, for lossy formats) | `q=85` |
| `fit` | Resize fit mode (cover, contain, fill, inside, outside) | `fit=cover` |
| `placeholder` | Placeholder type (`blur`) | `placeholder=blur` |

### Quick Examples

```bash
# 基本圖像優化
http://localhost:3001/optimize/_/demo-image.jpg?w=800&format=webp&q=85

# 模糊占位符
http://localhost:3001/optimize/_/demo-image.jpg?placeholder=blur

# 遠程圖像（URL 編碼）
http://localhost:3001/optimize/https%3A%2F%2Fexample.com%2Fimage.jpg?w=800
```

📖 **完整使用範例請參考 [examples.md](./examples.md)**，包含：
- 所有參數組合範例
- 模糊占位符詳細用法
- 前端整合範例（Vanilla JS、React、Next.js）
- 錯誤處理範例

## Error Handling

| Status Code | Description |
|-------------|-------------|
| **200** | Success |
| **400** | Bad Request (missing path or invalid parameters) |
| **500** | Internal Server Error (processing failed) |

## Configuration

Storage backends are configured in `src/lib/ipx-client.ts`:

- **Local Filesystem**: Images in the `./static` directory
- **HTTP Storage**: Remote images from configured domains
- **Aliases**: Short names for common image sources

## Project Structure

```
src/
  ├── index.ts               # Application entry point
  ├── routes/
  │   └── optimize.ts        # Image optimization route handler
  └── lib/
      ├── ipx-client.ts      # IPX configuration and client
      └── image-operations.ts # Image operation utilities
```

## License

MIT
