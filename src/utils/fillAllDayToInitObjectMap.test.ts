import fillAllDayToInitObjectMap from "./fillAllDayToInitObjectMap"

describe('test fillAllDayToInitObjectMap', () => {
  it('fill AllDay Init Object Map', () => {
    const now = new Date().getTime()
    const begin = new Date("2021.10.20").getTime()
    let map = {}
    map = fillAllDayToInitObjectMap(map, now, begin, "set")
    console.log(map)
    // @ts-ignore
    console.log(map["2021-10-19"].add("83883"))
    console.log(map)
    // expect()
  })
})
