-- Reset all abias_usuarios passwords to 'teste123'
UPDATE abias_usuarios
SET senha_hash = crypt('teste123', gen_salt('bf', 10));
