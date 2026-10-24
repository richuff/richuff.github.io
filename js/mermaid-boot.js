(function () {
  function start() {
    var nodes = document.querySelectorAll('div.mermaid');
    if (!nodes.length) return;
    var s = document.createElement('script');
    s.src = '/js/mermaid.min.js';
    s.onload = function () {
      try {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'default',
          fontFamily: 'inherit',
          flowchart: { htmlLabels: true, curve: 'basis', useMaxWidth: true }
        });
        mermaid.run({ nodes: Array.prototype.slice.call(nodes) });
      } catch (e) {
        console.error('mermaid init failed', e);
      }
    };
    document.body.appendChild(s);
  }

  if (document.readyState === 'complete') setTimeout(start, 50);
  else window.addEventListener('load', function () { setTimeout(start, 50); });
})();
