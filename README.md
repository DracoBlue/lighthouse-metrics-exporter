# lighthouse-metrics-exporter

This project is capable of returning prometheus metrics for a lighthouse report of a given url.

## Usage

To make lighthouse-metrics-exporter work, you will need one environment variables set: `URL`.

The `.env`:

```
URL=https://example.org
```

## Example Output

If you want to test it locally run:

```console
$ docker run --rm -p 9442:9442 -e URL=https://example.org dracoblue/lighthouse-metrics-exporter
```

and then open the metrics at <http://localhost:9442/metrics>. will look like this:

```text
# HELP lighthouse_category_performance Performance
# TYPE lighthouse_category_performance gauge
lighthouse_category_performance{url="https://example.org"} 100
# HELP lighthouse_category_accessibility Accessibility: These checks highlight opportunities to [improve the accessibility of your web app](https://developers.google.com/web/fundamentals/accessibility). Only a subset of accessibility issues can be automatically detected so manual testing is also encouraged.
# TYPE lighthouse_category_accessibility gauge
lighthouse_category_accessibility{url="https://example.org"} 92
# HELP lighthouse_category_best_practices Best Practices
# TYPE lighthouse_category_best_practices gauge
lighthouse_category_best_practices{url="https://example.org"} 100
# HELP lighthouse_category_seo SEO: These checks ensure that your page is following basic search engine optimization advice. There are many additional factors Lighthouse does not score here that may affect your search ranking, including performance on [Core Web Vitals](https://web.dev/learn-web-vitals/). [Learn more](https://support.google.com/webmasters/answer/35769).
# TYPE lighthouse_category_seo gauge
lighthouse_category_seo{url="https://example.org"} 91
# HELP lighthouse_category_pwa PWA: These checks validate the aspects of a Progressive Web App. [Learn more](https://developers.google.com/web/progressive-web-apps/checklist).
# TYPE lighthouse_category_pwa gauge
lighthouse_category_pwa{url="https://example.org"} 30
# HELP lighthouse_audit_is_on_https Uses HTTPS: All sites should be protected with HTTPS, even ones that don't handle sensitive data. This includes avoiding [mixed content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content), where some resources are loaded over HTTP despite the initial request being served over HTTPS. HTTPS prevents intruders from tampering with or passively listening in on the communications between your app and your users, and is a prerequisite for HTTP/2 and many new web platform APIs. [Learn more](https://web.dev/is-on-https/).
# TYPE lighthouse_audit_is_on_https gauge
lighthouse_audit_is_on_https{url="https://example.org"} 1
# HELP lighthouse_audit_service_worker Does not register a service worker that controls page and `start_url`: The service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. [Learn more](https://web.dev/service-worker/).
# TYPE lighthouse_audit_service_worker gauge
lighthouse_audit_service_worker{url="https://example.org"} 0
# HELP lighthouse_audit_viewport Has a `<meta name="viewport">` tag with `width` or `initial-scale`: A `<meta name="viewport">` not only optimizes your app for mobile screen sizes, but also prevents [a 300 millisecond delay to user input](https://developers.google.com/web/updates/2013/12/300ms-tap-delay-gone-away). [Learn more](https://web.dev/viewport/).
# TYPE lighthouse_audit_viewport gauge
lighthouse_audit_viewport{url="https://example.org"} 1
# HELP lighthouse_audit_first_contentful_paint First Contentful Paint (in millisecond): First Contentful Paint marks the time at which the first text or image is painted. [Learn more](https://web.dev/first-contentful-paint/).
# TYPE lighthouse_audit_first_contentful_paint gauge
lighthouse_audit_first_contentful_paint{url="https://example.org"} 965
# HELP lighthouse_audit_largest_contentful_paint Largest Contentful Paint (in millisecond): Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more](https://web.dev/lighthouse-largest-contentful-paint/)
# TYPE lighthouse_audit_largest_contentful_paint gauge
lighthouse_audit_largest_contentful_paint{url="https://example.org"} 965
# HELP lighthouse_audit_first_meaningful_paint First Meaningful Paint (in millisecond): First Meaningful Paint measures when the primary content of a page is visible. [Learn more](https://web.dev/first-meaningful-paint/).
# TYPE lighthouse_audit_first_meaningful_paint gauge
lighthouse_audit_first_meaningful_paint{url="https://example.org"} 965
# HELP lighthouse_audit_speed_index Speed Index (in millisecond): Speed Index shows how quickly the contents of a page are visibly populated. [Learn more](https://web.dev/speed-index/).
# TYPE lighthouse_audit_speed_index gauge
lighthouse_audit_speed_index{url="https://example.org"} 1231
# HELP lighthouse_audit_total_blocking_time Total Blocking Time (in millisecond): Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more](https://web.dev/lighthouse-total-blocking-time/).
```
## Related projects

* [prometheus_lighthouse_exporter](https://github.com/pkesc/prometheus_lighthouse_exporter)

## License

This work is copyright by DracoBlue (http://dracoblue.net) and licensed under the terms of MIT License.
