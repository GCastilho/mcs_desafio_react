import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const apiUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados'

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

function formatDateForInput(date: Date) {
  const month = date.getUTCMonth() + 1
  const year = date.getUTCFullYear()
  return `${year}-${('0' + month).slice(-2)}`
}

const { format: formatDateBr } = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })

const Home: NextPage = () => {
  const [ipca, setIpca] = useState<number>(0)
  const [start, setStart] = useState(get12MonthsAgo())
  const [end, setEnd] = useState(new Date())

  useEffect(() => {
    const url = new URL(apiUrl)
    url.search = new URLSearchParams({
      formato: 'json',
      dataInicial: formatDateBr(start),
      dataFinal: formatDateBr(end),
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
        <p>IPCA Acumulado de {formatDateBr(start)} até {formatDateBr(end)}: {ipca.toFixed(2)}%</p>

        <form action="">
          <input
            type='month'
            name='start'
            value={formatDateForInput(start)}
            onChange={e => setStart(new Date(e.target.value))}
          />
          <input
            type='month'
            name='end'
            value={formatDateForInput(end)}
            onChange={e => setEnd(new Date(e.target.value))}
          />
        </form>
      </main>

    </div>
  )
}

export default Home
