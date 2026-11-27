import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import { Link } from 'react-router'
import './CreateLotPage.css'

type LotType = 'product' | 'service'
type CategoryId = 'services' | 'home' | 'electronics' | 'tools' | 'children' | 'sport'
type Condition = 'new' | 'excellent' | 'good' | 'fair'

type Draft = {
  type: LotType
  category: CategoryId | ''
  title: string
  description: string
  condition: Condition | ''
  price: string
  desiredExchange: string
  characteristics: Record<string, string>
}

type Photo = { id: string; file: File; url: string }
type ErrorField = 'category' | 'title' | 'description' | 'condition' | 'desiredExchange'
type Errors = Partial<Record<ErrorField, string>>

const DRAFT_STORAGE_KEY = 'menyaemsya-create-lot-draft-v1'
const MAX_PHOTOS = 3
const MAX_PHOTO_BYTES = 10 * 1024 * 1024

const initialDraft: Draft = {
  type: 'product',
  category: '',
  title: '',
  description: '',
  condition: '',
  price: '',
  desiredExchange: '',
  characteristics: {},
}

const categories: { id: CategoryId; label: string }[] = [
  { id: 'services', label: 'Услуги' },
  { id: 'home', label: 'Дом и сад' },
  { id: 'electronics', label: 'Электроника' },
  { id: 'tools', label: 'Инструменты' },
  { id: 'children', label: 'Детские вещи' },
  { id: 'sport', label: 'Спорт и отдых' },
]

const conditions: { id: Condition; label: string }[] = [
  { id: 'new', label: 'Новое' },
  { id: 'excellent', label: 'Отличное' },
  { id: 'good', label: 'Хорошее' },
  { id: 'fair', label: 'Удовлетворительное' },
]

const characteristicsByCategory: Record<CategoryId, string[]> = {
  services: ['Формат услуги', 'Продолжительность'],
  home: ['Тип предмета', 'Материал'],
  electronics: ['Бренд', 'Модель'],
  tools: ['Производитель', 'Тип инструмента'],
  children: ['Возраст', 'Размер'],
  sport: ['Вид спорта', 'Размер / модель'],
}

function loadDraft(): Draft {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!saved) return initialDraft
    const parsed: unknown = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object') return initialDraft
    const data = parsed as Partial<Draft>
    return {
      ...initialDraft,
      type: data.type === 'service' ? 'service' : 'product',
      category: categories.some((item) => item.id === data.category) ? data.category! : '',
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description.slice(0, 1000) : '',
      condition: conditions.some((item) => item.id === data.condition) ? data.condition! : '',
      price: typeof data.price === 'string' ? data.price : '',
      desiredExchange: typeof data.desiredExchange === 'string' ? data.desiredExchange : '',
      characteristics: data.characteristics && typeof data.characteristics === 'object' ? data.characteristics : {},
    }
  } catch {
    return initialDraft
  }
}

function validate(draft: Draft): Errors {
  const errors: Errors = {}
  if (!draft.category) errors.category = 'Выберите категорию'
  if (draft.title.trim().length < 3) errors.title = 'Введите название не короче 3 символов'
  if (draft.description.trim().length < 10) errors.description = 'Добавьте описание не короче 10 символов'
  if (draft.type === 'product' && !draft.condition) errors.condition = 'Укажите состояние товара'
  if (draft.desiredExchange.trim().length < 3) errors.desiredExchange = 'Напишите, что хотите получить взамен'
  return errors
}

function CreateLotPage() {
  const formId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const allocatedUrls = useRef<Set<string>>(new Set())
  const [draft, setDraft] = useState<Draft>(loadDraft)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [photoError, setPhotoError] = useState('')
  const [notice, setNotice] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const urls = allocatedUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice('')
  }

  function selectCategory(category: CategoryId) {
    setDraft((current) => ({ ...current, category, characteristics: {} }))
    setErrors((current) => ({ ...current, category: undefined }))
    setNotice('')
  }

  function addPhotos(files: FileList | File[]) {
    const existing = photos.map((photo) => `${photo.file.name}-${photo.file.size}-${photo.file.lastModified}`)
    const next: Photo[] = []
    let invalid = 0
    let tooLarge = 0
    let tooMany = 0

    for (const file of Array.from(files)) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) { invalid++; continue }
      if (file.size > MAX_PHOTO_BYTES) { tooLarge++; continue }
      const key = `${file.name}-${file.size}-${file.lastModified}`
      if (existing.includes(key) || next.some((photo) => `${photo.file.name}-${photo.file.size}-${photo.file.lastModified}` === key)) continue
      if (photos.length + next.length >= MAX_PHOTOS) { tooMany++; continue }
      const url = URL.createObjectURL(file)
      allocatedUrls.current.add(url)
      next.push({ id: `${Date.now()}-${next.length}`, file, url })
    }

    if (next.length) setPhotos((current) => [...current, ...next])
    setPhotoError([
      invalid ? 'Разрешены только JPG и PNG.' : '',
      tooLarge ? 'Размер каждого файла должен быть до 10 МБ.' : '',
      tooMany ? 'Можно добавить не более трёх фото.' : '',
    ].filter(Boolean).join(' '))
    setNotice('')
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addPhotos(event.target.files)
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files.length) addPhotos(event.dataTransfer.files)
  }

  function removePhoto(id: string) {
    const photo = photos.find((item) => item.id === id)
    if (photo) {
      URL.revokeObjectURL(photo.url)
      allocatedUrls.current.delete(photo.url)
    }
    setPhotos((current) => current.filter((item) => item.id !== id))
    setPhotoError('')
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
      setNotice('Черновик сохранён в этом браузере. Фотографии нужно будет выбрать заново после перезагрузки.')
    } catch {
      setNotice('Не удалось сохранить черновик. Проверьте, разрешено ли хранение данных в браузере.')
    }
  }

  function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setNotice('Проверьте обязательные поля формы.')
      return
    }

    // Publication requires the backend endpoint. Do not simulate a live listing.
    setNotice('Форма заполнена. Публикация объявления станет доступна после подключения API. Пока можно сохранить черновик.')
  }

  const canEstimate = Boolean(draft.title.trim() && draft.category)
  const categoryFields = draft.category ? characteristicsByCategory[draft.category] : []

  return (
    <main className="create-lot-page">
      <div className="create-lot-page__container">
        <nav className="create-lot-page__breadcrumbs" aria-label="Хлебные крошки">
          Личный кабинет <span aria-hidden="true">/</span> <span aria-current="page">Создать лот</span>
        </nav>

        <h1 className="create-lot-page__title">Создать лот</h1>

        <form onSubmit={handlePublish} noValidate>
          <section className="create-lot-page__card create-lot-page__main-card" aria-labelledby="create-main-heading">
            <h2 id="create-main-heading">Основное</h2>

            <div className="create-lot-page__field-group">
              <span className="create-lot-page__label">Тип предложения</span>
              <div className="create-lot-page__type-control" role="group" aria-label="Тип предложения">
                <button type="button" aria-pressed={draft.type === 'product'} className={draft.type === 'product' ? 'is-selected' : ''} onClick={() => update('type', 'product')}>Товар</button>
                <button type="button" aria-pressed={draft.type === 'service'} className={draft.type === 'service' ? 'is-selected' : ''} onClick={() => update('type', 'service')}>Услуга</button>
              </div>
            </div>

            <div className="create-lot-page__field-group">
              <span className="create-lot-page__label">Категория</span>
              <div className="create-lot-page__chips" role="group" aria-label="Категория">
                {categories.map((category) => (
                  <button key={category.id} type="button" className={draft.category === category.id ? 'is-selected' : ''} aria-pressed={draft.category === category.id} onClick={() => selectCategory(category.id)}>{category.label}</button>
                ))}
              </div>
              {errors.category && <p className="create-lot-page__error" role="alert">{errors.category}</p>}
            </div>

            <div className="create-lot-page__field-group">
              <label className="create-lot-page__label" htmlFor={`${formId}-title`}>Название лота</label>
              <input id={`${formId}-title`} value={draft.title} maxLength={120} placeholder="Например, Платье женское" onChange={(event) => update('title', event.target.value)} aria-invalid={Boolean(errors.title)} />
              {errors.title && <p className="create-lot-page__error" role="alert">{errors.title}</p>}
            </div>

            <div className="create-lot-page__field-group">
              <div className="create-lot-page__label-row">
                <label className="create-lot-page__label" htmlFor={`${formId}-description`}>Описание</label>
                <span>{draft.description.length} / 1000</span>
              </div>
              <textarea id={`${formId}-description`} rows={5} value={draft.description} maxLength={1000} placeholder="Расскажите о состоянии, комплектации и условиях обмена" onChange={(event) => update('description', event.target.value)} aria-invalid={Boolean(errors.description)} />
              {errors.description && <p className="create-lot-page__error" role="alert">{errors.description}</p>}
            </div>

            {draft.type === 'product' && (
              <div className="create-lot-page__field-group">
                <span className="create-lot-page__label">Состояние</span>
                <div className="create-lot-page__chips" role="group" aria-label="Состояние товара">
                  {conditions.map((condition) => (
                    <button key={condition.id} type="button" className={draft.condition === condition.id ? 'is-selected' : ''} aria-pressed={draft.condition === condition.id} onClick={() => update('condition', condition.id)}>{condition.label}</button>
                  ))}
                </div>
                {errors.condition && <p className="create-lot-page__error" role="alert">{errors.condition}</p>}
              </div>
            )}
          </section>

          <section className="create-lot-page__card create-lot-page__photos-card" aria-labelledby="create-photos-heading">
            <h2 id="create-photos-heading">Фотографии</h2>
            <p className="create-lot-page__section-note">До 3 фото, JPG или PNG до 10 МБ. Первое фото станет главным</p>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple className="create-lot-page__hidden-input" onChange={handleFileChange} aria-label="Выбрать фотографии" />
            <div
              className={`create-lot-page__dropzone${isDragging ? ' is-dragging' : ''}`}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
              onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false) }}
              onDrop={handleDrop}
            >
              <p>Перетащите фотографии сюда</p>
              <button type="button" onClick={() => inputRef.current?.click()} disabled={photos.length >= MAX_PHOTOS}>Выбрать файлы</button>
            </div>
            {photoError && <p className="create-lot-page__error" role="alert">{photoError}</p>}
            <div className="create-lot-page__photo-slots" aria-label="Загруженные фотографии">
              {Array.from({ length: 5 }, (_, index) => {
                const photo = photos[index]
                return (
                  <div className="create-lot-page__photo-slot" key={photo?.id ?? `empty-${index}`}>
                    {photo && (
                      <>
                        <img src={photo.url} alt={`Фото объявления ${index + 1}`} />
                        {index === 0 && <span className="create-lot-page__main-photo-badge">Главное</span>}
                        <button type="button" aria-label={`Удалить фотографию ${index + 1}`} title="Удалить фотографию" onClick={() => removePhoto(photo.id)}>×</button>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <section className="create-lot-page__card create-lot-page__characteristics-card" aria-labelledby="create-characteristics-heading">
            <h2 id="create-characteristics-heading">Характеристики</h2>
            <p className="create-lot-page__section-note">Набор полей зависит от выбранной категории</p>
            {categoryFields.length ? (
              <div className="create-lot-page__characteristics-fields">
                {categoryFields.map((field) => (
                  <label key={field}>
                    <span>{field}</span>
                    <input value={draft.characteristics[field] ?? ''} placeholder={`Укажите: ${field.toLowerCase()}`} onChange={(event) => update('characteristics', { ...draft.characteristics, [field]: event.target.value })} />
                  </label>
                ))}
              </div>
            ) : (
              <div className="create-lot-page__hint">Выберите категорию — здесь появятся дополнительные характеристики, которые для нее предусмотрены.</div>
            )}
          </section>

          <section className="create-lot-page__card create-lot-page__price-card" aria-labelledby="create-price-heading">
            <h2 id="create-price-heading">Стоимость и обмен</h2>
            <p className="create-lot-page__section-note">Стоимость — ориентир, предлагайте равноценный обмен или договоритесь о доплате.</p>
            <div className="create-lot-page__field-group">
              <label className="create-lot-page__label" htmlFor={`${formId}-price`}>Ориентировочная стоимость, ₽</label>
              <div className="create-lot-page__price-row">
                <input id={`${formId}-price`} inputMode="numeric" value={draft.price} placeholder="Например, 1 000" onChange={(event) => { if (/^\d*$/.test(event.target.value)) update('price', event.target.value) }} />
                <button type="button" className="create-lot-page__ai-button" disabled={!canEstimate} onClick={() => setNotice('ИИ-оценка появится после подключения сервиса оценки на бэкенде.')}>✦ Оценить с помощью ИИ</button>
              </div>
            </div>
            <div className="create-lot-page__hint create-lot-page__ai-hint">
              {canEstimate ? 'Название и категория указаны — после подключения API здесь появится результат ИИ-оценки.' : 'Заполните название и категорию — кнопка оценки станет активной. Результат появится здесь.'}
            </div>
            <div className="create-lot-page__field-group create-lot-page__last-field">
              <label className="create-lot-page__label" htmlFor={`${formId}-wanted`}>Желаемый обмен</label>
              <input id={`${formId}-wanted`} value={draft.desiredExchange} placeholder="Что хотите получить взамен" onChange={(event) => update('desiredExchange', event.target.value)} aria-invalid={Boolean(errors.desiredExchange)} />
              {errors.desiredExchange && <p className="create-lot-page__error" role="alert">{errors.desiredExchange}</p>}
            </div>
          </section>

          {notice && <p className="create-lot-page__notice" role="status">{notice}</p>}
          <div className="create-lot-page__actions">
            <Link to="/catalog" className="create-lot-page__cancel">Отмена</Link>
            <div className="create-lot-page__action-buttons">
              <button type="button" className="create-lot-page__save" onClick={saveDraft}>Сохранить</button>
              <button type="submit" className="create-lot-page__publish">Опубликовать</button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export { CreateLotPage }
