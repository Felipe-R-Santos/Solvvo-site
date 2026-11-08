/** Máscara e dígito verificador de CNPJ. Sem dependência externa. */

export function mascaraCnpj(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export const soDigitos = (valor: string) => valor.replace(/\D/g, "");

/**
 * Confere os dois dígitos verificadores pelo módulo 11.
 * Recusa também os CNPJ de dígitos repetidos (00.000.000/0000-00 e afins),
 * que passam na conta mas não existem.
 */
export function cnpjValido(valor: string) {
  const c = soDigitos(valor);
  if (c.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(c)) return false;

  const digito = (base: string, pesos: number[]) => {
    const soma = base
      .split("")
      .reduce((t, n, i) => t + Number(n) * pesos[i], 0);
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };

  const d1 = digito(c.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = digito(c.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(c[12]) && d2 === Number(c[13]);
}
