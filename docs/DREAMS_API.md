# Dreams API Documentation

The Dreams API provides access to a live AI-generated art stream. Frames are generated on a GPU (typically via RunPod serverless) and streamed to viewers in real-time through a WebSocket-based architecture.

## Overview

**Base URL:** `https://your-domain.com`

The Dreams system consists of:
- **VPS Server (aethera)** - Hosts the API, manages viewer connections, controls GPU lifecycle
- **GPU Worker (dream_gen)** - Generates frames using Stable Diffusion, pushes to VPS
- **Viewers (browsers/clients)** - Connect to consume and display frames

### Key Features
- Real-time frame streaming via WebSocket
- Smart GPU lifecycle management (auto-start when viewers connect, auto-stop when idle)
- Frame caching for instant delivery to new viewers
- Rate limiting to prevent abuse
- Multiple consumption methods (WebSocket, SSE, polling)

---

## REST Endpoints

### GET /dreams

Returns the Dreams viewer HTML page.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `embed` | int | 0 | If `1`, renders minimal embed version without header/footer |

**Example:**
```
GET /dreams?embed=1
```

---

### GET /api/dreams/status

Returns comprehensive status information about the Dreams system.

**Rate Limit:** 60 requests/minute per IP

**Response:**
```json
{
  "status": "ready",
  "gpu": {
    "active": true,
    "state": "running",
    "configured": true,
    "provider": "runpod",
    "uptime_seconds": 3600,
    "frames_received": 12500,
    "error_message": null
  },
  "generation": {
    "frame_count": 12500,
    "current_frame": 12500,
    "current_keyframe": 625,
    "fps": 4.8,
    "session_fps": 4.7,
    "resolution": [1024, 512]
  },
  "viewers": {
    "websocket_count": 3,
    "api_active": true
  },
  "cache": {
    "frames_cached": 30,
    "total_bytes": 1572864
  },
  "playback": {
    "queue_depth": 5,
    "buffer_seconds": 1.0,
    "target_fps": 5.0,
    "actual_fps": 4.8
  }
}
```

**Status Values:**
| Status | Description |
|--------|-------------|
| `idle` | GPU not running, no viewers |
| `starting` | GPU is starting up |
| `ready` | GPU running, frames flowing |
| `stopping` | GPU shutting down |
| `error` | An error occurred |

---

### GET /api/dreams/current

Returns the most recent frame as a WebP image.

**Rate Limit:** 60 requests/minute per IP

**Response Headers:**
| Header | Description |
|--------|-------------|
| `X-Frame-Number` | Sequential frame number |
| `X-Keyframe-Number` | Associated keyframe number |
| `X-Generation-Time-Ms` | Time taken to generate (ms) |
| `Content-Type` | `image/webp` |

**Response Codes:**
| Code | Description |
|------|-------------|
| 200 | Frame returned successfully |
| 204 | No frames available yet |

**Example:**
```bash
curl -o frame.webp https://your-domain.com/api/dreams/current
```

---

### GET /api/dreams/health

Health check endpoint for monitoring and load balancers. Does **not** trigger GPU lifecycle.

**Response (Healthy):**
```json
{
  "status": "healthy",
  "gpu_connected": true,
  "viewer_count": 3,
  "frames_cached": true
}
```

**Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "error": "error message"
}
```

**Response Codes:**
| Code | Description |
|------|-------------|
| 200 | Service healthy |
| 503 | Service unavailable |

---

### GET /api/dreams/frames/recent

Returns metadata (and optionally data) for recent frames from the cache.

**Rate Limit:** 60 requests/minute per IP

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | int | 5 | Number of frames (1-30) |
| `format` | string | `metadata` | `metadata` or `urls` |

**Response (metadata format):**
```json
{
  "frames": [
    {
      "frame_number": 12498,
      "keyframe_number": 625,
      "timestamp": 1702489200.123,
      "generation_time_ms": 180,
      "size_bytes": 48256
    },
    // ... more frames
  ],
  "count": 5
}
```

**Response (urls format):**
```json
{
  "frames": [
    {
      "frame_number": 12498,
      "keyframe_number": 625,
      "timestamp": 1702489200.123,
      "generation_time_ms": 180,
      "size_bytes": 48256,
      "data_url": "data:image/webp;base64,UklGR..."
    }
  ],
  "count": 5
}
```

---

### GET /api/dreams/frame/{frame_number}

Returns a specific frame by number from the cache.

**Rate Limit:** 60 requests/minute per IP

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `frame_number` | int | Frame number to retrieve |

**Response Headers:**
Same as `/api/dreams/current`

**Response Codes:**
| Code | Description |
|------|-------------|
| 200 | Frame returned |
| 404 | Frame not in cache (too old or doesn't exist) |

---

### GET /api/dreams/embed

Returns embeddable code snippets for Dream Window.

**Response:**
```json
{
  "iframe": "<iframe src=\"https://your-domain.com/dreams?embed=1\" width=\"1024\" height=\"512\" frameborder=\"0\" allow=\"autoplay\" loading=\"lazy\"></iframe>",
  "image_url": "https://your-domain.com/api/dreams/current",
  "stream_url": "wss://your-domain.com/ws/dreams",
  "status_url": "https://your-domain.com/api/dreams/status",
  "resolution": {
    "width": 1024,
    "height": 512
  }
}
```

---

## Server-Sent Events (SSE)

### GET /api/dreams/sse

Alternative to WebSocket for simpler clients. Returns an SSE stream with frame updates.

**Rate Limit:** Initial connection counts against rate limit

**Events:**
| Event | Data | Description |
|-------|------|-------------|
| `status` | JSON | Status updates (every 5 seconds) |
| `frame` | JSON | New frame data (base64 encoded) |

**Event: status**
```json
{
  "status": "ready",
  "gpu_connected": true,
  "viewer_count": 3,
  "frame_count": 12500
}
```

**Event: frame**
```json
{
  "frame_number": 12501,
  "data": "UklGRlQ..."  // base64-encoded WebP
}
```

**Example (JavaScript):**
```javascript
const source = new EventSource('/api/dreams/sse');

source.addEventListener('status', (e) => {
  const status = JSON.parse(e.data);
  console.log('Status:', status.status);
});

source.addEventListener('frame', (e) => {
  const frame = JSON.parse(e.data);
  const img = document.getElementById('dream-img');
  img.src = `data:image/webp;base64,${frame.data}`;
});
```

**Note:** SSE polls for new frames at 10 Hz. WebSocket is more efficient for high-frequency updates.

---

## WebSocket Endpoints

### WS /ws/dreams

Primary WebSocket endpoint for browser viewers. Provides real-time frame streaming.

**Connection:**
```javascript
const ws = new WebSocket('wss://your-domain.com/ws/dreams');
ws.binaryType = 'arraybuffer';
```

**Incoming Messages:**

1. **Binary (Frame Data)**
   - First byte: `0x01` (message type)
   - Remaining bytes: WebP image data
   
   ```javascript
   ws.onmessage = (event) => {
     if (event.data instanceof ArrayBuffer) {
       const view = new Uint8Array(event.data);
       if (view[0] === 0x01) {
         const frameData = event.data.slice(1);
         const blob = new Blob([frameData], { type: 'image/webp' });
         // Display blob...
       }
     }
   };
   ```

2. **JSON (Status/Config)**
   ```json
   { "type": "status", "status": "ready", "message": "Dreams flowing...", "viewer_count": 3 }
   { "type": "config", "target_fps": 5.0 }
   { "type": "pong" }
   ```

**Outgoing Messages:**

1. **Ping (Keepalive)**
   ```json
   { "type": "ping" }
   ```

**Example Client:**
```javascript
class DreamClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onmessage = this.handleMessage.bind(this);
    
    // Keepalive ping every 30 seconds
    setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }
  
  handleMessage(event) {
    if (event.data instanceof ArrayBuffer) {
      const view = new Uint8Array(event.data);
      const msgType = view[0];
      
      if (msgType === 0x01) {
        // Frame data
        const frameData = event.data.slice(1);
        this.onFrame(frameData);
      }
    } else {
      // JSON message
      const msg = JSON.parse(event.data);
      if (msg.type === 'status') {
        this.onStatus(msg);
      } else if (msg.type === 'config') {
        this.onConfig(msg);
      }
    }
  }
  
  onFrame(data) {
    // Override this method
  }
  
  onStatus(status) {
    // Override this method
  }
  
  onConfig(config) {
    // Override this method
  }
}
```

---

### WS /ws/gpu (GPU Worker Only)

WebSocket endpoint for the GPU worker. **Requires authentication.**

**Authentication:**
- Set `DREAM_GEN_AUTH_TOKEN` environment variable on both VPS and GPU
- GPU sends token in Authorization header: `Authorization: Bearer <token>`
- If env var is not set, authentication is disabled (development mode only)

**Connection:**
```python
import websockets

async def connect():
    headers = {'Authorization': f'Bearer {auth_token}'}
    ws = await websockets.connect(
        'wss://your-domain.com/ws/gpu',
        additional_headers=headers
    )
```

**Message Protocol:**

All messages are binary with a type byte prefix:

| Type Byte | Direction | Description |
|-----------|-----------|-------------|
| `0x01` | GPU → VPS | Frame data (WebP bytes) |
| `0x02` | GPU → VPS | State snapshot (msgpack) |
| `0x03` | GPU → VPS | Heartbeat |
| `0x04` | GPU → VPS | Status update (JSON) |
| `0x10` | VPS → GPU | Pause generation |
| `0x11` | VPS → GPU | Resume generation |
| `0x12` | VPS → GPU | Save state |
| `0x13` | VPS → GPU | Shutdown |
| `0x14` | VPS → GPU | Load state (msgpack payload) |

**Sending Frames:**
```python
# Frame message: type byte + WebP data
message = bytes([0x01]) + webp_bytes
await ws.send(message)
```

**Sending Status:**
```python
import json
status = {"target_fps": 5.0, "keyframe": 123}
message = bytes([0x04]) + json.dumps(status).encode()
await ws.send(message)
```

**Receiving Control Messages:**
```python
message = await ws.recv()
msg_type = message[0]

if msg_type == 0x10:
    pause_generation()
elif msg_type == 0x11:
    resume_generation()
elif msg_type == 0x12:
    save_state()
elif msg_type == 0x13:
    shutdown_gracefully()
elif msg_type == 0x14:
    state_data = message[1:]
    load_state(state_data)
```

---

## GPU Lifecycle

The Dreams system automatically manages GPU resources:

1. **Viewer Connects** → GPU starts (if not running)
2. **Frames Flow** → GPU sends frames to VPS → VPS broadcasts to all viewers
3. **All Viewers Disconnect** → Grace period timer starts (5 minutes)
4. **Grace Period Expires** → GPU receives shutdown command, saves state, stops

This ensures cost-effective usage: GPU only runs when viewers are present.

**API Activity:** Accessing `/api/dreams/status`, `/api/dreams/current`, or other API endpoints also counts as viewer activity and keeps the GPU warm.

---

## Rate Limiting

Most API endpoints are rate limited to **60 requests per minute per IP**.

**Rate Limit Response:**
```json
{
  "detail": "Rate limit exceeded. Max 60 requests per 60s."
}
```

**HTTP Status:** `429 Too Many Requests`

WebSocket connections are not rate limited (connection frequency is inherently limited).

---

## Example: Simple Polling Client

For environments where WebSocket isn't available:

```python
import requests
import time

BASE_URL = "https://your-domain.com"

def poll_frames():
    last_frame = 0
    
    while True:
        # Check status
        status = requests.get(f"{BASE_URL}/api/dreams/status").json()
        
        if status["status"] != "ready":
            print(f"Status: {status['status']}")
            time.sleep(5)
            continue
        
        # Get current frame
        current = status["generation"]["current_frame"]
        
        if current > last_frame:
            response = requests.get(f"{BASE_URL}/api/dreams/current")
            if response.status_code == 200:
                with open(f"frame_{current}.webp", "wb") as f:
                    f.write(response.content)
                last_frame = current
                print(f"Saved frame {current}")
        
        time.sleep(0.2)  # 5 Hz polling

poll_frames()
```

---

## Example: Display on Canvas (Browser)

```html
<canvas id="dream-canvas" width="1024" height="512"></canvas>

<script>
const canvas = document.getElementById('dream-canvas');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('wss://your-domain.com/ws/dreams');
ws.binaryType = 'arraybuffer';

ws.onmessage = async (event) => {
  if (event.data instanceof ArrayBuffer) {
    const view = new Uint8Array(event.data);
    if (view[0] === 0x01) {
      const frameData = event.data.slice(1);
      const blob = new Blob([frameData], { type: 'image/webp' });
      const img = await createImageBitmap(blob);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }
};
</script>
```

---

## Example: Embed in External Site

```html
<iframe 
  src="https://your-domain.com/dreams?embed=1" 
  width="1024" 
  height="512" 
  frameborder="0"
  loading="lazy">
</iframe>
```

Or use the image endpoint for a static snapshot:
```html
<img 
  src="https://your-domain.com/api/dreams/current" 
  alt="AI Dream" 
  style="width: 100%; max-width: 1024px;"
>
```

---

## Frame Format

All frames are delivered as **WebP images**:
- Resolution: **1024×512** pixels
- Quality: 80-85%
- Average size: 40-70 KB per frame
- Color space: RGB (no alpha)

---

## Error Handling

**WebSocket Disconnection:**
- Implement exponential backoff for reconnection
- Start with 1 second delay, max 30 seconds
- Reset delay counter on successful connection

**No Frames Available:**
- `/api/dreams/current` returns `204 No Content`
- WebSocket sends initial status, then frames when GPU starts

**GPU Not Running:**
- Status will show `idle` or `starting`
- Connecting via WebSocket or hitting API triggers GPU start
- First frame typically arrives within 30-120 seconds

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DREAM_GEN_AUTH_TOKEN` | Shared secret for GPU authentication |
| `RUNPOD_API_KEY` | RunPod API key for GPU lifecycle management |
| `RUNPOD_ENDPOINT_ID` | RunPod serverless endpoint ID |
| `VPS_HOST` | VPS hostname (default: `aetherawi.red`) |

---

## Technical Notes

### Frame Buffering
The VPS maintains a playback queue to smooth network jitter:
- Frames queue at receive rate
- Playback releases at steady FPS
- Client-side also implements frame queue for smooth display

### Presence Tracking
- WebSocket connections tracked individually
- API access refreshes presence timer
- 5-minute grace period after last activity

### Binary Protocol
Using binary WebSocket messages with type prefixes is ~50% more efficient than base64-encoded JSON for image data.

