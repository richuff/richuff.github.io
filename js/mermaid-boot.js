(function () {
  function start() {
    var nodes = document.querySelectorAll('div.mermaid');
    if (!nodes.length) return;

    // 渲染完成前隐藏原始图表源码，避免先闪现一段代码文本
    var st = document.createElement('style');
    st.textContent = 'div.mermaid:not([data-processed]){visibility:hidden}';
    document.head.appendChild(st);

    function reveal() {
      var p = document.querySelectorAll('div.mermaid:not([data-processed])');
      for (var i = 0; i < p.length; i++) p[i].style.visibility = 'visible';
    }

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
        reveal();
      }
    };
    s.onerror = reveal; // 库加载失败时退回显示原始文本
    document.body.appendChild(s);

    // 兜底：8 秒后仍未渲染成功就把源码显示出来，避免永远空白
    setTimeout(reveal, 8000);
  }

  // 不再等 window.load（那会等所有图片），DOM 就绪立即开始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
