CREATE DATABASE sistema_cobrancas;

CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
  	nome text NOT NULL,
  	email text NOT NULL UNIQUE,
  	senha text NOT NULL,
  	telefone text,
  	cpf varchar(11) UNIQUE
);

CREATE TABLE clientes(
	id serial PRIMARY KEY,
  	nome text NOT NULL,
  	email text NOT NULL UNIQUE,
  	cpf varchar(11) NOT NULL UNIQUE,
  	telefone text NOT NULL,
  	cep varchar(8),
  	logradouro text,
  	complemento text,
  	bairro text,
  	cidade text,
  	estado text
  	ponto_referencia text
);

CREATE TABLE cobrancas(
	id serial PRIMARY KEY,
  	cliente_id integer NOT NULL,
  	descricao text NOT NULL,
  	valor integer NOT NULL,
  	status text NOT NULL,
  	data_vencimento date,
  	FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);