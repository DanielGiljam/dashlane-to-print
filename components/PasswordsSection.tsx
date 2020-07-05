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
}: PasswordsGroupProps): JSX.Element => (
  <section>
    <div className={"section-id"}>
      <h2>{id}</h2>
    </div>
    <ul>
      {passwords.map((password) => (
        <Password key={uuid()} {...password} />
      ))}
    </ul>
  </section>
)

export default PasswordsSection
