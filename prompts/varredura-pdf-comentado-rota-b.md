# Varredura — PDF Comentado Rota B

Você é uma IA convocada pra **conferir o PDF Comentado da Rota B** do projeto Joinville Inovação. Sessão zero, sem contexto anterior. Leia este documento todo antes de agir.

---

## Contexto mínimo

Projeto de consultoria SEBRAE/SC para a Prefeitura de Joinville: minutas de decreto pra instituir o **Programa Municipal de Incentivo à Inovação (PII/Jlle)**. Existem duas rotas alternativas (A com caixa via FIT/Jlle; B sem caixa via redirecionamento ISSQN/IPTU). Esta varredura é só da **Rota B — versão Comentada**.

Diferença entre as 3 versões da Rota B:
- **PDF Limpo** — só os artigos do decreto, sem notas
- **DOCX** — Word editável, mesmo conteúdo do PDF Limpo
- **PDF Comentado** ← *este é o foco desta varredura* — mesmo decreto + **notas consultivas** da consultoria à PGM (orientações técnicas, justificativas, fundamentação legal)

---

## Os arquivos

### 1. PDF Comentado — alvo da auditoria
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/public/pdfs/Joinville - R-B - Decreto PII - Comentado.pdf`
- ~1,0 MB
- Deve ter os artigos + blocos consultivos intercalados

### 2. PDF Limpo — referência de paridade
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/public/pdfs/Joinville - R-B - Decreto PII.pdf`
- ~853 KB
- Mesmos artigos, sem notas consultivas

### 3. HTML — fonte de verdade
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/index.html`
- Seção da Rota B: `<section ... id="caminho-b-completo">`
- Localizar limites:
  ```bash
  grep -n 'id="caminho-b-completo"\|id="page-decreto-apis"' /Users/brunorosa/Desktop/joinville-inovacao/index.html
  ```
- No HTML, as notas consultivas aparecem em blocos com classe `dec-nota-redacao`

---

## O que checar

### Eixo 1 — Notas consultivas presentes e completas
Os blocos `dec-nota-redacao` do HTML devem aparecer no PDF Comentado. Verifique:
- Cada bloco "Notas de redação ao..." está renderizado?
- Conteúdo dos itens (recomendações double-check à PGM, justificativas de cada artigo, fundamentação legal — Lei 7.170/2011, LRF, EC 132/2023, LC 214/2025, LC 224/2025) está completo?
- Listas dentro das notas (recomendações numeradas/bulletadas) preservadas?

### Eixo 2 — Paridade de artigos: PDF Comentado vs PDF Limpo
Os artigos devem ser **idênticos** nos dois PDFs. As únicas diferenças aceitáveis:
- Presença/ausência das notas consultivas
- Quebras de página
- Numeração de páginas

Diferenças no texto dos artigos (palavras, ordem, dispositivos) são bug.

### Eixo 3 — Não-regressão das correções já aplicadas

Confirme nos 3 (HTML, PDF Limpo, PDF Comentado):

**Art. 16 caput** — deve dizer: o FIT/Jlle **recebe e administra os saldos não executados** das Contas Vinculadas. NÃO pode dizer "concentra e executa os recursos do Programa" (isso seria Rota A).

**Art. 16 §1º** — saldos não executados como inciso I das receitas do FIT.

**Art. 37 §4º** — sem duplicação. Frase única: "O **teto anual do Programa** — valor máximo de redirecionamento fiscal autorizado..."

**Art. 65 I** — frase completa: "as disposições do Capítulo V relativas ao **redirecionamento fiscal**, que produzem efeitos a partir da vigência da Lei Complementar municipal autorizativa;"

### Eixo 4 — Sem vazamento Rota A → B
Buscar no PDF Comentado por sinais errados:
- "subvenção econômica direta", "Prefeitura paga via FIT", "despesa pública corrente" como mecanismo do Programa
- "dotação específica da Lei Orçamentária Anual" como fonte do Programa
- Art. 33 ou Art. 37 falando em pagamento à vista pela PMJ
- Resumo executivo dizendo "a Prefeitura paga direto"

OBS: as notas consultivas podem mencionar comparações com a Rota A em contexto explícito — isso é OK. O que não pode é o **corpo do decreto** afirmar mecanismo da A.

---

## Método

1. Abra o **HTML** e mapeie:
   - Quantos blocos `dec-nota-redacao` existem dentro de `caminho-b-completo`?
   - O que cada um cobre (qual capítulo/artigo)?
2. Abra o **PDF Comentado** e verifique se cada bloco aparece, em ordem, com conteúdo íntegro.
3. Compare **PDF Comentado vs PDF Limpo** artigo por artigo, capítulo por capítulo.
4. Releia Art. 16, Art. 37 §4º e Art. 65 I nos 3 artefatos para confirmar não-regressão.
5. Faça uma busca por sinais de vazamento Rota A → B no corpo do decreto do PDF Comentado.

---

## Formato de saída

```
## Veredicto
[OK / OK COM RESSALVAS / NÃO OK]

## Notas consultivas
- Blocos esperados (HTML): [N]
- Blocos encontrados (PDF Comentado): [N]
- Algum faltando ou truncado? [SIM / NÃO + descrição]

## Paridade artigos: PDF Comentado vs PDF Limpo
- Diferenças no corpo do decreto: [lista, ou "nenhuma"]

## Não-regressão das correções
- Art. 16 caput: [redação no PDF Comentado, em uma frase] — [OK / regressão]
- Art. 16 §1º: [estrutura encontrada] — [OK / regressão]
- Art. 37 §4º: [redação encontrada] — [OK / duplicação voltou + onde]
- Art. 65 I: [redação encontrada] — [OK / incompleto + onde]

## Vazamento Rota A → B no corpo do decreto
- [trechos suspeitos com referência de página. Vazio se nada.]

## Bloqueantes
- [item 1: descrição + página + qual artefato]
- ...

## Cosméticos (ignoráveis)
- [item 1]
- ...

## Recomendação
[publicar / regerar PDF Comentado / corrigir HTML em Y]
```

---

## Restrições

- **Não invente.** Cite trechos curtos com referência de página/linha.
- **Não confunda** o PDF Comentado com o PDF Limpo — o Comentado tem blocos "Notas de redação ao..." intercalados; o Limpo não.
- **Português brasileiro** com acentuação correta.
- Se não encontrou um trecho, diga que não encontrou — não suponha.
- As notas consultivas são da consultoria pra PGM. Avalie se estão presentes e íntegras, não se concorda com o conteúdo delas.
