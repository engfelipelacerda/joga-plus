import { ArrowRight, Trophy, Users, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-3xl font-extrabold text-orange-500">
          Joga<span className="text-gray-900">+</span>
        </h1>

        <button
          onClick={() => (window.location.href = "/login")}
          className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Entrar
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-8 py-20 text-center">
        <div className="mb-6 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600">
          Plataforma para atletas e organizadores
        </div>

        <h2 className="max-w-4xl text-6xl font-black leading-tight text-gray-900">
          Organize partidas,
          <span className="block text-orange-500">encontre jogadores</span>e
          jogue mais.
        </h2>

        <p className="mt-8 max-w-2xl text-xl text-gray-600">
          O Joga+ conecta atletas, equipes e organizadores em um único ambiente
          simples, moderno e intuitivo.
        </p>

        <div className="mt-12 flex gap-4">
          <button
            onClick={() => (window.location.href = "/login")}
            className="flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white transition hover:scale-105 hover:bg-orange-600"
          >
            Começar Agora
            <ArrowRight size={20} />
          </button>

          <button className="rounded-2xl border-2 border-orange-500 px-8 py-4 text-lg font-bold text-orange-500 transition hover:bg-orange-50">
            Saiba Mais
          </button>
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto grid max-w-6xl gap-8 px-8 pb-24 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition hover:-translate-y-2">
          <Users size={42} className="text-orange-500" />
          <h3 className="mt-4 text-2xl font-bold">Comunidade</h3>
          <p className="mt-3 text-gray-600">
            Encontre atletas, monte equipes e expanda sua rede esportiva.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition hover:-translate-y-2">
          <Calendar size={42} className="text-orange-500" />
          <h3 className="mt-4 text-2xl font-bold">Organização</h3>
          <p className="mt-3 text-gray-600">
            Gerencie partidas, horários e eventos esportivos com facilidade.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition hover:-translate-y-2">
          <Trophy size={42} className="text-orange-500" />
          <h3 className="mt-4 text-2xl font-bold">Competição</h3>
          <p className="mt-3 text-gray-600">
            Acompanhe estatísticas, rankings e evolução dos jogadores.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-500">
        © 2026 Joga+ • Todos os direitos reservados
      </footer>
    </div>
  );
}
