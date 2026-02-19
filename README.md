# Retroboard FE

Retroboard FE, ekiplerin sprint retrospektiflerini hızlıca başlatıp birlikte yönetebilmesi için geliştirilmiş bir React uygulamasıdır.

Uygulama ile:
- Yeni bir retro board oluşturabilirsiniz.
- Board detayında kart ekleyebilir, kart taşıyabilir, beğeni verebilir ve yorum yazabilirsiniz.
- Değişiklikleri SSE (Server-Sent Events) ile gerçek zamanlı olarak görebilirsiniz.

## Teknolojiler

- React 18
- Vite 5
- TanStack Router
- TanStack Query
- Tailwind CSS 4
- Lucide React

## Öne Çıkan Özellikler

- Board oluşturma ve board detayına otomatik yönlendirme
- 3 kolonlu retro akışı (`Başlangıç`, `Durdur`, `Devam et`)
- Kart ekleme, silme ve sürükle-bırak ile kolonlar arası taşıma
- Kart beğenme (aynı tarayıcı oturumunda tekrar beğenme engeli)
- Kart altına yorum ekleme
- Kullanıcı adı alma modalı (localStorage)
- React Query ile optimistic update yaklaşımı
- SSE ile canlı veri akışı (`/api/boards/:id/stream`)

## Proje Yapısı

```bash
src/
  api/
    client.js            # API istemcisi, base URL ve request yardımcıları
    domain/              # Endpoint bazlı istek fonksiyonları
    queries/             # React Query hook'ları
  components/            # UI bileşenleri
  hooks/                 # Sayfa davranışlarını yöneten özel hook'lar
  pages/
    BoardDetailPage.jsx  # Board detay ekranı
  routes/                # TanStack Router dosya tabanlı route'lar
  utils/                 # Yardımcı fonksiyonlar
```

## Kurulum

```bash
npm install
```

## Ortam Değişkeni

`.env` içinde backend adresini tanımlayın:

```env
VITE_API_URL=http://localhost:1330
```

Uygulama istekleri bu URL'in `/api` altına gider.

## Çalıştırma

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## API Notları

- Frontend varsayılan olarak `http://localhost:1330/api` adresine istek atar.
- Beklenen örnek istek/yanıtlar için `API_REQUESTS.md` dosyasına bakabilirsiniz.

## Route'lar

- `/` : Board oluşturma ekranı
- `/board/:boardID` : Board detay ekranı
