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

### Example Requests

**Local file:**
```
http://localhost:3001/optimize/_/demo-image.jpg
```

**With width constraint:**
```
http://localhost:3001/optimize/_/demo-image.jpg?w=800
```

**With multiple operations:**
```
http://localhost:3001/optimize/_/demo-image.jpg?w=800&format=webp&q=85
```

**Remote image via alias:**
```
http://localhost:3001/optimize/uploadthing/iphfglNoD16WBC350MsUvAIJmH1oCEB0SjclzGgNipWVZb3k?w=800&format=webp
```

**Direct HTTP URL:**
```
http://localhost:3001/optimize/w_800/https://example.com/image.jpg
```

## Blur Placeholder Flow

The blur placeholder feature enables progressive image loading by generating a tiny, heavily blurred preview image that can be displayed immediately while the full-resolution image loads in the background.

### Request Format

Add `placeholder=blur` to any optimization request:

```
http://localhost:3001/optimize/_/demo-image.jpg?placeholder=blur
```

### Optional Tuning Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `pw` | `24` | Placeholder width in pixels |
| `pq` | `35` | Placeholder quality (1-100) |
| `pb` | `35` | Blur sigma intensity |
| `format` | `image` | Response format: `image` (default) or `json` |

**Example - Get blur image directly (default behavior):**
```
http://localhost:3001/optimize/_/demo-image.jpg?placeholder=blur
```

**Example with custom parameters:**
```
http://localhost:3001/optimize/_/demo-image.jpg?placeholder=blur&pw=32&pq=40&pb=30
```

**Example with third-party image (via alias):**
```
http://localhost:3001/optimize/uploadthing/iphfglNoD16WBC350MsUvAIJmH1oCEB0SjclzGgNipWVZb3k?w=800&format=webp&placeholder=blur
```

**Example with third-party image (direct URL - URL encode first):**
```
http://localhost:3001/optimize/https%3A%2F%2Fexample.com%2Fimage.jpg?placeholder=blur&w=800
```

### Response Format

**By default**, when `placeholder=blur` is included, the API returns the blurred image directly (binary image data). This allows you to use it directly in an `<img>` tag:

```html
<img src="http://localhost:3001/optimize/_/demo-image.jpg?placeholder=blur" />
```

**To get JSON response instead**, add `format=json`:

```
http://localhost:3001/optimize/_/demo-image.jpg?placeholder=blur&format=json
```

This returns:
```json
{
  "type": "blur",
  "placeholderDataUrl": "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
  "optimizedImageUrl": "http://localhost:3001/optimize/_/demo-image.jpg?w=800&format=webp",
  "placeholderWidth": 24,
  "placeholderQuality": 35,
  "blurSigma": 35
}
```

### Frontend Integration

Here's how to use the blur placeholder in your web application:

```javascript
async function loadImageWithPlaceholder(imageUrl) {
  // Request blur placeholder
  const placeholderResponse = await fetch(
    `${imageUrl}?placeholder=blur&w=800&format=webp`
  );
  const { placeholderDataUrl, optimizedImageUrl } = await placeholderResponse.json();

  // Display placeholder immediately
  const img = document.createElement('img');
  img.src = placeholderDataUrl;
  img.style.filter = 'blur(20px)';
  img.style.transition = 'filter 0.3s';

  // Load full image in background
  const fullImage = new Image();
  fullImage.onload = () => {
    img.src = optimizedImageUrl;
    img.style.filter = 'blur(0)';
  };
  fullImage.src = optimizedImageUrl;

  return img;
}
```

**React Example:**

```tsx
import { useState, useEffect } from 'react';

function OptimizedImage({ src, width, ...props }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const placeholderUrl = `${src}?placeholder=blur&w=${width}`;
      const response = await fetch(placeholderUrl);
      const { placeholderDataUrl, optimizedImageUrl } = await response.json();

      setPlaceholder(placeholderDataUrl);

      const img = new Image();
      img.onload = () => setImageSrc(optimizedImageUrl);
      img.src = optimizedImageUrl;
    };

    loadImage();
  }, [src, width]);

  if (!placeholder) return <div>Loading...</div>;

  return (
    <img
      src={imageSrc || placeholder}
      style={{
        filter: imageSrc ? 'blur(0)' : 'blur(20px)',
        transition: 'filter 0.3s',
      }}
      {...props}
    />
  );
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success (image or JSON response)
- **400**: Bad Request (missing image path or invalid parameters)
- **500**: Internal Server Error (image processing failed)

Error responses follow this format:

```json
{
  "error": "Error message description"
}
```

## Caching

Optimized images include cache headers for efficient content delivery:

```
Cache-Control: public, max-age=60, stale-while-revalidate=60
```

This allows browsers and CDNs to cache images for 60 seconds, with an additional 60-second grace period for stale content while fresh content is being fetched.

## Configuration

### Image Storage

Storage backends are configured in `src/lib/ipx-client.ts`:

- **Local Filesystem**: Images in the `./static` directory
- **HTTP Storage**: Remote images from configured domains
- **Aliases**: Short names for common image sources (e.g., `uploadthing`)

To customize storage or add new aliases, modify the IPX configuration in `src/lib/ipx-client.ts`.

## Development

### Project Structure

```
src/
  ├── index.ts              # Application entry point
  ├── routes/
  │   └── optimize.ts       # Image optimization route handler
  └── lib/
      ├── ipx-client.ts      # IPX configuration and client
      └── image-operations.ts # Image operation utilities
```

### Adding New Placeholder Types

To add support for additional placeholder types (e.g., dominant color, SVG LQIP):

1. Add placeholder type constants in `src/lib/image-operations.ts`
2. Create a builder function similar to `buildBlurPlaceholderOperations`
3. Add handling logic in `src/routes/optimize.ts`

## License

MIT
