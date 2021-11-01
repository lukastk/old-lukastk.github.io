---
layout: page
title: Translations
permalink: /translations/
exclude: true
---

<ul>
{% for translation in site.translations %}
    <li><a href="{{ translation.url }}">{{ translation.title }} - {{ translation.author }}</a></li>
{% endfor %}
</ul>