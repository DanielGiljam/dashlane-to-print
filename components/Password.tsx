import Dashlane from "../types/dashlane"

const Password = ({
  title,
  domain,
  email,
  login,
  secondaryLogin,
  password,
  note,
}: Dashlane.Authentifiant): JSX.Element => {
  return (
    <li>
      <h2>{title || domain}</h2>
      <span className={"domain"}>{domain}</span>
      <ul className={"password-details"}>
        {email ? (
          <li>
            <span>Email</span>
            {email}
          </li>
        ) : undefined}
        {login ? (
          <li>
            <span>Login</span>
            {login}
          </li>
        ) : undefined}
        {secondaryLogin ? (
          <li>
            <span>Secondary login</span>
            {secondaryLogin}
          </li>
        ) : undefined}
        <li className={"password"}>
          <span>Password</span>
          <code>{password}</code>
        </li>
        {note ? (
          <li className={"note"}>
            <span>Note</span>
            {note}
          </li>
        ) : undefined}
      </ul>
    </li>
  )
}

export default Password
