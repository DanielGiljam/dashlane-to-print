import {promises as fsPromises} from "fs"

import {GetServerSideProps} from "next"
import Head from "next/head"

import PasswordsSection from "../components/PasswordsSection"
import Dashlane from "../types/dashlane"

const getSectionId = ({title, domain}: Dashlane.Authentifiant): string => {
  const firstLetter = (title || domain)[0]
  return /[^a-z]/i.test(firstLetter)
    ? /[^0-9]/.test(firstLetter)
      ? "#"
      : "0-9"
    : firstLetter.toUpperCase()
}

const title = `Dashlane Export ${new Date().toLocaleString("sv-FI")}`

interface IndexProps {
  passwordsSections: {[key: string]: Dashlane.Authentifiant[]};
}

const Index = ({passwordsSections}: IndexProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        {Object.entries(passwordsSections).map(([id, passwords]) => (
          <PasswordsSection key={id} id={id} passwords={passwords} />
        ))}
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data: {AUTHENTIFIANT?: Dashlane.Authentifiant[]} = JSON.parse(
    await fsPromises.readFile(
      process.env.DASHLANE_TO_PRINT_DATA_PATH as string,
      "utf-8",
    ),
  )
  const passwordsSections = (data.AUTHENTIFIANT || [])
    .sort((a, b) => (a.title || a.domain).localeCompare(b.title || b.domain))
    .reduce<{[key: string]: Dashlane.Authentifiant[]}>((sections, password) => {
      (sections[getSectionId(password)] =
        sections[getSectionId(password)] || []).push(password)
      return sections
    }, {})
  return {props: {passwordsSections}}
}

export default Index
