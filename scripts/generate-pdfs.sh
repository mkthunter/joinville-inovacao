#!/bin/bash
# Gera os 6 PDFs dos decretos via Chrome headless.
# Pré-requisito: servidor Vite rodando em localhost:5178 (npm run dev)
# Uso: bash scripts/generate-pdfs.sh

set -e

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="http://localhost:5178"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/pdfs"

if [ ! -x "$CHROME" ]; then
  echo "ERRO: Google Chrome não encontrado em $CHROME"
  exit 1
fi

# Verifica se o Vite está rodando
if ! curl -s -o /dev/null -w "%{http_code}" "$BASE/" | grep -q "200"; then
  echo "ERRO: servidor Vite não está rodando em $BASE"
  echo "Execute 'npm run dev' em outro terminal e rode este script novamente."
  exit 1
fi

mkdir -p "$OUT"

# Função auxiliar
gerar_pdf() {
  local url_query="$1"
  local filename="$2"
  local titulo="$3"

  echo "→ Gerando: $titulo"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --hide-scrollbars \
    --no-pdf-header-footer \
    --disable-pdf-tagging \
    --print-to-pdf="$OUT/$filename" \
    --virtual-time-budget=8000 \
    --run-all-compositor-stages-before-draw \
    "$BASE/?$url_query" 2>/dev/null

  if [ -f "$OUT/$filename" ]; then
    local size=$(du -h "$OUT/$filename" | cut -f1)
    echo "  ✓ $filename ($size)"
  else
    echo "  ✗ FALHOU: $filename"
  fi
}

echo ""
echo "═══════════════════════════════════════════════════════"
echo "Gerando 6 PDFs dos decretos Joinville Inovação"
echo "Saída: $OUT"
echo "═══════════════════════════════════════════════════════"
echo ""

# Versões limpas (sem notas da consultoria) — para PGM, Câmara, sanção
gerar_pdf "print=rota-a"                 "decreto-programa-rota-a.pdf"           "Decreto do Programa — Rota A (FIT/Jlle) — versão limpa"
gerar_pdf "print=rota-b"                 "decreto-programa-rota-b.pdf"           "Decreto do Programa — Rota B (ISS/IPTU) — versão limpa"
gerar_pdf "print=apis"                   "decreto-apis.pdf"                      "Decreto dos APIs — versão limpa"

# Versões consultivas (com notas da consultoria) — para SEBRAE, interno PMJ
gerar_pdf "print=rota-a&notas=1"         "decreto-programa-rota-a-consultivo.pdf" "Decreto do Programa — Rota A — consultivo (com orientações)"
gerar_pdf "print=rota-b&notas=1"         "decreto-programa-rota-b-consultivo.pdf" "Decreto do Programa — Rota B — consultivo (com orientações)"
gerar_pdf "print=apis&notas=1"           "decreto-apis-consultivo.pdf"            "Decreto dos APIs — consultivo (com orientações)"

# Kit de modelos operacionais (único PDF)
gerar_pdf "print=modelos"                "modelos-operacionais.pdf"               "Modelos Operacionais — Edital, Carta, Parecer, Relatórios, Manifestação"

# Apresentação executiva (pitch)
gerar_pdf "print=apresentacao"           "apresentacao-executiva.pdf"             "Apresentação Executiva — pitch institucional em 10 slides"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✓ Concluído. PDFs em:"
echo "  $OUT"
echo "═══════════════════════════════════════════════════════"
ls -lh "$OUT"/*.pdf 2>/dev/null | awk '{print "  " $9 " — " $5}'
