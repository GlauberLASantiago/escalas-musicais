# Escalas Musicais

Os três aplicativos Flash originais reunidos em um único app web de reconhecimento de escalas.

[Abrir o aplicativo](https://glauberlasantiago.github.io/escalas-musicais/)

## Jogar

Escolha um nível, leia o nome da escala e selecione a partitura correspondente entre quatro alternativas. O jogo preserva as partituras, sons, animações, sequência de perguntas, retorno de respostas e contadores originais.

- Nível 1: 12 questões; Dó, Sol e Fá maiores, e suas relativas menores.
- Nível 2: 24 questões; Ré, Si♭, Lá, Mi♭, Mi e Lá♭ maiores, e suas relativas menores.
- Nível 3: 24 questões; Si, Ré♭, Fá♯, Sol♭, Dó♯ e Dó♭ maiores, e suas relativas menores.

As menores incluem as formas natural, harmônica e melódica. Há controles únicos para escolher nível, reiniciar, silenciar e abrir tela cheia. Reiniciar ou trocar de nível encerra a partida atual e zera o placar do nível. Não há conta ou servidor de dados. Em telas pequenas, jogar na horizontal ou em tela cheia facilita a leitura da pauta.

## Como foi recuperado

Os EXEs fornecidos são projetores Flash e contêm byte a byte os SWFs correspondentes. O pacote foi inventariado com REA; o conteúdo SWF e os métodos ActionScript foram examinados por parsers locais. O app executa esse conteúdo com [Ruffle 0.7.1](https://github.com/ruffle-rs/ruffle/releases/tag/v0.7.1), hospedado junto ao site, sem exigir Adobe Flash ou extensão.

`assets/original/dificuldade_N.swf` preserva os arquivos fornecidos. As versões de reprodução em `assets/web/dificuldade_N.swf` alteram somente constantes XML de fonte TLF: Calibri incorporada passa a Arial de dispositivo, para que os números dos contadores sejam visíveis. O carregador, os métodos e o restante dos recursos permanecem intactos. Três testes verificam essa preservação byte a byte.

O arquivo externo `creditos.swf`, citado pelo jogo, não foi fornecido. O controle Sobre da interface web apresenta as informações verificadas, mantendo as marcas originais Educação Musical UFSCar, UFSCar e CAPES. Não se reconstruiu uma lista de autores sem evidência.

## Desenvolvimento

Node.js 20 ou superior para servir/testar; não é necessário instalar dependências.

```sh
npm start
# http://127.0.0.1:4190/
npm test
```

O site é estático e pode ser servido por qualquer servidor HTTP que entregue `.wasm` como `application/wasm`. GitHub Pages publica a raiz de `main`; os caminhos são relativos para funcionar em `/escalas-musicais/`. O Ruffle está fixado em 0.7.1, com suas licenças MIT e Apache incluídas em `vendor/ruffle`.

Os materiais educativos originais foram fornecidos pelo proprietário do acervo/repositório. Esta publicação não presume uma licença adicional para eles. A análise, identidades e limites estão em [docs/original-analysis.md](docs/original-analysis.md); a validação em [docs/validation.md](docs/validation.md).
