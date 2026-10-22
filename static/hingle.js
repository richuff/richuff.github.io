var Paul_Hingle = function (config) {
    var body = document.body;
    var content = ks.select(".post-content:not(.is-special), .page-content:not(.is-special)");

    // 菜单按钮
    this.header = function () {
        var menu = document.getElementsByClassName("head-menu")[0];

        ks.select(".toggle-btn").onclick = function () {
            menu.classList.toggle("active");
        };

        ks.select(".light-btn").onclick = this.night;

        var search = document.getElementsByClassName("search-btn")[0];
        var bar = document.getElementsByClassName("head-search")[0];

        search.addEventListener("click", function () {
            bar.classList.toggle("active");
        })
    };

    // 关灯切换
    this.night = function () {
        if(body.classList.contains("dark-theme")){
            body.classList.remove("dark-theme");
            document.cookie = "night=false;" + "path=/;" + "max-age=21600";
        }
        else{
            body.classList.add("dark-theme");
            document.cookie = "night=true;" + "path=/;" + "max-age=21600";
        }
    };

    // 目录树
    this.tree = function () {
        var id = 1;
        var wrap = ks.select(".wrap");
        var headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");

        if(headings.length > 0){
            body.classList.add("has-trees");

            var trees = ks.create("section", {
                class: "article-list",
                html: "<h4><span class=\"title\">目录</span></h4>"
            });

            ks.each(headings, function (t) {
                var cls, text = t.innerText;

                t.id = "title-" + id;

                switch (t.tagName){
                    case "H1": cls = "item-1"; break;
                    case "H2": cls = "item-2"; break;
                    case "H3": cls = "item-3"; break;
                    case "H4": cls = "item-4"; break;
                    case "H5": cls = "item-5"; break;
                    case "H6": cls = "item-6"; break;
                }

                trees.appendChild(ks.create("a", {class: cls, text: text, href: "#title-" + id}));

                id++;
            });

            wrap.appendChild(trees);

            function toggle_tree() {
                var buttons = ks.select("footer .buttons");
                var btn = ks.create("a", {class: "toggle-list"});
                buttons.appendChild(btn);

                btn.addEventListener("click", function () {
                    trees.classList.toggle("active");
                })
            }
            toggle_tree();
        }
    };

    // 自动添加外链
    this.links = function () {
        var l = content.getElementsByTagName("a");

        if(l){
            ks.each(l, function (t) {
                t.target = "_blank";
            });
        }
    };

    this.code_copy = function () {
        var blocks = content.querySelectorAll('pre[class*="language-"]');

        // 代码块增强配置（来自主题 _config.yml 的 code 段）
        var codeCfg = config.code || {};
        var showLang = codeCfg.language_label !== false;   // 是否显示语言标签
        var showToggle = codeCfg.line_numbers_toggle !== false; // 是否显示行号开关
        var defaultLN = codeCfg.line_numbers !== false;    // 行号默认是否开启

        // 无意义语言名过滤名单（小写比较），如 Hexo 默认给的 markup / none / text
        var langExclude = (codeCfg.language_label_exclude || []).map(function (s) {
            return String(s).toLowerCase();
        });

        ks.each(blocks, function (pre) {
            var code = pre.querySelector("code");
            if(!code || pre.parentNode.classList.contains("code-block")) return;

            var wrap = document.createElement("div");
            var button = document.createElement("button");
            wrap.className = "code-block";
            button.className = "code-copy-btn";
            button.type = "button";
            button.textContent = "";
            button.setAttribute("aria-label", "复制代码");
            button.title = "复制代码";

            pre.parentNode.insertBefore(wrap, pre);
            wrap.appendChild(pre);
            wrap.appendChild(button);

            button.addEventListener("click", function () {
                var text = code.textContent;
                var copy = navigator.clipboard && window.isSecureContext
                    ? navigator.clipboard.writeText(text)
                    : new Promise(function (resolve, reject) {
                        var input = document.createElement("textarea");
                        input.value = text;
                        input.style.position = "fixed";
                        input.style.opacity = "0";
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand("copy") ? resolve() : reject();
                        document.body.removeChild(input);
                    });

                copy.then(function () {
                    button.title = "已复制";
                    button.setAttribute("aria-label", "代码已复制");
                    button.classList.add("copied");
                    window.setTimeout(function () {
                        button.title = "复制代码";
                        button.setAttribute("aria-label", "复制代码");
                        button.classList.remove("copied");
                    }, 1600);
                });
            });

            // 右上角工具栏：语言标签 + 行号开关（复用同一个 .code-block 容器）
            var toolbar = document.createElement("div");
            toolbar.className = "code-toolbar";

            var lang = pre.getAttribute("data-language");
            if(showLang && lang && langExclude.indexOf(lang.toLowerCase()) === -1){
                var label = document.createElement("span");
                label.className = "code-lang";
                label.textContent = lang;
                label.setAttribute("aria-hidden", "true");
                toolbar.appendChild(label);
            }

            if(showToggle){
                var lnBtn = document.createElement("button");
                lnBtn.type = "button";
                lnBtn.className = "code-ln-btn";

                var show = defaultLN;
                function render(){
                    wrap.classList.toggle("show-line-numbers", show);
                    lnBtn.classList.toggle("active", show);
                    lnBtn.textContent = "行号";
                    lnBtn.title = show ? "隐藏行号" : "显示行号";
                    lnBtn.setAttribute("aria-label", lnBtn.title);
                    lnBtn.setAttribute("aria-pressed", String(show));
                }
                render();
                lnBtn.addEventListener("click", function () {
                    show = !show;
                    render();
                });
                toolbar.appendChild(lnBtn);
            }
            else if(defaultLN){
                wrap.classList.add("show-line-numbers");
            }

            if(toolbar.children.length){
                wrap.appendChild(toolbar);
            }
        });
    };

    this.comment_list = function () {
        ks(".comment-content [href^='#comment']").each(function (t) {
            var item = ks.select(t.getAttribute("href"));

            t.onmouseover = function () {
                item.classList.add("active");
            };

            t.onmouseout = function () {
                item.classList.remove("active");
            };
        });
    };

    // 返回页首
    this.to_top = function () {
        var btn = document.getElementsByClassName("to-top")[0];
        var scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

        scroll >= window.innerHeight / 2 ? btn.classList.add("active") : btn.classList.remove("active");
    };

    this.header();

    if(content){
        this.tree();
        this.links();
        this.code_copy();
        this.comment_list();
    }

    // 返回页首
    window.addEventListener("scroll", this.to_top);

    // 如果开启自动夜间模式
    if(config.night){
        var hour = new Date().getHours();

        if(document.cookie.indexOf("night") === -1 && (hour <= 5 || hour >= 22)){
            document.body.classList.add("dark-theme");
            document.cookie = "night=true;" + "path=/;" + "max-age=21600";
        }
    }
    else if(document.cookie.indexOf("night") !== -1){
        if(document.cookie.indexOf("night=true") !== -1){
            document.body.classList.add("dark-theme");
        }
        else{
            document.body.classList.remove("dark-theme");
        }
    }

    // 如果开启复制内容提示
    if(config.copyright){
        document.oncopy = function () {
            ks.notice("复制内容请注明来源并保留版权信息！", {color: "yellow", overlay: true})
        };
    }

    // 站内文章搜索（取代原来的 bing 跳转）
    this.hexo_search = function () {
        var form = ks.select(".head-search"),
            input = ks.select(".head-search input");
        if(!form || !input) return;

        // 结果浮层：挂在 header 内、搜索框下方
        var panel = document.createElement("div");
        panel.className = "search-results";
        panel.setAttribute("role", "listbox");
        panel.hidden = true;
        form.appendChild(panel);

        var cache = null;        // 索引内存缓存
        var inflight = null;      // 进行中的加载 Promise
        var timer = null;

        // 懒加载索引：首次搜索才 fetch，之后命中内存缓存
        function loadIndex() {
            if(cache) return Promise.resolve(cache);
            if(inflight) return inflight;

            var url = (window.SITE_ROOT || "/") + "search-index.json";
            url = url.replace(/([^:])\/+/g, "$1/"); // 规整多余斜杠

            inflight = new Promise(function (resolve) {
                var req = new XMLHttpRequest();
                req.open("GET", url + "?t=" + Date.now(), true);
                req.responseType = "json";
                req.onreadystatechange = function () {
                    if(req.readyState === 4){
                        if(req.status === 200 && req.response){
                            cache = req.response;
                            resolve(cache);
                        } else {
                            resolve([]);
                        }
                    }
                };
                req.onerror = function () {
                    resolve([]);
                };
                req.send();
            });

            return inflight;
        }

        // 多词拆分（按空白），小写比较；任一命中即算
        function splitQuery(q) {
            return q.toLowerCase().split(/\s+/).filter(Boolean);
        }

        // 在纯文本里找第一个命中的词，返回其下标（用于片段定位）
        function firstHit(text, words) {
            var low = text.toLowerCase();
            var best = -1;
            for(var i = 0; i < words.length; i++){
                var idx = low.indexOf(words[i]);
                if(idx !== -1 && (best === -1 || idx < best)) best = idx;
            }
            return best;
        }

        // 生成命中片段：命中位置前后各约 40 字
        function makeSnippet(text, words) {
            var hit = firstHit(text, words);
            if(hit === -1) return text.slice(0, 100);
            var start = Math.max(0, hit - 40);
            var end = Math.min(text.length, hit + 60);
            return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
        }

        // 把命中词用 <mark> 包起来（先转义，再注入，避免 XSS / 标签错乱）
        function highlight(text, words) {
            var esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if(!words.length) return esc;
            var re = new RegExp("(" + words.map(function (w) {
                return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }).join("|") + ")", "gi");
            return esc.replace(re, "<mark>$1</mark>");
        }

        function search(q) {
            var words = splitQuery(q);
            if(!words.length){ closePanel(); return; }

            loadIndex().then(function (data) {
                var results = [];

                for(var i = 0; i < data.length; i++){
                    var item = data[i];
                    var titleLow = (item.title || "").toLowerCase();
                    var hay = titleLow + " " +
                              (item.categories || []).join(" ").toLowerCase() + " " +
                              (item.tags || []).join(" ").toLowerCase() + " " +
                              (item.content || "").toLowerCase();

                    // 多词按「任一命中即算」（OR）
                    var matched = words.some(function (w) { return hay.indexOf(w) !== -1; });
                    if(!matched) continue;

                    var inTitle = words.some(function (w) { return titleLow.indexOf(w) !== -1; });

                    results.push({
                        item: item,
                        inTitle: inTitle,
                        snippet: makeSnippet(item.content || item.excerpt || "", words)
                    });
                }

                // 标题命中的排前面；其余保持稳定顺序
                results.sort(function (a, b) { return (b.inTitle ? 1 : 0) - (a.inTitle ? 1 : 0); });

                render(results, words, q);
            });
        }

        function render(results, words, q) {
            ks.empty(panel);
            panel.hidden = false;

            if(!results.length){
                var empty = document.createElement("div");
                empty.className = "search-empty";
                empty.textContent = "没有找到相关文章";
                panel.appendChild(empty);
                return;
            }

            var head = document.createElement("div");
            head.className = "search-count";
            head.textContent = "找到 " + results.length + " 篇与「" + q + "」相关的文章";
            panel.appendChild(head);

            var ul = document.createElement("ul");
            ul.className = "search-list";

            results.forEach(function (r) {
                var item = r.item;
                var li = document.createElement("li");
                li.className = "search-item";

                var a = document.createElement("a");
                a.className = "search-link";
                a.href = (window.SITE_ROOT || "/") + item.path;
                a.innerHTML = highlight(item.title || "", words);

                var meta = document.createElement("div");
                meta.className = "search-meta";
                var bits = [];
                if(item.date) bits.push(item.date);
                if(item.categories && item.categories.length) bits.push("分类：" + item.categories.join(" / "));
                if(item.tags && item.tags.length) bits.push("标签：" + item.tags.join(" / "));
                meta.textContent = bits.join("　·　");

                var snip = document.createElement("div");
                snip.className = "search-snippet";
                snip.innerHTML = highlight(r.snippet, words);

                a.appendChild(meta);
                a.appendChild(snip);
                li.appendChild(a);
                ul.appendChild(li);
            });

            panel.appendChild(ul);
        }

        function closePanel() {
            panel.hidden = true;
        }

        // 仅在搜索框聚焦时，于面板外点击才关闭（避免误关）
        document.addEventListener("click", function (e) {
            if(panel.hidden) return;
            if(form.contains(e.target)) return;
            closePanel();
        });

        document.addEventListener("keydown", function (e) {
            if(e.key === "Escape" && !panel.hidden) closePanel();
        });

        // 200ms 防抖
        input.addEventListener("input", function () {
            var q = input.value.trim();
            if(timer) clearTimeout(timer);
            timer = setTimeout(function () { search(q); }, 200);
        });

        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            if(timer) clearTimeout(timer);
            search(input.value.trim());
        });
    }

    this.hexo_search();
};



// 图片缩放
ks.image(".post-content:not(.is-special) img, .page-content:not(.is-special) img");

// 请保留版权说明
if(window.console && window.console.log){
    console.log("%c Richu %c https://richuff.top ","color: #fff; margin: 1em 0; padding: 5px 0; background: #6f9fc7;","margin: 1em 0; padding: 5px 0; background: #efefef;");
}
