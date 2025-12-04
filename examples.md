# Realtime Image Optimizer - 完整使用範例

本文檔包含所有可能的使用情境和範例。

## 目錄

1. [基本圖像優化](#基本圖像優化)
2. [模糊占位符](#模糊占位符)
3. [不同圖像來源](#不同圖像來源)
4. [前端整合範例](#前端整合範例)
5. [錯誤處理](#錯誤處理)

---

## 基本圖像優化

### 1. 無操作（直接返回原圖）

```bash
# 本地文件
curl http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4
```

### 2. 僅調整寬度

```bash
# 寬度 800px，保持寬高比
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800
```

### 3. 僅調整高度

```bash
# 高度 600px，保持寬高比
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?h=600"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?h=600
```

### 4. 同時調整寬度和高度

**重要說明：** 當同時設置 `w` 和 `h` 時，默認行為是**保持寬高比**（`fit=inside`）。這意味著圖像會被縮放到適合指定的尺寸範圍內，但不會精確匹配到 800x600。如果原始圖像是正方形（例如 1000x1000），結果可能是 800x800 而不是 800x600。

```bash
# 寬度 800px，高度 600px（保持寬高比，可能不會精確匹配）
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600
```

**如果需要精確尺寸，請使用 `fit` 參數：**

#### 4.1. 使用 `fit=fill`（拉伸到精確尺寸，可能變形）

```bash
# 強制拉伸到 800x600，不保持寬高比
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=fill"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=fill
```

#### 4.2. 使用 `fit=cover`（裁剪以填充整個區域，保持寬高比）

```bash
# 裁剪圖像以填充 800x600，保持寬高比
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=cover"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=cover
```

#### 4.3. 使用 `fit=contain`（完全包含在區域內，保持寬高比）

```bash
# 圖像完全包含在 800x600 內，保持寬高比，可能有空白區域
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=contain"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=contain
```

#### 4.4. 使用 `fit=inside`（默認行為，適合內部，保持寬高比）

```bash
# 默認行為，等同於不指定 fit
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=inside"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=inside
```

#### 4.5. 使用 `fit=outside`（適合外部，保持寬高比）

```bash
# 圖像會被縮放到至少滿足一個維度，可能超出指定尺寸
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=outside"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&h=600&fit=outside
```

**fit 參數說明：**

| fit 值 | 行為 | 是否保持寬高比 | 是否精確匹配尺寸 |
|--------|------|----------------|------------------|
| `inside` (默認) | 縮放到適合內部 | ✅ | ❌ |
| `cover` | 裁剪以填充整個區域 | ✅ | ✅ (通過裁剪) |
| `contain` | 完全包含在區域內 | ✅ | ❌ (可能有空白) |
| `fill` | 拉伸到精確尺寸 | ❌ | ✅ |
| `outside` | 至少滿足一個維度 | ✅ | ❌ (可能超出) |

### 5. 格式轉換

```bash
# 轉換為 WebP 格式
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=webp"

# 轉換為 JPEG 格式
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=jpeg"

# 轉換為 PNG 格式
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=png"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=webp
```

### 6. 調整品質（僅適用於有損格式）

```bash
# 品質 85（1-100）
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?q=85"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?q=85
```

### 7. 組合操作

```bash
# 寬度 800px，WebP 格式，品質 85
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp&q=85"

# 寬度 1200px，高度 800px，JPEG 格式，品質 90
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=1200&h=800&format=jpeg&q=90"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp&q=85
```

---

## 模糊占位符

### 1. 基本模糊占位符（返回圖像）

```bash
# 使用默認參數（寬度 24px，品質 35，模糊強度 35）
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur"

# 瀏覽器訪問（可直接用於 <img> 標籤）
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur
```

**HTML 使用：**
```html
<img src="http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur" />
```

### 2. 自定義模糊占位符參數

```bash
# 自定義寬度 300px，品質 40，模糊強度 30
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&pw=300&pq=40&pb=10"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&pw=32&pq=40&pb=30
```

**參數說明：**
- `pw`: 占位符寬度（像素），默認 24
- `pq`: 占位符品質（1-100），默認 35
- `pb`: 模糊強度（sigma），默認 35

### 3. 模糊占位符 + 圖像優化參數

```bash
# 占位符 + 優化後的圖像 URL（寬度 800px，WebP 格式）
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&w=800&format=webp"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&w=800&format=webp
```

### 4. 獲取 JSON 格式響應

```bash
# 返回 JSON，包含占位符 data URL 和優化圖像 URL
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&format=json"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&format=json
```

**響應格式：**
```json
{
  "type": "blur",
  "placeholderDataUrl": "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
  "optimizedImageUrl": "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp",
  "placeholderWidth": 24,
  "placeholderQuality": 35,
  "blurSigma": 35
}
```

### 5. 自定義參數 + JSON 格式

```bash
# 自定義參數並返回 JSON
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&pw=32&pq=40&pb=30&w=800&format=json"

# 瀏覽器訪問
http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&pw=32&pq=40&pb=30&w=800&format=json
```

---

## 不同圖像來源

### 1. 遠程圖像（Unsplash 範例）

```bash
# 基本用法
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800"

# 帶操作參數
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp&q=85"
```

**說明：** 遠程域名必須在 `src/lib/ipx-client.ts` 的 `httpStorage` 配置中允許。

### 2. 使用別名（Alias）

```bash
# UploadThing 別名示例
curl "http://localhost:3001/optimize/uploadthing/iphfglNoD16WBC350MsUvAIJmH1oCEB0SjclzGgNipWVZb3k?w=800&format=webp"

# 帶模糊占位符
curl "http://localhost:3001/optimize/uploadthing/iphfglNoD16WBC350MsUvAIJmH1oCEB0SjclzGgNipWVZb3k?w=800&format=webp&placeholder=blur"

# 瀏覽器訪問
http://localhost:3001/optimize/uploadthing/iphfglNoD16WBC350MsUvAIJmH1oCEB0SjclzGgNipWVZb3k?w=800&format=webp
```

**說明：** 別名在 `src/lib/ipx-client.ts` 中配置。

### 3. 直接 HTTP URL（URL 編碼說明）

```bash
# URL 需要先進行編碼
# 原始 URL: https://images.unsplash.com/photo-1506905925346-21bda4d32df4
# 編碼後: https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4

curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp"

# 帶模糊占位符
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&w=800"

# 瀏覽器訪問（瀏覽器會自動編碼）
http://localhost:3001/optimize/https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&format=webp
```

**說明：** 遠程域名必須在 `src/lib/ipx-client.ts` 的 `httpStorage` 配置中允許。

### 4. IPX 原生格式（帶操作前綴）

```bash
# 使用 IPX 操作前綴格式
curl "http://localhost:3001/optimize/w_800/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4"

# 組合操作
curl "http://localhost:3001/optimize/w_800,h_600,format_webp/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4"

# 瀏覽器訪問
http://localhost:3001/optimize/w_800/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4
```

---

## 前端整合範例

### Vanilla JavaScript

#### 基本圖像優化

```javascript
// 簡單的圖像優化 URL
const optimizedImageUrl = 
  'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp&q=85';

// 在 HTML 中使用
const img = document.createElement('img');
img.src = optimizedImageUrl;
document.body.appendChild(img);
```

#### 模糊占位符（直接圖像）

```javascript
// 獲取模糊占位符圖像
const placeholderUrl = 
  'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur';

const img = document.createElement('img');
img.src = placeholderUrl;
img.style.filter = 'blur(20px)';
img.style.transition = 'filter 0.3s';
document.body.appendChild(img);
```

#### 模糊占位符（JSON 響應）

```javascript
async function loadImageWithPlaceholder(imagePath) {
  const baseUrl = 'http://localhost:3001/optimize/_';
  const placeholderUrl = `${baseUrl}/${imagePath}?placeholder=blur&format=json&w=800&format=webp`;
  
  try {
    // 獲取占位符數據
    const response = await fetch(placeholderUrl);
    const { placeholderDataUrl, optimizedImageUrl } = await response.json();
    
    // 創建圖像元素
    const img = document.createElement('img');
    img.src = placeholderDataUrl;
    img.style.filter = 'blur(20px)';
    img.style.transition = 'filter 0.3s';
    document.body.appendChild(img);
    
    // 加載完整圖像
    const fullImage = new Image();
    fullImage.onload = () => {
      img.src = optimizedImageUrl;
      img.style.filter = 'blur(0)';
    };
    fullImage.src = optimizedImageUrl;
    
    return img;
  } catch (error) {
    console.error('Failed to load image:', error);
    throw error;
  }
}

// 使用
loadImageWithPlaceholder('https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4');
```

#### 錯誤處理

```javascript
async function loadOptimizedImage(imagePath, options = {}) {
  const { width = 800, format = 'webp', quality = 85 } = options;
  const url = `http://localhost:3001/optimize/_/${imagePath}?w=${width}&format=${format}&q=${quality}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Image optimization failed:', error);
    // 返回原始圖像 URL 作為後備
    return `http://localhost:3001/optimize/_/${imagePath}`;
  }
}
```

### React 範例

#### 基本優化圖像組件

```tsx
import { useState, useEffect } from 'react';

type OptimizedImageProps = {
  src: string;
  width?: number;
  height?: number;
  format?: string;
  quality?: number;
  alt?: string;
  className?: string;
};

const OptimizedImage = ({
  src,
  width,
  height,
  format = 'webp',
  quality = 85,
  alt = '',
  className,
}: OptimizedImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const buildUrl = () => {
      const baseUrl = `http://localhost:3001/optimize/_/${src}`;
      const params = new URLSearchParams();
      
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      if (format) params.set('format', format);
      if (quality) params.set('q', quality.toString());
      
      return `${baseUrl}?${params.toString()}`;
    };

    setImageUrl(buildUrl());
  }, [src, width, height, format, quality]);

  if (error) {
    return <div>Failed to load image: {error.message}</div>;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        setError(new Error('Image load failed'));
      }}
    />
  );
};

export default OptimizedImage;
```

#### 模糊占位符組件

```tsx
import { useState, useEffect } from 'react';

type BlurPlaceholderImageProps = {
  src: string;
  width?: number;
  format?: string;
  placeholderWidth?: number;
  placeholderQuality?: number;
  blurSigma?: number;
  alt?: string;
  className?: string;
};

const BlurPlaceholderImage = ({
  src,
  width = 800,
  format = 'webp',
  placeholderWidth = 24,
  placeholderQuality = 35,
  blurSigma = 35,
  alt = '',
  className,
}: BlurPlaceholderImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);

        // 構建占位符 URL
        const placeholderParams = new URLSearchParams({
          placeholder: 'blur',
          format: 'json',
          pw: placeholderWidth.toString(),
          pq: placeholderQuality.toString(),
          pb: blurSigma.toString(),
          w: width.toString(),
          format: format,
        });

        const placeholderUrl = `http://localhost:3001/optimize/_/${src}?${placeholderParams.toString()}`;
        
        // 獲取占位符數據
        const response = await fetch(placeholderUrl);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setPlaceholder(data.placeholderDataUrl);

        // 加載完整圖像
        const fullImage = new Image();
        fullImage.onload = () => {
          setImageSrc(data.optimizedImageUrl);
          setLoading(false);
        };
        fullImage.onerror = () => {
          throw new Error('Failed to load full image');
        };
        fullImage.src = data.optimizedImageUrl;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    loadImage();
  }, [src, width, format, placeholderWidth, placeholderQuality, blurSigma]);

  if (error) {
    return <div>Failed to load image: {error.message}</div>;
  }

  if (!placeholder) {
    return <div>Loading...</div>;
  }

  return (
    <img
      src={imageSrc || placeholder}
      alt={alt}
      className={className}
      style={{
        filter: imageSrc ? 'blur(0)' : 'blur(20px)',
        transition: 'filter 0.3s ease-in-out',
      }}
    />
  );
};

export default BlurPlaceholderImage;
```

#### 使用範例

```tsx
import OptimizedImage from './OptimizedImage';
import BlurPlaceholderImage from './BlurPlaceholderImage';

function App() {
  return (
    <div>
      <h2>基本優化圖像</h2>
      <OptimizedImage
        src="https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4"
        width={800}
        format="webp"
        quality={85}
        alt="Unsplash Mountain Image"
      />

      <h2>模糊占位符圖像</h2>
      <BlurPlaceholderImage
        src="https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4"
        width={1200}
        format="webp"
        placeholderWidth={32}
        placeholderQuality={40}
        blurSigma={30}
        alt="Unsplash Mountain Image with Blur Placeholder"
      />

      <h2>遠程圖像（別名）</h2>
      <OptimizedImage
        src="uploadthing/iphfglNoD16WBC350MsUvAIJmH1oCEB0SjclzGgNipWVZb3k"
        width={800}
        format="webp"
        alt="Remote Image"
      />
    </div>
  );
}

export default App;
```

### Next.js 範例

#### 圖像優化組件

```tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type OptimizedImageProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
};

const OptimizedImage = ({
  src,
  width,
  height,
  alt,
  className,
  quality = 85,
  format = 'webp',
}: OptimizedImageProps) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams({
      w: width.toString(),
      h: height.toString(),
      format,
      q: quality.toString(),
    });
    
    setOptimizedSrc(`http://localhost:3001/optimize/_/${src}?${params.toString()}`);
  }, [src, width, height, format, quality]);

  if (!optimizedSrc) return null;

  return (
    <Image
      src={optimizedSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      unoptimized
    />
  );
};

export default OptimizedImage;
```

---

## 錯誤處理

### 常見錯誤情況

#### 1. 缺少圖像路徑

```bash
curl http://localhost:3001/optimize/
```

**響應：**
```json
{
  "error": "Missing image path"
}
```

**狀態碼：** 400

#### 2. 圖像不存在

```bash
curl "http://localhost:3001/optimize/_/non-existent.jpg?w=800"
```

**響應：**
```json
{
  "error": "Image processing failed",
  "details": "Error message from IPX"
}
```

**狀態碼：** 500

#### 3. 無效的參數值

```bash
# 品質超出範圍（應該在 1-100 之間）
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?q=150"
```

**處理：** IPX 會自動處理或返回錯誤。

#### 4. 遠程圖像訪問失敗

```bash
# 域名未在允許列表中
curl "http://localhost:3001/optimize/https%3A%2F%2Funauthorized-domain.com%2Fimage.jpg"
```

**響應：**
```json
{
  "error": "Image processing failed",
  "details": "Domain not allowed"
}
```

**狀態碼：** 500

### 前端錯誤處理範例

```typescript
type ImageOptimizationResult = 
  | { ok: true; url: string }
  | { ok: false; error: string };

async function optimizeImage(
  imagePath: string,
  options: {
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
  } = {},
): Promise<ImageOptimizationResult> {
  try {
    const params = new URLSearchParams();
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.format) params.set('format', options.format);
    if (options.quality) params.set('q', options.quality.toString());

    const url = `http://localhost:3001/optimize/_/${imagePath}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }));
      return { ok: false, error: errorData.error || 'Unknown error' };
    }

    return { ok: true, url };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 使用
const result = await optimizeImage('https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4', { width: 800 });

if (result.ok) {
  console.log('Optimized image URL:', result.url);
} else {
  console.error('Optimization failed:', result.error);
}
```

---

## 完整使用場景總結

### 場景 1: 響應式圖像

```typescript
// 為不同設備生成不同尺寸的圖像
const responsiveImages = {
  mobile: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=400&format=webp',
  tablet: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp',
  desktop: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=1200&format=webp',
};
```

### 場景 2: 圖像畫廊

```typescript
// 縮略圖 + 完整圖像
const galleryImage = {
  thumbnail: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=200&h=200&format=webp&q=75',
  full: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=1920&format=webp&q=90',
};
```

### 場景 3: 漸進式加載

```typescript
// 模糊占位符 → 低品質預覽 → 完整圖像
const progressiveLoad = {
  placeholder: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur',
  preview: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=400&format=webp&q=50',
  full: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=1200&format=webp&q=90',
};
```

### 場景 4: 格式適配

```typescript
// 根據瀏覽器支持選擇格式
const formatAdaptive = {
  webp: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=webp',
  jpeg: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=jpeg',
  png: 'http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=png',
};
```

---

## 測試命令集合

### 基本測試

```bash
# 測試本地圖像
curl -I "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4"

# 測試寬度調整
curl -I "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800"

# 測試格式轉換
curl -I "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?format=webp"

# 測試組合操作
curl -I "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?w=800&format=webp&q=85"
```

### 模糊占位符測試

```bash
# 測試默認占位符
curl -I "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur"

# 測試自定義占位符
curl -I "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&pw=32&pq=40&pb=30"

# 測試 JSON 響應
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?placeholder=blur&format=json"
```

### 錯誤測試

```bash
# 測試缺少路徑
curl "http://localhost:3001/optimize/"

# 測試不存在的圖像
curl "http://localhost:3001/optimize/_/non-existent.jpg"

# 測試無效參數
curl "http://localhost:3001/optimize/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1506905925346-21bda4d32df4?q=invalid"
```

---

## 注意事項

1. **緩存策略**: 所有響應都包含 `Cache-Control` 標頭，瀏覽器和 CDN 會緩存圖像 60 秒。

2. **性能考慮**: 
   - 首次請求會進行圖像處理，後續相同請求會使用緩存
   - 模糊占位符處理速度很快，適合即時顯示

3. **安全性**:
   - 遠程圖像域名必須在配置中允許
   - 建議在生產環境中添加身份驗證和速率限制

4. **URL 編碼**:
   - 直接使用 HTTP URL 時需要進行 URL 編碼
   - 瀏覽器會自動處理，但手動構建 URL 時需要注意

5. **格式支持**:
   - WebP 提供最佳壓縮比
   - JPEG 兼容性最好
   - PNG 支持透明度

