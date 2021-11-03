import fillAllDayToInitObjectMap from "./fillAllDayToInitObjectMap"

describe('test fillAllDayToInitObjectMap', () => {
  it('fill AllDay Init Object Map', () => {
    const now = new Date().getTime()
    const begin = new Date("2021.10.20").getTime()
    const res = fillAllDayToInitObjectMap({}, now, begin, 0)
    console.log(res)
    // expect()
  })
})
