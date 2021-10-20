# Projeto Módulo 5 - Back-end

## API de cobranças

# Conteúdos

- Inicialização
- Cadastro de usuário
- Edição do cadastro de usuário
- Cadastro de clientes
- Atualziação de cadastro dos clientes

##Inicialização

### Antes de iniciar o projeto, executar o seguinte comando para instalar os node_modules necessários para execução da API

```JS
npm init -y
```

Também transformar o arquivo .env.example em .env que se encontra no seguinte padrão

```JS
PG_HOST=
PG_USER=
PG_PASSWORD=
PG_DATABASE=
PG_PORT=

JWT_SECRET=
```

Onde o PG se refere aos dados de conexão do postgres(usando knex) e JWT_SECRET é o segredo do token.

#### Para inicialização do projeto local será necessário modificar o códido (removendo os // no arquivo 'connection' e colocando as mesmas barras no primeiro bloco de conexão). Após isso executar o seguinte código

```JS
npm run dev
```

OBS: As requisições locais serão feitas na porta 3000

####Requisições remotas
As requisições remotas serão feitas a partir do seguinte link

```
https://cubosacademy-projeto-5.herokuapp.com/
```

##Endpoints

#### `POST` `/users`

Recebe um JSON como entrada contendo o nome, email e senha do usuário que será cadastrado

```JS
{
	"nome": "Teste",
	"email": "teste@123.com",
	"senha": "teste123"
}
```

Havendo sucesso na requisição (Email válido e todos os campos preenchidos) será exibida a seguinte mensagem:

```JS
"O usuário foi cadastrado com sucesso!"
```

#### `POST` `/login`

Recebe um JSON como entrada contendo o e-mail e a senha cadastradas do usuário a ser logado.

```JS
{
	"email": "teste@123.com",
	"senha": "teste"
}
```

Inserindo os dados corretos será retornado os dados do usuário (com exceção da senha) e o token de autenticação necessário para as próximas requisições.

```JS
{
  "usuario": {
    "id": 15,
    "nome": "Teste",
    "email": "teste@123.com",
    "telefone": null,
    "cpf": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTYzMzMxODcyOSwiZXhwIjoxNjMzMzI1OTI5fQ.zouZwfZE06E9IhVyrMijtUQvDCWnDG8nuHJII2tNjrA"
}
```

### A partir das próximas rotas será necessário utilizar o token na autenticação (Bearer) para fazer as requisições

#### `PUT` `/users`

Recebe um JSON como entrada podendo conter o nome, email, senha, telefone e cpf (Nenhum campo é obrigatório)

```JS
{
	"nome": "Teste Novo",
	"email": "testedoteste@123.com",
	"cpf": "32689679060",
	"telefone": "71991919999"
}
```

Havendo sucesso na requisição (Email e CPF válidos e todos os campos preenchidos) será exibida a seguinte mensagem:

```JS
"Usuário atualizado com sucesso."
```

#### `GET` `/users`

(Rota para suporte ao front-end)
Retorna os dados do usuário logado - Utilizado para renderizar os dados na edição dos dados do usuário.

```JS
[
  {
    "id": 4,
    "nome": "Teste",
    "email": "teste@123.com",
    "senha": "$2a$10$rQJjaTphLvk5UiX1lAlwV.BSBvmJ5fIERS3q4jTh4pKBOK8V/5QWu",
    "telefone": null,
    "cpf": null
  }
]
```

#### `POST` `/clients`

Recebe um JSON como entrada devendo conter os campos obrigatórios nome, email, cpf, telefone e cep, complemento e ponto de referência (Outros dados serão populados pelo front (cidade, estado, rua, etc)) - - Para obter os outros dados localmente por favor descomentar as linhas do response e as consts referentes a esses dados..

```JS
{
	"nome": "Cliente do Teste",
	"email": "clientedoteste@teste.com",
	"cpf": "76373878015",
	"telefone": "719999988877",
	"cep": "41720040",
	"complemento": "ap 104",
	"ponto_referencia": "ao lado da loja das casas bahia"
}
```

Havendo sucesso na requisição (CPF, telefone e e-mail válidos) a requisição terá o seguinte retorno

```JS
"O cliente foi cadastrado com sucesso."
```

#### `PUT` `/clients/:idCliente`

Recebe od id do cliente a ser editado como parâmetro JSON como entrada devendo conter os campos desejados para edição (nome, email, cpf, telefone e cep, complemento e ponto_referencia). - Para obter os outros localmente dados por favor descomentar as linhas do response e as consts referentes a esses dados.

```JS
{
	"nome": "Ex Cliente do Teste",
	"email": "fuiclientedele@exteste.com",
	"cpf": "29422234050",
	"telefone": "719999988877",
	"cep": "41760020",
	"complemento": "ali do lado",
	"ponto_referencia": "em frente ao bar da neide"
}
```

Havendo sucesso na requisição (CPF, telefone e e-mail válidos) a requisição terá o seguinte retorno:

```JS
"Cliente atualizado com sucesso."
```

Caso o id informado não pertença a algum cliente na tabela será retornado:

```JS
"O cliente informado não foi encontrado."
```

#### `GET` `/clients`

Retorna uma listagem com todos os clientes, com seus dados (id, nome, e-mail, telefone, cep e cpf), valores das cobranças já pagas e valores de todas as cobranças feitas.

```JS
[
  {
    "id": 3,
    "nome": "Cliente do Teste Local",
    "email": "clientedoteste@teste.com",
    "telefone": "719999988877",
    "cep": "41720040",
    "cpf": "29422234050",
    "so_pago": "0",
    "valor_cobrado": "6732",
    "statusCliente": "em_dia"
  },
  {
    "id": 5,
    "nome": "Clientasso",
    "email": "clientenovo@teste.com",
    "telefone": "719999988877",
    "cep": "41720040",
    "cpf": "01975264037",
    "so_pago": "0",
    "valor_cobrado": "5443",
    "statusCliente": "inadimplente"
  },
  {
    "id": 4,
    "nome": "Ex Clientela",
    "email": "teste@tes.com",
    "telefone": "71999994444",
    "cep": "41720040",
    "cpf": "26175995074",
    "so_pago": "23678",
    "valor_cobrado": "41578",
    "statusCliente": "em_dia"
  },
...
]
```

#### `GET` `/clients/:idCliente`

Recebe como parâmetro o id do cliente a ser consultado. Caso o cliente exista no banco de dados retornará um objeto contendo os dados do cliente e junto aos dados um objeto contendo todas as cobranças associadas ao cliente:

```JS
{
  "id": 4,
  "nome": "Ex Clientela",
  "cpf": "26175995074",
  "email": "teste@tes.com",
  "telefone": "71999994444",
  "cep": "41720040",
  "bairro": "Imbuí",
  "cidade": "Salvador",
  "logradouro": "Avenida Jorge Amado",
  "complemento": "casa 2A",
  "ponto_referencia": "Em frente ao mercado ods",
  "cobrancas": [
    {
      "id": 9,
      "descricao": "essa cobranca é sua",
      "valor": 3334,
      "data_vencimento": "2021-10-21T03:00:00.000Z",
      "status": "pendente"
    },
    {
      "id": 10,
      "descricao": "essa cobranca é sua também",
      "valor": 12345,
      "data_vencimento": "2021-10-09T03:00:00.000Z",
      "status": "vencido"
    },
    {
      "id": 11,
      "descricao": "essa cobranca dizem que te pertence",
      "valor": 3212,
      "data_vencimento": "2021-10-09T03:00:00.000Z",
      "status": "pago"
    },
    {
      "id": 12,
      "descricao": "essa cobranca é sua, tenho certeza",
      "valor": 3334,
      "data_vencimento": "2021-10-12T03:00:00.000Z",
      "status": "vencido"
    },
    {
      "id": 16,
      "descricao": "sim, é sua essa cobrança",
      "valor": 32123,
      "data_vencimento": "2021-10-12T03:00:00.000Z",
      "status": "pago"
    }
  ]
}
```

#### `POST` `/charges/`

Recebe um objeto JSON com os dados (todos obrigatórios) para cadastrar uma cobrança para determinado cliente:

```JS
{
	"cliente_id": 5,
	"descricao": "cobrei to leve",
	"valor": 5221,
	"status": "pendente",
	"data_vencimento": "2021-10-20"
}
```

Ao final da requisição, estando todos os dados corretos, será retornada a seguinte mensagem:

```JS
"Cobrança cadastrada."
```

#### `PUT` `/charges/:idCobranca`

Recebe o id da cobrança como parâmetro e um objeto JSON com os dados (todos obrigatórios) para alterar uma cobrança para determinado cliente (inclusive podendo alterar o cliente anteriormente associado à cobrança):

```JS
{
	"cliente_id": 5,
	"descricao": "cobrei to leve",
	"valor": 5221,
	"status": "pendente",
	"data_vencimento": "2021-10-20"
}
```

Ao final da requisição, será retornada a seguinte mensagem:

```JS
"Cobrança atualizada com sucesso"
```

#### `GET` `/charges/`

Retorna todas as cobranças cadastradas, informando aquelas na qual a data de vencimento forem maiores que a data atual com o status de vencido:

```JS
[
  {
    "id": 1,
    "cliente_id": 3,
    "nome": "Cliente do Teste Local",
    "descricao": "to cobrando msm",
    "valor": 5500,
    "status": "pendente",
    "data_vencimento": "2021-11-05T03:00:00.000Z"
  },
  {
    "id": 2,
    "cliente_id": 2,
    "nome": "Eurides",
    "descricao": "to cobrando aq",
    "valor": 4455,
    "status": "pendente",
    "data_vencimento": "2021-11-05T03:00:00.000Z"
  },
  {
    "id": 3,
    "cliente_id": 2,
    "nome": "Eurides",
    "descricao": "cobrei de novo",
    "valor": 3322,
    "status": "pendente",
    "data_vencimento": "2021-11-05T03:00:00.000Z"
  },
  {
    "id": 4,
    "cliente_id": 1,
    "nome": "Eurides",
    "descricao": "cobrei de novo tbm",
    "valor": 3322,
    "status": "pendente",
    "data_vencimento": "2021-11-07T03:00:00.000Z"
  },
...,
  {
    "id": 27,
    "cliente_id": 6,
    "nome": "Cliente Novo",
    "descricao": "cobrei to leve de novo",
    "valor": 522,
    "status": "vencido",
    "data_vencimento": "2021-10-05T03:00:00.000Z"
  }
]
```

#### `GET` `/charges/:idCobranca`

(Rota para suporte ao front-end)
Retorna os dados do cadastro parametrizado pelo id - Utilizado para renderizar os dados na edição dos dados da cobrança

```JS
[
  {
    "id": 16,
    "cliente_id": 4,
    "nome": "Ex Clientela",
    "descricao": "sim, é sua essa cobrança",
    "valor": 32123,
    "status": "pago",
    "data_vencimento": "2021-10-12T03:00:00.000Z"
  }
]
```

#### `DELETE` `/charges/:idCobranca`

Recebe o id da cobrança a ser deletada como parâmetro. A cobrança só poderá ser deletada se o status dela for pendente e consequentemente a data de vencimento for menor ou igual a data atual (hoje). Ao final da requisição, caso as condições sejam atendidas, será retornada a seguinte mensagem:

```JS
"Cobrança removida com sucesso."
```

#### `GET` `/reports/charges/:statusCobranca`

Retorna uma lista com as cobranças para os determinados status: pendente, pago e vencido.

Ex: `http://localhost:3000/reports/charges/:vencido`

```JS
[
  {
    "id": 26,
    "cliente_id": 5,
    "nome": "Clientasso",
    "descricao": "cobrei to leve",
    "valor": 222,
    "status": "vencido",
    "data_vencimento": "2021-10-05T03:00:00.000Z"
  },
  {
    "id": 27,
    "cliente_id": 6,
    "nome": "Cliente Novo",
    "descricao": "cobrei to leve de novo",
    "valor": 522,
    "status": "vencido",
    "data_vencimento": "2021-10-05T03:00:00.000Z"
  },
  {
    "id": 32,
    "cliente_id": 5,
    "nome": "Clientasso",
    "descricao": "cobrei to leve",
    "valor": 5221,
    "status": "vencido",
    "data_vencimento": "2021-10-19T03:00:00.000Z"
  },
  {
    "id": 10,
    "cliente_id": 4,
    "nome": "Ex Clientela",
    "descricao": "essa cobranca é sua também",
    "valor": 12345,
    "status": "vencido",
    "data_vencimento": "2021-10-09T03:00:00.000Z"
  },
  {
    "id": 12,
    "cliente_id": 4,
    "nome": "Ex Clientela",
    "descricao": "essa cobranca é sua, tenho certeza",
    "valor": 3334,
    "status": "vencido",
    "data_vencimento": "2021-10-12T03:00:00.000Z"
  }
]
```

#### `GET` `/reports/clients/:statusCliente`

Retorna uma lista com as os para os determinados status: em_dia e inadimplente.
Ex: `http://localhost:3000/reports/clients/inadimplente`

```JS
[
  {
    "id": 5,
    "nome": "Clientasso",
    "email": "clientenovo@teste.com",
    "telefone": "719999988877",
    "cep": "41720040",
    "cpf": "01975264037",
    "so_pago": "0",
    "valor_cobrado": "5443",
    "statusCliente": "inadimplente"
  },
  {
    "id": 4,
    "nome": "Ex Clientela",
    "email": "teste@tes.com",
    "telefone": "71999994444",
    "cep": "41720040",
    "cpf": "26175995074",
    "so_pago": "35335",
    "valor_cobrado": "54348",
    "statusCliente": "inadimplente"
  },
  {
    "id": 6,
    "nome": "Cliente Novo",
    "email": "clientenovonovo@teste.com",
    "telefone": "719999988877",
    "cep": "41720040",
    "cpf": "85081629014",
    "so_pago": "0",
    "valor_cobrado": "522",
    "statusCliente": "inadimplente"
  }
]
```
