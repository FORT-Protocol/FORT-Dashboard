const fillAllDayToInitObjectMap = (map: {[index: string]: any}, future: number, past: number, initData: any) => {
  for (let it = past; it < future + 84600000; it += 84600000){
    const day = new Date(it).toJSON().substr(0, 10)
    map[day] = initData
  }
  return map
}

export default fillAllDayToInitObjectMap