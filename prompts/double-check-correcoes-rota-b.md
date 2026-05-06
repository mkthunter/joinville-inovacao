# Double-check — Correções Rota B (HTML × PDF × DOCX)

Você é uma IA convocada pra **validar 2 correções específicas** que acabaram de ser aplicadas no decreto da Rota B do projeto Joinville Inovação. Sessão zero, sem contexto anterior. Leia este documento todo antes de agir.

---

## Contexto mínimo

Projeto de consultoria SEBRAE/SC para a Prefeitura de Joinville: minutas de decreto pra instituir o **Programa Municipal de Incentivo à Inovação (PII/Jlle)**. Existem duas rotas alternativas (A com caixa via FIT/Jlle; B sem caixa via redirecionamento ISSQN/IPTU). Esta varredura é só da **Rota B**.

---

## Os 3 arquivos

### 1. HTML — fonte
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/index.html`
- **Seção da Rota B:** `<section ... id="caminho-b-completo">`
- Localizar limites:
  ```bash
  grep -n 'id="caminho-b-completo"\|id="page-decreto-apis"' /Users/brunorosa/Desktop/joinville-inovacao/index.html
  ```

### 2. PDF — versão limpa
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/public/pdfs/Joinville - R-B - Decreto PII.pdf`
- Sem notas consultivas

### 3. DOCX — Word editável
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/public/pdfs/Joinville - R-B - Decreto PII.docx`

---

## Correções a validar

Numa rodada anterior de auditoria, outra IA apontou 2 erros reais no HTML. Os 2 foram corrigidos. Confirme que **as 3 saídas (HTML, PDF, DOCX) estão alinhadas** após a correção.

### Correção 1 — Art. 37 §4º (duplicação removida)

**Antes (errado):**
> "O **teto anual do Programa** o teto anual do Programa — valor máximo de redirecionamento fiscal autorizado..."

**Depois (correto):**
> "O **teto anual do Programa** — valor máximo de redirecionamento fiscal autorizado no conjunto dos Projetos em cada exercício — será **fixado pela Lei Complementar autorizativa**, observada a compatibilidade com a Lei de Diretrizes Orçamentárias e a Lei Orçamentária Anual do Município, e demonstrada em nota técnica da SEFAZ (LRF, art. 14). *[Decisão da PMJ — a definir na redação da LC]*"

**O que checar:**
- HTML não pode ter mais a duplicação "teto anual do Programa o teto anual do Programa"
- PDF deve mostrar a frase única e fluida
- DOCX idem
- Os 3 arquivos devem trazer **a mesma redação** desse parágrafo

### Correção 2 — Art. 65 I (palavra preenchida)

**Antes (errado):**
> "as disposições do Capítulo V relativas ao **, que produzem efeitos a partir da vigência da Lei Complementar municipal autorizativa;"
>
> (faltava a palavra entre "ao" e a vírgula)

**Depois (correto):**
> "as disposições do Capítulo V relativas ao **redirecionamento fiscal**, que produzem efeitos a partir da vigência da Lei Complementar municipal autorizativa;"

**O que checar:**
- HTML tem agora "relativas ao **redirecionamento fiscal**, que produzem efeitos..."
- PDF mostra "redirecionamento fiscal" no inciso I do Art. 65
- DOCX idem
- Os 3 batem

---

## Verificações adicionais (não-regressão)

Confirme também que NADA QUEBROU em relação à validação anterior:

### Art. 16 — caput
Deve continuar dizendo: o FIT/Jlle **recebe e administra os saldos não executados** das Contas Vinculadas dos Projetos. NÃO pode dizer "concentra e executa os recursos do Programa" (isso seria Rota A).

### Art. 16 — §1º
Deve continuar listando saldos não executados como inciso I das receitas do FIT/Jlle.

### Mecanismo geral da Rota B
- Recursos vão direto do contribuinte (ISSQN/IPTU) pra Conta Vinculada
- Prefeitura não paga, não desembolsa, não opera o FIT como caixa primário
- Eficácia condicionada à Lei Complementar municipal autorizativa
- Sem vazamento de "subvenção econômica direta" / "Prefeitura paga via FIT" / "dotação específica da Lei Orçamentária Anual" como mecanismo

### Paridade PDF ↔ DOCX
Os dois devem trazer exatamente o mesmo conteúdo (palavras, ordem, dispositivos). Diferenças tipográficas e de cabeçalho institucional do DOCX são aceitáveis. O DOCX é versão editável pra PGM — não precisa ter capa/sumário do PDF.

---

## Método

1. Abra o HTML e extraia a seção `caminho-b-completo`. Ignore comentários `<!-- ... -->` e blocos `dec-nota-redacao`.
2. Localize Art. 37 §4º e Art. 65 I no HTML, no PDF e no DOCX.
3. Compare as redações nos 3 artefatos.
4. Releia Art. 16 (caput e §1º) nos 3 e confirme que não regrediu.
5. Faça uma busca por sinais de vazamento Rota A → Rota B nos 3.

---

## Formato de saída

```
## Veredicto
[OK / OK COM RESSALVAS / NÃO OK]

## Correção 1 — Art. 37 §4º
- HTML: [redação encontrada]
- PDF (página): [redação encontrada]
- DOCX: [redação encontrada]
- Os 3 batem? [SIM / NÃO + diferença]
- Duplicação ainda presente em algum? [SIM / NÃO + onde]

## Correção 2 — Art. 65 I
- HTML: [redação encontrada]
- PDF (página): [redação encontrada]
- DOCX: [redação encontrada]
- Os 3 batem? [SIM / NÃO + diferença]
- Frase ainda incompleta em algum? [SIM / NÃO + onde]

## Não-regressão
- Art. 16 caput: [OK / regressão + descrição]
- Art. 16 §1º: [OK / regressão + descrição]
- Mecanismo Rota B (sem caixa): [OK / vazamento detectado + trecho]

## Paridade PDF ↔ DOCX
[Estão alinhados em conteúdo? Onde diverge?]

## Recomendação
[publicar / regerar artefato X / corrigir HTML em Y]
```

---

## Restrições

- **Não invente.** Cite trechos curtos, com referência de página/linha.
- **Não confunda esta versão com a Comentada.** Esta NÃO tem notas consultivas.
- **Português brasileiro** com acentuação correta.
- Se não encontrou um trecho, diga que não encontrou — não suponha.
