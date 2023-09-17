export interface Item {
  itemId: string
  createdAt: string
  name: string
  soldDate: string
  sold: boolean
  attachmentUrl?: string
  description?: string
  price: number
}
