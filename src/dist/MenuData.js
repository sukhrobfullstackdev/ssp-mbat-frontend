
export const lvl1 = [
    {id:1000, name:'Тизимни бошкариш'},
    {id:1500, name:'Хисоб ракамлар'},
    {id:2000, name:'Смета'},
    {id:3000, name:'Юридик мажбуриятлар'},
    {id:4000, name:'Тулов хужжатлари'},
    {id:5000, name:'Маълумотномалар'},
    {id:4500, name:'Банк маълумотлари'},
    /*{id:1100, name:'Дарсликлар ва ЎМКлар билан ишлаш'},
    {id:1200, name:'Идоралараро хамкорлик'},
    {id:1300, name:'Мониторинг ва хисоботлар'},
    {id:1400, name:'Маълумотнома билан ишлаш'}*/
]

export const lvl2 = [
    [   {id:1005, parent:1000, name:'Ваколатни бошқариш'},
        {id:1010, parent:1000, name:'Фойдаланувчилар билан ишлаш'},
        {id:1015, parent:1000, name:'Ролларни бошқариш'},
        {id:1020, parent:1000, name:'Хужжатлар устида амаллар бажариш'}
    ]
    ,
    [   {id:1105, parent:1100, name:'ХТВ дарсликлар руйхати билан ишлаш'},
        {id:1110, parent:1100, name:'Буюртмалар талабномаси билан ишлаш'},
        {id:1115, parent:1100, name:'Буюртма хамда эркин сотиб олиш буйича Истиқбол кўрсаткич билан ишлаш'},
        {id:1120, parent:1100, name:'Кутубхона бўлими билан ишлаш'}
    ]
    ,
    [
        {id:1205, parent:1200, name:'Мактаблар маълумоти билан ишлаш'},
        {id:1210, parent:1200, name:'Ўқувчилар маълумоти билан ишлаш'},
        {id:1215, parent:1200, name:'Тушумлар маълумоти билан ишлаш (ДМБАТ)'},
        {id:1220, parent:1200, name:'Марказлашган бухгалтерия билан ишлаш бўлими (ДМБАТ)'},
        {id:1225, parent:1200, name:'Молия вазирлиги "Ягона Реестр" АТ билан ишлаш'},
        {id:1230, parent:1200, name:'Кам таъминланган оилалар маълумоти билан ишлаш'}
    ]
]