CREATE TABLE stores(
    idStore varchar(36) primary key,
    label varchar(50) not null,
    nameContact varchar(50),
    numberContact varchar(50),
    cnpj varchar(50),
    razaoSocial varchar(50),
    inscricaoEstadual varchar(50),
    endereco varchar(50),
    numero varchar(50),
    bairro varchar(50),
    cidade varchar(50),
    uf varchar(50),
    cep varchar(50),
    createdAt datetime default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `stores` (`idStore`,`label`) VALUES 
    ('b9f1901b-269e-11ef-8f5a-d92739a69807','Loja Admin');

CREATE TABLE `users` (
    `idUser` varchar(36) NOT NULL PRIMARY KEY,
    `idStore` varchar(36) NOT NULL,
    `name` varchar(50) NOT NULL,
    `email` varchar(50) NOT NULL,
    `password` char(32) NOT NULL,
    `permition` int not null,
    `createdAt` datetime default CURRENT_TIMESTAMP(),
    `updatedAt` datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idStore) REFERENCES stores(idStore)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`idUser`, `name`, `email`, `password`, `permition`,`idStore`) VALUES
(   '6e5ac729-0489-11ef-9412-e66239f625d6',
    'Administrador', 
    'felipe@hotmail.com', 
    '5c02f67a1da6b9b24c87a914d44c7470',
    '1',
    'b9f1901b-269e-11ef-8f5a-d92739a69807'
);

CREATE TABLE clients(
    idClient varchar(36) primary key not null,
    idStore varchar(36) NOT NULL,
    phone varchar(50) NOT NULL,
    name varchar(100) NOT NULL,
    birth date,

    /*ENDERECO*/
    endereco varchar(50),
    numero varchar(50),
    bairro varchar(50),
    cidade varchar(50),
    uf varchar(50),
    cep varchar(50),

    createdAt datetime not null default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idStore) REFERENCES stores(idStore)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quotes(
    idQuote varchar(36) primary key not null,
    idStore varchar(36) NOT NULL,
    idUserRegister varchar(36) NOT NULL,
    idClient varchar(36) not null,

    status int not null default 1,
    description text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci not null,
    instructions text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    services longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    price float,

    createdAt datetime not null default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idStore) REFERENCES stores(idStore),
    FOREIGN KEY (idUserRegister) REFERENCES users(idUser),
    FOREIGN KEY (idClient) REFERENCES clients(idClient)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notes(
    idNote varchar(36) primary key not null,
    idQuote varchar(36) NOT NULL,
    idUserRegister varchar(36) NOT NULL,

    description text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci not null,

    createdAt datetime not null default CURRENT_TIMESTAMP(),
    FOREIGN KEY (idQuote) REFERENCES quotes(idQuote),
    FOREIGN KEY (idUserRegister) REFERENCES users(idUser)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customFields(
	idCustomField varchar(36) primary key,
    idStore varchar(36) not null,
    tableReference int not null,
    label varchar(50) not null,
    required boolean not null,
    searchable boolean not null,
    editable boolean not null,
    type varchar(50),
    createdAt datetime not null default CURRENT_TIMESTAMP(),
    FOREIGN KEY (idStore) REFERENCES stores(idStore)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customFieldContents (
	idCustomFieldContent varchar(36) primary key,
    idCustomField varchar(36) not null,
    idTableReference varchar(36) not null,
    content text not null,
    FOREIGN KEY (idCustomField) REFERENCES customFields(idCustomField)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;