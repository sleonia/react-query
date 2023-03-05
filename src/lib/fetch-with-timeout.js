export const fetchWithTimeout = (input, init) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      fetch(input, init).then(res).catch(rej)
    }, 250)
  })
