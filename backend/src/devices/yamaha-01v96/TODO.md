# TODO

Pairing

* kInputPair f0 43 10 3e 7f 01 18 00 cc 00 00 00 aa f7
  * CH1+2 f0 43 10 3e 7f 01 18 00 00 00 00 00 01 f7 + f0 43 10 3e 7f 01 18 00 01 00 00 00 01 f7
  * Reset:  f0 43 10 3e 7f 01 18 00 00 00 00 00 00 f7 + f0 43 10 3e 7f 01 18 00 01 00 00 00 00 f7

Fader Groups

* kSceneInputGroup
  * enable/disable group: f0 43 10 3e 7f 01 15 gg 00 00 00 00 aa f7 (fader groups: gg 00-07)
* kInputGroup
  * add/remove channel: f0 43 10 3e 7f 01 26 gg cc 00 00 00 aa f7  (fader groups: gg 00-07)

Channel EQ

*kInputEQ
  * off/on: f0 43 10 3e 7f 01 20 0f cc 00 00 00 aa f7
  * type 2: f0 43 10 3e 7f 01 20 00 02 00 00 00 aa f7
  * low gain: f0 43 10 3e 7f 01 20 03 cc 7f 7f 7e 4c f7
    * -180 - 180 == 7f 7f 7e 4c - 00 00 01 34
  * ...