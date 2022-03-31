import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const apiUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json'

type RawIpca = {
  data: string
  valor: string
}

function get12MonthsAgo() {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  oneYearAgo.setDate(1)
  return oneYearAgo
}

const { format: formatDate } = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })

const Home: NextPage = () => {
  const [ipca, setIpca] = useState<number>(0)
  const [start, setStart] = useState<Date|null>(get12MonthsAgo())
  const [end, setEnd] = useState<Date|null>(new Date())

  useEffect(() => {
    const url = new URL(apiUrl)
    url.search = new URLSearchParams({
      dataInicial: formatDate(start || new Date('01/01/2000')),
      dataFinal: formatDate(end || new Date('31/12/2100')),
    }).toString()

    fetch(url.toString())
      .then(res => res.json() as Promise<RawIpca[]>)
      .then(data => data.map(v => +v.valor).reduce((acc, cur) => acc + cur))
      .then(ipca => setIpca(ipca))
      .catch(err => console.error('err', err))
  }, [start, end])

  return (
    <div className={styles.container}>
      <Head>
        <title>MCS Desafio React</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>IPCA Acumulado 12 meses: {ipca.toFixed(2)}%</p>
        <p>Start: {start && formatDate(start)}</p>
        <p>End: {end && formatDate(end)}</p>

        <form action="">
          <input
            type='month'
            name='start'
            onChange={e => setStart(e.target.valueAsDate)}
          />
          <input
            type='month'
            name='end'
            onChange={e => setEnd(e.target.valueAsDate)}
          />
        </form>
      </main>

    </div>
  )
}

export default Home
