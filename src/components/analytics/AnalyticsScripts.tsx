"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

interface AnalyticsConfig {
  meta_pixel_id?: string;
  ga4_measurement_id?: string;
  google_site_verification?: string;
}

export default function AnalyticsScripts() {
  const [config, setConfig] = useState<AnalyticsConfig>({
    meta_pixel_id: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    ga4_measurement_id: process.env.NEXT_PUBLIC_GA4_ID,
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setConfig({
            meta_pixel_id: data.meta_pixel_id || process.env.NEXT_PUBLIC_META_PIXEL_ID,
            ga4_measurement_id: data.ga4_measurement_id || process.env.NEXT_PUBLIC_GA4_ID,
            google_site_verification: data.google_site_verification,
          });
        }
      } catch {}
    }
    fetchSettings();
  }, []);

  const metaPixelId = config.meta_pixel_id;
  const ga4Id = config.ga4_measurement_id;

  return (
    <>
      {/* Google Search Console Verification Meta */}
      {config.google_site_verification && (
        <meta
          name="google-site-verification"
          content={config.google_site_verification}
        />
      )}

      {/* Meta Pixel Script */}
      {metaPixelId && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Google Analytics 4 Script */}
      {ga4Id && (
        <>
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
