import { useState } from 'react'
import './HowItWorks.css'

const steps = [
  {
    id: 1,
    title: 'Создайте лот',
    description: 'Название, описание, фото и примерная стоимость.',
    theme: 'lilac',
  },
  {
    id: 2,
    title: 'Оцените с ИИ',
    description: 'Получите ориентировочный диапазон стоимости.',
    theme: 'blue',
  },
  {
    id: 3,
    title: 'Укажите желаемое',
    description: 'Товар, услуга или категория, которую хотите получить.',
    theme: 'primary',
  },
  {
    id: 4,
    title: 'Предложите обмен',
    description: 'Отправьте предложение, а владелец примет или отклонит.',
    theme: 'purple',
  },
] as const

type Step = (typeof steps)[number]

type StepCardProps = {
  step: Step
  mobile?: boolean
}

function StepCard({ step, mobile = false }: StepCardProps) {
  return (
    <article
      className={`how-it-works__card how-it-works__card--${step.theme} ${
        mobile ? 'how-it-works__card--mobile' : ''
      }`}
    >
      <span className="how-it-works__number">
        {step.id}
      </span>

      <div className="how-it-works__card-content">
        <h3 className="how-it-works__card-title">
          {step.title}
        </h3>

        <p className="how-it-works__card-description">
          {step.description}
        </p>
      </div>
    </article>
  )
}

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const showPreviousStep = () => {
    setActiveStep((current) =>
      (current - 1 + steps.length) % steps.length
    )
  }

  const showNextStep = () => {
    setActiveStep((current) =>
      (current + 1) % steps.length
    )
  }

  return (
    <section
      className="how-it-works"
      id="how-it-works"
      aria-labelledby="how-it-works-title"
    >
      <div className="how-it-works__container">
        <h2
          className="how-it-works__title"
          id="how-it-works-title"
        >
          Как это работает
        </h2>

        <div className="how-it-works__desktop">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>

        <div className="how-it-works__mobile">
          <button
            className="how-it-works__arrow"
            type="button"
            onClick={showPreviousStep}
            aria-label="Предыдущий шаг"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M19 12H5M11 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className="how-it-works__active-card"
            aria-live="polite"
          >
            <StepCard step={steps[activeStep]} mobile />
          </div>

          <button
            className="how-it-works__arrow"
            type="button"
            onClick={showNextStep}
            aria-label="Следующий шаг"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export { HowItWorks }
