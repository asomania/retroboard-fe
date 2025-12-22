// Lightweight mock data for local testing without a backend.

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
          { id: "c1", text: "CI süreleri 2x hızlandı", votes: 3 },
          {
            id: "c2",
            text: "Yeni onboarding dokümanı işimizi kolaylaştırdı",
            votes: 2,
          },
        ],
      },
      {
        id: "problem",
        title: "Geliştirilecek",
        cards: [
          { id: "c3", text: "Prod veri maskeleme eksik", votes: 4 },
          { id: "c4", text: "Toplantı notları dağınık", votes: 1 },
        ],
      },
      {
        id: "action",
        title: "Aksiyonlar",
        cards: [
          { id: "c5", text: "Maskeleme scriptini bu sprint tamamla", votes: 2 },
          { id: "c6", text: "Retro çıktıları için tek doküman aç", votes: 1 },
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
          { id: "c7", text: "Kullanıcılar hızlı arama istiyor", votes: 5 },
        ],
      },
      {
        id: "problem",
        title: "Sorular",
        cards: [{ id: "c8", text: "Hangi plan ücretsiz olacak?", votes: 2 }],
      },
      {
        id: "action",
        title: "Denenecek",
        cards: [{ id: "c9", text: "Arama için önbellek POC", votes: 1 }],
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
