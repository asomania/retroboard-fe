import { useState } from "react";
import logo from "/team.svg";
import { useNavigate } from "@tanstack/react-router";
import { useCreateBoard } from "./api/queries/boards";
import { createClientId } from "./utils/ids";

function App() {
  const [boardName, setBoardName] = useState("");
  const [boardDate, setBoardDate] = useState("");
  const [boardTime, setBoardTime] = useState("");
  const [requireInvite, setRequireInvite] = useState(true);
  const [participantsInput, setParticipantsInput] = useState("");
  const [joinKey, setJoinKey] = useState("");
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useCreateBoard();

  const handleCreateBoard = async (event) => {
    event.preventDefault();
    const name = boardName.trim();
    if (!name) return;
    const trimmedDate = boardDate.trim();
    const trimmedTime = boardTime.trim();
    const isoDate =
      trimmedDate && trimmedTime
        ? new Date(`${trimmedDate}T${trimmedTime}`).toISOString()
        : undefined;

    const participants = participantsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const created = await mutateAsync({
        id: createClientId("board"),
        name,
        date: isoDate,
        inviteRequired: requireInvite,
        participants,
      });
      if (created?.id) {
        navigate({
          to: "/board/$boardID",
          params: { boardID: created.id },
        });
      }
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const handleJoinWithKey = (event) => {
    event.preventDefault();
    const trimmedKey = joinKey.trim();
    if (!trimmedKey) return;

    navigate({
      to: "/board/$boardID",
      params: { boardID: trimmedKey },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.16),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.18),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="grid items-center gap-12 md:grid-cols-5">
          <section className="md:col-span-3 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 shadow-sm shadow-cyan-500/30">
              Retroboard
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Hazır
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                Takım retro’larını hızla başlat, herkes sözünü alsın.
              </h1>
              <p className="max-w-2xl text-lg text-white/80">
                Anonim kartlar, hızlı oylama ve net aksiyonlar için tasarlanmış
                akıcı bir tahta. Akışın bozulmasın, geri bildirimler büyüsün.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Canlı eşzamanlama",
                  desc: "Anlık güncellemelerle aynı anda düzenleyin.",
                },
                {
                  title: "Akışa uygun sütunlar",
                  desc: "Başarılı, geliştirilecek, aksiyon gibi hazır şablonlar.",
                },
                {
                  title: "Oylama & anonimlik",
                  desc: "Güvenli paylaşım için eşit söz hakkı.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="md:col-span-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.38)] backdrop-blur">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-indigo-500/10" />
              <div className="relative space-y-6">
                <header className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
                    <img src={logo} alt="Takım" className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Retronu başlat
                    </p>
                    <p className="text-lg font-semibold text-white">
                      Yeni tahta oluştur
                    </p>
                  </div>
                </header>

                <form className="space-y-4" onSubmit={handleCreateBoard}>
                  <label className="block space-y-2 text-sm font-medium text-white/80">
                    Tahta adı
                    <input
                      type="text"
                      placeholder="Örn: Sprint 12 - Demo hazırlığı"
                      value={boardName}
                      onChange={(event) => setBoardName(event.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 shadow-inner shadow-black/40 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/40"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-2 text-sm font-medium text-white/80">
                      Tarih
                      <input
                        type="date"
                        value={boardDate}
                        onChange={(event) => setBoardDate(event.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 shadow-inner shadow-black/40 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/40"
                      />
                    </label>
                    <label className="block space-y-2 text-sm font-medium text-white/80">
                      Saat
                      <input
                        type="time"
                        value={boardTime}
                        onChange={(event) => setBoardTime(event.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 shadow-inner shadow-black/40 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/40"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2 text-sm font-medium text-white/80">
                    Katılımcılar
                    <input
                      type="text"
                      placeholder="Eren, Ayşe, Mert"
                      value={participantsInput}
                      onChange={(event) =>
                        setParticipantsInput(event.target.value)
                      }
                      className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 shadow-inner shadow-black/40 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/40"
                    />
                  </label>

                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Davetiye gereksinimi</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={requireInvite}
                        onChange={(event) =>
                          setRequireInvite(event.target.checked)
                        }
                      />
                      <div className="peer h-6 w-11 rounded-full bg-white/15 shadow-inner shadow-black/50 transition peer-checked:bg-emerald-400/90" />
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5 peer-checked:bg-emerald-950" />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
                    disabled={isPending || !boardName.trim()}
                  >
                    {isPending ? "Oluşturuluyor..." : "Board’u başlat"}
                  </button>
                  {error && (
                    <p className="text-center text-xs text-rose-200">
                      {error.message}
                    </p>
                  )}
                  <p className="text-center text-xs text-white/60">
                    Davetliler, paylaştığın bağlantıyla direkt katılabilir.
                  </p>
                </form>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-sm font-semibold text-white">
                Veya anahtarla katıl
              </p>
              <p className="text-xs text-white/60">
                Sana iletilen katılım anahtarını yaz.
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={handleJoinWithKey}
              >
                <input
                  type="text"
                  placeholder="Örn: RB-8F2K-P9"
                  value={joinKey}
                  onChange={(event) => setJoinKey(event.target.value)}
                  className="flex-1 rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 shadow-inner shadow-black/40 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-cyan-950 shadow-lg shadow-cyan-500/40 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                >
                  Katıl
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
