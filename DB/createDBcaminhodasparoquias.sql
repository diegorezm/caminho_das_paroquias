DROP DATABASE IF EXISTS db_caminhodasparoquias;
CREATE DATABASE db_caminhodasparoquias;
\c db_caminhodasparoquias;


CREATE TABLE estado (
	sigla CHAR(2) PRIMARY KEY
);

CREATE TABLE cidade (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(200),
	estado_sigla CHAR(2) NOT NULL,
	
	FOREIGN KEY (estado_sigla) REFERENCES estado(sigla) ON DELETE CASCADE
);

CREATE TABLE endereco (
	id SERIAL PRIMARY KEY,
	cep VARCHAR(9) NOT NULL,
	rua VARCHAR(200),
	bairro VARCHAR(200),
	numero VARCHAR(6),
	
	cidade_id INT NOT NULL,
	
	FOREIGN KEY (cidade_id) REFERENCES cidade(id) ON DELETE CASCADE
);

CREATE TABLE igreja (
	id SERIAL PRIMARY KEY,
	nome_igreja VARCHAR(250) NOT NULL,
	atendente VARCHAR(250),
	email VARCHAR(100) UNIQUE,
	numero_contato VARCHAR(15),
	
	endereco_id INTEGER NOT NULL,
	
	FOREIGN KEY (endereco_id) REFERENCES endereco(id) ON DELETE CASCADE
);

INSERT INTO estado (sigla) VALUES 
('AC'), ('AL'), ('AP'), ('AM'), ('BA'), ('CE'), ('DF'), ('ES'), ('GO'), ('MA'), 
('MT'), ('MS'), ('MG'), ('PA'), ('PB'), ('PR'), ('PE'), ('PI'), ('RJ'), ('RN'), 
('RS'), ('RO'), ('RR'), ('SC'), ('SP'), ('SE'), ('TO')
ON CONFLICT (sigla) DO NOTHING;


