# Varredura — PDF Rota B vs HTML fonte

Você é uma IA convocada pra **conferir se o PDF gerado reflete fielmente o HTML fonte** do Decreto da Rota B do projeto Joinville Inovação. Sessão zero, sem contexto anterior. Leia este documento todo antes de agir.

---

## Contexto do projeto (mínimo necessário)

Projeto de consultoria SEBRAE/SC para a Prefeitura de Joinville: minutas de decreto pra instituir o **Programa Municipal de Incentivo à Inovação (PII/Jlle)**. Existem duas rotas alternativas:

- **Rota A (com caixa)**: Prefeitura paga direto via Fundo Municipal (FIT/Jlle), na modalidade subvenção econômica. Aplicável imediatamente por Decreto.
- **Rota B (sem caixa)**: contribuintes (ISSQN/IPTU) redirecionam imposto direto pro projeto. Recurso **não passa pelo caixa da PMJ**. Modelo Florianópolis. Eficácia condicionada a Lei Complementar municipal autorizativa.

Esta varredura é só da **Rota B**.

---

## Arquivos pra comparar

### Fonte (verdade)
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/index.html`
- **Seção da Rota B:** delimitada por `<section ... id="caminho-b-completo">` até o `</section>` correspondente
- Tamanho aproximado: ~8400 linhas no arquivo total; a seção da Rota B começa por volta da linha 5447

### Gerado (a auditar)
- **Caminho absoluto:** `/Users/brunorosa/Desktop/joinville-inovacao/public/pdfs/Joinville - R-B - Decreto PII.pdf`
- PDF "limpo" — sem notas consultivas (não confundir com a versão Comentada)

---

## Como localizar a seção no HTML

```bash
grep -n 'id="caminho-b-completo"\|id="page-decreto-apis"' /Users/brunorosa/Desktop/joinville-inovacao/index.html
```

A primeira linha é o início da Rota B. A segunda (`page-decreto-apis`) marca o limite — tudo entre as duas é Rota B + transições. Extraia esse intervalo pra trabalhar.

Dentro da seção, ignore (são invisíveis no PDF):
- Comentários HTML (`<!-- ... -->`)
- Blocos com classe `dec-nota-redacao` (notas consultivas — só aparecem na versão **Comentada**, não nesta)
- Divisor visual `caminho-divisor` no final da seção

Considere visível no PDF:
- Tudo dentro de `dec-caminho dec-caminho--b` (corpo do decreto)
- Cabeçalhos `dec-section`, `dec-section__num`, `dec-section__title`, `dec-section__subtitle`
- Parágrafos `dec-artigo`, `dec-paragrafo`, `dec-inciso`, `dec-alinea`
- Resumo executivo `resumo-executivo`
- Lista de decisões consultivas, considerandos, ementa

---

## Pontos críticos pra checar (atenção especial)

A última correção feita no HTML foi no **Art. 16** da Rota B. Verifique se o PDF reflete:

### Art. 16 — caput
**Deve dizer (ou equivalente):** o FIT/Jlle **recebe e administra os saldos não executados** das Contas Vinculadas dos Projetos.
**NÃO pode dizer:** o FIT/Jlle "concentra e executa os recursos do Programa". Essa redação é da Rota A — se aparecer aqui, é erro.

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
3. **Compare seção por seção** (capítulo por capítulo, artigo por artigo).
4. Para cada divergência, classifique:
   - **Bloqueante:** mistura A/B, fonte legal errada, dispositivo do decreto faltando ou alterado, contradição interna.
   - **Cosmética:** quebra de linha diferente, espaço duplo, ordem de itens em lista (se a leitura não muda).
5. **Sumário do PDF:** confira se o índice/sumário só lista seções da Rota B (não pode aparecer "Caminho A — com caixa" ou similar).

---

## Formato de saída esperado

Devolva um relatório curto, objetivo, em português, com esta estrutura:

```
## Veredicto
[OK / OK COM RESSALVAS / NÃO OK]

## Art. 16 — checagem específica
- caput: [redação encontrada no PDF, em uma frase]
- §1º: [estrutura encontrada]
- Conformidade: [SIM / NÃO + motivo]

## Vazamento Rota A → Rota B
- [Lista de trechos do PDF que parecem mecanismo da Rota A. Vazio se nada.]

## Bloqueantes encontrados
- [item 1: descrição + página do PDF + linha do HTML]
- ...

## Cosméticos (ignoráveis)
- [item 1]
- ...

## Recomendação
[publicar / corrigir e regerar]
```

---

## Restrições

- **Não invente.** Se não encontrou um trecho, diga que não encontrou — não suponha.
- **Não cite o PDF inteiro.** Devolva trechos curtos, com referência de página.
- **Não confunda esta versão com a Comentada.** Esta NÃO tem notas consultivas. Se você ver bloco "Notas de redação" no PDF, está auditando o arquivo errado.
- **Português brasileiro** com acentuação correta.
- Se tiver dúvida sobre o que é Rota A vs Rota B, releia a seção "Contexto do projeto" no topo deste documento — não chute.
