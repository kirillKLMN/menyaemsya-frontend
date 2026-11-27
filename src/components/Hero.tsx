import { Link } from 'react-router'
import heroIllustration from '../assets/figma/hero-swap.png'
import './Hero.css'

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__content">
          <h1 className="hero__title" id="hero-title">
            Меняйте вещи и услуги — система найдёт обмен{' '}
            <span className="hero__title-accent">
              за вас
            </span>
          </h1>

          <div className="hero__bottom">
            <p className="hero__description">
              Разместите лот, укажите, что хотите получить,
              и «Меняемся» подберёт взаимовыгодные варианты.
              ИИ подскажет ориентировочную стоимость.
            </p>

            <div className="hero__actions">
              <Link
                className="hero__button hero__button--primary"
                to="/lots/new"
              >
                Создать лот
              </Link>

              <Link
                className="hero__button hero__button--secondary"
                to="/catalog"
              >
                Смотреть каталог
              </Link>
            </div>
          </div>
        </div>

        <img
          className="hero__illustration"
          src={heroIllustration}
          alt=""
          width="654"
          height="524"
        />
      </div>
    </section>
  )
}

export { Hero }
