# Sobre o repositório

Este repositório possuí como propósito principal armazenar minha primeira prática com pipelines no Azure. A ideia desta pipeline é oferecer uma alternativa de implementação de um repositório único (monorepo) para gerenciamento de lambdas na AWS, onde cada diretório dentro do repositório representa uma Lambda. Esta prática me proporcionou novos conhecimentos sobre o Azure, como suas pipelines funcionam (o básico ao menos), algumas formas de autenticação para utilizar comandos contra a API da AWS pela pipeline, um pouco de bash scripting, dentre outros conhecimentos.

# Sobre a estrutura do monorepo

Para melhor entender as etapas da pipeline é preciso conhecer a estrutura de pastas com a qual pratiquei. Foi criado um repositório no Azure chamado "Lambdas", contendo na root apenas o `README.md` e o arquivo `azure-pipelines.yml` com o código da pipeline. Dentro deste repositório, cada pasta representa uma função Lambda, que deve obrigatóriamente ser exportada por um arquivo `index.js`. A estrutura de pastas pode ser conferida na imagem abaixo:

![Screenshot from 2023-04-10 16-50-14](https://user-images.githubusercontent.com/92902666/230985224-4d4577b1-25a0-4a3a-bf88-b9c8079088b0.png)
![image](https://user-images.githubusercontent.com/92902666/230985562-d1e05159-057b-4082-aabc-f8231c5522d2.png)

# Sobre a pipeline

A pipeline utiliza algumas variáveis de ambiente cadastradas para fazer login na conta da AWS. Existem alguns modos de autenticação para executar comandos contra a API da aws, eu escolhi este para praticar por ser o mais rápido. Note também que a pipeline exclui de seus triggers alterações nos arquivos READMNE.md e no código da pipeline, afinal apenas as alterações nos códigos da Lambda interessam nesta pipeline.

## Passo-a-passo

### Identificação da lambda
Através do git diff o nome do repositório (que deve ser o nome da Lambda) é extraído e armazenado em uma variável de ambiente temporária. Acredito que há modos melhores de identificar o repositório onde ocorreram as alterações, mas por hora decidir proseguir desta forma.

### Zip do código

Todo o código da Lambda dentro do diretório é zippado e colocado em um espaço de armazenamento temporário na máquina virtual da pipeline.

### Instalação da CLI

Executa o script para instalação da versão 2 (atual) da AWS CLI.

### Configuração das credenciais

Utiliza as variáveis de ambiente com as credenciais para acessar a conta da AWS.

### Criação/Edição da Lambda

Aqui é onde fica interessante...
