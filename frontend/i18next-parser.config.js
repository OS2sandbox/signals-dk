module.exports = {
    contextSeparator: false,
    createOldCatalogs: false,
    defaultNamespace: 'translation',
    defaultValue: '',
    indentation: 2,
    keySeparator: false,
    lexers: {
      js: ['JavascriptLexer'],
      ts: ['JavascriptLexer'],
      jsx: ['JsxLexer'],
      tsx: ['JsxLexer'],
    },
    locales: ['en', 'da'], // Add your supported locales
    namespaceSeparator: false,
    output: 'public/locales/$LOCALE/$NAMESPACE.json',
    pluralSeparator: '_',
    input: ['src/**/*.{js,jsx,ts,tsx}'],
    sort: true,
    useKeysAsDefaultValue: true,
  };
  