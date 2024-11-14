export interface ICategory {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  parent: string
  children: string[]
  hasChildren: boolean
}
