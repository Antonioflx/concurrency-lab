#!/bin/sh
set -e

SEED_FLAG="/app/tmp/.seed-done"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

log() {
  echo "[$TIMESTAMP] [INFO] [entrypoint] $1"
}

log "Iniciando container..."

if [ -f "$SEED_FLAG" ]; then
  log "Seed já executado em: $(cat $SEED_FLAG). Pulando."
  log "Para re-executar o seed, rode: docker exec concurrency-lab-backend rm $SEED_FLAG && docker restart concurrency-lab-backend"
else
  log "Seed não encontrado. Executando..."
  node dist/seed/run-seed.js
  date -u +"%Y-%m-%dT%H:%M:%SZ" > "$SEED_FLAG"
  log "Seed concluído. Flag criado em $SEED_FLAG"
fi

log "Iniciando servidor..."
exec node dist/server.js
