This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SQL

-- Deleta a tabela caso já exista uma
drop if exists table products;

-- Cri a tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  expiration_date DATE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  purchase_price DECIMAL(10,2) NOT NULL CHECK (purchase_price > 0),
  purchase_currency VARCHAR(10) NOT NULL,
  sale_price DECIMAL(10,2),
  sale_currency VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opcional: Limpar a tabela products antes de inserir novos dados
TRUNCATE TABLE products RESTART IDENTITY;

-- Inserir 100 registros fictícios na tabela products
INSERT INTO products (name, category, expiration_date, quantity, purchase_price, purchase_currency, sale_price, sale_currency, created_at) VALUES
('Arroz Integral 5kg', 'Alimentos', '2025-12-31', 200, 15.50, 'BRL', 22.00, 'BRL', '2024-01-15 10:00:00'),
('Smartphone Galaxy S23', 'Eletrônicos', NULL, 50, 800.00, 'USD', 1000.00, 'USD', '2024-02-20 14:30:00'),
('Camiseta Algodão M', 'Vestuário', NULL, 150, 25.00, 'BRL', 40.00, 'BRL', '2024-03-10 09:15:00'),
('Leite em Pó 400g', 'Alimentos', '2026-06-30', 300, 12.75, 'BRL', 18.50, 'BRL', '2024-04-05 11:45:00'),
('Fone de Ouvido Bluetooth', 'Eletrônicos', NULL, 80, 50.00, 'USD', 70.00, 'USD', '2024-05-12 16:20:00'),
('Calça Jeans Azul', 'Vestuário', NULL, 100, 80.00, 'BRL', 120.00, 'BRL', '2024-06-18 13:10:00'),
('Feijão Carioca 1kg', 'Alimentos', '2025-09-30', 250, 8.90, 'BRL', 13.50, 'BRL', '2024-07-22 08:50:00'),
('Notebook Dell Inspiron', 'Eletrônicos', NULL, 30, 1200.00, 'USD', 1500.00, 'USD', '2024-08-30 15:25:00'),
('Tênis Esportivo Nike', 'Vestuário', NULL, 120, 150.00, 'BRL', 220.00, 'BRL', '2024-09-14 12:00:00'),
('Azeite Extra Virgem 500ml', 'Alimentos', '2026-03-31', 180, 35.00, 'BRL', 50.00, 'BRL', '2024-10-01 10:30:00'),
('Televisor LED 55"', 'Eletrônicos', NULL, 40, 600.00, 'USD', 800.00, 'USD', '2024-11-05 17:40:00'),
('Jaqueta de Couro', 'Vestuário', NULL, 90, 200.00, 'BRL', 300.00, 'BRL', '2024-12-12 14:15:00'),
('Macarrão Espaguete 500g', 'Alimentos', '2025-11-30', 400, 4.50, 'BRL', 7.00, 'BRL', '2025-01-20 09:00:00'),
('Mouse Sem Fio Logitech', 'Eletrônicos', NULL, 200, 20.00, 'USD', 30.00, 'USD', '2025-02-25 11:50:00'),
('Vestido Floral', 'Vestuário', NULL, 130, 60.00, 'BRL', 90.00, 'BRL', '2025-03-15 13:30:00'),
('Café em Grão 1kg', 'Alimentos', '2026-01-31', 220, 30.00, 'BRL', 45.00, 'BRL', '2025-04-10 10:20:00'),
('Tablet Samsung 10"', 'Eletrônicos', NULL, 60, 300.00, 'USD', 400.00, 'USD', '2024-01-30 15:00:00'),
('Sapato Social Masculino', 'Vestuário', NULL, 110, 120.00, 'BRL', 180.00, 'BRL', '2024-02-28 12:45:00'),
('Biscoito Recheado 150g', 'Alimentos', '2025-08-31', 350, 3.20, 'BRL', 5.00, 'BRL', '2024-03-25 09:10:00'),
('Câmera Digital Canon', 'Eletrônicos', NULL, 25, 500.00, 'USD', 650.00, 'USD', '2024-04-15 16:30:00'),
('Bermuda Esportiva', 'Vestuário', NULL, 140, 40.00, 'BRL', 60.00, 'BRL', '2024-05-20 14:00:00'),
('Suco de Laranja 1L', 'Alimentos', '2025-07-31', 280, 6.50, 'BRL', 10.00, 'BRL', '2024-06-10 11:15:00'),
('Monitor 24" Full HD', 'Eletrônicos', NULL, 70, 150.00, 'USD', 200.00, 'USD', '2024-07-05 13:50:00'),
('Blusa de Lã', 'Vestuário', NULL, 160, 70.00, 'BRL', 100.00, 'BRL', '2024-08-12 10:40:00'),
('Farinha de Trigo 1kg', 'Alimentos', '2025-10-31', 300, 5.00, 'BRL', 8.00, 'BRL', '2024-09-18 09:30:00'),
('Teclado Mecânico RGB', 'Eletrônicos', NULL, 90, 80.00, 'USD', 110.00, 'USD', '2024-10-22 15:20:00'),
('Calça Legging', 'Vestuário', NULL, 170, 50.00, 'BRL', 75.00, 'BRL', '2024-11-30 12:10:00'),
('Iogurte Natural 900g', 'Alimentos', '2025-06-30', 260, 10.00, 'BRL', 15.00, 'BRL', '2024-12-15 14:25:00'),
('Smartwatch Xiaomi', 'Eletrônicos', NULL, 100, 100.00, 'USD', 140.00, 'USD', '2025-01-10 16:00:00'),
('Chinelo Havaianas', 'Vestuário', NULL, 200, 20.00, 'BRL', 30.00, 'BRL', '2025-02-05 11:30:00'),
('Açúcar Refinado 1kg', 'Alimentos', '2026-02-28', 320, 4.00, 'BRL', 6.50, 'BRL', '2025-03-12 09:50:00'),
('Impressora Multifuncional', 'Eletrônicos', NULL, 35, 250.00, 'USD', 320.00, 'USD', '2025-04-01 13:15:00'),
('Moletom com Capuz', 'Vestuário', NULL, 180, 90.00, 'BRL', 130.00, 'BRL', '2024-01-25 10:00:00'),
('Molho de Tomate 340g', 'Alimentos', '2025-11-30', 400, 2.50, 'BRL', 4.00, 'BRL', '2024-02-15 12:20:00'),
('Carregador USB-C', 'Eletrônicos', NULL, 250, 15.00, 'USD', 22.00, 'USD', '2024-03-05 14:45:00'),
('Saia Midi', 'Vestuário', NULL, 140, 55.00, 'BRL', 80.00, 'BRL', '2024-04-20 11:00:00'),
('Cereal Matinal 300g', 'Alimentos', '2025-09-30', 300, 8.00, 'BRL', 12.00, 'BRL', '2024-05-25 09:25:00'),
('Roteador Wi-Fi 6', 'Eletrônicos', NULL, 60, 120.00, 'USD', 160.00, 'USD', '2024-06-30 15:10:00'),
('Boné Esportivo', 'Vestuário', NULL, 200, 30.00, 'BRL', 45.00, 'BRL', '2024-07-15 12:35:00'),
('Óleo de Soja 900ml', 'Alimentos', '2026-04-30', 280, 7.50, 'BRL', 11.00, 'BRL', '2024-08-20 10:50:00'),
('Caixa de Som Bluetooth', 'Eletrônicos', NULL, 80, 70.00, 'USD', 95.00, 'USD', '2024-09-25 14:00:00'),
('Camisa Polo', 'Vestuário', NULL, 150, 45.00, 'BRL', 65.00, 'BRL', '2024-10-10 11:15:00'),
('Manteiga 200g', 'Alimentos', '2025-08-31', 350, 9.00, 'BRL', 13.50, 'BRL', '2024-11-15 09:40:00'),
('Console PS5', 'Eletrônicos', NULL, 20, 900.00, 'USD', 1100.00, 'USD', '2024-12-20 16:30:00'),
('Meia Esportiva', 'Vestuário', NULL, 300, 10.00, 'BRL', 15.00, 'BRL', '2025-01-05 12:00:00'),
('Sal Refinado 1kg', 'Alimentos', '2026-05-31', 400, 2.00, 'BRL', 3.50, 'BRL', '2025-02-10 10:25:00'),
('Pendrive 64GB', 'Eletrônicos', NULL, 200, 10.00, 'USD', 15.00, 'USD', '2025-03-15 14:50:00'),
('Casaco de Inverno', 'Vestuário', NULL, 120, 150.00, 'BRL', 220.00, 'BRL', '2025-04-05 11:10:00'),
('Chá de Camomila 100g', 'Alimentos', '2025-12-31', 250, 5.50, 'BRL', 8.50, 'BRL', '2024-01-10 09:00:00'),
('Projetor LED', 'Eletrônicos', NULL, 30, 400.00, 'USD', 500.00, 'USD', '2024-02-20 15:30:00'),
('Calça Social', 'Vestuário', NULL, 100, 100.00, 'BRL', 150.00, 'BRL', '2024-03-30 12:45:00'),
('Geleia de Morango 300g', 'Alimentos', '2025-10-31', 300, 6.00, 'BRL', 9.00, 'BRL', '2024-04-25 10:15:00'),
('Webcam HD', 'Eletrônicos', NULL, 150, 30.00, 'USD', 45.00, 'USD', '2024-05-15 14:00:00'),
('Cinto de Couro', 'Vestuário', NULL, 180, 35.00, 'BRL', 50.00, 'BRL', '2024-06-20 11:30:00'),
('Atum em Lata 170g', 'Alimentos', '2026-03-31', 350, 4.50, 'BRL', 7.00, 'BRL', '2024-07-25 09:50:00'),
('Headset Gamer', 'Eletrônicos', NULL, 90, 60.00, 'USD', 85.00, 'USD', '2024-08-30 15:20:00'),
('Jaqueta Jeans', 'Vestuário', NULL, 140, 80.00, 'BRL', 120.00, 'BRL', '2024-09-05 12:10:00'),
('Leite Condensado 395g', 'Alimentos', '2025-11-30', 320, 5.50, 'BRL', 8.50, 'BRL', '2024-10-10 10:40:00'),
('Smart TV 43"', 'Eletrônicos', NULL, 50, 500.00, 'USD', 650.00, 'USD', '2024-11-15 16:00:00'),
('Sapatênis Casual', 'Vestuário', NULL, 160, 70.00, 'BRL', 100.00, 'BRL', '2024-12-20 11:25:00'),
('Milho para Pipoca 500g', 'Alimentos', '2025-09-30', 400, 3.00, 'BRL', 5.00, 'BRL', '2025-01-25 09:15:00'),
('Adaptador HDMI', 'Eletrônicos', NULL, 200, 12.00, 'USD', 18.00, 'USD', '2025-02-15 14:30:00'),
('Regata Esportiva', 'Vestuário', NULL, 180, 25.00, 'BRL', 40.00, 'BRL', '2025-03-20 12:00:00'),
('Massa para Bolo 400g', 'Alimentos', '2025-12-31', 300, 4.00, 'BRL', 6.50, 'BRL', '2025-04-10 10:45:00'),
('Drone com Câmera', 'Eletrônicos', NULL, 40, 300.00, 'USD', 400.00, 'USD', '2024-01-15 15:00:00'),
('Cachecol de Lã', 'Vestuário', NULL, 150, 30.00, 'BRL', 45.00, 'BRL', '2024-02-25 11:20:00'),
('Erva-Mate 500g', 'Alimentos', '2026-01-31', 250, 7.00, 'BRL', 10.50, 'BRL', '2024-03-10 09:30:00'),
('Cabo USB 2m', 'Eletrônicos', NULL, 300, 8.00, 'USD', 12.00, 'USD', '2024-04-05 14:50:00'),
('Camisa Social', 'Vestuário', NULL, 120, 60.00, 'BRL', 90.00, 'BRL', '2024-05-15 12:15:00'),
('Sardinha em Lata 125g', 'Alimentos', '2025-10-31', 400, 3.50, 'BRL', 5.50, 'BRL', '2024-06-20 10:00:00'),
('Power Bank 10000mAh', 'Eletrônicos', NULL, 100, 40.00, 'USD', 55.00, 'USD', '2024-07-25 15:30:00'),
('Calça de Moletom', 'Vestuário', NULL, 140, 50.00, 'BRL', 75.00, 'BRL', '2024-08-30 11:45:00'),
('Creme de Leite 200g', 'Alimentos', '2025-08-31', 350, 3.00, 'BRL', 4.50, 'BRL', '2024-09-05 09:20:00'),
('Controle Remoto Universal', 'Eletrônicos', NULL, 200, 15.00, 'USD', 22.00, 'USD', '2024-10-10 14:00:00'),
('Bolsa Feminina', 'Vestuário', NULL, 160, 80.00, 'BRL', 120.00, 'BRL', '2024-11-15 12:30:00'),
('Achocolatado 400g', 'Alimentos', '2025-11-30', 300, 6.50, 'BRL', 9.50, 'BRL', '2024-12-20 10:10:00'),
('Microfone USB', 'Eletrônicos', NULL, 90, 50.00, 'USD', 70.00, 'USD', '2025-01-25 15:15:00'),
('Calça Cargo', 'Vestuário', NULL, 130, 70.00, 'BRL', 100.00, 'BRL', '2025-02-15 11:00:00'),
('Gelatina em Pó 35g', 'Alimentos', '2025-12-31', 400, 2.00, 'BRL', 3.50, 'BRL', '2025-03-20 09:40:00'),
('Mini Teclado Bluetooth', 'Eletrônicos', NULL, 150, 25.00, 'USD', 35.00, 'USD', '2025-04-05 14:20:00'),
('Mochila Esportiva', 'Vestuário', NULL, 180, 90.00, 'BRL', 130.00, 'BRL', '2024-01-30 12:50:00'),
('Vinagre de Maçã 500ml', 'Alimentos', '2026-02-28', 250, 5.00, 'BRL', 7.50, 'BRL', '2024-02-10 10:00:00'),
('Fone In-Ear', 'Eletrônicos', NULL, 300, 10.00, 'USD', 15.00, 'USD', '2024-03-15 15:45:00'),
('Luva de Inverno', 'Vestuário', NULL, 200, 20.00, 'BRL', 30.00, 'BRL', '2024-04-20 11:30:00'),
('Maionese 500g', 'Alimentos', '2025-09-30', 350, 7.50, 'BRL', 11.00, 'BRL', '2024-05-25 09:15:00'),
('Hub USB 4 Portas', 'Eletrônicos', NULL, 250, 12.00, 'USD', 18.00, 'USD', '2024-06-30 14:00:00'),
('Camiseta Estampada', 'Vestuário', NULL, 170, 35.00, 'BRL', 50.00, 'BRL', '2024-07-05 12:20:00'),
('Pão de Forma 500g', 'Alimentos', '2025-07-31', 400, 5.50, 'BRL', 8.50, 'BRL', '2024-08-10 10:45:00'),
('Cabo HDMI 3m', 'Eletrônicos', NULL, 200, 15.00, 'USD', 22.00, 'USD', '2024-09-15 15:10:00'),
('Calça de Alfaiataria', 'Vestuário', NULL, 150, 100.00, 'BRL', 150.00, 'BRL', '2024-10-20 11:55:00'),
('Mel 300g', 'Alimentos', '2026-01-31', 300, 15.00, 'BRL', 22.00, 'BRL', '2024-11-25 09:30:00'),
('Mouse Pad Gamer', 'Eletrônicos', NULL, 250, 10.00, 'USD', 15.00, 'USD', '2024-12-30 14:25:00'),
('Blusa de Manga Longa', 'Vestuário', NULL, 180, 50.00, 'BRL', 75.00, 'BRL', '2025-01-15 12:00:00'),
('Mostarda 200g', 'Alimentos', '2025-10-31', 350, 4.50, 'BRL', 7.00, 'BRL', '2025-02-20 10:15:00'),
('Carregador Portátil', 'Eletrônicos', NULL, 200, 20.00, 'USD', 30.00, 'USD', '2025-03-25 15:00:00'),
('Óculos de Sol', 'Vestuário', NULL, 160, 60.00, 'BRL', 90.00, 'BRL', '2025-04-10 11:40:00');

-- Verificar os dados inseridos
SELECT COUNT(*) FROM products;
SELECT * FROM products LIMIT 5;
