Server
=========

```
node server.js test
```

Client
=========

```
node client.js
```

Test Console
=========

```
catz@mbpro watcher :) [~/Projects/git/watcher] git:master $ touch test
catz@mbpro watcher :) [~/Projects/git/watcher] git:master $ echo "E" >> test
catz@mbpro watcher :) [~/Projects/git/watcher] git:master $ rm test
```

Client Output
=========

```
catz@mbpro watcher :) [~/Projects/watcher] $ node client.js
Connected
{
  "file": "test",
  "type": "create",
  "changed": "2014-03-31T21:39:09.938Z"
}
{
  "file": "test",
  "type": "change",
  "changed": "2014-03-31T21:39:14.943Z"
}
{
  "file": "test",
  "type": "remove",
  "changed": "2014-03-31T21:39:29.966Z"
}