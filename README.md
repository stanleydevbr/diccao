# Dicção

Aplicação web para praticar dicção com exercícios por nível, uma rotina semanal, gravação de voz e anotações.

## Requisitos

- **Python 3.7 ou superior** para iniciar o servidor local.
- **Node.js 18 ou superior** para executar os testes.
- Um navegador moderno. Para gravar áudio, o navegador precisa oferecer suporte à API `MediaRecorder` e ter acesso ao microfone.

O projeto não tem dependências npm de terceiros, portanto não é necessário executar `npm install`.

## Estrutura do projeto

```text
diccao/
├── package.json              # Scripts para iniciar o servidor e executar os testes
├── README.md
└── app/
    ├── index.html            # Estrutura da página
    ├── styles.css            # Estilos e layout responsivo
    ├── src/
    │   ├── main.js           # Interface, gravação de áudio e anotações
    │   ├── data/
    │   │   └── exercises.js  # Catálogo de exercícios
    │   └── lib/
    │       └── plan.js       # Sequência de exercícios e plano semanal
    └── tests/
        └── plan.test.js      # Testes da sequência de exercícios e do plano
```

## Instalação e execução local

1. Instale Python e Node.js, caso ainda não estejam disponíveis no computador.
2. Abra o PowerShell ou o terminal na pasta raiz do projeto (`diccao`).
3. Inicie o servidor:

   ```powershell
   npm run dev
   ```

   Esse comando executa `python -m http.server 8000 --directory app` e publica os arquivos da pasta `app` na porta `8000`.

   Se o comando `python` não for reconhecido no Windows, confirme que o Python está instalado e adicionado ao `PATH`. Como alternativa, inicie o servidor diretamente pelo launcher do Python:

   ```powershell
   py -m http.server 8000 --directory app
   ```

4. Abra [http://localhost:8000](http://localhost:8000) no navegador.
5. Para encerrar o servidor, volte ao terminal e pressione `Ctrl+C`.

Não abra `app/index.html` diretamente como arquivo: o servidor local permite que o navegador carregue corretamente os módulos JavaScript da aplicação.

## Como usar

- Em **Exercícios**, selecione um nível e escolha um exercício para ver suas instruções.
- Em **Plano**, consulte a rotina semanal correspondente ao nível selecionado.
- Em **Gravação**, permita o acesso ao microfone, pressione **Gravar** para começar e pressione novamente para parar. Use **Ouvir última gravação** ou os controles de áudio para reproduzi-la.
- Escreva uma observação e pressione **Salvar nota** para guardá-la neste navegador.

O navegador solicita permissão para usar o microfone. `localhost` é considerado uma origem segura pelos navegadores modernos; em outros endereços, a gravação pode exigir HTTPS. As anotações ficam no armazenamento local do navegador. As gravações usam URLs temporárias do navegador e podem deixar de estar disponíveis após recarregar ou fechar a página.

## Testes

Com Node.js instalado, execute na pasta raiz:

```powershell
npm test
```

O comando usa o test runner nativo do Node.js para verificar a geração do plano semanal e a seleção de exercícios por nível.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica automaticamente o conteúdo de `app/` no GitHub Pages quando há um push para a branch `main`. Também é possível iniciá-lo manualmente pela aba **Actions** usando **Deploy to GitHub Pages**.

Na primeira publicação, abra **Settings > Pages** no repositório e selecione **GitHub Actions** como origem de publicação. Quando o workflow terminar, o endereço do site aparece no resumo da execução e em **Settings > Pages**.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor HTTP local na porta `8000`, servindo a pasta `app`. |
| `npm test` | Executa os testes automatizados em `app/tests`. |
