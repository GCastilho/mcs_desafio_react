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
  const [error, setError] = useState('')
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
      .catch(err => {
        console.error('Error:', err)
        setError(err.statusText)
      })
  }, [start, end])

  return (
    <div className={styles.container}>
      <Head>
        <title>MCS Desafio React</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {error && <p className={styles.error}>Error: {error}</p>}
        <h1>Inflação Acumulada</h1>

        <p>IPCA Acumulado de <b>{formatDateBr(start)}</b> até <b>{formatDateBr(end)}</b>:</p>

        <h2>{ipca.toFixed(2)}%</h2>

        <form className={styles.form}>
          <h3>Selecione o range para cálculo:</h3>
          <div>
            <section>
              <p>Inicio</p>
              <input
                type='month'
                name='start'
                value={formatDateForInput(start)}
                onChange={e => setStart(new Date(e.target.value))}
              />
            </section>
            <section>
              <p>Fim</p>
              <input
                type='month'
                name='end'
                value={formatDateForInput(end)}
                onChange={e => setEnd(new Date(e.target.value))}
              />
            </section>
          </div>
        </form>
      </main>

    </div>
  )
}

export default Home
