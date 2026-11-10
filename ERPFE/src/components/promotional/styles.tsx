export function PromoStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: [
          "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}",
          "::view-transition-new(root){animation:vt-clip .62s cubic-bezier(.16,1,.3,1) both}",
          "@keyframes vt-clip{from{clip-path:circle(0 at var(--vt-x,50%) var(--vt-y,50%))}to{clip-path:circle(var(--vt-r,150vmax) at var(--vt-x,50%) var(--vt-y,50%))}}",
          "@keyframes promo-spin{to{transform:rotate(1turn)}}",
          "@keyframes promo-sweep{0%{transform:translateX(-140%)}100%{transform:translateX(340%)}}",
          "@keyframes promo-pan{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}",
          ".promo-pan{background-size:220% 220%;animation:promo-pan 11s ease-in-out infinite}",
          ".promo-sweep{animation:promo-sweep 4.5s cubic-bezier(.5,0,.5,1) infinite}",
          "@media (prefers-reduced-motion:reduce){.promo-pan,.promo-sweep{animation:none!important}::view-transition-new(root){animation:none!important}}",
        ].join(""),
      }}
    />
  );
}
