export const mockBoards = [
  {
    id: "a0",
    name: "Sprint 12 - Demo hazırlığı",
    date: "2024-05-10 14:00",
    inviteRequired: true,
    participants: ["Eren", "Ayşe", "Mert", "Deniz"],
    columns: [
      {
        id: "keep",
        title: "İyi gidenler",
        cards: [
          {
            id: "c1",
            text: "CI süreleri 2x hızlandı",
            votes: 3,
            comments: [
              {
                id: "cm1",
                author: "Eren",
                text: "Önbellek ayarları dokümana eklendi mi?",
                createdAt: "2024-05-09 12:10",
              },
              {
                id: "cm2",
                author: "Deniz",
                text: "Yeni runner'lar ne kadar yükte dayanıyor?",
                createdAt: "2024-05-09 13:05",
              },
              {
                id: "cm1-1",
                author: "Ayşe",
                text: "README'ye linkledim, göz atıp ekleme yapabiliriz.",
                createdAt: "2024-05-09 12:30",
              },
              {
                id: "cm2-1",
                author: "Mert",
                text: "%80 CPU'da 30dk sorunsuz, grafiği Slack'e atarım.",
                createdAt: "2024-05-09 13:40",
              },
            ],
          },
          {
            id: "c2",
            text: "Yeni onboarding dokümanı işimizi kolaylaştırdı",
            votes: 2,
            comments: [
              {
                id: "cm3",
                author: "Mert",
                text: "Girişte ekran görüntüsü eklenirse süper olur.",
                createdAt: "2024-05-08 17:45",
              },
              {
                id: "cm3-1",
                author: "Deniz",
                text: "Burak'ın videosunu da bağlayalım mı?",
                createdAt: "2024-05-08 18:00",
              },
            ],
          },
        ],
      },
      {
        id: "problem",
        title: "Geliştirilecek",
        cards: [
          {
            id: "c3",
            text: "Prod veri maskeleme eksik",
            votes: 4,
            comments: [
              {
                id: "cm4",
                author: "Ayşe",
                text: "KV tarafı kaldı, kim üstleniyor?",
                createdAt: "2024-05-10 09:15",
              },
              {
                id: "cm5",
                author: "Zeynep",
                text: "Maskelenmiş veri ile e2e koşabilir miyiz?",
                createdAt: "2024-05-10 10:00",
              },
              {
                id: "cm4-1",
                author: "Eren",
                text: "Bugün bakacağım, test datasını da ekleyeceğim.",
                createdAt: "2024-05-10 09:30",
              },
            ],
          },
          {
            id: "c4",
            text: "Toplantı notları dağınık",
            votes: 1,
            comments: [
              {
                id: "cm6",
                author: "Deniz",
                text: "Notion'a şablon açıp sabitleyelim mi?",
                createdAt: "2024-05-09 11:20",
              },
            ],
          },
        ],
      },
      {
        id: "action",
        title: "Aksiyonlar",
        cards: [
          {
            id: "c5",
            text: "Maskeleme scriptini bu sprint tamamla",
            votes: 2,
            comments: [
              {
                id: "cm7",
                author: "Mert",
                text: "Cron'a alacak mıyız yoksa manuel mi?",
                createdAt: "2024-05-10 08:20",
              },
              {
                id: "cm7-1",
                author: "Ayşe",
                text: "İlk hafta manuel, sonra cron PR açacağım.",
                createdAt: "2024-05-10 08:45",
              },
            ],
          },
          {
            id: "c6",
            text: "Retro çıktıları için tek doküman aç",
            votes: 1,
            comments: [
              {
                id: "cm8",
                author: "Eren",
                text: "Örnek sayfa açtım, herkes doldurabilir.",
                createdAt: "2024-05-09 16:00",
              },
              {
                id: "cm8-1",
                author: "Deniz",
                text: "Template'i sabitledim, link Slack'te.",
                createdAt: "2024-05-09 16:30",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "a1",
    name: "Ürün keşif notları",
    date: "2024-05-08 10:30",
    inviteRequired: false,
    participants: ["Zeynep", "Onur"],
    columns: [
      {
        id: "keep",
        title: "Öne çıkanlar",
        cards: [
          {
            id: "c7",
            text: "Kullanıcılar hızlı arama istiyor",
            votes: 5,
            comments: [
              {
                id: "cm9",
                author: "Onur",
                text: "Autocomplete için hangi kütüphane?",
                createdAt: "2024-05-07 15:10",
              },
              {
                id: "cm9-1",
                author: "Zeynep",
                text: "Aşağıda c10 aramalarını da cache'leyelim.",
                createdAt: "2024-05-07 15:25",
              },
            ],
          },
        ],
      },
      {
        id: "problem",
        title: "Sorular",
        cards: [
          {
            id: "c8",
            text: "Hangi plan ücretsiz olacak?",
            votes: 2,
            comments: [
              {
                id: "cm10",
                author: "Zeynep",
                text: "Freemium için limitleri netleştirelim mi?",
                createdAt: "2024-05-06 10:00",
              },
              {
                id: "cm10-1",
                author: "Onur",
                text: "A/B datası gelsin, sonra karar verelim.",
                createdAt: "2024-05-06 10:30",
              },
            ],
          },
        ],
      },
      {
        id: "action",
        title: "Denenecek",
        cards: [
          {
            id: "c9",
            text: "Arama için önbellek POC",
            votes: 1,
            comments: [
              {
                id: "cm11",
                author: "Onur",
                text: "Redis mi yoksa edge cache mi?",
                createdAt: "2024-05-06 11:50",
              },
              {
                id: "cm12",
                author: "Zeynep",
                text: "POC sonunda metrikleri dashboard'a ekleyelim.",
                createdAt: "2024-05-06 12:10",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const findBoardById = (id) =>
  mockBoards.find((board) => board.id.toLowerCase() === id.toLowerCase());

export const listBoardSummaries = () =>
  mockBoards.map(({ id, name, date, inviteRequired, participants }) => ({
    id,
    name,
    date,
    inviteRequired,
    participantsCount: participants.length,
  }));
