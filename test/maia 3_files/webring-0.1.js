// shamelessly stolen from the https://lavender.software webring

(function() {
    const currentScript = document.currentScript;
    const ctx = currentScript.dataset;

    // charlotte's ad-hoc terse javascript framework!
    const CSS_PREFIX = "sleepy-zone-webring";
    const e = (tag, props = {}, children = []) => {
        let element = Object.assign(document.createElement(tag), props);
        element.append(...children);
        return element;
    };
    const t = (text) => document.createTextNode(text);
    const c = (className) => ({
        className: `${CSS_PREFIX}-${className}`
    });
    const h = (href) => ({
        href
    });

    const createDescriptionContent = () =>
        ctx.description != null ?
        [t(ctx.description)] :
        [
            e("a", h("http://sleepy.zone"), [t("sleepy.zone")]),
            t(" webring!"),
        ];

    const renderWebring = (currSite, prevSite, nextSite) => {
        currentScript.replaceWith(
            e("aside", c("container"), [
                e("section", c("description"), createDescriptionContent()),
                e("ul", c("site-links"), [
                    e("li", c("prev-site"), [e("a", h(prevSite.url), [t(prevSite.name)])]),
                    e("li", c("curr-site"), [e("a", h(currSite.url), [t(currSite.name)])]),
                    e("li", c("next-site"), [e("a", h(nextSite.url), [t(nextSite.name)])]),
                ]),
            ])
        );
    };

    (async () => {
        const data = await fetch("http://sleepy.zone/webring/data.json").then(
            (r) => r.json()
        );

        let thisSiteIdx = data.findIndex((site) => site.id == ctx.siteId);
        if (thisSiteIdx === -1) {
            throw new Error(
                `Could not find site by id '${ctx.siteId}' in the webring!`
            );
        }

        let currSite = data[thisSiteIdx];
        let prevSite = data[(thisSiteIdx + data.length - 1) % data.length];
        let nextSite = data[(thisSiteIdx + 1) % data.length];

        renderWebring(currSite, prevSite, nextSite);
    })();

})();

