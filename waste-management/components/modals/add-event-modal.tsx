"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useUser } from '@clerk/nextjs'


interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: EventFormData) => void
  initialData?: Partial<EventFormData>
  mode?: 'create' | 'view' | 'edit'
  isLoading?: boolean
}

export interface EventFormData {
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  location: string
  maxCapacity: number | null
  targetAudience: string[]
  status: 'ACTIVE' | 'DRAFT'
  localityId: number | null
}

const targetAudienceOptions = [
  { value: 'CITIZEN', label: 'Citizens' },
  { value: 'WORKER', label: 'Workers' },
  { value: 'DISTRICT_ADMIN', label: 'District Admins' },
  { value: 'LOCALITY_ADMIN', label: 'Locality Admins' }
]

export const AddEventModal: React.FC<AddEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  mode = 'create',
  isLoading = false
}) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string;
  
  // Set default locality ID based on user role
  const getDefaultLocalityId = () => {
    if (userRole === 'Citizen' || userRole === 'Worker') {
      return 1; // Default to locality ID 1 for Citizens and Workers
    }
    return null; // Admins can choose any locality
  };

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    maxCapacity: null,
    targetAudience: [],
    status: 'DRAFT',
    localityId: getDefaultLocalityId()
  })

  // Update form data when initialData changes
  React.useEffect(() => {
    const defaultLocalityId = (userRole === 'Citizen' || userRole === 'Worker') ? 1 : null;
    
    if (initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }))
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        maxCapacity: null,
        targetAudience: [],
        status: 'DRAFT',
        localityId: defaultLocalityId
      })
    }
  }, [initialData, isOpen, userRole])

  const [errors, setErrors] = useState<Partial<EventFormData>>({})

  const handleInputChange = (field: keyof EventFormData, value: string | number | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleTargetAudienceChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: checked 
        ? [...prev.targetAudience, value]
        : prev.targetAudience.filter(item => item !== value)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.startDateTime) newErrors.startDateTime = 'Start date and time is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (formData.targetAudience.length === 0) {
      newErrors.targetAudience = ['At least one target audience must be selected']
    }

    // Validate end date is after start date
    if (formData.endDateTime && formData.startDateTime) {
      if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
        newErrors.endDateTime = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startDateTime: '',
      endDateTime: '',
      location: '',
      maxCapacity: null,
      targetAudience: [],
      status: 'DRAFT',
      localityId: getDefaultLocalityId()
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex pb-4 items-center gap-2">
            {mode === 'view' ? 'View Training Event' : mode === 'edit' ? 'Edit Training Event' : 'Add New Training Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              Event Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title"
              className={errors.title ? 'border-red-500' : ''}
              readOnly={mode === 'view'}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2 ">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter event description"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
              readOnly={mode === 'view'}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDateTime" className="flex items-center gap-2">
                Start Date & Time *
              </Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => handleInputChange('startDateTime', e.target.value)}
                className={errors.startDateTime ? 'border-red-500' : ''}
                readOnly={mode === 'view'}
              />
              {errors.startDateTime && <p className="text-sm text-red-500">{errors.startDateTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDateTime">End Date & Time</Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => handleInputChange('endDateTime', e.target.value)}
                className={errors.endDateTime ? 'border-red-500' : ''}
                readOnly={mode === 'view'}
              />
              {errors.endDateTime && <p className="text-sm text-red-500">{errors.endDateTime}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              Location *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter event location"
              className={errors.location ? 'border-red-500' : ''}
              readOnly={mode === 'view'}
            />
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>

          {/* Max Capacity */}
          <div className="space-y-2">
            <Label htmlFor="maxCapacity" className="flex items-center gap-2">
              Maximum Capacity
            </Label>
            <Input
              id="maxCapacity"
              type="number"
              min="1"
              value={formData.maxCapacity || ''}
              onChange={(e) => handleInputChange('maxCapacity', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Leave empty for unlimited capacity"
              readOnly={mode === 'view'}
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Target Audience *
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {targetAudienceOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={formData.targetAudience.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleTargetAudienceChange(option.value, checked as boolean)
                    }
                    disabled={mode === 'view'}
                  />
                  <Label htmlFor={option.value} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.targetAudience && <p className="text-sm text-red-500">{errors.targetAudience[0]}</p>}
          </div>

          {/* Locality Selection */}
          <div className="space-y-2">
            <Label htmlFor="locality">
              Locality
              {(userRole === 'Citizen' || userRole === 'Worker') && (
                <span className="text-sm text-gray-500 ml-2">(Auto-assigned to your locality)</span>
              )}
            </Label>
            <Select 
              value={formData.localityId?.toString() || ''} 
              onValueChange={(value) => handleInputChange('localityId', value ? parseInt(value) : null)}
              disabled={mode === 'view' || userRole === 'Citizen' || userRole === 'Worker'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select locality (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Koramangala</SelectItem>
                <SelectItem value="2">Indiranagar</SelectItem>
                <SelectItem value="3">VV Mohalla</SelectItem>
              </SelectContent>
            </Select>
            {(userRole === 'Citizen' || userRole === 'Worker') && (
              <p className="text-xs text-gray-500">
                Events will be created for your assigned locality (Koramangala)
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Event Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'ACTIVE' | 'DRAFT') => handleInputChange('status', value)}
              disabled={mode === 'view'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode === 'create' && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            )}
            {mode === 'edit' && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Event"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}