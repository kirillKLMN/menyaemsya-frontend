import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useParams } from 'react-router'
import { catalogLots } from '../../data/catalogLots'
import type { CatalogLot } from '../../data/catalogLots'
import bikePhoto from '../../assets/figma/lot-bike-raw.png'
import bikeAnglePhoto from '../../assets/lot-details/bike-angle.png'
import bikeHandlebarPhoto from '../../assets/lot-details/bike-handlebar.png'
import bikeBoxPhoto from '../../assets/lot-details/bike-box.png'
import { PreviewPage } from '../DemoPages'
import '../CreateLotPage/CreateLotPage.css'
import './EditLotPage.css'

type Category = 'services' | 'home' | 'electronics' | 'tools' | 'children' | 'sport'
type Condition = 'new' | 'excellent' | 'good' | 'fair'
type LotType = 'product' | 'service'
type ExtraCharacteristic = { id: string; name: string; value: string }

type EditValues = {
  type: LotType
  category: Category
  title: string
  description: string
  condition: Condition
  price: string
  desiredExchange: string
  characteristics: Record<string, string>
  extraCharacteristics: ExtraCharacteristic[]
}

type Photo = { id: string; url: string; file?: File }
type SavedEdit = { values: EditValues; removedPhotoIds: string[] }
type FormErrors = Partial<Record<'category' | 'title' | 'description' | 'condition' | 'desiredExchange', string>>

const MAX_PHOTOS = 4
const MAX_PHOTO_SIZE = 10 * 1024 * 1024
const categories: { id: Category; label: string }[] = [
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
const categoryFields: Record<Category, string[]> = {
  services: ['Формат услуги', 'Продолжительность'],
  home: ['Тип', 'Материал'],
  electronics: ['Тип', 'Бренд', 'Модель'],
  tools: ['Тип', 'Бренд'],
  children: ['Возраст', 'Размер'],
  sport: ['Тип', 'Бренд', 'Размер', 'Материал'],
}

const bikeDescription = 'Продаю горный велосипед с алюминиевой рамой размера M, колёса 27,5″. Ездил два сезона, в основном по городу и лесным дорогам. Рама без трещин и серьёзных вмятин, есть пара мелких царапин от эксплуатации. Переключатели работают чётко, цепь и кассета недавно обслужены, покрышки в хорошем состоянии.\nХочу обменять на электросамокат, рассмотрю модели с запасом хода от 25 км. Передача возможна в Москве: самовывоз или встреча в удобном для обоих месте. Перед обменом готов показать велосипед и дать проехаться.'

function getOriginalPhotos(lot: CatalogLot): Photo[] {
  if (lot.id === 1) {
    return [bikePhoto, bikeAnglePhoto, bikeHandlebarPhoto, bikeBoxPhoto].map((url, index) => ({
      id: `original-${index}`, url,
    }))
  }
  return lot.imageUrls.map((url, index) => ({ id: `original-${index}`, url }))
}

function getDefaultValues(lot: CatalogLot): EditValues {
  const category: Category = categories.some((item) => item.id === lot.category) ? lot.category as Category : 'home'
  return {
    type: lot.type,
    category,
    title: lot.title,
    description: lot.id === 1 ? bikeDescription : lot.description,
    condition: lot.condition === 'new' ? 'new' : lot.condition === 'like-new' ? 'excellent' : 'good',
    // В макете велосипеда цена оставлена пустой, несмотря на оценку в карточке объявления.
    price: lot.id === 1 ? '' : lot.estimatedPrice?.toString() ?? '',
    desiredExchange: lot.id === 1 ? 'Электросамокат' : lot.desiredExchange,
    characteristics: lot.id === 1 ? {
      'Тип': 'Горный, хардтейл',
      'Бренд': 'Merida',
      'Размер': 'М, 27,5”',
      'Материал': 'Алюминий',
    } : {},
    extraCharacteristics: [],
  }
}

function loadSavedEdit(lotId: number): SavedEdit | null {
  try {
    const raw = localStorage.getItem(`menyaemsya-edit-lot-${lotId}`)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const edit = parsed as Partial<SavedEdit>
    if (!edit.values || typeof edit.values.title !== 'string' || !Array.isArray(edit.removedPhotoIds)) return null
    return edit as SavedEdit
  } catch {
    return null
  }
}

function EditLotForm({ lot }: { lot: CatalogLot }) {
  const inputId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const previewUrls = useRef<Set<string>>(new Set())
  const [values, setValues] = useState<EditValues>(() => loadSavedEdit(lot.id)?.values ?? getDefaultValues(lot))
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const removed = loadSavedEdit(lot.id)?.removedPhotoIds ?? []
    return getOriginalPhotos(lot).filter((photo) => !removed.includes(photo.id))
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [notice, setNotice] = useState('')
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    const urls = previewUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function update<K extends keyof EditValues>(field: K, value: EditValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice('')
  }

  function updateCategory(category: Category) {
    setValues((current) => ({ ...current, category, characteristics: {} }))
    setErrors((current) => ({ ...current, category: undefined }))
    setNotice('')
  }

  function addPhotos(files: FileList | null) {
    if (!files) return
    const additions: Photo[] = []
    let invalid = false
    let tooLarge = false
    let tooMany = false
    for (const file of Array.from(files)) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) { invalid = true; continue }
      if (file.size > MAX_PHOTO_SIZE) { tooLarge = true; continue }
      if (photos.length + additions.length >= MAX_PHOTOS) { tooMany = true; continue }
      const url = URL.createObjectURL(file)
      previewUrls.current.add(url)
      additions.push({ id: `upload-${Date.now()}-${additions.length}`, url, file })
    }
    if (additions.length) setPhotos((current) => [...current, ...additions])
    setPhotoError([
      invalid ? 'Загрузите JPG или PNG.' : '',
      tooLarge ? 'Размер одного фото не должен превышать 10 МБ.' : '',
      tooMany ? 'Можно разместить не более четырёх фото.' : '',
    ].filter(Boolean).join(' '))
    setNotice('')
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    addPhotos(event.target.files)
    event.target.value = ''
  }

  function removePhoto(id: string) {
    const photo = photos.find((item) => item.id === id)
    if (photo?.file) {
      URL.revokeObjectURL(photo.url)
      previewUrls.current.delete(photo.url)
    }
    setPhotos((current) => current.filter((item) => item.id !== id))
    setPhotoError('')
    setNotice('')
  }

  function addCharacteristic() {
    const newItem = { id: `extra-${Date.now()}`, name: '', value: '' }
    update('extraCharacteristics', [...values.extraCharacteristics, newItem])
  }

  function editCharacteristic(id: string, field: 'name' | 'value', value: string) {
    update('extraCharacteristics', values.extraCharacteristics.map((item) => item.id === id ? { ...item, [field]: value } : item))
  }

  function removeCharacteristic(id: string) {
    update('extraCharacteristics', values.extraCharacteristics.filter((item) => item.id !== id))
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    if (!values.category) nextErrors.category = 'Выберите категорию'
    if (values.title.trim().length < 3) nextErrors.title = 'Введите название не короче 3 символов'
    if (values.description.trim().length < 10) nextErrors.description = 'Добавьте описание не короче 10 символов'
    if (values.type === 'product' && !values.condition) nextErrors.condition = 'Укажите состояние'
    if (values.desiredExchange.trim().length < 3) nextErrors.desiredExchange = 'Укажите желаемый обмен'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) { setNotice('Проверьте обязательные поля.'); return }

    try {
      const keptIds = new Set(photos.map((photo) => photo.id))
      const saved: SavedEdit = {
        values,
        removedPhotoIds: getOriginalPhotos(lot).filter((photo) => !keptIds.has(photo.id)).map((photo) => photo.id),
      }
      localStorage.setItem(`menyaemsya-edit-lot-${lot.id}`, JSON.stringify(saved))
      setNotice(photos.some((photo) => photo.file)
        ? 'Изменения сохранены в этом браузере (демо). Новые фотографии нужно загрузить заново после перезагрузки.'
        : 'Изменения сохранены в этом браузере (демо). Сохранение на сервере появится после подключения API.')
    } catch {
      setNotice('Не удалось сохранить изменения в браузере.')
    }
  }

  return (
    <main className="create-lot-page edit-lot-page">
      <div className="create-lot-page__container">
        <nav className="create-lot-page__breadcrumbs" aria-label="Хлебные крошки">
          Личный кабинет <span aria-hidden="true">/</span> <span aria-current="page">Редактировать лот</span>
        </nav>
        <h1 className="create-lot-page__title">Редактировать лот</h1>

        <form onSubmit={handleSave} noValidate>
          <section className="create-lot-page__card create-lot-page__main-card" aria-labelledby="edit-main-title">
            <h2 id="edit-main-title">Основное</h2>
            <div className="create-lot-page__field-group">
              <span className="create-lot-page__label">Тип предложения</span>
              <div className="create-lot-page__type-control" role="group" aria-label="Тип предложения">
                <button type="button" className={values.type === 'product' ? 'is-selected' : ''} aria-pressed={values.type === 'product'} onClick={() => update('type', 'product')}>Товар</button>
                <button type="button" className={values.type === 'service' ? 'is-selected' : ''} aria-pressed={values.type === 'service'} onClick={() => update('type', 'service')}>Услуга</button>
              </div>
            </div>
            <div className="create-lot-page__field-group">
              <span className="create-lot-page__label">Категория</span>
              <div className="create-lot-page__chips" role="group" aria-label="Категория">
                {categories.map((category) => (
                  <button type="button" key={category.id} className={values.category === category.id ? 'is-selected' : ''} aria-pressed={values.category === category.id} onClick={() => updateCategory(category.id)}>{category.label}</button>
                ))}
              </div>
              {errors.category && <p className="create-lot-page__error" role="alert">{errors.category}</p>}
            </div>
            <div className="create-lot-page__field-group">
              <label className="create-lot-page__label" htmlFor={`${inputId}-title`}>Название лота</label>
              <input id={`${inputId}-title`} value={values.title} maxLength={120} onChange={(event) => update('title', event.target.value)} aria-invalid={Boolean(errors.title)} />
              {errors.title && <p className="create-lot-page__error" role="alert">{errors.title}</p>}
            </div>
            <div className="create-lot-page__field-group">
              <div className="create-lot-page__label-row">
                <label className="create-lot-page__label" htmlFor={`${inputId}-description`}>Описание</label>
                <span>{values.description.length} / 1000</span>
              </div>
              <textarea id={`${inputId}-description`} rows={5} maxLength={1000} value={values.description} onChange={(event) => update('description', event.target.value)} aria-invalid={Boolean(errors.description)} />
              {errors.description && <p className="create-lot-page__error" role="alert">{errors.description}</p>}
            </div>
            {values.type === 'product' && (
              <div className="create-lot-page__field-group">
                <span className="create-lot-page__label">Состояние</span>
                <div className="create-lot-page__chips" role="group" aria-label="Состояние товара">
                  {conditions.map((condition) => (
                    <button type="button" key={condition.id} className={values.condition === condition.id ? 'is-selected' : ''} aria-pressed={values.condition === condition.id} onClick={() => update('condition', condition.id)}>{condition.label}</button>
                  ))}
                </div>
                {errors.condition && <p className="create-lot-page__error" role="alert">{errors.condition}</p>}
              </div>
            )}
          </section>

          <section className="create-lot-page__card create-lot-page__photos-card" aria-labelledby="edit-photos-title">
            <h2 id="edit-photos-title">Фотографии</h2>
            <p className="create-lot-page__section-note">До 4 фото, JPG или PNG до 10 МБ. Первое фото станет главным</p>
            <input type="file" ref={fileInput} accept="image/png,image/jpeg" multiple className="create-lot-page__hidden-input" aria-label="Добавить фотографии" onChange={handleFileChange} />
            <div className="create-lot-page__photo-slots edit-lot-page__photos">
              {photos.map((photo, index) => (
                <div className="create-lot-page__photo-slot" key={photo.id}>
                  <img src={photo.url} alt={`Фото лота ${index + 1}`} />
                  <button type="button" aria-label={`Удалить фотографию ${index + 1}`} title="Удалить фотографию" onClick={() => removePhoto(photo.id)}>×</button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button type="button" className="edit-lot-page__add-photo" onClick={() => fileInput.current?.click()}>
                  <span aria-hidden="true">+</span>Добавить
                </button>
              )}
            </div>
            {photoError && <p className="create-lot-page__error" role="alert">{photoError}</p>}
          </section>

          {values.type === 'product' && <section className="create-lot-page__card create-lot-page__characteristics-card" aria-labelledby="edit-characteristics-title">
            <h2 id="edit-characteristics-title">Характеристики</h2>
            <p className="create-lot-page__section-note">Набор полей зависит от выбранной категории</p>
            <div className="edit-lot-page__characteristics-grid">
              {categoryFields[values.category].map((field) => (
                <label key={field}>
                  <span className="create-lot-page__label">{field}</span>
                  <input value={values.characteristics[field] ?? ''} onChange={(event) => update('characteristics', { ...values.characteristics, [field]: event.target.value })} />
                </label>
              ))}
              {values.extraCharacteristics.map((extra) => (
                <div className="edit-lot-page__extra-characteristic" key={extra.id}>
                  <label><span className="create-lot-page__label">Название характеристики</span><input value={extra.name} onChange={(event) => editCharacteristic(extra.id, 'name', event.target.value)} placeholder="Например, Цвет" /></label>
                  <label><span className="create-lot-page__label">Значение</span><input value={extra.value} onChange={(event) => editCharacteristic(extra.id, 'value', event.target.value)} placeholder="Укажите значение" /></label>
                  <button type="button" onClick={() => removeCharacteristic(extra.id)} aria-label="Удалить дополнительную характеристику">×</button>
                </div>
              ))}
            </div>
            <button type="button" className="edit-lot-page__add-characteristic" onClick={addCharacteristic}>+ Добавить характеристику</button>
          </section>}

          <section className="create-lot-page__card create-lot-page__price-card" aria-labelledby="edit-price-title">
            <h2 id="edit-price-title">Стоимость и обмен</h2>
            <p className="create-lot-page__section-note">Стоимость — ориентир, предлагайте равноценный обмен или договоритесь о доплате.</p>
            <div className="create-lot-page__field-group">
              <label className="create-lot-page__label" htmlFor={`${inputId}-price`}>Ориентировочная стоимость, ₽</label>
              <div className="create-lot-page__price-row">
                <input id={`${inputId}-price`} inputMode="numeric" value={values.price} placeholder="Например, 1 000" onChange={(event) => { if (/^\d*$/.test(event.target.value)) update('price', event.target.value) }} />
                <button type="button" className="create-lot-page__ai-button" disabled={!values.title.trim() || !values.category} onClick={() => setNotice('ИИ-оценка появится после подключения сервиса оценки к API.')}>✦ Оценить с помощью ИИ</button>
              </div>
            </div>
            <div className="create-lot-page__hint create-lot-page__ai-hint">Не знаете, сколько стоит товар? ИИ оценит его и предложит ориентировочный диапазон стоимости.</div>
            <div className="create-lot-page__field-group create-lot-page__last-field">
              <label className="create-lot-page__label" htmlFor={`${inputId}-wanted`}>Желаемый обмен</label>
              <input id={`${inputId}-wanted`} value={values.desiredExchange} onChange={(event) => update('desiredExchange', event.target.value)} aria-invalid={Boolean(errors.desiredExchange)} />
              {errors.desiredExchange && <p className="create-lot-page__error" role="alert">{errors.desiredExchange}</p>}
            </div>
          </section>

          {notice && <p className="create-lot-page__notice" role="status">{notice}</p>}
          <div className="create-lot-page__actions edit-lot-page__actions">
            <button type="button" className="edit-lot-page__delete" onClick={() => setNotice('Удаление объявления станет доступно после подключения API. Сейчас это демонстрационная страница.')}>Удалить лот</button>
            <button type="submit" className="create-lot-page__publish edit-lot-page__save">Сохранить изменения</button>
          </div>
        </form>
      </div>
    </main>
  )
}

function EditLotPage() {
  const { id } = useParams()
  const lot = catalogLots.find((item) => String(item.id) === id)
  if (!lot) return <PreviewPage title="Лот не найден" description="Проверьте адрес или вернитесь в каталог." />
  return <EditLotForm key={lot.id} lot={lot} />
}

export { EditLotPage }
