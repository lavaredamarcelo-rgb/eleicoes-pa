#!/bin/bash
# Backup completo do Eleições PA: código (histórico git inteiro), banco
# local, banco de PRODUÇÃO (Railway) e segredos — em backups/<data>/ e,
# se disponível, uma cópia no iCloud Drive.
# Uso: bash scripts/backup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

DATA=$(date +%Y-%m-%d-%H%M)
DEST="backups/$DATA"
mkdir -p "$DEST"
echo "→ Backup em $DEST"

echo "1/5 Código (git bundle com todo o histórico)…"
git bundle create "$DEST/codigo.bundle" --all
git bundle verify "$DEST/codigo.bundle" > /dev/null && echo "    bundle íntegro"

echo "2/5 Banco local (cópia consistente)…"
sqlite3 dev.db ".backup '$DEST/dev.db'"
[ "$(sqlite3 "$DEST/dev.db" 'PRAGMA integrity_check;')" = "ok" ] && echo "    dev.db íntegro"

echo "3/5 Segredos (.env)…"
cp .env "$DEST/env-local.txt"

echo "4/5 Banco de PRODUÇÃO (Railway)…"
# Snapshot consistente via VACUUM INTO (better-sqlite3 do próprio app);
# o script node vai codificado em base64 para não brigar com aspas no ssh.
SNIPPET="try{require('/app/node_modules/better-sqlite3')('/data/prod.db').exec(\"VACUUM INTO '/tmp/bk.db'\")}catch(e){require('fs').copyFileSync('/data/prod.db','/tmp/bk.db')}"
B64=$(printf %s "$SNIPPET" | base64 | tr -d '\n')
npx --yes @railway/cli ssh -- "sh -c 'echo $B64 | base64 -d > /tmp/bk.js && node /tmp/bk.js && gzip -c /tmp/bk.db | base64 && rm -f /tmp/bk.db /tmp/bk.js'" \
  | grep -E '^[A-Za-z0-9+/=]+$' | base64 -d | gunzip > "$DEST/prod.db"
[ "$(sqlite3 "$DEST/prod.db" 'PRAGMA integrity_check;')" = "ok" ] && echo "    prod.db íntegro"

echo "5/5 Cópia no iCloud Drive…"
ICLOUD="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Claude Code.Projetos/Eleicoes-pa"
if [ -d "$(dirname "$ICLOUD")" ]; then
  mkdir -p "$ICLOUD"
  cp -R "$DEST" "$ICLOUD/$DATA"
  cp backups/RESTAURAR.md "$ICLOUD/" 2>/dev/null || true
  echo "    copiado para: $ICLOUD/$DATA"
else
  echo "    iCloud Drive não encontrado — só a cópia local foi feita"
fi

echo "✓ Backup concluído:"
du -sh "$DEST"/* | sed 's/^/    /'
