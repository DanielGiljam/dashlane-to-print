import {v4 as uuid} from "uuid"

import Dashlane from "../types/dashlane"

import Password from "./Password"

interface PasswordsGroupProps {
  id: string;
  passwords: Dashlane.Authentifiant[];
}

const PasswordsSection = ({
  id,
  passwords,
}: PasswordsGroupProps): JSX.Element => {
  const passwordsSectionSections = []
  for (let i = 0; i < passwords.length; i = i + 2) {
    passwordsSectionSections.push(
      <li key={uuid()}>
        <ul className={"section-section"}>
          <Password {...passwords[i]} />
          {passwords[i + 1] ? <Password {...passwords[i + 1]} /> : undefined}
        </ul>
      </li>,
    )
  }
  return (
    <section>
      <div className={"section-id"}>
        <h2>{id}</h2>
      </div>
      <ul>{passwordsSectionSections}</ul>
    </section>
  )
}

export default PasswordsSection
