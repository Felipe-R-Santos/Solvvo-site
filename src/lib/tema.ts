// ─────────────────────────────────────────────────────────────────────────────
// TEMA — uma fonte só para o nome da chave e para o script anti-flash.
//
// A chave de armazenamento é usada em dois lugares que não se enxergam: o
// script que roda no <head> antes da pintura (string, dentro do layout) e o
// botão que alterna o tema (componente client). Deixar o literal 'sv-tema'
// escrito nos dois é a divergência silenciosa que a regra 1.5 do brief manda
// evitar — bastaria alguém renomear num lado.
// ─────────────────────────────────────────────────────────────────────────────

export const CHAVE_TEMA = 'sv-tema'

export type Tema = 'dark' | 'light'

export const TEMA_PADRAO: Tema = 'dark'

// ─────────────────────────────────────────────────────────────────────────────
// SCRIPT ANTI-FLASH
//
// Precisa rodar SÍNCRONO no <head>, antes de o navegador pintar o primeiro
// quadro. Se esperar o React hidratar, a página aparece no tema padrão e só
// depois troca — o "flash" branco que o brief chama de inaceitável num site
// aberto à noite.
//
// Ordem da decisão:
//   1. escolha já salva pelo visitante, se houver;
//   2. senão, a preferência declarada no sistema operacional;
//   3. senão, escuro.
//
// O try/catch existe porque localStorage lança exceção em navegação privativa
// de alguns navegadores e com cookies de terceiros bloqueados. Falhar ali não
// pode derrubar a página — no pior caso o site abre no tema padrão.
// ─────────────────────────────────────────────────────────────────────────────

export const SCRIPT_ANTI_FLASH = `
(function(){
  try {
    var t = localStorage.getItem('${CHAVE_TEMA}');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : '${TEMA_PADRAO}';
    }
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = '${TEMA_PADRAO}';
  }
})();
`.trim()
