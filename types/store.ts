import type { ImageOptimized } from '~~/types/image'

type Rating = {
  rate: number
  count: number
}

export type Treatment = {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  imageOptimized?: ImageOptimized
}

export type Treatments = Treatment[]

export type Category = {
  id: string
  name: string
  description: string
  header_img: string
  body_img1: string
  body_img2: string
  body_img3: string,
  treatment: Treatment[]
}

export type Categories = Category[]

export type Store = {
  treatments: Treatments
  categories: Categories
}
