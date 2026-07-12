const SCALAR_CDN = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'

export function buildDocsHtml(): string {
  return `<!doctype html>
<html>
  <head>
    <title>Concurrency Lab — API Docs</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="app"></div>
    <script src="${SCALAR_CDN}"></script>
    <script>
      Scalar.createApiReference('#app', {
        url: '/openapi.json',
      })
    </script>
  </body>
</html>`
}
