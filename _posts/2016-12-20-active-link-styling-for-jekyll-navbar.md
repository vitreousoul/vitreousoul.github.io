---
title: Active Link Styling for Jekyll Navbar
layout: base
description: An approach to styling the navbar of a Jekyll project that uses named folders for urls.
---

# {{ page.title }}

The goal of this post is to outline an approach for organizing a Jekyll app that features a structure-driven navigation bar. The most recent version of this app can be found at [this repo](https://github.com/vitreousoul/jekyll-active-link-navbar-example).

## Setup

_I highly recommend using [Ruby Version Manager](https://rvm.io/rvm/install) to install Jekyll._

The example app was written using Jekyll v3.3.1.

## Basic Structure and Configuration

The structure of our app will be as follows:

```
_includes
    - nav.html
_layouts
    - base.html
_posts
    - 2016-12-19-my-cool-blog-post.md
    - 2016-12-20-my-not-so-cool-post.md
art
    - cactus.html
    - car.html
    - index.html
css
    - main.scss
_config.yml
index.html
```

This directory structure takes advantage of [named folders](http://jekyllrb.com/docs/pages/#named-folders-containing-index-html-files) in order to serve pages with the following URLs:

```
http://example.com/art/cactus.html
http://example.com/art/car.html
http://example.com/art/
http://example.com/
```

## Navbar without Active Links

The navbar will have two links named "blog" and "art". When a user is at the root directory or a blog post, the navbar will style "blog" as the active link. When the user is on a page contained in the "art" directory, the navbar will style "art" as the active link.

Since we want every named folder to be a link in the navbar, we can [filter out](http://jekyllrb.com/docs/templates/#filters) any page whose name is "index.html" with the following line:

{% raw %}
```liquid
{% assign nav_pages = site.pages | where: "name", "index.html" %}
```
{% endraw %}

`nav_pages` can now be iterated over to create a simple navbar:

{% raw %}
```html
{% assign nav_pages = site.pages | where: "name", "index.html" %}

<div id="main-nav-wrap">
  <div id="main-nav">
    <div>my cool site</div>
    {% for nav_page in nav_pages %}
      <a href="{{ nav_page.url }}">{{ nav_page.title }}</a>
    {% endfor %}
  </div>
</div>
```
{% endraw %}

So far the navbar has no active styling. However, we first need a way to determine the base path of a URL.

## Determining a URL's base path

Let's assume the user is at "http://example.com/art/my-art-piece.html". The base path of that URL can be determined by the following one-liner:

{% raw %}
```liquid
{% assign base_path = page.url | slice: 1, page.url.size | split: "/" | first %}
```
{% endraw %}

The value of `page.url` is "/art/my-art-piece.html" and the desired output is "art". The leading slash is removed with `slice`, otherwise `split` returns an empty string as the first value.

## Configure Blog Post Permalink

Jekyll blog post URLs default to `/:year/:month/:day/:title/`, which means `base_url` will return the year of the post's publication date. We can set each post's permalink to something sane by [adding default values](http://jekyllrb.com/docs/configuration/#front-matter-defaults) to `_config.yml`:


```
defaults:
  -
    scope:
      path: "" # an empty string here means all files in the project
      type: "posts"
    values:
      page_type: blog
      permalink: "/blog/:year/:month/:day/:title/"
```
{: .language-yaml}

This ensures that `base_url` return "blog" for any blog post URL.

## Active Link Styling

We now have most of the pieces necessary to style active links. Let's take a look at the final code for `nav.html`, then go through some of the details.

{% raw %}
```html
{% assign base_path = page.url | slice: 1, page.url.size
                               | split: "/" | first %}

{% if base_path == "blog" %}
  {% assign base_path = nil %}
{% endif %}

{% assign nav_pages = site.pages | where: "name", "index.html" %}

<div id="main-nav-wrap">
  <div id="main-nav">
    <div>my cool site</div>
    {% for nav_page in nav_pages %}
      {% assign nav_base_path = nav_page.url | slice: 1, nav_page.url.size
                                             | split: "/" | first %}

      {% if nav_base_path == base_path %}
        <a class="active" href="{{ nav_page.url }}">{{ nav_page.title }}</a>
      {% else %}
        <a href="{{ nav_page.url }}">{{ nav_page.title }}</a>
      {% endif %}
    {% endfor %}
  </div>
</div>
```
{% endraw %}

Determine the current page's base URL.

{% raw %}
```liquid
{% assign base_path = page.url | slice: 1, page.url.size
                               | split: "/" | first %}
```
{% endraw %}

Check if `base_url` is "blog", which means the page is a blog post. If so we set `base_url` to [nil](http://shopify.github.io/liquid/basics/types/#nil) so that it equals the base URL of the root directory. This will be used later for comparison.

{% raw %}
```liquid
{% if base_path == "blog" %}
  {% assign base_path = nil %}
{% endif %}
```
{% endraw %}

Assign all pages with name of "index.html" to `nav_pages`.

{% raw %}
```liquid
{% assign nav_pages = site.pages | where: "name", "index.html" %}
```
{% endraw %}

Inside the `nav_pages` loop, determine the base URL of the current `nav_page`.

{% raw %}
```liquid
{% assign nav_base_path = nav_page.url | slice: 1, nav_page.url.size
                                       | split: "/" | first %}
```
{% endraw %}

If the two base URLs match, set as the active link.

{% raw %}
```html
{% if nav_base_path == base_path %}
  <a class="active" href="{{ nav_page.url }}">{{ nav_page.title }}</a>
{% else %}
  <a href="{{ nav_page.url }}">{{ nav_page.title }}</a>
{% endif %}
```
{% endraw %}

## Conclusion

This is a good start but many improvements can be made, such as:
- explicitly order the nav links
- create a function for `base_url`

The list items above will eventually link to blog posts if I implement the improvements. Until then they remain as suggestions.

[Check out the repo for this blog!](https://github.com/vitreousoul/jekyll-active-link-navbar-example)
