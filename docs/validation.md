# Verificação da edição web

Em 13/10/2026, o inventário REA do ZIP produziu `ev_8fd838756ea3adac0b97f3b57af3c967b9b14c1fb71e0bb10bf13086c6a428e6`, com três EXEs. Os hashes e a igualdade do conteúdo SWF incorporado constam em original-identities.json.

## Observação no navegador

- Os três níveis carregaram partituras e perguntas sem instalar Flash.
- Nível 1: resposta correta para Mi menor harmônica mostrou PARABÉNS e avançou a Mi menor melódica. A variante de fontes foi também respondida em viewport móvel 390×844; acerto passou de zero para um.
- Nível 2: uma alternativa errada para Si menor harmônica mostrou Tente Novamente e erros=1. A alternativa correta mostrou PARABÉNS, acertos=1 e erros=1, mantendo a contagem anterior.
- Nível 3: Sol♯ menor harmônica, incluindo sustenido duplo, aceitou a alternativa correta e marcou acertos=1.
- Menu e jogo móvel apresentaram largura útil e de rolagem de 375px, sem transbordamento horizontal. O jogo mantém a proporção original 720×480; a orientação horizontal oferece leitura maior.
- Silenciar mudou para Ativar som. Sobre abre um diálogo HTML que pausa o player; fechar retoma o conteúdo. Tela cheia entrou e dispõe de botão próprio para sair.

Um erro de API de pausa encontrado durante o desenvolvimento foi corrigido para os métodos `suspend`/`resume` da API Ruffle instalada antes da publicação. A validação de carregamento isolado do conteúdo interno falhou: depende do contexto do carregador original. A publicação usa os carregadores completos com a adaptação de fontes, não esse experimento.

## Testes de preservação

Três testes passaram, um por nível. Comparam todos os recursos/tags originais com as variantes, verificam que só o conteúdo ID3 muda no carregador e que somente as constantes XML previstas e os dois placements específicos do placar mudam no conteúdo. Todos os metadados, métodos e corpos ActionScript depois do pool de strings são idênticos. Sons, vetores, textos estáticos e demais recursos também são comparados.

Correção de alinhamento: os campos ra/wa foram elevados 140 twips (7 px) nos três níveis, sem mudar x, escala, rotação, nome ou profundidade. O teste compara os seis payloads PlaceObject2 exatos antes/depois, sem exceção genérica para outras posições. O navegador confirmou que 0 e 1 agora ficam na mesma linha dos rótulos; registrar um acerto continuou incrementando o contador. O manifesto position-patch.json documenta os offsets e matrizes. URLs versionadas evitam reutilizar os SWFs anteriores em cache.

Os testes não afirmam que todas as 60 questões foram respondidas manualmente nem que a compatibilidade de todo Flash é completa. As perguntas e os retornos acima foram observados no navegador; quantidade/sequência e contagem são apoiadas na análise estática do ABC.
