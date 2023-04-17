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

Aqui é onde fica interessante. Antes de saber qual ação tomar (criar ou editar) uma chamada para a aws é feita para verificar se já existe uma lambda com o nome do repositório. Caso já exista, ela é atualizada com o código atualizado, que foi zipado e armazenado temporariamente na máquina virtual da pipeline. Caso não exista, um novo  _IAM role_ é criado, políticas básicas de execução são adicionadas à esse role, permitindo que a função possa assumir a role e adicionar logs ao serviço CloudWatch (acesso configurado na política "AWSLambdaBasicExecutionRole", gerenciada pela AWS). Por fim, após a criação das permissões necessárias, a função é criada.

Pode-se perceber que em alguns pontos neste script eu pauso a execusão por 5 segundos. Isso é proposital e necessário. Sem esta pausa, a criação da Lambda gera um erro, pois não reconhece o role passado a ela, já que não teve tempo das alterações serem propagadas pela sua conta na AWS. Este pequeno intervalo de 5s permite que o role seja criado e reconhecido pelos demais serviços antes de ser utilizado (o que foi super divertido de descobrir haha).

# Comentários

Sinceramente não acho que a identificação da lambda pelo commando git diff seja a melhor opção (acho que pessoalmente até iria argumentar a favor de um repo por lambda), mas é uma opção interessante para uma primeira implementação de CI nas lambdas.

Porém, esse pequeno projeto foi uma experiência muito bacana com algumas ferramentas. Pude ter um primeiro entendimento de como as pipelines do Azure funcionam e algum contato com bash scripting. Sinta-se a vontade para utilizar este código e modificá-lo como precisar. Também aceito sugestões de melhoria, refatoração e/ou diferentes abordagens possíveis.


