import fillAllDayToInitMap from "./fillAllDayToInitMap"

describe('test fillAllDayToInitMap', () => {
  it('fill AllDay Init Object Map', () => {
    const now = new Date().getTime()
    const begin = new Date("2021.10.1 8:0:0").getTime()
    let map = {}
    map = fillAllDayToInitMap(map, now, begin, "set")
    console.log(map)
    // @ts-ignore
  })
})
