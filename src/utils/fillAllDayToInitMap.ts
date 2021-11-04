const fillAllDayToInitMap = (map: {[index: string]: any}, future: number, past: number, type: string) => {
  for (let it = past; it <= future + 84600000; it += 84600000){
    const day = new Date(it).toJSON().substr(0, 10)
    if (type === "number") {
      map[day] = 0
    }
    if (type === "set") {
      map[day] = new Set<string>()
    }
  }
  return map
}

export default fillAllDayToInitMap