import heroIllustration from '../assets/hero-swap-3d 1.png'
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
              <a
                className="hero__button hero__button--primary"
                href="#create-lot"
              >
                Создать лот
              </a>

              <a
                className="hero__button hero__button--secondary"
                href="#catalog"
              >
                Смотреть каталог
              </a>
            </div>
          </div>
        </div>

        <img
          className="hero__illustration"
          src={heroIllustration}
          alt=""
          width="497"
          height="497"
        />
      </div>
    </section>
  )
}

export { Hero }
