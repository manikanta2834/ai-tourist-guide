# Free Tier APIs for AI Tourist Guide

## Map APIs (Free Alternatives)

### 1. Leaflet + OpenStreetMap (RECOMMENDED - Completely Free)
- **Cost**: FREE forever
- **Limit**: No limits
- **Setup**: No API key required

```bash
npm install leaflet react-leaflet
```

Replace Mapbox with Leaflet in `MapContainer.tsx`.

### 2. Mapbox (Current Implementation)
- **Free tier**: 50,000 loads/month
- **Get token**: https://account.mapbox.com/access-tokens/

### 3. Google Maps
- **Free tier**: $200 credit/month (~28,000 loads)
- **Requires**: Google Cloud account + billing

### 4. HERE Maps
- **Free tier**: 250,000 transactions/month
- **Get key**: https://developer.here.com/

---

## Weather APIs (Free)

### OpenWeatherMap
- **Free tier**: 1,000 calls/day
- **Get key**: https://openweathermap.org/api

---

## AI/ML (Free)

### TensorFlow.js (On-device)
- **Cost**: FREE
- **No API calls** - runs in browser/Node.js

### Hugging Face Inference API
- **Free tier**: Rate limited
- **Get key**: https://huggingface.co/settings/tokens

---

## Recommendation

For hackathon/personal projects:
1. **Maps**: Leaflet + OpenStreetMap (zero setup, zero cost)
2. **Weather**: OpenWeatherMap free tier
3. **AI**: TensorFlow.js (runs locally)
