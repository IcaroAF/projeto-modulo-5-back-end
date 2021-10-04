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

#### `POST` `/clients`

Recebe um JSON como entrada devendo conter os campos obrigatórios nome, email, cpf, telefone e cep (que após a requisição também cadastrará os dados referentes ao cep (logradouro, bairro, etc)).

```JS
{
	"nome": "Cliente do Teste",
	"email": "clientedoteste@teste.com",
	"cpf": "76373878015",
	"telefone": "719999988877",
	"cep": "41720040"
}
```

Havendo sucesso na requisição (CPF, telefone e e-mail válidos) a requisição terá o seguinte retorno

```JS
"O cliente foi cadastrado com sucesso."
```

#### `PUT` `/clients`

Recebe um JSON como entrada devendo conter os campos desejados para edição (nome, email, cpf, telefone e cep).

```JS
{
	"nome": "Ex Cliente do Teste",
	"email": "fuiclientedele@exteste.com",
	"cpf": "29422234050",
	"telefone": "719999988877",
	"cep": "41760020"
}
```

Havendo sucesso na requisição (CPF, telefone e e-mail válidos) a requisição terá o seguinte retorno:

```JS
"Cliente atualizado com sucesso."
```
