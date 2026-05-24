-- =========================================================
-- SEED 005: abias_membros para os 5 entregadores iFood seed
-- Telefones normalizados para casar com usuarios.telefone
-- =========================================================

INSERT INTO abias_membros (id, nome, telefone, regiao, tempo_atuacao, ferramenta, raca, reputacao) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'Carlos Augusto Nascimento',
  '11940010001',
  'Zona Leste, São Paulo',
  '3 anos',
  'Moto',
  'Preto',
  820
),
(
  'b2000000-0000-0000-0000-000000000002',
  'Regiane Ferreira dos Santos',
  '11940010002',
  'Zona Leste, São Paulo',
  '18 meses',
  'Bicicleta',
  'Parda',
  640
),
(
  'b3000000-0000-0000-0000-000000000003',
  'Marcos Vinícius Almeida',
  '11940010003',
  'Zona Leste, São Paulo',
  '8 meses',
  'Moto',
  'Preto',
  480
),
(
  'b4000000-0000-0000-0000-000000000004',
  'Aline Cristina Souza',
  '11940010004',
  'Zona Leste, São Paulo',
  '6 meses',
  'Bicicleta',
  'Parda',
  310
),
(
  'b5000000-0000-0000-0000-000000000005',
  'Jefferson Lima Barbosa',
  '11940010005',
  'Zona Leste, São Paulo',
  '2 anos',
  'Moto',
  'Preto',
  710
)
ON CONFLICT DO NOTHING;
