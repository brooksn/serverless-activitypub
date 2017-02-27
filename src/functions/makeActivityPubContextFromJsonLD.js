module.exports = function makeActivityPubContextFromJsonLD(json)  {
  const res = ['https://www.w3.org/ns/activitystreams']
  if (json['@context'] && typeof json['@context'] === 'object' && json['@context']['@language']) {
    res.push({'@language': json['@context']['@language']})
  } else if (Array.isArray(json['@context'])) {
    json['@context'].forEach(val => {
      if (val && typeof val === 'object' && val['@language']) {
        res.push({'@language': val['@language']})
      }
    })
  }
  return res
}
const person = {
  "@context": ["https://www.w3.org/ns/activitystreams",
               {"@language": "ja"}],
  "type": "Person",
  "id": "https://kenzoishii.example.com/",
  "following": "https://kenzoishii.example.com/following.json",
  "followers": "https://kenzoishii.example.com/followers.json",
  "likes": "https://kenzoishii.example.com/likes.json",
  "inbox": "https://kenzoishii.example.com/inbox.json",
  "outbox": "https://kenzoishii.example.com/feed.json",
  "preferredUsername": "kenzoishii",
  "name": "石井健蔵",
  "summary": "この方はただの例です",
  "icon": [
    "https://kenzoishii.example.com/image/165987aklre4"
  ]
}
