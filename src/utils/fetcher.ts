const fetcher = (url: string) => fetch(url, {mode: "cors"}).then(res => res.json())

export default fetcher
