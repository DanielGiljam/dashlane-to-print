import Dashlane from "../types/dashlane"

const Password = ({
  title,
  domain,
  email,
  login,
  secondaryLogin,
  password,
  note,
}: Dashlane.Authentifiant): JSX.Element => (
  <li className={"password-item"}>
    <h3>{title || domain}</h3>
    <span className={"domain"}>{domain}</span>
    <ul>
      {email ? (
        <li className={"email"}>
          <span>Email</span>
          {email}
        </li>
      ) : undefined}
      {login ? (
        <li className={"login"}>
          <span>Login</span>
          {login}
        </li>
      ) : undefined}
      {secondaryLogin ? (
        <li className={"secondary-login"}>
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

export default Password
