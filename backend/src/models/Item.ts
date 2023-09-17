export interface Item {
  userId: string
  itemId: string
  createdAt: string
  name: string
  soldDate?: string
  sold?: boolean
  attachmentUrl?: string,
  price: number,
  description: string
}
