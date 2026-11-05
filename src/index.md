---
title: Home
layout: layouts/home.njk
heroLayout: true
description: Southwest Florida's custom home builder. Quality craftsmanship, thoughtful design.
---

<section class="hero" style="background-image: url('/images/web/svc-construction.jpg')">
  <div class="hero__overlay"></div>
  <div class="hero__content">
    <h1 class="hero__headline"><em>Built for the<br>way you live.</em></h1>
    <p class="hero__sub">Southwest Florida's custom home builder — quality craftsmanship, thoughtful design, every detail considered.</p>
    <div class="hero__actions">
      <a href="/designs/" class="btn btn--primary">View Our Designs</a>
      <a href="/contact/" class="btn btn--outline">Get in Touch</a>
    </div>
  </div>
  <div class="hero__social">
    {% for item in site.social %}
      <a href="{{ item.url }}" class="hero__social-link" aria-label="{{ item.label }}" target="_blank" rel="noopener">
        <i class="{{ item.icon }}"></i>
      </a>
    {% endfor %}
  </div>
</section>
