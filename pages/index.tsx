import {promises as fsPromises} from "fs"

import {GetServerSideProps} from "next"
import Head from "next/head"

import Password from "../components/Password"
import Dashlane from "../types/dashlane"

interface IndexProps {
  passwords: Dashlane.Authentifiant[];
}

const Index = ({passwords}: IndexProps): JSX.Element => {
  const title = `Dashlane Export ${new Date().toLocaleString("sv-FI")}`
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        <ul className={"passwords"}>
          {passwords.map((password) => (
            <Password key={password.title} {...password} />
          ))}
        </ul>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = JSON.parse(
    await fsPromises.readFile(
      process.env.DASHLANE_TO_PRINT_DATA_PATH as string,
      "utf-8",
    ),
  )
  return {props: {passwords: data.AUTHENTIFIANT}}
}

export default Index
