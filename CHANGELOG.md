## [1.2.4](https://github.com/folltoshe/music-lyric-utils/compare/v1.2.3...v1.2.4) (2025-10-23)


### Bug Fixes

* **parser:** bad rule in producer math rules ([2606c57](https://github.com/folltoshe/music-lyric-utils/commit/2606c571c028add7cf7dafe94166c534bea75ab0))


### Features

* **parser:** match lines with content when match duet info ([f1fa276](https://github.com/folltoshe/music-lyric-utils/commit/f1fa2766681f8366ae0ac992837cf057c30527e0))
* **parser:** support custom match mode and rules when purification first line ([c9fa18d](https://github.com/folltoshe/music-lyric-utils/commit/c9fa18d0a3ff4579d2d2572ac68e3f6200bd087e))
* **parser:** update default purification match mode ([fb2c43a](https://github.com/folltoshe/music-lyric-utils/commit/fb2c43a2e72508fd0f60a8646d60f60c6951cd0c))



## [1.2.3](https://github.com/folltoshe/music-lyric-utils/compare/v1.2.2...v1.2.3) (2025-10-23)


### Features

* enable minify for output file ([8de93c2](https://github.com/folltoshe/music-lyric-utils/commit/8de93c2b0a2d3c4526bcb4810735e4e0934650db))
* **parser:** add check whether it is pure music ([8ad5ef6](https://github.com/folltoshe/music-lyric-utils/commit/8ad5ef6c7dcc5fde4cc9604aa05405a555641d37))
* **parser:** update default purification match rules ([7db178f](https://github.com/folltoshe/music-lyric-utils/commit/7db178f6e8d74e89f5c5fa3974cc64576f66e846))



## [1.2.2](https://github.com/folltoshe/music-lyric-utils/compare/v1.2.1...v1.2.2) (2025-10-22)


### Bug Fixes

* **parser:** errors may occur when align some extended lyric ([ae51c78](https://github.com/folltoshe/music-lyric-utils/commit/ae51c789be5f1f892aa8781a6c6fe5bb9f101a8f))


### Features

* **parser:** optimize insert space in some char ([059c318](https://github.com/folltoshe/music-lyric-utils/commit/059c3189986e1fe4bb9febd58e28ae65e218db16))



## [1.2.1](https://github.com/folltoshe/music-lyric-utils/compare/v1.2.0...v1.2.1) (2025-10-19)


### Bug Fixes

* throw error when custom options ([1d1208f](https://github.com/folltoshe/music-lyric-utils/commit/1d1208fe1d8421cebb53663ca1c826e5ca2a72a7))


### Features

* **parser:** support update options ([ca35e05](https://github.com/folltoshe/music-lyric-utils/commit/ca35e056928a832bfcc60594721f06f6185213ee))



# [1.2.0](https://github.com/folltoshe/music-lyric-utils/compare/v1.1.0...v1.2.0) (2025-10-19)


### Bug Fixes

* **parser:** dynamic line options error ([d4c5c22](https://github.com/folltoshe/music-lyric-utils/commit/d4c5c227e4245e050854069f39a752a83f915c17))
* **parser:** return type error ([4327bdc](https://github.com/folltoshe/music-lyric-utils/commit/4327bdcb700378646749e4823e759b84489156f2))
* **parser:** wrong behavior when aligning extended lyric ([7af5096](https://github.com/folltoshe/music-lyric-utils/commit/7af50964a55f8bf3bf3222d4ab31384adc10a251))
* **parser:** wrong start time when add interlude ([77cbd9d](https://github.com/folltoshe/music-lyric-utils/commit/77cbd9de26143b490faf3117abcc4a701ed5d934))


### Features

* freeze export constants ([645e78e](https://github.com/folltoshe/music-lyric-utils/commit/645e78ee2efe3762808c2422ccc112e88c34bdcc))
* **parser:** add global and block index in line duet info ([0600ae2](https://github.com/folltoshe/music-lyric-utils/commit/0600ae2821ed046af96d5ed596663df38c8aa454))
* **parser:** add need space start config in dynamic word ([742400f](https://github.com/folltoshe/music-lyric-utils/commit/742400f6e64d1c06e5671b13bd373ab671baab53))
* **parser:** add trailing config in dynamic word ([9bedd16](https://github.com/folltoshe/music-lyric-utils/commit/9bedd166bd64c03e9d66d4c7892d599a95347ae4))
* **parser:** optimize process order ([1293555](https://github.com/folltoshe/music-lyric-utils/commit/12935554f1dde56e14043be7d11409dfac460746))
* **parser:** optimize rule check when purification first line ([cc252b7](https://github.com/folltoshe/music-lyric-utils/commit/cc252b7947976d4a4231494b911705e0c14ec2a3))
* **parser:** support purification first lyric line ([e245f99](https://github.com/folltoshe/music-lyric-utils/commit/e245f9908db8ec009eed8d27601bd123146b5e29))
* **parser:** support purification other line and custom match rule ([151b4f1](https://github.com/folltoshe/music-lyric-utils/commit/151b4f1548db60856ada624d93780024f36a11ee))
* **parser:** update default purification match rules ([e236973](https://github.com/folltoshe/music-lyric-utils/commit/e236973c3baa769fe70ae854d713225e05af8f72))



# [1.1.0](https://github.com/folltoshe/music-lyric-utils/compare/v1.0.5...v1.1.0) (2025-10-18)


### Bug Fixes

* comments are not preserved in the output type file ([f9a6191](https://github.com/folltoshe/music-lyric-utils/commit/f9a61911e57f2b39083a1780c69f15e159100d25))
* **parser:** error return when add producer to meta ([bb06f69](https://github.com/folltoshe/music-lyric-utils/commit/bb06f69bae7eab95eb3b3374046fdbfaf02466aa))
* **parser:** global regex rule make bad return when match producer ([65f1967](https://github.com/folltoshe/music-lyric-utils/commit/65f1967bc2bbc98f5f357951013d196691dc20f1))
* **parser:** lyric lines are not sorted after inserting the interlude ([c290b78](https://github.com/folltoshe/music-lyric-utils/commit/c290b78497a505a9beea5c58d39eb5a848242a85))
* wrong export type ([fb9164e](https://github.com/folltoshe/music-lyric-utils/commit/fb9164e3b5bbae42e45d60fe4dd908bad0c283b0))


### Features

* **parser:** add exact match mode when check is valid producer ([b81e796](https://github.com/folltoshe/music-lyric-utils/commit/b81e796a4479691b593cb741154d346859a7e753))
* **parser:** add first line check time option when insert interlude line ([af98de2](https://github.com/folltoshe/music-lyric-utils/commit/af98de2740f98fdbbcd0807ef4e8e907a9f6486f))
* **parser:** change enable option key for interlude and duet ([d437527](https://github.com/folltoshe/music-lyric-utils/commit/d4375277086875670a92aa4e45598a97d5bf8ece))
* **parser:** support insert duet info to lyric lines ([df27db2](https://github.com/folltoshe/music-lyric-utils/commit/df27db2d3b2ce355699f77ff24721001bd064896))
* **parser:** update default producer match rules ([b720164](https://github.com/folltoshe/music-lyric-utils/commit/b720164b3759317d3711c97510c0ae7faa0a9941))
* **player:** change export content ([8f445c9](https://github.com/folltoshe/music-lyric-utils/commit/8f445c9bd44eb12f29732287de32d777a270f7f4))
* **test:** support save and load last parse content ([09644a5](https://github.com/folltoshe/music-lyric-utils/commit/09644a54bc26e38ae3a20daf439d9e2be76e49db))



## [1.0.5](https://github.com/folltoshe/music-lyric-utils/compare/v1.0.4...v1.0.5) (2025-10-10)


### Bug Fixes

* **parser:** bad return lines when parse producer ([512907c](https://github.com/folltoshe/music-lyric-utils/commit/512907c0ee34a2bf7b4168647418b1f40a4238fe))


### Features

* **parser:** add enable parse meta option ([9c04a97](https://github.com/folltoshe/music-lyric-utils/commit/9c04a97bfc70b27d66f95da73a446a379c3063dc))
* **parser:** optimize parse producer ([87870a5](https://github.com/folltoshe/music-lyric-utils/commit/87870a5319c08e6a9a91f8c4fac09115c5c43c33))
* **parser:** update default producer match rules ([9e02651](https://github.com/folltoshe/music-lyric-utils/commit/9e0265181efe9158f5cb8b68e967771b8369b4ea))
* **parser:** update parse producer options ([9064bc3](https://github.com/folltoshe/music-lyric-utils/commit/9064bc39cf4fc21bf9d58c73f8518fd46974b2ae))



## [1.0.4](https://github.com/folltoshe/music-lyric-utils/compare/v1.0.3...v1.0.4) (2025-10-07)


### Bug Fixes

* **parser:** can get stuck when insert space to punctuation ([159b299](https://github.com/folltoshe/music-lyric-utils/commit/159b29964b8c30d7dcff221ccd40e0b74f95db25))
* **parser:** spaces are not inserted correctly before and after some characters ([a447ea6](https://github.com/folltoshe/music-lyric-utils/commit/a447ea6b59ab7551a15a44c63d6698d58f82c878))


### Features

* **parser:** add is use default option when match producer ([b9972f9](https://github.com/folltoshe/music-lyric-utils/commit/b9972f9ab67a42017bd875bfe478a95b98fecb91))
* **parser:** insert space support more types ([e8b0904](https://github.com/folltoshe/music-lyric-utils/commit/e8b090425bc5e169fe09ab78bea8edef9f585f52))
* **parser:** update default producer match rules ([31dc568](https://github.com/folltoshe/music-lyric-utils/commit/31dc568c1e7c2d1d278ccf2de3267a24c5589b03))



## [1.0.3](https://github.com/folltoshe/music-lyric-utils/compare/v1.0.2...v1.0.3) (2025-10-06)


### Bug Fixes

* **parser:** incorrect rule option type ([a4fab10](https://github.com/folltoshe/music-lyric-utils/commit/a4fab1068e7bcd5a898b2bfc0c118c5496b4abe1))
* **parser:** insert punctuation space not work in dynamic word ([255f6d7](https://github.com/folltoshe/music-lyric-utils/commit/255f6d72e421632fa687600e89f6ca69d8e9639a))
* **parser:** lyric match error after replace chinese punctuation ([85f4574](https://github.com/folltoshe/music-lyric-utils/commit/85f457441efba6226705879fec79e336eadf6c4a))


### Features

* **parser:** add role match when match producers ([331716d](https://github.com/folltoshe/music-lyric-utils/commit/331716d9786c35b8b26097b9001d49e846e18fa7))
* **parser:** optimize default producer name split rule option ([a67f3e7](https://github.com/folltoshe/music-lyric-utils/commit/a67f3e75b1b62774b1c1b5966742b0b134746474))
* **parser:** optimize options manager ([8f295db](https://github.com/folltoshe/music-lyric-utils/commit/8f295db03b5e6076852724c9cc2215275d81dd0c))
* **parser:** support many rule replace when parse producer role ([d193496](https://github.com/folltoshe/music-lyric-utils/commit/d193496165940d30d5c34a5077c8f3fa38014240))
* **shared:** optimize deep required type function ([153d60b](https://github.com/folltoshe/music-lyric-utils/commit/153d60bad03f879bca7d9754d48c0af792dabeef))



## [1.0.2](https://github.com/folltoshe/music-lyric-utils/compare/v1.0.1...v1.0.2) (2025-10-04)


### Bug Fixes

* **parser:** return error when add dynamic word space end config ([f8a1cef](https://github.com/folltoshe/music-lyric-utils/commit/f8a1cef89c27cb1035f90b58dd132a9917f41a4e))
* **player:** calc current speed error ([b42e7ad](https://github.com/folltoshe/music-lyric-utils/commit/b42e7ad3a7ff01768536528218e212f4da8b59e3))



## [1.0.1](https://github.com/folltoshe/music-lyric-utils/compare/v1.0.0...v1.0.1) (2025-10-04)


### Bug Fixes

* **parser:** add interlude error ([2507e8c](https://github.com/folltoshe/music-lyric-utils/commit/2507e8c78a766375f4b54d41d3c1cab916d291b4))
* **parser:** also add first interlude when disable show interlude and first line time too long ([828e639](https://github.com/folltoshe/music-lyric-utils/commit/828e639879c1583bacd739dd64d6ac372106f669))
* **parser:** can not split chinese punctuation when match producers ([2541a8b](https://github.com/folltoshe/music-lyric-utils/commit/2541a8b7fa3f116de1f11243158af6bfae2aa680))
* **parser:** parse multiple lines in one row returned bad result ([758bcfb](https://github.com/folltoshe/music-lyric-utils/commit/758bcfb9cadfb29b5f1910e63a31f89b5152877c))
* **parser:** show interlude option not working when add interlude ([d3e9161](https://github.com/folltoshe/music-lyric-utils/commit/d3e9161582d715e6220794cc8efe6ee1fac697c7))
* **shared:** options manager get by key return bad type ([f6157ca](https://github.com/folltoshe/music-lyric-utils/commit/f6157ca20374ca12162e058b2dd5119bbcbee27e))


### Features

* **parser:** add check is interlude line function ([f8f8092](https://github.com/folltoshe/music-lyric-utils/commit/f8f8092a8ce34e539b1e8c2e9a1d1f591edf2485))
* **parser:** change options interface ([13f2ea6](https://github.com/folltoshe/music-lyric-utils/commit/13f2ea6f03be9693f70368647a8e27a394dd71f4))
* **parser:** export constant and interface from shared ([fff928e](https://github.com/folltoshe/music-lyric-utils/commit/fff928e57332d422de94af3ed06349cf6b5a7809))
* **parser:** optimize choose dynamic lyric or original lyric ([d0e1530](https://github.com/folltoshe/music-lyric-utils/commit/d0e15307045492fa1c956cfb049b5897f23d2d50))
* **parser:** optimize the timing of replacing chinese punctuation to english ([4bacf59](https://github.com/folltoshe/music-lyric-utils/commit/4bacf592b9b5b405d13f0292adffce4f703be994))
* **parser:** pre match valid lyric line when start parse ([afa7b5f](https://github.com/folltoshe/music-lyric-utils/commit/afa7b5fb79f7140ccca6bd6f5852254670c64927))
* **parser:** replace chinese punctuation to english support translate lyric and roman lyric ([acbf856](https://github.com/folltoshe/music-lyric-utils/commit/acbf8563f2c992bb709a8b9c2cf931ac10071721))
* **parser:** support custom split rule for people name when parse lyric meta ([eae3e1d](https://github.com/folltoshe/music-lyric-utils/commit/eae3e1d648770b1de5ff4a4d00c05b3f433abfac))
* **parser:** support insert space to punctuation left or right ([71f690c](https://github.com/folltoshe/music-lyric-utils/commit/71f690cb33c0e8b5e340c9ca6e365e6299fa3140))
* **parser:** support matching producers from lyric ([899f11a](https://github.com/folltoshe/music-lyric-utils/commit/899f11aa851a96ff2c1605a9e6fb48de780ceae7))
* **parser:** support parse lyric meta ([3e8dae7](https://github.com/folltoshe/music-lyric-utils/commit/3e8dae7b41553225b851ed844c7821a9fde1d3d7))
* **parser:** use options manager and support update options ([e72420a](https://github.com/folltoshe/music-lyric-utils/commit/e72420ae442bb92a97d51fd43279042d7599342e))
* **player:** export interface from shared ([84ef6ef](https://github.com/folltoshe/music-lyric-utils/commit/84ef6ef275d7645ff309392b1d7dbf875ed7e792))
* **player:** use options manager and support update options ([836a1dd](https://github.com/folltoshe/music-lyric-utils/commit/836a1dd88bef8f250196e7723eeb3165707737db))
* **shared:** add options manager ([1bc3204](https://github.com/folltoshe/music-lyric-utils/commit/1bc32047a066eef34143d9171da9e00a61ed9341))
* **shared:** add util type export ([1a57e9d](https://github.com/folltoshe/music-lyric-utils/commit/1a57e9dc4ce8622780d3eeea28bd301cc74eb0e2))



# 1.0.0 (2025-10-02)


### Bug Fixes

* bad include and exclude file in tsconfig ([a1abf0f](https://github.com/folltoshe/music-lyric-utils/commit/a1abf0f58468fe555e6bf0a3adefb4ba9cb579a5))
* **player:** error when calc current time ([b76f1ff](https://github.com/folltoshe/music-lyric-utils/commit/b76f1ff759f777aa508d4e58baa39ff5e1c8b79e))
* **shared:** type hints error in lyric line type ([5dc28a8](https://github.com/folltoshe/music-lyric-utils/commit/5dc28a8728dde6e47e2bfd254dd351ead6f23916))


### Features

* **parser:** support parse lyric ([44f7959](https://github.com/folltoshe/music-lyric-utils/commit/44f7959ef8c353ec2987a287a72f75c7706e6e17))
* **player:** add base player ([3116bcf](https://github.com/folltoshe/music-lyric-utils/commit/3116bcf75b29fd90cf1388f74816c8aa8789153e))
* **shared:** add common code ([e8087af](https://github.com/folltoshe/music-lyric-utils/commit/e8087af022efe720a8296e400f407ac53eeb1e58))
* **test:** add parser example ([3c3ce62](https://github.com/folltoshe/music-lyric-utils/commit/3c3ce62664afd2bd25e50e0b71c04deb62b6491e))
* **test:** add player example ([2d3c7cf](https://github.com/folltoshe/music-lyric-utils/commit/2d3c7cfe89411c3580021b02a56bfdc46768a924))



