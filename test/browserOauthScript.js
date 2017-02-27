'use strict';
const assert = require('assert')

const userPassword = 'foobar'

describe('oauth_script', () => {
  global.localStorageItems = {}
  global.localStorage = {
    setItem: (name, val) => {
      localStorageItems[name] = val
    },
    getItem: name => localStorageItems[name]
  }
  global.location = {
    hash: "",
    search: "?client_id=acme&scope=post,read,admin&redirect_uri=http://example.com&state=nkRvVumQrxXn3cG2gtGLYWVVMLp4SQTI&jwt=eyJhbGciOiJIU…29rcyIsImlhdCI6MTQ4NjY2MTk3MX0.lBuLM5_HNFVLWWFBDKacqZWyx_Iinh626UV3ZiuaNxM",
    pathname: "/ap/authorize/brooks",
    port: "",
    hostname: "ap.brooks.is",
    host: "ap.brooks.is",
    protocol: "https:",
    origin: "https://ap.brooks.is",
    href: "https://ap.brooks.is/ap/authorize/brooks?client_id=acme&scope=post,read,admin&redirect_uri=http://example.com&state=nkRvVumQrxXn3cG2gtGLYWVVMLp4SQTI&jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJyb29rcyIsImlhdCI6MTQ4NjY2MTk3MX0.lBuLM5_HNFVLWWFBDKacqZWyx_Iinh626UV3ZiuaNxM"
  }
  global.window = {
    location: location,
    localStorage: localStorage
  }
  
  
  it('should be okay', () => {
    assert.ok(true)
  })

  
})