-- Patch para corrigir Favoritos e BackLog no Joga+.
-- Erro corrigido: Unknown column 'status' in 'field list'.
-- Rode no banco usado pelo backend, caso ainda apareça erro ao iniciar.
-- Exemplo:
-- mysql -u SEU_USUARIO -p NOME_DO_BANCO < prisma/patch_lists_backlog_favorites.sql

ALTER TABLE `lists`
  MODIFY COLUMN `tipo_lista` ENUM(
    'desejados',
    'nao_jogados',
    'jogados',
    'jogar_novamente',
    'backlog',
    'favoritos'
  ) NOT NULL;

SET @status_col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'lists'
    AND COLUMN_NAME = 'status'
);

SET @add_status_sql := IF(
  @status_col_exists = 0,
  'ALTER TABLE `lists` ADD COLUMN `status` ENUM(''quer_jogar'', ''joguei'', ''talvez'') NOT NULL DEFAULT ''quer_jogar'' AFTER `prioridade`',
  'SELECT ''Coluna status já existe'' AS info'
);

PREPARE stmt FROM @add_status_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE `lists`
SET `status` = 'quer_jogar'
WHERE `status` IS NULL OR `status` = '';
