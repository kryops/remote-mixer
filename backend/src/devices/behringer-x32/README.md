# Behringer X32

Also works for

* Midas M32

## Configuration

```js
{
  device: {
    type: 'behringer-x32',
    options: {
      remoteAddress: '192.168.2.7', // IP address here
      remotePort: 10023
    }
  }
}
```

## Links

* https://sites.google.com/site/patrickmaillot/x32
  * Unofficial X32 OSC protocol: https://drive.google.com/file/d/1Snbwx3m6us6L1qeP1_pD6s8hbJpIpD0a/view?usp=sharing
* Wiki: https://behringerwiki.musictribe.com/index.php?title=OSC_Remote_Protocol
* Partial implementation: https://github.com/avodacs/m32/blob/master/src/M32Client.js
