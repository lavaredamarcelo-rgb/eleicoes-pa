# Como restaurar o Eleições PA a partir de um backup

Cada pasta `backups/<data>/` contém TUDO o que é preciso para reconstruir o
sistema do zero. Guarde também a cópia do iCloud Drive ("Backups Eleições PA").

## O que há em cada backup

| Arquivo         | Conteúdo                                                        |
| --------------- | --------------------------------------------------------------- |
| `codigo.bundle` | Todo o código com o histórico git completo                      |
| `dev.db`        | Banco de dados local (TSE 2012–2024, eleitorado 2026, SGIP etc.)|
| `prod.db`       | Banco de PRODUÇÃO baixado do Railway (usuários, cenários salvos, convenções) |
| `env-local.txt` | Segredos locais (`.env` — SESSION_SECRET etc.)                  |

## Restauração completa (novo computador ou pasta apagada)

```bash
# 1. Recriar o projeto a partir do bundle (escolha a pasta de destino)
git clone backups/<data>/codigo.bundle "Eleicoes-pa-restaurado"
cd "Eleicoes-pa-restaurado"

# 2. Restaurar segredos e banco local
cp ../backups/<data>/env-local.txt .env
cp ../backups/<data>/dev.db dev.db

# 3. Dependências e cliente do banco
npm install          # roda "prisma generate" sozinho (postinstall)

# 4. Conferir que subiu
npm run dev          # abrir http://localhost:3000
```

## Restaurar a PRODUÇÃO (Railway)

1. Instale/entre no CLI: `npx @railway/cli login` e `npx @railway/cli link`
   (projeto `eleicoes-pa`).
2. Publique o código restaurado: `npx @railway/cli up`.
3. Restaure o banco de produção enviando o `prod.db` do backup:

```bash
gzip -c backups/<data>/prod.db | base64 | tr -d '\n' > /tmp/prod-b64.txt
# copie o conteúdo para o volume via ssh (em pedaços, se muito grande), ou
# peça ao Claude Code — o processo inverso do backup.
```

> Mais simples: peça ao Claude Code "restaure a produção com o backup de
> <data>" — o procedimento é o inverso exato do `scripts/backup.sh`.

4. Confirme as variáveis no Railway: `DATABASE_URL=file:/data/prod.db`,
   `SESSION_SECRET` (o de produção é diferente do local — se perdido, gere um
   novo; todos precisarão entrar de novo), `NIXPACKS_NODE_VERSION=20`,
   `NIXPACKS_PKGS=python3 gcc gnumake`, `NODE_ENV=production`.

## Fazer um novo backup

```bash
bash scripts/backup.sh
```

Recomendação: rode após cada bloco de mudanças importantes (o Claude Code
também roda quando você pedir "faça um backup").
