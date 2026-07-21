// Marketing pixels that fire ONLY after consent is granted.
// Called from the CookieConsent banner's accept flow.
// These are ad-network retargeting pixels, not product analytics.

let fired = false;

export function initMarketingPixels(): void {
  if (fired || typeof window === "undefined") return;
  fired = true;
  const w = window as any;
  const d = document;

  // --- Meta / Facebook Pixel ---
  (function (f: any, b: any, e: string, v: string, n: any, t: any, s: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments as any)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    w,
    d,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
    undefined,
    undefined,
    undefined,
  );
  w.fbq("init", "1278454893564023");
  w.fbq("track", "PageView");

  // --- Reddit Pixel ---
  (function (w2: any, d2: any) {
    if (!w2.rdt) {
      var p = (w2.rdt = function () {
        p.sendEvent
          ? p.sendEvent.apply(p, arguments as any)
          : p.callQueue.push(arguments);
      });
      p.callQueue = [];
      var t2 = d2.createElement("script");
      t2.src = "https://www.redditstatic.com/ads/pixel.js";
      t2.async = true;
      var s2 = d2.getElementsByTagName("script")[0];
      s2.parentNode.insertBefore(t2, s2);
    }
  })(w, d);
  w.rdt("init", "a2_iqsi13q5oijk");
  w.rdt("track", "PageVisit");

  // --- LinkedIn Insight Tag ---
  w._linkedin_partner_id = "6891888";
  w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
  w._linkedin_data_partner_ids.push(w._linkedin_partner_id);
  (function (l: any) {
    if (!l) {
      w.lintrk = function (a: any, b: any) {
        w.lintrk.q.push([a, b]);
      };
      w.lintrk.q = [];
    }
    var s3 = d.getElementsByTagName("script")[0];
    var b3 = d.createElement("script");
    b3.type = "text/javascript";
    b3.async = true;
    b3.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s3.parentNode!.insertBefore(b3, s3);
  })(w.lintrk);
}
