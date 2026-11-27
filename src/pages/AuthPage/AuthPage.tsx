import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import './AuthPage.css'

type AuthMode = 'login' | 'register'
type FieldName = 'name' | 'email' | 'password' | 'terms'
type AuthErrors = Partial<Record<FieldName, string>>

type AuthPageProps = {
  mode: AuthMode
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === 'register'
  const formId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<AuthErrors>({})
  const [notice, setNotice] = useState('')

  function updateField(field: FieldName, value: string) {
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice('')
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: AuthErrors = {}

    if (isRegister && (name.trim().length < 2 || name.trim().length > 30)) {
      nextErrors.name = 'Имя должно быть от 2 до 30 символов'
    }

    if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Некорректный адрес электронной почты'
    }

    if (isRegister && password.length < 8) {
      nextErrors.password = 'Пароль должен быть не менее 8 символов'
    } else if (!isRegister && password.length === 0) {
      nextErrors.password = 'Введите пароль'
    }

    if (isRegister && !acceptedTerms) {
      nextErrors.terms = 'Для регистрации нужно принять условия использования'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setNotice('')
      return
    }

    // No auth API is connected yet. Never treat a locally valid form as a signed-in account.
    setNotice(isRegister
      ? 'Форма заполнена верно. Создание аккаунта станет доступно после подключения API.'
      : 'Форма заполнена верно. Вход в аккаунт станет доступен после подключения API.')
  }

  return (
    <main className={`auth-screen auth-screen--${mode}`}>
      <div className="auth-layout">
        <section className="auth-intro" aria-label="О сервисе Меняемся">
          <h1 className="auth-intro__title">
            {isRegister ? 'Новые возможности начинаются с обмена' : 'Ваш следующий обмен уже где-то рядом'}
          </h1>
          <p className="auth-intro__description">
            {isRegister
              ? <>Создайте профиль, добавьте первый лот —<br />и мы поможем найти то, что вам нужно.</>
              : <>Войдите, чтобы увидеть предложения,<br />продолжить общение и найти что-то своё.</>}
          </p>
          <p className="auth-intro__tagline">Меняйте вещи и услуги — подбор берём на себя.</p>
        </section>

        <section className="auth-card" aria-labelledby={`${formId}-title`}>
          <h2 className="auth-card__title" id={`${formId}-title`}>
            {isRegister ? 'Давайте знакомиться' : 'С возвращением!'}
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-card__fields">
              {isRegister && (
                <div className="auth-field">
                  <label htmlFor={`${formId}-name`}>Ваше имя</label>
                  <input
                    id={`${formId}-name`}
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(event) => updateField('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                  />
                  {errors.name && <p className="auth-field__error" id={`${formId}-name-error`} role="alert">{errors.name}</p>}
                </div>
              )}

              <div className="auth-field">
                <label htmlFor={`${formId}-email`}>Электронная почта</label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@example.ru"
                  value={email}
                  onChange={(event) => updateField('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                />
                {errors.email && <p className="auth-field__error" id={`${formId}-email-error`} role="alert">{errors.email}</p>}
              </div>

              <div className="auth-field">
                <label htmlFor={`${formId}-password`}>Пароль</label>
                <div className="auth-field__password-wrap">
                  <input
                    id={`${formId}-password`}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    placeholder={isRegister ? 'Придумайте пароль' : 'Введите пароль'}
                    value={password}
                    onChange={(event) => updateField('password', event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={isRegister ? `${formId}-password-hint${errors.password ? ` ${formId}-password-error` : ''}` : (errors.password ? `${formId}-password-error` : undefined)}
                  />
                  <button
                    className="auth-field__visibility"
                    type="button"
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
                {errors.password && <p className="auth-field__error" id={`${formId}-password-error`} role="alert">{errors.password}</p>}
                {isRegister && <p className="auth-field__hint" id={`${formId}-password-hint`}>Не менее 8 символов</p>}
              </div>
            </div>

            {isRegister ? (
              <div className="auth-card__agreement">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked)
                      setErrors((current) => ({ ...current, terms: undefined }))
                      setNotice('')
                    }}
                    aria-invalid={Boolean(errors.terms)}
                  />
                  <span>
                    Я принимаю <button type="button" className="auth-card__legal-link" onClick={() => setNotice('Текст условий использования пока не опубликован.')}>условия использования</button><br className="auth-agreement__desktop-break" /> и <button type="button" className="auth-card__legal-link" onClick={() => setNotice('Политика конфиденциальности пока не опубликована.')}>политику конфиденциальности</button>
                  </span>
                </label>
                {errors.terms && <p className="auth-field__error" role="alert">{errors.terms}</p>}
              </div>
            ) : (
              <div className="auth-card__options">
                <label className="auth-checkbox">
                  <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                  <span>Запомнить меня</span>
                </label>
                <button
                  type="button"
                  className="auth-card__forgot"
                  onClick={() => setNotice('Восстановление пароля станет доступно после подключения API.')}
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            {notice && <p className="auth-card__notice" role="status">{notice}</p>}

            <div className="auth-card__actions">
              <button type="submit" className="auth-card__submit">
                {isRegister ? 'Зарегистрироваться' : 'Войти'}
              </button>
              <Link className="auth-card__switch" to={isRegister ? '/login' : '/register'}>
                {isRegister ? 'Войти' : 'Зарегистрироваться'}
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

export { AuthPage }
