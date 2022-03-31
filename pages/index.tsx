import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const apiUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json&dataInicial=01/01/2000&dataFinal=31/12/2100'

type RawIpca = {
  data: string
  valor: string
}

const Home: NextPage = () => {
  const [ipca, setIpca] = useState<number>(0)

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json() as Promise<RawIpca[]>)
      .then(data => data.slice(-12).map(v => +v.valor).reduce((acc, cur) => acc + cur))
      .then(ipca => setIpca(ipca))
      .catch(err => console.error('err', err))
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>MCS Desafio React</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>IPCA Acumulado 12 meses: {ipca.toFixed(2)}%</p>
      </main>

    </div>
  )
}

export default Home
