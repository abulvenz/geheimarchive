# geheimarchive
Cross (?) browser extension to enjoy the internet more than ever. Find new Newstickers on der-postillon.com 

## Building

```
npm install
```

```
npm run build
```

## Test it

When done with the setup navigate to https://der-postillon.com/ and 
select any word. That word/phrase should be used as input to a search on 
https://abulvenz.github.io/postillion-newsticker/ and display the results 
at the very bottom of the screen.  

### Firefox
Navigate to about:debugging and load the extension. 

### Ungoogled Chromium
AFAIR you need to load it on the regular extension page (There is a point "developer" maybe)

## Hack it
You can use 
```
npm start to have a hot rebuild, but AFAIC you need to reload it on the extension page as well.
```