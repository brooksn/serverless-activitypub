module.exports = `
<html>
  <head>
  <title>John Doe</title>
  <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "Person",
      "email": "mailto:john@example.com",
      "image": "image.png",
      "name": "John Doe",
      "telephone": "(888) 888-8888",
      "url": "https://example.com/john"
    }
  </script>
  <script type="application/ld+json">
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "https://example.com/john",
      "type": "Person",
      "name": "John Doe",
      "inbox": "https://example.com/ap/inbox/john",
      "outbox": "https://example.com/ap/outbox/john",
      "following": "https://example.com/ap/following/john",
      "followers": "https://example.com/ap/followers/john",
      "likes": "https://example.com/likes/ap/john",
      "oauthClientAuthorize": "https://example.com/ap/authorize/john"
    }
  </script>
  </head>
  <body>
    <div id="content" itemscope itemtype="http://schema.org/Person">
      <span id="name" itemprop="name">John Doe</span><br />
      <a id="email" href="mailto:joh@example.com" itemprop="email">john@example.com</a><br />
      <a title="GitHub profile" href="https://github.com/john"></a>
    </div>
  </body>
</html>
`
