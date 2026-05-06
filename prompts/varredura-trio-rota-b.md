# Varredura — HTML × PDF × DOCX (Rota B)

Você é uma IA convocada pra **conferir se o PDF e o DOCX gerados refletem fielmente o HTML fonte** do Decreto da Rota B do projeto Joinville Inovação. Sessão zero, sem contexto anterior. Leia este documento todo antes de agir.

---

## Contexto do projeto (mínimo necessário)

Projeto de consultoria SEBRAE/SC para a Prefeitura de Joinville: minutas de decreto pra instituir o **Programa Municipal de Incentivo à Inovação (PII/Jlle)**. Existem duas rotas alternativas:

- **Rota A (com caixa)**: Prefeitura paga direto via Fundo Municipal (FIT/Jlle), na modalidade subvenção econômica. Aplicável imediatamente por Decreto.
- **Rota B (sem caixa)**: contribuintes (ISSQN/IPTU) redirecionam imposto direto pro projeto. Recurso **não passa pelo caixa da PMJ**. Modelo Florianópolis. Eficácia condicionada a Lei Complementar municipal autorizativa.

Esta varredura é só da **Rota B**, comparando 3 artefatos.

---

## Os 3 arquivos

### 1. HTML — fonte de verdade
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/index.html`
- **Seção da Rota B:** delimitada por `<section ... id="caminho-b-completo">` até o `</section>` correspondente
- ~8400 linhas no arquivo total; a seção da Rota B começa por volta da linha 5447
- Localizar:
  ```bash
  grep -n 'id="caminho-b-completo"\|id="page-decreto-apis"' /Users/brunorosa/Desktop/joinville-inovacao/index.html
  ```

### 2. PDF — versão "limpa" (sem comentários consultivos)
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/public/pdfs/Joinville - R-B - Decreto PII.pdf`
- Renderizado via Chrome headless a partir do HTML
- Não deve conter blocos `Notas de redação` / consultivas

### 3. DOCX — Word editável
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/public/pdfs/Joinville - R-B - Decreto PII.docx`
- Gerado via python-docx a partir do HTML, usando BeautifulSoup
- Mesmo conteúdo do PDF limpo, em formato editável pra PGM

---

## O que comparar

### Eixo 1: HTML → PDF
O PDF deve trazer o conteúdo visível do HTML da seção `caminho-b-completo`, ignorando:
- Comentários HTML (`<!-- ... -->`)
- Blocos `dec-nota-redacao` (consultivos — não estão nesta versão limpa)
- Divisor visual `caminho-divisor` no fim da seção

### Eixo 2: HTML → DOCX
O DOCX deve trazer **o mesmo conteúdo** do PDF: mesmas seções, mesmos artigos, mesma ordem, mesmas redações.
Diferenças aceitáveis:
- Tipografia (fonte / tamanho)
- Cabeçalho institucional do DOCX (BRZ Capacitação × SEBRAE/SC)
- Quebras de página
- Numeração de páginas

### Eixo 3: PDF ↔ DOCX
Os dois devem estar **alinhados entre si** em conteúdo. Se um diverge do HTML, o outro provavelmente também diverge — mas pode haver bug de extração específico. Compare o que cada um trouxe.

---

## Pontos críticos pra checar (atenção máxima)

A última correção feita no HTML foi no **Art. 16** da Rota B. Verifique nos 3 arquivos:

### Art. 16 — caput
**Deve dizer (ou equivalente):** o FIT/Jlle **recebe e administra os saldos não executados** das Contas Vinculadas dos Projetos.
**NÃO pode dizer:** o FIT/Jlle "concentra e executa os recursos do Programa". Essa redação é da Rota A — se aparecer aqui, é erro grave.

### Art. 16 — §1º
**Deve listar como receitas do FIT/Jlle, com saldos não executados como inciso I.** A Rota B não capta recursos pelo FIT — o fundo só recebe saldos que sobraram nas Contas Vinculadas dos Projetos.

### Mecanismo geral da Rota B (não pode confundir com A)
- Recursos vão **direto do contribuinte (ISSQN/IPTU) pra Conta Vinculada do Projeto**
- Prefeitura **não paga**, não desembolsa, não opera o FIT como caixa primário
- O FIT só **recebe saldos não executados** ao final
- Eficácia condicionada à **Lei Complementar municipal** autorizativa
- Base constitucional: EC 132/2023, LC 214/2025

### Sinais de vazamento Rota A → Rota B (são erro)
- Frases tipo "subvenção econômica direta", "Prefeitura paga via FIT", "despesa pública corrente"
- Menção a "dotação específica da Lei Orçamentária Anual" como fonte do Programa
- Art. 33 ou Art. 37 falando em pagamento à vista pela PMJ
- Resumo executivo dizendo "a Prefeitura paga direto"

---

## Método de comparação

1. **Abra o HTML** e extraia o conteúdo visível da seção `caminho-b-completo` (ignore comentários e `dec-nota-redacao`).
2. **Abra o PDF** e leia o conteúdo página por página.
3. **Abra o DOCX** e leia parágrafo por parágrafo.
4. **Compare seção por seção** (capítulo por capítulo, artigo por artigo) entre os 3.
5. Para cada divergência, classifique:
   - **Bloqueante:** mistura A/B, fonte legal errada, dispositivo do decreto faltando ou alterado, contradição interna, redação diferente entre PDF e DOCX no mesmo artigo.
   - **Cosmética:** quebra de linha diferente, espaço duplo, ordem de itens em lista (se a leitura não muda).
6. **Sumário:** confira se o índice/sumário só lista seções da Rota B (não pode aparecer "Caminho A — com caixa" ou similar).

---

## Formato de saída esperado

Devolva um relatório curto, objetivo, em português, com esta estrutura:

```
## Veredicto
[OK / OK COM RESSALVAS / NÃO OK]

## Art. 16 — checagem específica nos 3 arquivos
- HTML caput: [redação encontrada, em uma frase]
- PDF caput: [redação encontrada]
- DOCX caput: [redação encontrada]
- HTML §1º: [estrutura encontrada]
- PDF §1º: [estrutura encontrada]
- DOCX §1º: [estrutura encontrada]
- Conformidade dos 3: [SIM / NÃO + motivo]

## Vazamento Rota A → Rota B
- HTML: [trechos suspeitos. Vazio se nada.]
- PDF: [trechos suspeitos. Vazio se nada.]
- DOCX: [trechos suspeitos. Vazio se nada.]

## Divergências entre artefatos
- HTML × PDF: [item 1: descrição + página do PDF + linha do HTML]
- HTML × DOCX: [...]
- PDF × DOCX: [...]

## Bloqueantes encontrados
- [item 1: descrição + onde está + qual artefato]
- ...

## Cosméticos (ignoráveis)
- [item 1]
- ...

## Recomendação
[publicar / corrigir e regerar (e qual artefato)]
```

---

## Restrições

- **Não invente.** Se não encontrou um trecho, diga que não encontrou — não suponha.
- **Não cite os arquivos inteiros.** Devolva trechos curtos, com referência de página/linha.
- **Não confunda esta versão com a Comentada.** Esta NÃO tem notas consultivas. Se você ver bloco "Notas de redação" no PDF ou DOCX, está auditando o arquivo errado.
- **Português brasileiro** com acentuação correta.
- Se tiver dúvida sobre o que é Rota A vs Rota B, releia a seção "Contexto do projeto" no topo deste documento — não chute.
- **Igualdade entre PDF e DOCX é obrigatória** no nível do conteúdo (palavras, ordem, dispositivos). Diferenças tipográficas não contam.
