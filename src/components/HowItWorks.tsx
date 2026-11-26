import { useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import stepCreate from '../assets/figma/step-create.svg'
import stepCreateMobile from '../assets/figma/step-create-mobile.svg'
import stepAI from '../assets/figma/step-ai.svg'
import stepWanted from '../assets/figma/step-wanted.svg'
import stepExchange from '../assets/figma/step-exchange.svg'
import './HowItWorks.css'

const steps = [
  {
    id: 1,
    title: 'Создайте лот',
    description: 'Название, описание, фото и примерная стоимость.',
    theme: 'lilac',
    illustration: stepCreate,
    mobileIllustration: stepCreateMobile,
  },
  {
    id: 2,
    title: 'Оцените с ИИ',
    description: 'Получите ориентировочный диапазон стоимости.',
    theme: 'blue',
    illustration: stepAI,
  },
  {
    id: 3,
    title: 'Укажите желаемое',
    description: 'Товар, услуга или категория, которую хотите получить.',
    theme: 'peach',
    illustration: stepWanted,
  },
  {
    id: 4,
    title: 'Предложите обмен',
    description: 'Отправьте предложение, а владелец примет или отклонит.',
    theme: 'mint',
    illustration: stepExchange,
  },
] as const

type Step = (typeof steps)[number]

type StepCardProps = {
  step: Step
  mobile?: boolean
}

function StepCard({ step, mobile = false }: StepCardProps) {
  const illustration = mobile && 'mobileIllustration' in step
    ? step.mobileIllustration
    : step.illustration

  return (
    <article
      className={`how-it-works__card how-it-works__card--${step.theme} ${
        mobile ? 'how-it-works__card--mobile' : ''
      }`}
    >
      <span className="how-it-works__number">
        {step.id}
      </span>

      <img className="how-it-works__illustration" src={illustration} alt="" aria-hidden="true" />

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
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (!touchStart.current) return

    const touch = event.changedTouches[0]
    const distanceX = touch.clientX - touchStart.current.x
    const distanceY = touch.clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(distanceX) < 50 || Math.abs(distanceX) < Math.abs(distanceY) * 1.2) return

    setActiveStep((current) => distanceX < 0
      ? (current + 1) % steps.length
      : (current - 1 + steps.length) % steps.length,
    )
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setActiveStep((current) => (current + 1) % steps.length)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setActiveStep((current) => (current - 1 + steps.length) % steps.length)
    }
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

        <div
          className="how-it-works__mobile"
          role="region"
          aria-roledescription="карусель"
          aria-label="Этапы обмена"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => { touchStart.current = null }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="how-it-works__active-card"
            aria-live="polite"
          >
            <StepCard step={steps[activeStep]} mobile />
          </div>

          <div className="how-it-works__pagination" aria-label="Шаги работы сервиса">
            {steps.map((step, index) => (
              <button
                key={step.id}
                className={`how-it-works__dot${index === activeStep ? ' is-active' : ''}`}
                type="button"
                onClick={() => setActiveStep(index)}
                aria-label={`Показать шаг ${step.id}: ${step.title}`}
                aria-current={index === activeStep ? 'step' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { HowItWorks }
