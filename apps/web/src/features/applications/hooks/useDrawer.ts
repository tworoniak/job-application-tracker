import { useState } from 'react'

export const useDrawer = () => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)

  const openView = (id: string) => { setSelectedAppId(id); setEditMode(false) }
  const openEdit = (id: string) => { setSelectedAppId(id); setEditMode(true) }
  const close = () => setSelectedAppId(null)

  return { selectedAppId, editMode, openView, openEdit, close }
}
