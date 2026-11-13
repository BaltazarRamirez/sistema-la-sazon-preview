#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_NAME="${1:-sistema-la-sazon-preview}"

echo "==> Cuenta GitHub"
gh api user --jq '"\(.login) (\(.name // ""))"'

OWNER="$(gh api user --jq .login)"
FULL="$OWNER/$REPO_NAME"

echo "==> Crear repo $FULL (si no existe)"
if gh repo view "$FULL" >/dev/null 2>&1; then
  echo "    ya existe"
else
  gh repo create "$REPO_NAME" --public --description "Preview mock La Sazón (carta, mesas, panel demo)"
fi

echo "==> Remote 'mio'"
if git remote get-url mio >/dev/null 2>&1; then
  git remote set-url mio "https://github.com/$FULL.git"
else
  git remote add mio "https://github.com/$FULL.git"
fi

echo "==> Push rama preview → main (para deploy fácil)"
git push -u mio preview:main

echo "==> Listo: https://github.com/$FULL"
