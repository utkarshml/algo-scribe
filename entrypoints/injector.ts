// injector.js
export default defineUnlistedScript(() => {
(function pageExtractor() {
  const poll = () => {
    const models = window.monaco?.editor?.getModels?.();
    if (models?.length  > 0 && models[0].getValue() !== '') {
      const m = models[0];
      const code = m.getValue();
      const language = m.getLanguageId();

      window.postMessage({
        source: 'monaco-extractor',
        type: 'LEETCODE_CODE',
        code: code,
        language:language
      }, '*');
    } else {
      setTimeout(poll, 500);
    }
  };
  poll();
})();
});

