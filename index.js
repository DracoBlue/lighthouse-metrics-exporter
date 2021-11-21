require('dotenv').config();
const http = require('http');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

let configName = process.env.CONFIG_NAME || 'default';

process.on('unhandledRejection', function(err) {
    console.log(err);
    process.exit(1);
});

/* As specified at https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#comments-help-text-and-type-information */
let escapeHelpLabel = (rawLabel) => {
    var metricHelpEscapeMap = {
        '\n': '\\n',
        '\\': '\\\\',
    };

    return ("" + rawLabel).replace(/([\\\n])/g, (str, item) => {
        return metricHelpEscapeMap[item];
    });
};

/* As specified at https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#comments-help-text-and-type-information */
let quoteMetricLabel = (rawLabel) => {
    var metricLabelEscapeMap = {
        '\n': '\\n',
        '\\': '\\\\',
        '"': '\\"',
    };

    return "\"" + ("" + rawLabel).replace(/([\\\n"])/g, (str, item) => {
        return metricLabelEscapeMap[item];
    }) + "\"";
};

let fetchMetricLines = async () => {
    var lines = [];

    try {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let urlLabel = quoteMetricLabel(process.env.URL);

        try {
            let results = await lighthouse(process.env.URL, {
                port: require('url').parse(browser.wsEndpoint()).port,
                output: 'json'
            }, require('lighthouse/lighthouse-core/config/' + configName + '-config'));

            for(var categoryName in results.lhr.categories){
                var category = results.lhr.categories[categoryName];
                var categoryMetricName = "lighthouse_category_" + categoryName.replace(/-/g, '_');
                var helpText = category.title;

                if (category.description) {
                    helpText = helpText + ': ' + category.description;
                }
                lines.push('# HELP ' + categoryMetricName + ' ' + escapeHelpLabel(helpText));
                lines.push('# TYPE ' + categoryMetricName + ' gauge');
                lines.push(`${categoryMetricName}{config="${configName}",url=${urlLabel}} ${category.score * 100}`);
            }


            var audits = results.lhr.audits;

            for (var auditName in results.lhr.audits) {
                let audit = audits[auditName];
                var auditMetricName = "lighthouse_audit_" + auditName.replace(/-/g, '_');
                var helpText = audit.title;

                if (audit.scoreDisplayMode === "numeric" && audit.numericUnit !== "unitless") {
                    helpText = audit.title + ` (in ${audit.numericUnit})`;
                }
                if (audit.description) {
                    helpText = helpText + ': ' + audit.description;
                }

                if (audit.scoreDisplayMode === "numeric") {
                    let numericValue = false;

                    try {
                        numericValue = Math.round(audit.numericValue);
                    } catch (error) {
                        console.error(error);
                    }

                    if (numericValue !== false) {
                        lines.push('# HELP ' +  auditMetricName + ' ' + escapeHelpLabel(helpText));
                        lines.push('# TYPE ' +  auditMetricName + ' gauge');
                        lines.push(`${auditMetricName}{config="${configName}",url=${urlLabel}} ${numericValue}`);
                    }
                }

                if (audit.scoreDisplayMode === "binary") {
                    let numericValue = false;

                    try {
                        numericValue = Math.round(audit.score);
                    } catch (error) {
                        console.error(error);
                    }

                    if (numericValue !== false) {
                        lines.push('# HELP ' +  auditMetricName + ' ' + escapeHelpLabel(helpText));
                        lines.push('# TYPE ' +  auditMetricName + ' gauge');
                        lines.push(`${auditMetricName}{config="${configName}",url=${urlLabel}} ${numericValue}`);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }

        await browser.close();
    } catch (error) {
        console.error(error);
    }

    return lines;
};

let fetchedLines = [];

if (process.env.FETCH_MODE === "interval") {
    setInterval(async () => {
        fetchedLines = await fetchMetricLines();
    }, parseInt(process.env.FETCH_INTERVAL_SECONDS, 10) * 1000);

    setTimeout(async () => {
        fetchedLines = await fetchMetricLines();
    }, 0);
}

http.createServer(async (req, res) => {
    if (req.url === "/") {
        res.setHeader('X-App-Version', process.env.APP_VERSION || 'dev')
        res.end('OK');
        return ;
    }

    if (req.url !== "/metrics") {
        res.setHeader('X-App-Version', process.env.APP_VERSION || 'dev')
        res.writeHead(404);
        res.end();
        return ;
    }

    let lines = [];
    if (process.env.FETCH_MODE === "interval") {
        lines = fetchedLines;
    } else {
        lines = await fetchMetricLines();
    }

    res.setHeader('X-App-Version', process.env.APP_VERSION || 'dev')
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(lines.join("\n"));
}).listen(process.env.PORT || 9442);
