---
title: Get started
permalink: /get-started/index.html
description: 'You can use this starter as a template for your blog and you are ready to go! But there are some adjustments you have to make.'
layout: page
---

Here are [Style Guides](/styleguide/)

The [blog posts](/blog/) also explain / show some features that aren't covered here.

## "Docs" lol

<!-- loop docs -->
{% set itemList = collections.docs %}
{% set headingLevel = "h2" %}
{% include 'partials/details.njk' %}

{% css "local" %}
  {% include "css/custom-card.css" %}
{% endcss %}
